import React from "react";
import { render, screen } from "@testing-library/react";
import CTA from "@/components/home/CTA";

describe("CTA", () => {
	it("renders the heading text", () => {
		render(<CTA />);
		const headingText = screen.getByText(
			/Ready to keep your car in perfect condition?/i,
		);
		expect(headingText).toBeInTheDocument();
	});

	it("renders the paragraph text", () => {
		render(<CTA />);
		const paragraphText = screen.getByText(
			/Join the Car Maintenance Tracker community today and enjoy a hassle-free car maintenance experience./i,
		);
		expect(paragraphText).toBeInTheDocument();
	});

	it("renders the register link", () => {
		render(<CTA />);

		const registerLink = screen.getByRole("link", {
			name: /Register Now/i,
		});
		expect(registerLink).toBeInTheDocument();
		expect(registerLink).toHaveAttribute("href", "/register");
	});
});
