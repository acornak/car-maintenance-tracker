import React from "react";
import { render, screen } from "@testing-library/react";
import Pricing from "@/components/home/Pricing";

describe("Pricing", () => {
	it("renders the plan names", () => {
		render(<Pricing />);
		const planNames = screen.getAllByText(/Basic|Standard|Premium/i);
		expect(planNames).toHaveLength(9);
	});

	it("renders the plan prices", () => {
		render(<Pricing />);
		const planPrices = screen.getAllByText(/\$0|\$9.99|\$19.99/i);
		expect(planPrices).toHaveLength(3);
	});

	it("renders the plan features", () => {
		render(<Pricing />);
		const featureLists = screen.getAllByRole("list");
		expect(featureLists).toHaveLength(3);

		const featureListItems = screen.getAllByRole("listitem");
		expect(featureListItems).toHaveLength(15);
		expect(featureListItems[0]).toHaveTextContent("Feature 1");
		expect(featureListItems[1]).toHaveTextContent("Feature 2");
		expect(featureListItems[2]).toHaveTextContent("Feature 3");
		expect(featureListItems[3]).toHaveTextContent("Feature 1");
		expect(featureListItems[4]).toHaveTextContent("Feature 2");
		expect(featureListItems[5]).toHaveTextContent("Feature 3");
		expect(featureListItems[6]).toHaveTextContent("Feature 1");
		expect(featureListItems[7]).toHaveTextContent("Feature 2");
		expect(featureListItems[8]).toHaveTextContent("Feature 1");
		expect(featureListItems[9]).toHaveTextContent("Feature 2");
		expect(featureListItems[10]).toHaveTextContent("Feature 3");
		expect(featureListItems[11]).toHaveTextContent("Standard Feature 1");
		expect(featureListItems[12]).toHaveTextContent("Standard Feature 2");
		expect(featureListItems[13]).toHaveTextContent("Premium Feature 1");
		expect(featureListItems[14]).toHaveTextContent("Premium Feature 2");
	});
});
