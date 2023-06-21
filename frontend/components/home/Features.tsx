import React from "react";
import CostIcon from "@/icons/CostIcon";
import HistoryIcon from "@/icons/HistoryIcon";
import ReminderIcon from "@/icons/ReminderIcon";
import TrackingIcon from "@/icons/TrackingIcon";

const FeatureItem: React.FC<{
	title: string;
	description: string;
	IconComponent: React.ElementType;
}> = ({ title, description, IconComponent }) => {
	return (
		<div className="pt-6">
			<div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
				<div className="flex flex-col items-center">
					<div
						className="mt-3 flex items-center justify-center h-12 w-12 rounded-md text-white"
						role="img"
					>
						<IconComponent />
					</div>
					<h3 className="mt-2 text-lg leading-6 font-medium text-gray-900">
						{title}
					</h3>
					<p
						className="mt-2 text-base leading-6 text-gray-500"
						role="paragraph"
					>
						{description}
					</p>
				</div>
			</div>
		</div>
	);
};

type FeatureProps = {
	title: string;
	description: string;
	IconComponent: React.ElementType;
};

const features: FeatureProps[] = [
	{
		title: "Maintenance Reminders",
		description: "Never forget a service date with automatic reminders.",
		IconComponent: ReminderIcon,
	},
	{
		title: "Comprehensive Tracking",
		description:
			"Keep track of everything from oil changes to tire rotations.",
		IconComponent: TrackingIcon,
	},
	{
		title: "Cost Management",
		description:
			"Track expenses and manage your car maintenance budget effectively.",
		IconComponent: CostIcon,
	},
	{
		title: "Vehicle History",
		description:
			"A complete history of your car's maintenance at your fingertips.",
		IconComponent: HistoryIcon,
	},
];

const Features: React.FC = () => {
	return (
		<div className="py-12 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:text-center">
					<h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
						Features
					</h2>
					<p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
						A better way to manage your car maintenance
					</p>
					<p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
						Track, plan, and manage your car maintenance all in one
						place.
					</p>
				</div>
				<div className="mt-10">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{features.map((feature: FeatureProps, idx: number) => (
							<FeatureItem
								key={idx}
								title={feature.title}
								description={feature.description}
								IconComponent={feature.IconComponent}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Features;
