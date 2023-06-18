"use client";
import React, { useState, useEffect } from "react";
import { Car, CarMaker, CarModel } from "@/common/types";
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

async function getAllCarMakers(): Promise<CarMaker[]> {
	const res = await fetch("/api/v1/cars/makers");
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message);
	}

	return data.makers;
}

async function getAllModelsByMakerID(makerID: number): Promise<CarModel[]> {
	const res = await fetch(`/api/v1/cars/models`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ maker_id: makerID }),
	});
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message);
	}

	return data.models;
}

export default function AddCarModal({
	onClose,
	onSubmit,
	car,
	setCar,
}: AddCarModalProps) {
	const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);
	const [carMakers, setCarMakers] = useState<CarMaker[]>([]);
	const [carModels, setCarModels] = useState<CarModel[]>([]);

	useEffect(() => {
		const { brand_id, model_id, image } = car;
		const requiredFieldsFilled =
			brand_id && model_id && image ? true : false;
		setRequiredFieldsFilled(requiredFieldsFilled);
		if (brand_id && brand_id !== 0) {
			getAllModelsByMakerID(brand_id).then((models) => {
				setCarModels(models);
			});
		}
	}, [car]);

	useEffect(() => {
		getAllCarMakers().then((makers) => {
			setCarMakers(makers);
		});
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { id, value } = e.target;
		const fieldValue =
			id === "brand_id" || id === "model_id"
				? parseInt(value, 10)
				: value;
		setCar({ ...car, [id]: fieldValue });
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		onSubmit(car);
		resetForm();
	};

	const resetForm = () => {
		setCar({
			id: null,
			brand_id: null,
			model_id: null,
			year: null,
			color: "",
			price: null,
			image: "",
			description: "",
			licensePlate: "",
			vin: "",
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
							id="brand_id"
							value={car.brand_id || ""}
							onChange={handleChange}
							label="Car Brand (required)"
							name="brand_id"
							options={carMakers.map((maker) => ({
								value: maker.id,
								label: maker.name,
							}))}
						/>
						<Select
							id="model_id"
							value={car.model_id || ""}
							onChange={handleChange}
							label="Car Model (required)"
							name="model_id"
							options={carModels.map((model) => ({
								value: model.id,
								label: model.name,
							}))}
						/>
						<Input
							id="licensePlate"
							type="text"
							placeholder="ABC-123"
							value={car.licensePlate || ""}
							onChange={handleChange}
							label="License Plate"
							name="licensePlate"
						/>
						<Input
							id="vin"
							type="text"
							placeholder="12345678901234567"
							value={car.vin || ""}
							onChange={handleChange}
							label="VIN"
							name="vin"
						/>
						<Input
							id="year"
							type="number"
							placeholder="2019"
							value={car.year || ""}
							onChange={handleChange}
							label="Year"
							name="year"
						/>
						<Input
							id="color"
							type="text"
							placeholder="black metallic"
							value={car.color || ""}
							onChange={handleChange}
							label="Color"
							name="color"
						/>
						<Input
							id="price"
							type="number"
							placeholder="10000"
							value={car.price || ""}
							onChange={handleChange}
							label="Price"
							name="price"
						/>
						<Input
							id="image"
							type="text"
							placeholder="https://example.com/image.jpg"
							value={car.image || ""}
							onChange={handleChange}
							label="Image URL (required)"
							name="image"
						/>
						<Input
							id="description"
							type="text"
							placeholder="This is my weekend car"
							value={car.description || ""}
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
