import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className="bg-white text-center text-sm p-4 mt-auto">
			<div className="container mx-auto">
				<p className="text-base text-gray-500 sm:text-md sm:max-w-xl sm:mx-auto md:text-md">
					&copy; {new Date().getFullYear()} Car Maintenance Tracker,
					Inc. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
