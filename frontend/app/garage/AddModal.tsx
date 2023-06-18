"use client";
import React, { useState, useEffect } from "react";
import { Car } from "@/common/types";
import { Input, Select } from "@/components/Input";

const styles = {
	modal: {
		position: "fixed" as "fixed",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		display: "flex" as "flex",
		alignItems: "center" as "center",
		justifyContent: "center" as "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: "5px",
		padding: "20px",
		width: "70%",
		maxWidth: "500px",
	},
};

type AddCarModalProps = {
	onClose: () => void;
	onSubmit: (car: Car) => void;
	car: Car;
	setCar: (car: Car) => void;
};

export default function AddCarModal({
	onClose,
	onSubmit,
	car,
	setCar,
}: AddCarModalProps) {
	const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);

	useEffect(() => {
		const { brand, model, image } = car;
		const requiredFieldsFilled =
			brand !== "" && model !== "" && image !== "";
		setRequiredFieldsFilled(requiredFieldsFilled);
	}, [car]);

	const handleChange = (e: any) => {
		setCar({ ...car, [e.target.id]: e.target.value });
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		onSubmit(car);
		resetForm();
	};

	const resetForm = () => {
		setCar({
			id: 0,
			brand: "",
			model: "",
			year: 0,
			color: "",
			price: 0,
			image: "",
			description: "",
			createdAt: "",
		});
	};

	return (
		<div style={styles.modal}>
			<div style={styles.modalContent}>
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 text-gray-500"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<Select
							id="brand"
							value={car.brand || ""}
							onChange={handleChange}
							label="Car Brand (required)"
							name="brand"
							options={[
								{ value: "Audi", label: "Audi" },
								{ value: "BMW", label: "BMW" },
								{ value: "Mercedes", label: "Mercedes" },
								{ value: "Volkswagen", label: "Volkswagen" },
								{ value: "Porsche", label: "Porsche" },
							]}
						/>
						<Select
							id="model"
							value={car.model || ""}
							onChange={handleChange}
							label="Car Model (required)"
							name="model"
							// TODO
							options={[
								{ value: "A1", label: "A1" },
								{ value: "A2", label: "A2" },
								{ value: "A3", label: "A3" },
								{ value: "A4", label: "A4" },
								{ value: "A5", label: "A5" },
								{ value: "A6", label: "A6" },
								{ value: "A7", label: "A7" },
								{ value: "A8", label: "A8" },
								{ value: "Q2", label: "Q2" },
								{ value: "Q3", label: "Q3" },
							]}
						/>
						<Input
							id="year"
							type="number"
							placeholder="2019"
							value={car.year}
							onChange={handleChange}
							label="Year"
							name="year"
						/>
						<Input
							id="color"
							type="text"
							placeholder="black metallic"
							value={car.color}
							onChange={handleChange}
							label="Color"
							name="color"
						/>
						<Input
							id="price"
							type="number"
							placeholder="10000"
							value={car.price}
							onChange={handleChange}
							label="Price"
							name="price"
						/>
						<Input
							id="image"
							type="text"
							placeholder="https://example.com/image.jpg"
							value={car.image}
							onChange={handleChange}
							label="Image URL (required)"
							name="image"
						/>
						<Input
							id="description"
							type="text"
							placeholder="This is my weekend car"
							value={car.description}
							onChange={handleChange}
							label="Description"
							name="description"
						/>
					</div>
					<div className="flex justify-between pt-4">
						<button
							className="group flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-500 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
							type="button"
							onClick={resetForm}
						>
							Clear form
						</button>
						<button
							className={`group flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
								requiredFieldsFilled
									? "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									: "bg-gray-400 cursor-not-allowed"
							}`}
							type="submit"
							disabled={!requiredFieldsFilled}
						>
							Add Car
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
