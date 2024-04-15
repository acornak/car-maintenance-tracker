import React from "react";
import { render, screen } from "@testing-library/react";
import Features from "@/components/home/Features";

describe("Features", () => {
	it("renders the heading text", () => {
		render(<Features />);
		const headingText = screen.getByText(
			/A better way to manage your car maintenance/i,
		);
		expect(headingText).toBeInTheDocument();
	});

	it("renders the feature titles", () => {
		render(<Features />);
		const featureTitles = screen.getAllByRole("heading", { level: 3 });
		expect(featureTitles).toHaveLength(4);
		expect(featureTitles[0]).toHaveTextContent("Maintenance Reminders");
		expect(featureTitles[1]).toHaveTextContent("Comprehensive Tracking");
		expect(featureTitles[2]).toHaveTextContent("Cost Management");
		expect(featureTitles[3]).toHaveTextContent("Vehicle History");
	});

	it("renders the feature descriptions", () => {
		render(<Features />);
		const featureDescriptions = screen.getAllByRole("paragraph");
		expect(featureDescriptions).toHaveLength(4);
		expect(featureDescriptions[0]).toHaveTextContent(
			/Never forget a service date with automatic reminders./i,
		);
		expect(featureDescriptions[1]).toHaveTextContent(
			/Keep track of everything from oil changes to tire rotations./i,
		);
		expect(featureDescriptions[2]).toHaveTextContent(
			/Track expenses and manage your car maintenance budget effectively./i,
		);
		expect(featureDescriptions[3]).toHaveTextContent(
			/A complete history of your car's maintenance at your fingertips./i,
		);
	});

	it("renders the feature icons", () => {
		render(<Features />);
		const featureIcons = screen.getAllByRole("img");
		expect(featureIcons).toHaveLength(4);
	});
});
