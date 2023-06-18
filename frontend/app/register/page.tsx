"use client";
// pages/register.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

import zxcvbn from "zxcvbn";
import { Input } from "@/components/Input";
import { emailRegex } from "@/common/const";
import { validateField } from "@/common/functions";
import { useAuth } from "@/context/AuthContext";

async function checkNickname(nickname: string): Promise<boolean> {
	return await fetch(`/api/v1/check-nickname`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ nickname: nickname }),
	}).then((res) => {
		if (res.status === 404) {
			return false;
		} else {
			return true;
		}
	});
}

async function checkEmail(email: string): Promise<boolean> {
	return await fetch(`/api/v1/check-email`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: email }),
	}).then((res) => {
		if (res.status === 404) {
			return false;
		} else {
			return true;
		}
	});
}

async function registerUser(
	firstName: string,
	lastName: string,
	nickname: string,
	email: string,
	password: string,
) {
	const res = await fetch("/api/v1/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			first_name: firstName,
			last_name: lastName,
			nickname: nickname,
			email: email,
			password: password,
		}),
	});

	// Always return the JSON response whether it's successful or not
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message || "Unknown error");
	}

	return data; // Ensure something is returned
}

const RegisterPage: React.FC = () => {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [nickname, setNickname] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [confirmEmail, setConfirmEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [emailError, setEmailError] = useState<boolean>(false);
	const [emailExistsError, setEmailExistsError] = useState<boolean>(false);
	const [nicknameError, setNicknameError] = useState<boolean>(false);
	const [emailConfirmError, setEmailConfirmError] = useState<boolean>(false);
	const [passwordConfirmError, setPasswordConfirmError] =
		useState<boolean>(false);
	const [passwordStrength, setPasswordStrength] = useState<number>(0);
	const [passwordRequirements, setPasswordRequirements] = useState<any>({
		length: false,
		lowercase: false,
		uppercase: false,
		number: false,
		specialCharacter: false,
	});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isFormValid, setIsFormValid] = useState<boolean>(false);
	const [successfulRegister, setSuccessfulRegister] = useState<
		boolean | null
	>(null);

	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_\-+=?/\\|~`:;"';]).{8,}$/;

	const validateEmail = async (email: string) => {
		setEmailError(!validateField(email, emailRegex));

		if (await checkEmail(email)) {
			setEmailExistsError(true);
		} else {
			setEmailExistsError(false);
		}
	};

	const validateConfirmEmail = (value: string) => {
		setEmailConfirmError(value !== email);
	};

	const validateConfirmPassword = (value: string) =>
		setPasswordConfirmError(value !== password);

	const validateNickname = async (nickname: string) => {
		if (await checkNickname(nickname)) {
			setNicknameError(true);
		} else {
			setNicknameError(false);
		}
	};

	const updatePasswordStrength = (password: string) => {
		const { score } = zxcvbn(password);
		setPasswordStrength(score);
	};

	const updatePasswordRequirements = (password: string) => {
		const requirements = {
			length: password.length >= 8,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			number: /[0-9]/.test(password),
			specialCharacter: /[!@#$%^&*]/.test(password),
		};
		setPasswordRequirements(requirements);
	};

	useEffect(() => {
		updatePasswordStrength(password);
		updatePasswordRequirements(password);
	}, [password]);

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/garage");
		}
	}, [isAuthenticated, router]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		switch (name) {
			case "firstName":
				setFirstName(value);
				break;
			case "lastName":
				setLastName(value);
				break;
			case "nickname":
				setNickname(value);
				validateNickname(value);
				break;
			case "email":
				setEmail(value);
				validateEmail(value);
				break;
			case "confirmEmail":
				setConfirmEmail(value);
				validateConfirmEmail(value);
				break;
			case "password":
				setPassword(value);
				updatePasswordRequirements(value);
				break;
			case "confirmPassword":
				setConfirmPassword(value);
				validateConfirmPassword(value);
				break;
			default:
				break;
		}
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		if (!isFormValid) return;

		try {
			// assuming registerUser returns a promise that resolves with a success status
			const response = await registerUser(
				firstName,
				lastName,
				nickname,
				email,
				password,
			);

			setSuccessfulRegister(true);
		} catch (error) {
			setSuccessfulRegister(false);
			console.error(error);
			// handle error as needed, possibly setting an error state here
		}
	};

	useEffect(() => {
		const isFirstNameValid = firstName.trim() !== "";
		const isLastNameValid = lastName.trim() !== "";
		const isNicknameValid = nickname.trim() !== "";
		const isEmailValid = emailRegex.test(email);
		const isConfirmEmailValid = email === confirmEmail;
		const isPasswordValid = passwordRegex.test(password);
		const isConfirmPasswordValid = password === confirmPassword;

		const isPasswordLengthValid = password.length >= 8;
		const isPasswordLowercaseValid = /[a-z]/.test(password);
		const isPasswordUppercaseValid = /[A-Z]/.test(password);
		const isPasswordNumberValid = /[0-9]/.test(password);
		const isPasswordSpecialCharacterValid = /[!@#$%^&*]/.test(password);

		const formIsValid =
			isFirstNameValid &&
			isLastNameValid &&
			isNicknameValid &&
			isEmailValid &&
			isConfirmEmailValid &&
			isPasswordValid &&
			isConfirmPasswordValid &&
			isPasswordLengthValid &&
			isPasswordLowercaseValid &&
			isPasswordUppercaseValid &&
			isPasswordNumberValid &&
			isPasswordSpecialCharacterValid;

		setIsFormValid(
			formIsValid && !emailConfirmError && !passwordConfirmError,
		);
	}, [
		firstName,
		lastName,
		nickname,
		email,
		confirmEmail,
		password,
		confirmPassword,
		emailConfirmError,
		passwordConfirmError,
		passwordRegex,
	]);

	if (successfulRegister) {
		return <SuccessfulRegisterPage />;
	}

	if (successfulRegister === false) {
		return <UnsuccessfulRegisterPage />;
	}

	return (
		<div className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Register for an account
					</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<input type="hidden" name="remember" value="true" />
					<div className="rounded-md shadow-sm space-y-4">
						<Input
							id="first-name"
							type="text"
							placeholder="First Name"
							value={firstName}
							onChange={(event) => handleChange(event)}
							name="firstName"
						/>
						<Input
							id="last-name"
							type="text"
							placeholder="Last Name"
							value={lastName}
							onChange={(event) => handleChange(event)}
							name="lastName"
						/>
						<Input
							id="nickname"
							type="text"
							placeholder="Nickname"
							value={nickname}
							onChange={(event) => handleChange(event)}
							name="nickname"
						/>
						{nicknameError && (
							<div className="mb-4 text-sm text-red-600">
								Nickname already exists.
							</div>
						)}
						<Input
							id="email"
							type="email"
							placeholder="Email"
							value={email}
							onChange={(event) => handleChange(event)}
							name="email"
						/>
						{emailError && (
							<div className="mb-4 text-sm text-red-600">
								Invalid email format.
							</div>
						)}
						{emailExistsError && (
							<div className="mb-4 text-sm text-red-600">
								User with this email already exists.
							</div>
						)}
						<Input
							id="confirm-email"
							type="email"
							placeholder="Confirm Email"
							value={confirmEmail}
							onChange={(event) => handleChange(event)}
							name="confirmEmail"
						/>
						{emailConfirmError && (
							<div className="mb-4 text-sm text-red-600">
								Emails do not match.
							</div>
						)}
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(event) => handleChange(event)}
							label="Password (should be at least 8 characters, include numbers and special characters)"
							name="password"
						/>
						<progress
							value={passwordStrength}
							max="4"
							className="rounded-full w-full"
						/>
						<span className="text-sm text-gray-700">
							Password strength:{" "}
							{
								["Weak", "Weak", "Ok", "Good", "Excellent"][
									passwordStrength
								]
							}
						</span>
						<ul className="text-sm text-gray-700">
							<li
								className={
									passwordRequirements.length
										? "text-green-500"
										: "text-red-500"
								}
							>
								- at least 8 characters
							</li>
							<li
								className={
									passwordRequirements.lowercase
										? "text-green-500"
										: "text-red-500"
								}
							>
								- at least 1 lowercase letter
							</li>
							<li
								className={
									passwordRequirements.uppercase
										? "text-green-500"
										: "text-red-500"
								}
							>
								- at least 1 uppercase letter
							</li>
							<li
								className={
									passwordRequirements.number
										? "text-green-500"
										: "text-red-500"
								}
							>
								- at least 1 number
							</li>
							<li
								className={
									passwordRequirements.specialCharacter
										? "text-green-500"
										: "text-red-500"
								}
							>
								{`- at least 1 special character: !"#$%&'()*+,-./:;<=>?@[]^_\`{|}~`}
							</li>
						</ul>
						<Input
							id="confirm-password"
							type={showPassword ? "text" : "password"}
							placeholder="Confirm Password"
							value={confirmPassword}
							onChange={(event) => handleChange(event)}
							name="confirmPassword"
						/>
						{passwordConfirmError && (
							<div className="mb-4 text-sm text-red-600">
								Passwords do not match.
							</div>
						)}
						<div className="flex items-center">
							<input
								type="checkbox"
								id="show-password"
								checked={showPassword}
								onChange={() => setShowPassword(!showPassword)}
							/>
							<label
								className="text-sm font-medium text-gray-700 pl-2"
								htmlFor="show-password"
							>
								Show passwords
							</label>
						</div>
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
							Register
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const SuccessfulRegisterPage = () => {
	const router = useRouter();

	const redirectToLogin = () => {
		router.push("/login");
	};

	return (
		<div className="h-screen flex items-center justify-center bg-green-100">
			<div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden mx-3">
				<div className="md:flex">
					<div className="md:flex-shrink-0 flex items-center justify-center pt-4 pb-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 50 50"
							fill={"#25AE88"}
							width={100}
							height={100}
						>
							<circle cx="25" cy="25" r="25" fill={"#25AE88"} />
							<polyline
								style={{
									fill: "none",
									stroke: "#FFFFFF",
									strokeWidth: "3.6",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeMiterlimit: "10",
								}}
								points="38,15 22,33 12,25"
							/>
						</svg>
					</div>
					<div className="p-8">
						<div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
							Congratulations!
						</div>
						<p className="mt-2 text-gray-600">
							You have successfully registered for an account. You
							can now proceed to login to access your account.
						</p>
						<button
							className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded font-medium hover:bg-indigo-600"
							onClick={redirectToLogin}
						>
							Go to Login
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

const UnsuccessfulRegisterPage = () => {
	const router = useRouter();

	const redirectToRegister = () => {
		router.push("/register");
	};

	return (
		<div className="h-screen flex items-center justify-center bg-red-100">
			<div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden mx-3">
				<div className="md:flex">
					<div className="md:flex-shrink-0 flex items-center justify-center pt-4 pb-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 64 64"
							width={100}
							height={100}
						>
							<defs>
								<linearGradient
									y2="161.29"
									x2="0"
									y1="218.22"
									gradientUnits="userSpaceOnUse"
									id="0"
								>
									<stop stop-color="#c52828" />
									<stop offset="1" stop-color="#ff5454" />
								</linearGradient>
							</defs>
							<g transform="matrix(.92857 0 0 .92857-666.94-144.37)">
								<circle
									r="28"
									cy="189.93"
									cx="752.7"
									fill="url(#0)"
								/>
								<g fill="#fff" fill-opacity=".851">
									<path d="m739.54 180.23c0-2.166 1.756-3.922 3.922-3.922 2.165 0 3.922 1.756 3.922 3.922 0 2.167-1.756 3.923-3.922 3.923-2.166 0-3.922-1.756-3.922-3.923m17.784 0c0-2.166 1.758-3.922 3.923-3.922 2.165 0 3.922 1.756 3.922 3.922 0 2.167-1.756 3.923-3.922 3.923-2.166 0-3.923-1.756-3.923-3.923" />
									<path d="m766.89 200.51c-2.431-5.621-8.123-9.253-14.502-9.253-6.516 0-12.242 3.65-14.588 9.3-.402.967.056 2.078 1.025 2.48.238.097.485.144.727.144.744 0 1.45-.44 1.753-1.17 1.756-4.229 6.107-6.96 11.08-6.96 4.864 0 9.189 2.733 11.02 6.965.416.962 1.533 1.405 2.495.989.961-.417 1.405-1.533.989-2.495" />
								</g>
							</g>
						</svg>
					</div>
					<div className="p-8">
						<div className="uppercase tracking-wide text-sm text-red-500 font-semibold">
							Registration Failed
						</div>
						<p className="mt-2 text-gray-600">
							Unfortunately, we were unable to create your
							account. Please try registering again.
						</p>
						<button
							className="mt-4 bg-red-500 text-white px-6 py-2 rounded font-medium hover:bg-red-600"
							onClick={redirectToRegister}
						>
							Try Again
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
