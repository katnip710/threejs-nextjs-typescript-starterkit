"use client";

import dynamic from "next/dynamic";
import ExampleNavigation from "@/components/ExampleNavigation";

// Dynamically import the component for client-side rendering
const GalacticSolarSystem = dynamic(
  () => import("@/components/GalacticSolarSystem"),
  { ssr: false }
);

export default function GalacticSolarSystemPage() {
  return (
    <div className="w-full h-screen relative">
      {/* Navigation */}
      <ExampleNavigation currentExample="galactic-solar-system" />

      <GalacticSolarSystem />
    </div>
  );
}
