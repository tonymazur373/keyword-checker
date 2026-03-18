import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Keyword Checker",
  description: "Check exact keyword and phrase occurrences in text.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
