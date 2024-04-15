import React from "react";
import Image from "next/image";

const Hero: React.FC = () => {
	return (
		<div className="relative bg-white overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
					<main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
						<div className="sm:text-center lg:text-left">
							<h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
								<span className="block xl:inline">
									Keep your car in
								</span>{" "}
								<span className="block text-indigo-600 xl:inline">
									perfect condition
								</span>
							</h1>
							<p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
								With our Car Maintenance Tracker, you&apos;ll
								never forget about your car&apos;s maintenance
								again. Track everything in one place, get
								reminders, and keep your vehicle running
								smoothly.
							</p>
						</div>
					</main>
				</div>
			</div>
			<div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
				<Image
					className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
					src="/hero.jpg"
					alt="Car Maintenance Tracker Hero Image"
					fill={true}
					style={{ objectFit: "cover" }}
					role="img"
				/>
			</div>
		</div>
	);
};

export default Hero;
