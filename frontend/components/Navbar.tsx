"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const Navbar: React.FC = () => {
	const { isAuthenticated, logout, user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const dropdownRef: any = useRef(null);

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleLogout = () => {
		logout();
		router.push("/");
		setIsDropdownOpen(false);
	};

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<nav className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4">
				<div className="flex justify-between h-16">
					<div className="flex px-2 lg:px-0">
						<div className="flex-shrink-0 flex items-center">
							<Link href="/">
								<Image
									className="block h-12 w-auto"
									src="/logo.png"
									alt="Car Maintenance Tracker"
									width={500}
									height={500}
								/>{" "}
							</Link>
						</div>
						<div className="hidden lg:ml-6 lg:flex lg:space-x-8">
							<Link
								href="/"
								className={`${
									pathname === "/"
										? "text-gray-900 border-indigo-500"
										: "text-gray-500"
								} inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium`}
							>
								Home
							</Link>
							{isAuthenticated && (
								<Link
									href="/garage"
									className={`${
										pathname.includes("/garage")
											? "text-gray-900 border-indigo-500"
											: "text-gray-500"
									} inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium`}
								>
									My Garage
								</Link>
							)}
						</div>
					</div>
					<div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
						{isAuthenticated ? (
							<div className="ml-4 flex items-center">
								<div className="ml-3 relative">
									<div>
										<button
											className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:shadow-outline"
											onClick={() => toggleDropdown()}
											aria-label="User menu"
											aria-haspopup="true"
										>
											<div className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 px-4 py-2 ">
												{`Welcome, ${user.nickname}!`}
											</div>
											<Image
												className="h-8 w-8 rounded-full"
												src="https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
												alt="User Icon"
												width={32}
												height={32}
											/>
										</button>
									</div>
									{isDropdownOpen && (
										<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50">
											<div className="py-1 rounded-md bg-white shadow-xs">
												<Link href="/settings" passHref>
													<div
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														onClick={() =>
															toggleDropdown()
														}
													>
														Account Settings
													</div>
												</Link>
												<Link href="/billing" passHref>
													<div
														className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														onClick={() =>
															toggleDropdown()
														}
													>
														Billing
													</div>
												</Link>
												<button
													onClick={() =>
														handleLogout()
													}
													className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 focus:outline-none focus:bg-red-100"
												>
													Logout
												</button>
											</div>
										</div>
									)}
								</div>
							</div>
						) : (
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
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
