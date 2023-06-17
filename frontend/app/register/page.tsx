"use client";
// pages/register.tsx
import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import zxcvbn from "zxcvbn";
import Input from "@/components/Input";
import { emailRegex } from "@/common/const";
import { validateField } from "@/common/functions";

const RegisterPage: React.FC = () => {
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [nickname, setNickname] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [confirmEmail, setConfirmEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [emailError, setEmailError] = useState<boolean>(false);
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

	const [isFormValid, setIsFormValid] = useState<boolean>(false);

	const router = useRouter();

	const passwordRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_\-+=?/\\|~`:;"';]).{8,}$/;

	const validateEmail = (email: string) =>
		setEmailError(!validateField(email, emailRegex));

	const validateConfirmEmail = (value: string) => {
		setEmailConfirmError(value !== email);
	};

	const validateConfirmPassword = (value: string) =>
		setPasswordConfirmError(value !== password);

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

		router.push("/");
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
	]);

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
							type="password"
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
							type="password"
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

export default RegisterPage;
