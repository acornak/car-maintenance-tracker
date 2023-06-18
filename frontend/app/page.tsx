import React from "react";

import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Testimonials from "@/components/home/Testimonials";
import Pricing from "@/components/home/Pricing";

const HomePage: React.FC = () => {
	return (
		<>
			<Hero />
			<Features />
			<Testimonials />
			<Pricing />
			<CTA />
		</>
	);
};

export default HomePage;
