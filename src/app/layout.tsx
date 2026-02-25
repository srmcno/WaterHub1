import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CNO Water Data Hub",
  description: "Choctaw Nation of Oklahoma Water Data Platform - Real-time monitoring of stream gauges, groundwater, and water quality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
