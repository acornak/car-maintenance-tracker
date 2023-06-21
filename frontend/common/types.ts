export type User = {
	id: number;
	firstName: string;
	lastName: string;
	nickname: string;
	email: string;
	created_at: string;
};

export type Car = {
	id: number | null;
	brand_id: number | null;
	model_id: number | null;
	year: number | null;
	color: string | null;
	price: number | null;
	image: string | null;
	description: string | null;
	license_plate: string | null;
	vin: string | null;
	brand_name?: string | null;
	model_name?: string | null;
	created_at: string | null;
	image_file?: File | null;
};

export type CarMaker = {
	id: number;
	name: string;
};

export type CarModel = {
	id: number;
	carMakerId: number;
	name: string;
};
