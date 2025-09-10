"use client";

import dynamic from "next/dynamic";
import ExampleNavigation from "@/components/ExampleNavigation";

// Dynamically import the Three.js component to avoid SSR issues
const ImmersiveScene = dynamic(() => import("@/components/ImmersiveScene"), {
  ssr: false,
});

export default function ImmersiveScenePage() {
  return (
    <div className="w-full h-screen relative">
      {/* Navigation */}
      <ExampleNavigation currentExample="immersive-scene" />

      <ImmersiveScene />
    </div>
  );
}

// Note: metadata cannot be exported from client components
