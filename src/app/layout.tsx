import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Three.js + Next.js + TypeScript Starter Kit by Kat Lea",
  description:
    "A comprehensive guide and starter kit for building 3D web applications with Three.js, Next.js, and TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.gif" type="image/gif" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
