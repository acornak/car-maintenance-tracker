import React from "react";

interface InputProps {
	id: string;
	type: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	name?: string;
}

const Input: React.FC<InputProps> = ({
	id,
	type,
	placeholder,
	value,
	onChange,
	label,
	name,
}) => {
	return (
		<div className="flex flex-col space-y-2">
			{label && (
				<label
					htmlFor={id}
					className="text-sm font-medium text-gray-700"
				>
					{label}
				</label>
			)}
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				name={name}
				className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
			/>
		</div>
	);
};

export default Input;
