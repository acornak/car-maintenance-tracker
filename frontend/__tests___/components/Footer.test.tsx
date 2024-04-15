import React from "react";
import { render } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
	it("renders the copyright text", () => {
		const { getByText } = render(<Footer />);
		const copyrightText: HTMLElement = getByText(
			/Car Maintenance Tracker, Inc. All rights reserved./i,
		);
		expect(copyrightText).toBeInTheDocument();
	});

	it("renders the current year", () => {
		const currentYear = new Date().getFullYear();
		const { getByText } = render(<Footer />);
		const yearText = getByText(new RegExp(currentYear.toString()));
		expect(yearText).toBeInTheDocument();
	});

	it("renders the footer with the correct classes", () => {
		const { container } = render(<Footer />);
		const footerElement = container.firstChild;
		expect(footerElement).toHaveClass(
			"bg-white text-center text-sm p-4 mt-auto",
		);
	});
});
