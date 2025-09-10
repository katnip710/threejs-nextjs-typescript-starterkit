"use client";

import Link from "next/link";

type NavigationItem = {
  href: string;
  label: string;
  emoji: string;
  color: string;
};

type ExampleNavigationProps = {
  currentExample?: string;
};

export default function ExampleNavigation({
  currentExample,
}: ExampleNavigationProps) {
  const navigationItems: NavigationItem[] = [
    {
      href: "/",
      label: "Home",
      emoji: "🏠",
      color: "bg-blue-400 hover:bg-blue-500",
    },
    {
      href: "/rotating-cube",
      label: "Cube",
      emoji: "🎲",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    // {
    //   href: "/galactic-solar-system",
    //   label: "Galaxy",
    //   emoji: "🌌",
    //   color: "bg-blue-600 hover:bg-blue-700",
    // },
    // {
    //   href: "/3-d-text",
    //   label: "3D Text",
    //   emoji: "🔤",
    //   color: "bg-blue-700 hover:bg-blue-800",
    // },
    // {
    //   href: "/immersive-scene",
    //   label: "City",
    //   emoji: "🏙️",
    //   color: "bg-blue-800 hover:bg-blue-900",
    // },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="relative flex items-center gap-4 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-2xl border border-white/10">
        {navigationItems.map((item) => {
          const isActive =
            (currentExample && item.href === `/${currentExample}`) ||
            (item.href === "/" && !currentExample);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-white text-sm transition-all duration-300 transform hover:scale-105 lg:w-24",
                item.color,
                isActive ? "ring-2 ring-white/50 shadow-lg" : "hover:shadow-lg",
              ].join(" ")}
            >
              <span className="text-base">{item.emoji}</span>
              <span className="hidden lg:flex">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-green-600/20 rounded-xl blur-xl -z-10"></div>
    </div>
  );
}
