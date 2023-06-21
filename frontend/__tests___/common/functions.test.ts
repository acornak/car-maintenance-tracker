import { Car } from "@/common/types";
import {
	fetchJSON,
	getAllCarMakers,
	getAllCars,
	getAllModelsByMakerID,
	getCarByID,
	getMakerByID,
	getModelByID,
	validateField,
} from "../../common/functions";

describe("validateField", () => {
	it("returns true when the value matches the regex", () => {
		const value = "abc123";
		const regex = /^[a-z0-9]+$/i;
		const result = validateField(value, regex);
		expect(result).toBe(true);
	});

	it("returns false when the value does not match the regex", () => {
		const value = "abc$123";
		const regex = /^[a-z0-9]+$/i;
		const result = validateField(value, regex);
		expect(result).toBe(false);
	});

	it("returns true when the regex allows an empty value", () => {
		const value = "";
		const regex = /^.*$/; // Match anything, including an empty string
		const result = validateField(value, regex);
		expect(result).toBe(true);
	});

	it("returns false when the regex does not allow an empty value", () => {
		const value = "";
		const regex = /^.+/; // Match anything that is not an empty string
		const result = validateField(value, regex);
		expect(result).toBe(false);
	});
});

describe("fetchJSON", () => {
	let mockFetch: jest.Mock;

	beforeEach(() => {
		mockFetch = jest.fn();
		global.fetch = mockFetch;
	});

	it("should return data when response is ok", async () => {
		const responseData = { someKey: "someValue" };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => responseData,
		});

		const result = await fetchJSON("http://test.url", {}, mockFetch);
		expect(result).toEqual(responseData);
	});

	it("should throw an error when response is not ok", async () => {
		const responseError = "Some error message";
		mockFetch.mockResolvedValueOnce({
			ok: false,
			statusText: responseError,
			json: async () => ({ message: responseError }),
		});

		await expect(
			fetchJSON("http://test.url", {}, mockFetch),
		).rejects.toThrow(responseError);
	});

	it("should make a request with the correct url and options", async () => {
		const responseData = { someKey: "someValue" };
		const testUrl = "http://test.url";
		const testOptions = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => responseData,
		});

		await fetchJSON(testUrl, testOptions, mockFetch);
		expect(mockFetch).toHaveBeenCalledWith(testUrl, testOptions);
	});
});

// Testing async fetch functions
beforeEach(() => {
	mockFetchJSON = jest.fn();
});

type AllCarMakersResponseData = { makers: { id: number; name: string }[] };
type AllModelsByIDResponseData = { models: { id: number; name: string }[] };
type MakerResponseData = { maker: { name: string } };
type ModelResponseData = { model: { name: string } };

let responseError: string = "Invalid ID";
let mockFetchJSON: jest.Mock;

const modelResponseData: ModelResponseData = { model: { name: "Model1" } };
const makerResponseData: MakerResponseData = { maker: { name: "Maker1" } };
const allCarMakersResponseData: AllCarMakersResponseData = {
	makers: [
		{ id: 1, name: "Maker1" },
		{ id: 2, name: "Maker2" },
	],
};
const allModelsByIDresponseData: AllModelsByIDResponseData = {
	models: [
		{ id: 1, name: "Model1" },
		{ id: 2, name: "Model2" },
	],
};

describe("getMakerByID", () => {
	it("should return maker name when id is valid", async () => {
		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => makerResponseData,
		});

		const result: string = await getMakerByID(1, mockFetchJSON);
		expect(result).toEqual(makerResponseData.maker.name);
	});

	it("should throw an error when id is not valid", async () => {
		mockFetchJSON.mockRejectedValueOnce(new Error(responseError));

		await expect(getMakerByID(999, mockFetchJSON)).rejects.toThrow(
			responseError,
		);
	});

	it("should make a request with the correct url and options", async () => {
		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => makerResponseData,
		});

		const testId: number = 1;
		const testUrl: string = `/api/v1/cars/maker?id=${testId}`;
		const testOptions: RequestInit = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};

		mockFetchJSON.mockResolvedValueOnce(makerResponseData);

		await getMakerByID(testId, mockFetchJSON);
		expect(mockFetchJSON).toHaveBeenCalledWith(testUrl, testOptions);
	});
});

describe("getModelByID", () => {
	it("should return model name when id is valid", async () => {
		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => modelResponseData,
		});

		const result: string = await getModelByID(1, mockFetchJSON);
		expect(result).toEqual(modelResponseData.model.name);
	});

	it("should throw an error when id is not valid", async () => {
		mockFetchJSON.mockRejectedValueOnce(new Error(responseError));

		await expect(getModelByID(999, mockFetchJSON)).rejects.toThrow(
			responseError,
		);
	});

	it("should make a request with the correct url and options", async () => {
		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => modelResponseData,
		});

		const testId: number = 1;
		const testUrl: string = `/api/v1/cars/model?id=${testId}`;
		const testOptions: RequestInit = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		};

		mockFetchJSON.mockResolvedValueOnce(modelResponseData);

		await getModelByID(testId, mockFetchJSON);
		expect(mockFetchJSON).toHaveBeenCalledWith(testUrl, testOptions);
	});
});

describe("getAllCarMakers", () => {
	responseError = "Fetch error";
	it("should return all car makers when data is valid", async () => {
		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => allCarMakersResponseData,
		});

		const result = await getAllCarMakers(mockFetchJSON);
		expect(result).toEqual(allCarMakersResponseData.makers);
	});

	it("should throw an error when fetchJSON rejects", async () => {
		mockFetchJSON.mockRejectedValueOnce(new Error(responseError));

		await expect(getAllCarMakers(mockFetchJSON)).rejects.toThrow(
			responseError,
		);
	});

	it("should make a request with the correct url", async () => {
		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => allCarMakersResponseData,
		});

		await getAllCarMakers(mockFetchJSON);
		expect(mockFetchJSON).toHaveBeenCalledWith("/api/v1/cars/makers", {});
	});
});

describe("getAllModelsByMakerID", () => {
	it("should return all models for a maker when data is valid", async () => {
		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => allModelsByIDresponseData,
		});

		const result = await getAllModelsByMakerID(1, mockFetchJSON);
		expect(result).toEqual(allModelsByIDresponseData.models);
	});

	it("should throw an error when fetchJSON rejects", async () => {
		mockFetchJSON.mockRejectedValueOnce(new Error(responseError));

		await expect(getAllModelsByMakerID(1, mockFetchJSON)).rejects.toThrow(
			responseError,
		);
	});

	it("should make a request with the correct url and options", async () => {
		const testId = 1;
		const testUrl = "/api/v1/cars/models";
		const testOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ maker_id: testId }),
		};

		mockFetchJSON.mockResolvedValueOnce({
			ok: true,
			json: async () => allModelsByIDresponseData,
		});

		await getAllModelsByMakerID(testId, mockFetchJSON);
		expect(mockFetchJSON).toHaveBeenCalledWith(testUrl, testOptions);
	});
});

// Testing get cars functions

beforeEach(() => {
	mockFetchJSON = jest.fn();
	global.fetch = jest.fn();
});

type AllCarsResponseData = { cars: Car[] };
const allCarsResponseData: AllCarsResponseData = {
	cars: [
		{
			id: 1,
			brand_id: 1,
			model_id: 1,
			year: 2000,
			price: 10000,
			description: "This is a car",
			created_at: "2021-01-01T00:00:00.000Z",
			color: "red",
			image: "image.jpg",
			license_plate: "ABC123",
			vin: "12345678901234567",
		},
		{
			id: 2,
			brand_id: 2,
			model_id: 2,
			year: 2020,
			price: 30000,
			description: "This is another car",
			created_at: "2021-02-04T00:00:00.000Z",
			color: "black",
			image: "image_2.jpg",
			license_plate: "DEF456",
			vin: "09876543212345",
		},
	],
};

describe("getAllCars", () => {
	beforeEach(() => {
		mockFetchJSON.mockImplementation(async (url: string, _) => {
			switch (url) {
				case "/api/v1/cars/maker?id=1":
					return {
						ok: true,
						json: async () => ({ maker: { name: "Maker1" } }),
					};
				case "/api/v1/cars/maker?id=2":
					return {
						ok: true,
						json: async () => ({ maker: { name: "Maker2" } }),
					};
				case "/api/v1/cars/model?id=1":
					return {
						ok: true,
						json: async () => ({ model: { name: "Model1" } }),
					};
				case "/api/v1/cars/model?id=2":
					return {
						ok: true,
						json: async () => ({ model: { name: "Model2" } }),
					};
				case "/api/v1/cars/get-by-user":
					return {
						ok: true,
						json: async () => allCarsResponseData,
					};
				default:
					throw new Error("Invalid URL");
			}
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return an array of cars with brand_name and model_name", async () => {
		const cars = await getAllCars(mockFetchJSON);

		expect(mockFetchJSON).toHaveBeenCalledTimes(5);

		expect(mockFetchJSON.mock.calls[0][0]).toBe("/api/v1/cars/get-by-user");
		expect(mockFetchJSON.mock.calls[1][0]).toBe("/api/v1/cars/maker?id=1");
		expect(mockFetchJSON.mock.calls[2][0]).toBe("/api/v1/cars/maker?id=2");
		expect(mockFetchJSON.mock.calls[3][0]).toBe("/api/v1/cars/model?id=1");
		expect(mockFetchJSON.mock.calls[4][0]).toBe("/api/v1/cars/model?id=2");

		const expectedCars = allCarsResponseData.cars.map((car) => ({
			...car,
			brand_name: car.brand_id === 1 ? "Maker1" : "Maker2",
			model_name: car.model_id === 1 ? "Model1" : "Model2",
		}));
		expect(cars).toEqual(expectedCars);
	});
});

describe("getCarByID", () => {
	const getCarResponse: { car: Car } = {
		car: {
			id: 1,
			brand_id: 1,
			model_id: 1,
			year: 2000,
			price: 10000,
			description: "This is a car",
			created_at: "2021-01-01T00:00:00.000Z",
			color: "red",
			image: "image.jpg",
			license_plate: "ABC123",
			vin: "12345678901234567",
		},
	};

	it("should return a car with brand_name and model_name", async () => {
		mockFetchJSON.mockImplementation(async (url: string, _) => {
			switch (url) {
				case "/api/v1/cars/get?id=1":
					return {
						ok: true,
						json: async () => getCarResponse,
					};
				case "/api/v1/cars/maker?id=1":
					return {
						ok: true,
						json: async () => ({ maker: { name: "Maker1" } }),
					};
				case "/api/v1/cars/model?id=1":
					return {
						ok: true,
						json: async () => ({ model: { name: "Model1" } }),
					};
				default:
					throw new Error("Invalid URL");
			}
		});

		const car = await getCarByID(1, mockFetchJSON);

		expect(mockFetchJSON).toHaveBeenCalledTimes(3);
		expect(mockFetchJSON.mock.calls[0][0]).toBe("/api/v1/cars/get?id=1");
		expect(mockFetchJSON.mock.calls[1][0]).toBe("/api/v1/cars/maker?id=1");
		expect(mockFetchJSON.mock.calls[2][0]).toBe("/api/v1/cars/model?id=1");

		expect(car).toEqual({
			id: 1,
			brand_id: 1,
			model_id: 1,
			year: 2000,
			price: 10000,
			description: "This is a car",
			created_at: "2021-01-01T00:00:00.000Z",
			color: "red",
			image: "image.jpg",
			license_plate: "ABC123",
			vin: "12345678901234567",
			brand_name: "Maker1",
			model_name: "Model1",
		});
	});

	it("should throw Unauthorized error when status is 401", async () => {
		mockFetchJSON.mockImplementation(async (url: string, _) => {
			switch (url) {
				case "/api/v1/cars/get?id=1":
					return {
						ok: false,
						json: async () => ({ message: "Unauthorized" }),
					};
				default:
					throw new Error("Invalid URL");
			}
		});

		await expect(getCarByID(1, mockFetchJSON)).rejects.toThrow(
			"Unauthorized",
		);
	});

	it("should throw Invalid car data error when brand_id or model_id is missing", async () => {
		mockFetchJSON.mockImplementation(async (url: string, _) => {
			switch (url) {
				case "/api/v1/cars/get?id=1":
					return {
						ok: true,
						json: async () => ({
							car: {
								id: 1,
								year: 2000,
								price: 10000,
								description: "This is a car",
								created_at: "2021-01-01T00:00:00.000Z",
								color: "red",
								image: "image.jpg",
								license_plate: "ABC123",
								vin: "12345678901234567",
							},
						}),
					};
				default:
					throw new Error("Invalid URL");
			}
		});

		await expect(getCarByID(1, mockFetchJSON)).rejects.toThrow(
			"Invalid car data",
		);
	});
});
