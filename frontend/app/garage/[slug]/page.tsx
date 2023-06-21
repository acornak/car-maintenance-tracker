"use client";
import React, { useState, useEffect } from "react";
import { getCarByID, getAllCars } from "@/common/functions";
import { Car } from "@/common/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthLayout from "../layout";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const cars: Car[] = await getAllCars();
	return cars.map((car: Car) => ({
		slug: `${car.id}`,
	}));
}

export const dynamicParams: boolean = true;
export const revalidate: number = 3600;

export default async function CarPage({
	params,
}: {
	params: { slug: string };
}) {
	const [car, setCar] = useState<Car | null>(null);
	const router = useRouter();

	useEffect(() => {
		const carID = params.slug;
		getCarByID(parseInt(carID))
			.then((car) => {
				if (!car) {
					// TODO: add err handling
					return;
				}
				setCar(car);
			})
			.catch((error) => {
				if (error.message === "Unauthorized") {
					router.push("/garage");
				}
			});
	}, [params]);

	if (!car) {
		return <div>Loading...</div>;
	}

	const createdAt = new Date(car.created_at!);
	const formattedDate = createdAt.toLocaleDateString();
	const formattedTime = createdAt.toLocaleTimeString();

	return (
		<AuthLayout>
			<div className="bg-gray-100 min-h-screen pb-12">
				<div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
					<Image
						fill={true}
						style={{ objectFit: "cover" }}
						src={
							car.image ||
							"https://www.cnet.com/a/img/resize/33cd2a21cb8b041a68114816f79b2ff835f6bf83/hub/2021/01/07/61d32fc6-6506-4d60-bcb7-3a705df2d4b7/leader-accessories-platinum-guard-1.jpg?auto=webp&width=1200"
						}
						alt={`${car.brand_name} ${car.model_name}`}
						className="object-cover rounded-lg"
					/>
				</div>
				<div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-8 mb-8">
					<div className="md:flex items-center px-8 py-6 relative">
						<div className="md:w-1/2">
							<h2 className="text-xl text-gray-700 font-bold">
								{car.year} {car.brand_name} {car.model_name}
							</h2>
							<div className="absolute top-0 right-0 mt-2 mr-2">
								<button
									className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
									onClick={() =>
										router.push(`/garage/edit/${car.id}`)
									}
									style={{
										padding: "2px 12px",
										margin: "10px",
									}}
								>
									Edit Car
								</button>
								<button
									className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
									onClick={() => {}}
									style={{
										padding: "2px 12px",
										margin: "10px",
									}}
								>
									Delete Car
								</button>
							</div>
							<p className="mt-2 text-gray-600">
								{car.description}
							</p>
							<div className="mt-4">
								<h3 className="text-lg font-semibold text-gray-700">
									Car Details
								</h3>
								<div className="grid grid-cols-2 gap-2">
									<p className="text-sm font-bold text-gray-700">
										Color:
									</p>
									<p className="text-sm text-gray-600">
										{car.color}
									</p>
									<p className="text-sm font-bold text-gray-700">
										License Plate:
									</p>
									<p className="text-sm text-gray-600">
										{car.license_plate}
									</p>
									<p className="text-sm font-bold text-gray-700">
										VIN:
									</p>
									<p className="text-sm text-gray-600">
										{car.vin}
									</p>
									<p className="text-sm font-bold text-gray-700">
										Price:
									</p>
									<p className="text-sm text-gray-600">
										${car.price}
									</p>
									<p className="text-sm font-bold text-gray-700">
										Added on:
									</p>
									<p className="text-sm text-gray-600">
										{formattedDate} at {formattedTime}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
}
