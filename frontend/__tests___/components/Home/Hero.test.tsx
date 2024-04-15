import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "@/components/home/Hero";

describe("Hero", () => {
	it("renders the main heading", () => {
		render(<Hero />);
		const mainHeading = screen.getByRole("heading", { level: 1 });
		expect(mainHeading).toHaveTextContent(
			"Keep your car in perfect condition",
		);
	});

	it("renders the subheading", () => {
		render(<Hero />);
		const subheading = screen.getByText(
			/With our Car Maintenance Tracker/i,
		);
		expect(subheading).toBeInTheDocument();
	});

	it("renders the image with correct alt text", () => {
		render(<Hero />);
		const image = screen.getByAltText(
			/Car Maintenance Tracker Hero Image/i,
		);
		expect(image).toBeInTheDocument();
	});
});
