"use client";
import React, { useState, FormEvent, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import { emailRegex } from "@/common/const";
import { validateField } from "@/common/functions";
import { useAuth } from "@/context/AuthContext";

const LoginPage: React.FC = () => {
	const { login, authError, isAuthenticated } = useAuth();
	const router = useRouter();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [emailError, setEmailError] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		await login(email, password);
	};

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated]);

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
						{authError && (
							<div className="mt-4 text-red-600 text-center">
								{authError}
							</div>
						)}
						{isAuthenticated && (
							<div className="mt-4 text-green-500 text-center">
								Login successful! Redirecting...
							</div>
						)}
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
			</div>
		</div>
	);
};

export default LoginPage;
