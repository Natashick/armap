import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ARMAP - Assurance & Resilience Mapping Assistant",
	description: "Dein intelligenter Assurance & Resilience Mapping Assistant powered by AI",
	openGraph: {
		title: "ARMAP Assistant",
		description: "Dein Assurance & Resilience Mapping Assistant",
		type: "website"
	}
};

export default function RootLayout({
	children
}: {
	children: React. ReactNode;
}) {
	return (
		<html lang="en">
			<body className={cn(inter.className, "overscroll-none bg-neutral-900")}>
				{children}
			</body>
		</html>
	);
}
