import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Head from "next/head";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Car Maintenance Tracker",
	description: "Manage your car maintenance records online.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<Head>
				<title>Car Maintenance Tracker</title>
			</Head>
			<body className={`${inter.className} bg-white`}>
				<div className="flex flex-col min-h-screen">
					<AuthProvider>
						<Navbar />
						<div className="flex-grow">{children}</div>
						<Footer />
					</AuthProvider>
				</div>
			</body>
		</html>
	);
}
