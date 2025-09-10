import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-animated flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-10 py-16">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center gap-10">
          <h1 className="text-2xl lg:text-4xl font-bold text-white leading-tight">
            Three.js + Next.js + TypeScript
          </h1>
          <p className="text-base lg:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light">
            Welcome to a comprehensive starter kit for building 3D web
            applications. This project demonstrates how to integrate Three.js
            with Next.js, TypeScript, and Tailwind CSS through progressive
            examples from basic shapes to complex interactive scenes.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExampleCard
              href="/rotating-cube"
              title="Rotating Cube"
              description="Learn the basics with a simple animated 3D cube"
              status="Available"
            />
            <ExampleCard
              href="/galactic-solar-system"
              title="Galactic Solar System"
              description="Solar system within a stunning particle galaxy - 20k particles!"
              status="Coming Soon"
            />
            <ExampleCard
              href="/three-d-text"
              title="3D Text Geometry"
              description="Dynamic typography in 3D space with animated letters"
              status="Coming Soon"
            />
            <ExampleCard
              href="/immersive-scene"
              title="Immersive Scene"
              description="Advanced cyberpunk city with dynamic effects"
              status="Coming Soon"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ExampleCard({
  href,
  title,
  description,
  status,
}: {
  href: string;
  title: string;
  description: string;
  status: "Available" | "Coming Soon";
}) {
  const isAvailable = status === "Available";

  const content = (
    <div
      className={[
        "p-6 rounded-xl border transition-all duration-500 transform hover:scale-105 h-full flex flex-col items-center gap-4",
        isAvailable
          ? "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/30 cursor-pointer hover:shadow-2xl"
          : "bg-gray-800/50 border-gray-600/50 cursor-not-allowed opacity-60",
      ].join(" ")}
    >
      <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
      <p className="text-gray-200 text-md leading-relaxed">{description}</p>
    </div>
  );

  return isAvailable ? (
    <Link href={href}>{content}</Link>
  ) : (
    <div>{content}</div>
  );
}
