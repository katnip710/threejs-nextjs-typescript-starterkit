"use client";

import dynamic from "next/dynamic";
import ExampleNavigation from "@/components/ExampleNavigation";

// Dynamically import the Three.js component to avoid SSR issues
const RotatingCube = dynamic(() => import("@/components/RotatingCube"), {
  ssr: false,
});

export default function RotatingCubePage() {
  return (
    <div className="w-full h-screen relative">
      {/* Navigation */}
      <ExampleNavigation currentExample="rotating-cube" />

      <RotatingCube />
    </div>
  );
}
