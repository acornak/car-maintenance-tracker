"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Car } from "@/common/types";
import AddCarModal from "./AddModal";
import { getAllCars } from "@/common/functions";
import AuthLayout from "./layout";

export default function Garage() {
	const router = useRouter();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [addCarSuccess, setAddCarSuccess] = useState<boolean | null>(null);
	const [fetchCarsSuccess, setFetchCarsSuccess] = useState<boolean | null>(
		null,
	);
	const [newCar, setNewCar] = useState<Car>({} as Car);
	const [cars, setCars] = useState<Car[]>([]);

	const handleAddCar = () => {
		setShowModal(false);
		addNewCar(newCar);
	};

	useEffect((): void => {
		getAllCars().then((data) => {
			if (!data) {
				return;
			}
			setCars(data);
		});
	}, [addCarSuccess]);

	useEffect((): (() => void) => {
		let timer: NodeJS.Timeout | null = null;

		timer = setTimeout(() => {
			setFetchCarsSuccess(null);
		}, 5000);

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [fetchCarsSuccess]);

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;

		timer = setTimeout(() => {
			setAddCarSuccess(null);
		}, 5000);

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [addCarSuccess]);

	async function addNewCar(car: Car): Promise<void> {
		const res = await fetch("/api/v1/cars/add", {
			credentials: "include",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				brand_id: car.brand_id,
				model_id: car.model_id,
				license_plate: car.license_plate,
				vin: car.vin,
				year: car.year,
				color: car.color,
				price: car.price,
				description: car.description,
				image: car.image,
			}),
		});

		if (!res.ok) {
			setAddCarSuccess(false);
			return;
		}

		setAddCarSuccess(true);
		return;
	}

	return (
		<AuthLayout>
			{showModal && (
				<AddCarModal
					onClose={() => setShowModal(false)}
					onSubmit={handleAddCar}
					car={newCar}
					setCar={setNewCar}
				/>
			)}
			<div className="flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
				<div className="max-w-5xl space-y-8 w-full">
					<div className="flex justify-between items-center mb-5">
						<h1 className="text-4xl font-bold">Your Garage</h1>
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => setShowModal(true)}
						>
							Add {cars.length === 0 && "First"} Car
						</button>
					</div>
					{cars.length === 0 ? (
						<div className="text-center">
							<p className="text-gray-500 py-4">
								You don&apos;t have any cars in your garage yet.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
							{cars.map((car) => (
								<div
									key={car.id}
									className="rounded overflow-hidden shadow-lg"
								>
									<Image
										className="w-full h-64 object-cover"
										src={car.image!}
										alt={
											car.brand_name +
											" " +
											car.model_name
										}
										width={500}
										height={500}
									/>
									<div className="px-6 py-4">
										<div className="font-bold text-xl mb-2">
											{car.year +
												" " +
												car.brand_name +
												" " +
												car.model_name}
										</div>
										<p className="text-gray-700 text-base">
											{car.description}
										</p>
									</div>
									<div className="px-6 pt-4 pb-2">
										{/* Add action buttons here */}
										<button
											className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
											onClick={() =>
												router.push(`/garage/${car.id}`)
											}
										>
											View Details
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
			{addCarSuccess === false && (
				<div className="fixed top-0 left-0 right-0 flex items-center justify-center">
					<div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative">
						<strong className="font-bold">Oops!</strong>
						<span className="block sm:inline ml-2">
							There was an error adding your car.
						</span>
					</div>
				</div>
			)}
			{fetchCarsSuccess === false && (
				<div className="fixed top-0 left-0 right-0 flex items-center justify-center">
					<div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative">
						<strong className="font-bold">Oops!</strong>
						<span className="block sm:inline ml-2">
							There was an error fetching your garage.
						</span>
					</div>
				</div>
			)}
			{addCarSuccess === true && (
				<div className="fixed top-0 left-0 right-0 flex items-center justify-center">
					<div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded relative">
						<strong className="font-bold">Success!</strong>
						<span className="block sm:inline ml-2">
							Your car has been successfully added.
						</span>
					</div>
				</div>
			)}
		</AuthLayout>
	);
}
