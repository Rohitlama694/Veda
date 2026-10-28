import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VEDA | Internship Portal",
  description: "Internship task submission and mentor review portal",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
