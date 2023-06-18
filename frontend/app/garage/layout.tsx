"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated } = useAuth();
	const router = useRouter();

	if (isAuthenticated) {
		return <div>{children}</div>;
	}

	return (
		<div className="flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
			<div className="max-w-5xl space-y-8 w-full text-center">
				<h1 className="text-4xl font-bold mb-5">
					You must be logged in to view this page.
				</h1>
			</div>
			<div className="text-center">
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					onClick={() => router.push("/login")}
				>
					Login
				</button>
			</div>
		</div>
	);
}
