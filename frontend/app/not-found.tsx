"use client";
import React, { useEffect } from "react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Custom404: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		setTimeout(() => {
			router.push("/");
		}, 5000); // redirect to home page after 5s
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full">
				<div>
					<h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
						404 - Page Not Found
					</h2>
					<p className="mt-2 text-center text-base leading-6 text-gray-600">
						The page you are looking for does not exist. You will be
						redirected to the home page in a few seconds...
						<br />
						If you are not redirected, click{" "}
						<Link href="/" className="underline text-blue-500">
							here
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Custom404;
