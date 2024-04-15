import React from "react";
import { render, screen } from "@testing-library/react";
import ReminderIcon from "@/icons/ReminderIcon";

describe("TrackingIcon Component", () => {
	it("should render without throwing an error", () => {
		render(<ReminderIcon />);

		// Test if the svg icon is in the document
		const svgElement = screen.getByTestId("reminder-icon");
		expect(svgElement).toBeInTheDocument();

		// Test if the svg icon has correct classes
		expect(svgElement).toHaveClass("h-full w-full text-indigo-600");
	});
});
