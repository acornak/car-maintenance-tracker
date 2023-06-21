import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import HistoryIcon from "../../icons/HistoryIcon";

describe("TrackingIcon Component", () => {
	it("should render without throwing an error", () => {
		render(<HistoryIcon />);

		// Test if the svg icon is in the document
		const svgElement = screen.getByTestId("history-icon");
		expect(svgElement).toBeInTheDocument();

		// Test if the svg icon has correct classes
		expect(svgElement).toHaveClass("h-full w-full text-indigo-600");
	});
});
