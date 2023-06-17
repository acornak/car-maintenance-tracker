import React from "react";

interface PricingPlan {
	name: string;
	price: number;
	features: string[];
}

const pricingPlans: PricingPlan[] = [
	{
		name: "Basic",
		price: 0,
		features: ["Feature 1", "Feature 2", "Feature 3"],
	},
	{
		name: "Standard",
		price: 9.99,
		features: [
			"Feature 1",
			"Feature 2",
			"Feature 3",
			"Standard Feature 1",
			"Standard Feature 2",
		],
	},
	{
		name: "Premium",
		price: 19.99,
		features: [
			"Feature 1",
			"Feature 2",
			"Feature 3",
			"Standard Feature 1",
			"Standard Feature 2",
			"Premium Feature 1",
			"Premium Feature 2",
		],
	},
	// Add more pricing plans as needed
];

const Pricing: React.FC = () => {
	return (
		<section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
					Choose Your Plan
				</h2>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{pricingPlans.map((plan, idx) => (
						<div
							key={idx}
							className="p-6 bg-white rounded-lg shadow"
						>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								{plan.name}
							</h3>
							<p className="text-2xl font-extrabold text-gray-900 mb-4">
								${plan.price}
							</p>
							<ul className="list-disc list-inside space-y-2">
								{plan.features.map((feature, idx) => (
									<li key={idx} className="text-gray-600">
										{feature}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Pricing;
