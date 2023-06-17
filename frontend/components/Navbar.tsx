import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
	return (
		<nav className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4">
				<div className="flex justify-between h-16">
					<div className="flex px-2 lg:px-0">
						<div className="flex-shrink-0 flex items-center">
							<Link href="/">
								<img
									className="block h-12 w-auto"
									src="/logo.png"
									alt="Car Maintenance Tracker"
								/>{" "}
							</Link>
						</div>
						<div className="hidden lg:ml-6 lg:flex lg:space-x-8">
							<Link
								href="/"
								className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium"
							>
								Home
							</Link>
						</div>
					</div>
					<div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
						<div className="max-w-lg w-full lg:max-w-xs">
							<Link
								href="/login"
								className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
							>
								Login
							</Link>
							<span className="mx-2 text-black">or</span>
							<Link
								href="/register"
								className="whitespace-nowrap text-base font-medium text-indigo-600 hover:text-indigo-500"
							>
								Register
							</Link>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
