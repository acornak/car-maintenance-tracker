import React from "react";
import { render, screen } from "@testing-library/react";
import Testimonials from "@/components/home/Testimonials";

describe("Testimonials", () => {
	it("renders the testimonial quotes", () => {
		render(<Testimonials />);
		const testimonialQuotes = screen.getAllByText(
			/This app has made maintaining my car so much easier! Highly recommend./i,
		);
		expect(testimonialQuotes).toHaveLength(3);
	});

	it("renders the testimonial authors", () => {
		render(<Testimonials />);
		const testimonialAuthors = screen.getAllByText(
			/John Doe|Jane Doe|Jim Doe/i,
		);
		expect(testimonialAuthors).toHaveLength(3);
	});

	it("renders the testimonial images if provided", () => {
		render(<Testimonials />);
		const testimonialImages = screen.getAllByRole("img");
		expect(testimonialImages).toHaveLength(3);
		testimonialImages.forEach((image) => {
			expect(image).toHaveAttribute("alt", "");
		});
	});
});
