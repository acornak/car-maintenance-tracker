import React from "react";
import { render, screen } from "@testing-library/react";
import CostIcon from "@/icons/CostIcon";

describe("TrackingIcon Component", () => {
	it("should render without throwing an error", () => {
		render(<CostIcon />);

		// Test if the svg icon is in the document
		const svgElement = screen.getByTestId("cost-icon");
		expect(svgElement).toBeInTheDocument();

		// Test if the svg icon has correct classes
		expect(svgElement).toHaveClass("h-full w-full text-indigo-600");
	});
});
