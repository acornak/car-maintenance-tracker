"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "@/common/types";

interface AuthContextProps {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	authError: string;
	user: User;
}

const AuthContext = createContext<AuthContextProps>({
	isAuthenticated: false,
	login: () => Promise.resolve(),
	logout: () => {},
	authError: "",
	user: {} as User,
});

export function useAuth(): AuthContextProps {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authError, setAuthError] = useState<string>("");
	const [user, setUser] = useState<User>({} as User);

	useEffect(() => {
		function checkAuthStatus() {
			const auth_status = Cookies.get("auth_status");
			setIsAuthenticated(auth_status === "true");
		}

		checkAuthStatus();

		// handle user here
		if (isAuthenticated) {
			fetch("/api/v1/user", {
				credentials: "include",
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					} else if (res.status === 401) {
						throw new Error("Token expired");
					} else {
						throw new Error("Server error");
					}
				})
				.then((data) => {
					setUser(data.user);
				})
				.catch((error) => {
					console.error(error);
					logout();
				});
		}

		// Listen for changes in local storage
		window.addEventListener("storage", checkAuthStatus);

		// Cleanup
		return () => window.removeEventListener("storage", checkAuthStatus);
	}, [isAuthenticated]);

	useEffect(() => {
		console.log("refreshing token...");
		// Function to refresh the token
		async function refreshToken() {
			const res = await fetch("/api/v1/refresh-token", {
				method: "POST",
				credentials: "include",
			});

			if (res.ok) {
				setIsAuthenticated(true);
				setAuthError("");
				Cookies.set("auth_status", "true");
				const { user } = await res.json();
				setUser(user);
				console.log("token refreshed");
			} else if (res.status === 401) {
				// refresh token is invalid, log the user out
				logout();
				console.error("failed to refresh token");
			} else {
				// Server error, handle accordingly
				console.error("Server error during token refresh");
			}
		}

		// This value can be adjusted based on JWT's expiry
		const intervalId = setInterval(refreshToken, 14 * 60 * 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	async function login(email: string, password: string) {
		try {
			// Make your login request and handle the response
			const res = await fetch("/api/v1/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (res.ok) {
				setIsAuthenticated(true);
				setAuthError("");
				Cookies.set("auth_status", "true");
				const { user } = await res.json();
				setUser(user);
			} else if (res.status === 401) {
				setAuthError("Invalid credentials. Please try again.");
				Cookies.remove("auth_status");
			} else {
				setAuthError("Login failed. Please try again.");
				Cookies.remove("auth_status");
			}
		} catch (error) {
			setAuthError("Server error. Please try again later.");
			Cookies.remove("auth_status");
		}
	}

	function logout() {
		Cookies.remove("auth_status");
		setIsAuthenticated(false);
	}

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, login, logout, authError, user }}
		>
			{children}
		</AuthContext.Provider>
	);
}
