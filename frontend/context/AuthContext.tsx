"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextProps {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	authError: string;
}

const AuthContext = createContext<AuthContextProps>({
	isAuthenticated: false,
	login: () => Promise.resolve(),
	logout: () => {},
	authError: "",
});

export function useAuth(): AuthContextProps {
	return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authError, setAuthError] = useState<string>("");

	useEffect(() => {
		const access_token = Cookies.get("access_token");
		if (access_token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, []);

	async function login(email: string, password: string) {
		try {
			// Make your login request and handle the response
			const res = await fetch("http://localhost:8000/api/v1/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (res.ok) {
				setIsAuthenticated(true);
				setAuthError("");
			} else if (res.status === 401) {
				setAuthError("Invalid credentials. Please try again.");
			} else {
				setAuthError("Login failed. Please try again.");
			}
		} catch (error) {
			setAuthError("Server error. Please try again later.");
		}
	}

	function logout() {
		Cookies.remove("access_token");
		setIsAuthenticated(false);
	}

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, login, logout, authError }}
		>
			{children}
		</AuthContext.Provider>
	);
}
