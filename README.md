# Three.js + Next.js + TypeScript Starter Kit

A modern, production-ready starter kit for building 3D web applications using Three.js with Next.js 15, React 19, and TypeScript. This project showcases progressive complexity from basic 3D shapes to advanced interactive scenes with particle systems, orbital mechanics, and dynamic lighting.

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (Node.js 20+ recommended)
- **npm** or **yarn** package manager
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/katnip710/threejs-nextjs-typescript-starterkit.git
cd threejs-nextjs-typescript-starterkit

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the project.

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

## 🏗️ Project Structure

```
threejs-nextjs-typescript-starterkit/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                 # Home page with example gallery
│   │   ├── layout.tsx               # Root layout with global styles
│   │   ├── globals.css              # Global CSS with custom animations
│   │   ├── rotating-cube/           # Basic cube animation example
│   │   ├── galactic-solar-system/   # Solar system with particle galaxy
│   │   ├── 3-d-text/               # Dynamic 3D typography
│   │   └── immersive-scene/        # Advanced cyberpunk cityscape
│   └── components/                   # Reusable Three.js components
│       ├── ExampleNavigation.tsx    # Navigation between examples
│       ├── RotatingCube.tsx         # Interactive cube with controls
│       ├── GalacticSolarSystem.tsx  # 20k particle solar system
│       ├── ThreeDText.tsx           # Animated 3D text geometry
│       └── ImmersiveScene.tsx       # Complex scene with effects
├── public/                          # Static assets
├── PRESENTATION_GUIDE.md            # Tutorial and presentation script
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── next.config.js                   # Next.js configuration
```

## 🎯 3D Examples & Components

### 🎲 1. Rotating Cube (Currently Available)
**Route:** `/rotating-cube`
- **Interactive Controls:** Color picker, size slider, rotation speed
- **Features:** Real-time material changes, texture options, mouse interaction
- **Concepts:** Basic Three.js setup, animation loops, event handling

### 🌌 2. Galactic Solar System (Built, Hidden)
**Route:** `/galactic-solar-system` 
- **Scale:** 20,000+ particle galaxy background
- **Features:** Realistic orbital mechanics, multiple planets with moons
- **Concepts:** Particle systems, complex animations, orbital mathematics

### 🔤 3. 3D Text Geometry (Built, Hidden)
**Route:** `/3-d-text`
- **Features:** Dynamic typography, animated letter movements
- **Effects:** Multi-colored lighting, shadow casting, text extrusion
- **Concepts:** Text geometry, advanced lighting, material properties

### 🏙️ 4. Immersive Scene (Built, Hidden)
**Route:** `/immersive-scene`
- **Environment:** Cyberpunk cityscape with atmospheric effects
- **Features:** Dynamic lighting, particle effects, camera controls
- **Concepts:** Complex scene composition, post-processing, performance optimization

> **Note:** Currently only the Rotating Cube is publicly accessible. The other examples are fully implemented but temporarily hidden during development/presentation phases.

## 🛠️ Technology Stack

### Core Framework
- **[Next.js 15.5.2](https://nextjs.org/)** - React framework with App Router
- **[React 19.0.0](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5.7.3](https://www.typescriptlang.org/)** - Full type safety

### 3D Graphics
- **[Three.js 0.172.0](https://threejs.org/)** - 3D graphics library
- **[three-stdlib 2.36.0](https://github.com/pmndrs/three-stdlib)** - Three.js utilities and controls

### Styling & UI
- **[Tailwind CSS 3.4.15](https://tailwindcss.com/)** - Utility-first CSS framework
- **Custom CSS Animations** - Gradient backgrounds and transitions

### Development Tools
- **[ESLint 9.18.0](https://eslint.org/)** - Code linting and quality
- **[PostCSS 8.5.2](https://postcss.org/)** - CSS processing
- **Type Definitions** - Complete TypeScript support for all libraries

## ⚡ Performance Features

- **✅ Server-Side Rendering (SSR)** - Fast initial page loads
- **✅ Component-Based Architecture** - Reusable Three.js components
- **✅ Memory Management** - Proper cleanup and disposal patterns
- **✅ Responsive Design** - Adapts to all screen sizes
- **✅ WebGL Optimization** - Efficient rendering and animations
- **✅ Type Safety** - Comprehensive TypeScript coverage

## 🔧 Available Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build optimized production bundle
npm run start    # Start production server
npm run lint     # Run ESLint code quality checks
```

## 🎨 Development Notes

### Current Status
- **Production Ready:** Rotating Cube example with full interactivity
- **Development Complete:** All 4 examples are fully built and functional
- **Temporarily Hidden:** 3 examples are commented out in navigation for presentation/development

### Enabling Hidden Examples
To enable the hidden examples, uncomment the navigation items in `src/components/ExampleNavigation.tsx`:

```typescript
// Uncomment these sections (lines 32-49) to enable navigation:
{
  href: "/galactic-solar-system",
  label: "Galaxy", 
  emoji: "🌌",
  color: "bg-blue-600 hover:bg-blue-700",
},
// ... other examples
```

### Custom CSS Classes
The project includes custom Tailwind utilities in `src/app/globals.css`:
- `bg-gradient-animated` - Animated gradient background
- Responsive typography and spacing utilities

## 📚 Learning Path

This starter kit is designed for progressive learning:

1. **Start with Rotating Cube** - Learn Three.js basics, scene setup, and React integration
2. **Explore Solar System** - Understand particle systems and complex animations  
3. **Study 3D Text** - Master geometry creation and advanced lighting
4. **Analyze Immersive Scene** - Learn professional scene composition and effects

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Add proper Three.js cleanup in useEffect returns
- Maintain responsive design principles
- Include comprehensive comments for 3D-specific code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Three.js](https://threejs.org/)** - Incredible 3D graphics library
- **[Next.js](https://nextjs.org/)** - Outstanding React framework
- **[TypeScript](https://www.typescriptlang.org/)** - Essential type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Excellent utility-first styling
- **[React](https://react.dev/)** - Modern UI library with concurrent features

---

**Ready to build amazing 3D web experiences?** Start with `npm run dev` and explore the examples! 🚀
