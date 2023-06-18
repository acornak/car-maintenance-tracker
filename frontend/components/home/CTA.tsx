import React from "react";
import Link from "next/link";

const CTA: React.FC = () => {
	return (
		<section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 text-center">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-2xl font-extrabold text-gray-900 mb-6">
					Ready to keep your car in perfect condition?
				</h2>
				<p className="mb-8">
					Join the Car Maintenance Tracker community today and enjoy a
					hassle-free car maintenance experience.
				</p>
				<Link
					href="/register"
					className="inline-block py-3 px-6 bg-blue-600 text-white rounded-full text-lg font-bold"
				>
					Register Now
				</Link>
			</div>
		</section>
	);
};

export default CTA;
