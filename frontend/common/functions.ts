import { Car, CarMaker, CarModel } from "./types";

const validateField = (value: string, regex: RegExp) => regex.test(value);

async function fetchJSON(
	url: string,
	options?: RequestInit,
	fetcher = fetch,
): Promise<any> {
	const res: Response = await fetcher(url, options);
	const data: any = await res.json();

	if (!res.ok) {
		throw new Error(data.message);
	}

	return data;
}

async function getMakerByID(id: number, fetcher = fetch): Promise<string> {
	const data = await fetchJSON(
		`/api/v1/cars/maker?id=${id}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
		fetcher,
	);

	return data.maker.name;
}

async function getModelByID(id: number, fetcher = fetch): Promise<string> {
	const data = await fetchJSON(
		`/api/v1/cars/model?id=${id}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
		fetcher,
	);

	return data.model.name;
}

async function getAllCars(fetcher = fetch): Promise<Car[]> {
	const data = await fetchJSON(
		"/api/v1/cars/get-by-user",
		{
			credentials: "include",
		},
		fetcher,
	);

	return Promise.all(
		data.cars.map(async (car: Car) => {
			if (!car.brand_id || !car.model_id) {
				throw new Error("Invalid car data");
			}

			const brand: string = await getMakerByID(car.brand_id, fetcher);
			const model: string = await getModelByID(car.model_id, fetcher);

			return { ...car, brand_name: brand, model_name: model };
		}),
	);
}

async function getCarByID(id: number, fetcher = fetch): Promise<Car> {
	const data = await fetchJSON(
		`/api/v1/cars/get?id=${id}`,
		{
			credentials: "include",
		},
		fetcher,
	);

	if (data.status === 401) {
		throw new Error("Unauthorized");
	}

	const car: Car = data.car;

	if (!car.brand_id || !car.model_id) {
		throw new Error("Invalid car data");
	}

	const brand: string = await getMakerByID(car.brand_id, fetcher);
	const model: string = await getModelByID(car.model_id, fetcher);

	return { ...car, brand_name: brand, model_name: model };
}

async function getAllCarMakers(fetcher = fetch): Promise<CarMaker[]> {
	const data = await fetchJSON("/api/v1/cars/makers", {}, fetcher);

	return data.makers;
}

async function getAllModelsByMakerID(
	makerID: number,
	fetcher = fetch,
): Promise<CarModel[]> {
	const data = await fetchJSON(
		`/api/v1/cars/models`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ maker_id: makerID }),
		},
		fetcher,
	);

	return data.models;
}

export {
	fetchJSON,
	validateField,
	getAllCars,
	getMakerByID,
	getModelByID,
	getCarByID,
	getAllCarMakers,
	getAllModelsByMakerID,
};
