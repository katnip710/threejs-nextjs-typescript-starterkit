"use client";

import dynamic from "next/dynamic";
import ExampleNavigation from "@/components/ExampleNavigation";

// Dynamically import the Three.js component to avoid SSR issues
const ThreeDText = dynamic(() => import("@/components/ThreeDText"), {
  ssr: false,
});

export default function ThreeDTextPage() {
  return (
    <div className="w-full h-screen relative">
      {/* Navigation */}
      <ExampleNavigation currentExample="product-showcase" />

      <ThreeDText />
    </div>
  );
}

// Note: metadata cannot be exported from client components
