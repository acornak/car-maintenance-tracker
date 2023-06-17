"use client";
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import { emailRegex } from "@/common/const";
import { validateField } from "@/common/functions";

async function handleLogin(email: string, password: string): Promise<any> {
	const res = await fetch("http://localhost:8000/api/v1/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: email,
			password: password,
		}),
	});

	const data = await res.json();

	if (res.ok) {
		const { access_token, refresh_token } = data;
		console.log(access_token, refresh_token);
	}

	return res;
}

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const router = useRouter();
	const [emailError, setEmailError] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const res = await handleLogin(email, password);
		if (res.ok) {
			setLoginSuccess(true);
			router.push("/");
		} else {
			setLoginSuccess(false);
			// Handle login failure
			if (res.status === 401) {
				// Invalid credentials
				setError("Invalid credentials. Please try again.");
			} else {
				// Other failure scenarios
				setError("Login failed. Please try again.");
			}
		}
	};

	const validateEmail = (email: string) =>
		setEmailError(!validateField(email, emailRegex));

	useEffect(() => {
		setIsFormValid(email !== "" && password !== "");
	}, [email, password]);

	useEffect(() => {
		const isEmailValid = emailRegex.test(email);

		const formIsValid = isEmailValid && password !== "";

		setIsFormValid(formIsValid);
	}, [email, password]);

	return (
		<div className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Sign in to your account
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<input type="hidden" name="remember" value="true" />
					<div className="rounded-md shadow-sm space-y-4">
						<Input
							id="email"
							type="email"
							placeholder="Email address"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								validateEmail(e.target.value);
							}}
						/>
						{emailError && (
							<div className="mb-4 text-sm text-red-600">
								Invalid email format.
							</div>
						)}
						<Input
							id="password"
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div>
						<button
							type="submit"
							disabled={!isFormValid}
							className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md ${
								isFormValid
									? "text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									: "text-gray-500 bg-gray-200 cursor-not-allowed"
							}`}
						>
							Sign in
						</button>
					</div>
				</form>
				{error && <div className="mt-4 text-red-600">{error}</div>}
				{loginSuccess && (
					<div className="mt-4 text-green-500">
						Login successful! Redirecting...
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginPage;
