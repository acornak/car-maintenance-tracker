import React from "react";

interface InputProps {
	id: string;
	type: string;
	placeholder: string;
	value: string | number;
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

interface SelectProps {
	id: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	label?: string;
	name?: string;
	options: Array<{ value: string | number; label: string }>;
}

const Select: React.FC<SelectProps> = ({
	id,
	value,
	onChange,
	label,
	name,
	options,
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
			<select
				id={id}
				value={value}
				onChange={onChange}
				name={name}
				className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
			>
				<option value="" disabled>
					Select an option
				</option>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
						selected={option.value === value}
					>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export { Input, Select };
