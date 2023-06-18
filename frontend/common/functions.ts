import { Car } from "./types";

const validateField = (value: string, regex: RegExp) => regex.test(value);

async function getMakerByID(id: number): Promise<string> {
	const res = await fetch(`/api/v1/cars/maker?id=${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		return "";
	}

	const data = await res.json();
	return data.maker.name;
}

async function getModelByID(id: number): Promise<string> {
	const res = await fetch(`/api/v1/cars/model?id=${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		return "";
	}

	const data = await res.json();
	return data.model.name;
}

async function fetchCars(): Promise<Car[]> {
	const res = await fetch("/api/v1/cars/get-by-user", {
		credentials: "include",
	});
	const data = await res.json();

	if (!res.ok) {
		throw new Error(data.message);
	}

	// for each car in cars, fetch data about model and brand by id:
	for (let i = 0; i < data.cars.length; i++) {
		const car = data.cars[i];
		const brand = await getMakerByID(car.brand_id);
		const model = await getModelByID(car.model_id);
		car.brand_name = brand;
		car.model_name = model;
	}

	return data.cars;
}

async function fetchCarByID(id: number): Promise<Car> {
	const res = await fetch(`/api/v1/cars/get?id=${id}`, {
		credentials: "include",
	});
	const data = await res.json();

	console.log(res.status);

	// Check if response status is 401 unauthorized
	if (res.status === 401) {
		throw new Error("Unauthorized");
	}

	if (!res.ok) {
		throw new Error(data.message);
	}

	const car = data.car;
	const brand = await getMakerByID(car.brand_id);
	const model = await getModelByID(car.model_id);
	car.brand_name = brand;
	car.model_name = model;

	return car;
}

export { validateField, fetchCars, getMakerByID, getModelByID, fetchCarByID };
