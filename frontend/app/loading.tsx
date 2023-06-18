import React from "react";

const LoadingPage: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex items-center space-x-4">
				<svg
					className="animate-spin h-8 w-8 text-indigo-500"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 12a8 8 0 01-8 8v-4c2.206 0 4-1.794 4-4h4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"
					></path>
				</svg>
				<p className="text-gray-600">Loading...</p>
			</div>
		</div>
	);
};

export default LoadingPage;
