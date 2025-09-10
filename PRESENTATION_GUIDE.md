# 🎯 Three.js + Next.js + TypeScript: Complete Presentation Guide

*A comprehensive script and blog-style guide for presenting modern 3D web development*

---

## 📖 Table of Contents

1. [Introduction & Setup](#1-introduction--setup)
2. [Basic Three.js Integration](#2-basic-threejs-integration)
3. [Example 1: Rotating Cube](#3-example-1-rotating-cube)
7. [Current Status & Access](#7-current-status--access)
8. [Performance & Best Practices](#8-performance--best-practices)

---

## 1. Introduction & Setup

### 🎬 **Presentation Script Opening**

> "Today we're going to explore the cutting-edge world of 3D web development by combining Three.js with Next.js 15, React 19, and TypeScript. This modern stack represents the latest in web technology, and by the end of this presentation, you'll understand how to create stunning interactive 3D experiences that run smoothly in any modern web browser."

### 🌟 **What We're Building**
- **🎲 Rotating Cube**: Foundation concepts and interactive controls

### 🚀 **Why This Modern Tech Stack?**

- **Three.js 0.172.0**: The most popular WebGL library (100k+ GitHub stars) with latest features
- **Next.js 15.5.2**: Production-ready React framework with App Router and SSR/SSG
- **React 19.0.0**: Latest React with concurrent features and improved performance
- **TypeScript 5.7.3**: Full type safety for complex 3D calculations and enhanced developer experience

### 💻 **Prerequisites**

```bash
# Ensure you have Node.js 18+ installed (Node.js 20+ recommended)
node --version  # Should be 18.0.0+ (20.0.0+ recommended)
npm --version   # Should be 8.0.0+
```

### 🔧 **Step 1: Clone the Complete Project**

**Script Point**: *"We have a complete, production-ready starter kit available that demonstrates all four examples. Let's start by cloning it and exploring what we've built."*

```bash
# Clone the comprehensive starter kit
git clone https://github.com/katnip710/threejs-nextjs-typescript-starterkit.git
cd threejs-nextjs-typescript-starterkit

# Install dependencies (includes all latest versions)
npm install

# Start development server
npm run dev
```

**Note**: The project comes pre-configured with:
- **Next.js 15.5.2** with App Router
- **React 19.0.0** with concurrent features
- **TypeScript 5.7.3** with strict type checking
- **Three.js 0.172.0** with complete type definitions
- **Tailwind CSS 3.4.15** for modern styling

### 🔧 **Alternative: Step-by-Step Setup**

**Script Point**: *"If you prefer to build from scratch, here's the complete setup process."*

```bash
# Create project directory
mkdir threejs-nextjs-presentation
cd threejs-nextjs-presentation

# Initialize with latest packages
npm init -y

# Install Next.js 15 and React 19
npm install next@15.5.2 react@19.0.0 react-dom@19.0.0

# Install Three.js with utilities
npm install three@0.172.0 three-stdlib@2.36.0

# Install development dependencies with exact versions
npm install -D typescript@5.7.3 @types/react@19.0.7 @types/node@22.10.6 @types/react-dom@19.0.2 @types/three@0.172.0 eslint@9.18.0 eslint-config-next@15.5.2 tailwindcss@3.4.15 postcss@8.5.2 autoprefixer@10.4.20
```

### 📁 **Step 2: Project Structure**

```
threejs-nextjs-typescript-starterkit/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                 # Home page with example gallery
│   │   ├── layout.tsx               # Root layout with global styles
│   │   ├── globals.css              # Global CSS with custom animations
│   │   ├── rotating-cube/           # Basic cube animation example
│   │   │   └── page.tsx
│   └── components/                   # Reusable Three.js components
│       ├── ExampleNavigation.tsx    # Navigation between examples
│       ├── RotatingCube.tsx         # Interactive cube with controls
├── public/                          # Static assets
├── PRESENTATION_GUIDE.md            # This comprehensive guide
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── next.config.js                   # Next.js configuration
```

### ⚙️ **Step 3: Configuration Files**

**TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "baseUrl": ".",
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Next.js Configuration** (`next.config.js`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['three'], // Important for Three.js
}

module.exports = nextConfig
```

**Script Point**: *"The transpilePackages setting is crucial for Three.js to work properly with Next.js."*

---

## 2. Basic Three.js Integration

### 🎯 **Core Three.js Concepts**

Before diving into examples, let's understand the fundamental Three.js concepts:

1. **Scene**: The 3D world container
2. **Camera**: Your viewpoint into the scene
3. **Renderer**: Draws the scene to a canvas
4. **Geometry**: The shape of objects
5. **Material**: The appearance/surface properties
6. **Mesh**: Geometry + Material = visible object

### 🧩 **The Three.js Recipe**

Every Three.js application follows this pattern:

```typescript
// 1. Create a scene
const scene = new THREE.Scene()

// 2. Create a camera
const camera = new THREE.PerspectiveCamera(
  75,           // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,          // Near clipping plane
  1000          // Far clipping plane
)

// 3. Create a renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 4. Create objects and add to scene
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 5. Position camera
camera.position.z = 5

// 6. Render loop
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()
```

### 🔗 **Next.js Integration Challenges**

**Script Point**: *"When integrating Three.js with Next.js, we face several challenges:"*

1. **SSR Compatibility**: Three.js uses browser-only APIs
2. **Canvas Management**: React lifecycle vs Three.js
3. **Performance**: Memory management and cleanup
4. **TypeScript**: Proper typing for 3D math

### 💡 **Solution: Custom Hook Pattern**

We'll create a reusable pattern for all our examples:

```typescript
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const useThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  
  useEffect(() => {
    if (!mountRef.current) return
    
    // Setup Three.js scene...
    
    return () => {
      // Cleanup
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])
  
  return mountRef
}
```

---

## 3. Example 1: Rotating Cube

### 🎯 **Learning Objectives**

- Basic Three.js setup in Next.js
- Understanding the render loop
- Handling window resize
- React lifecycle integration

### 💻 **Implementation**

**Script Point**: *"Let's start with the classic 'Hello World' of 3D graphics - a rotating cube."*

Create `src/components/RotatingCube.tsx`:

```typescript
'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function RotatingCube() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cubeRef = useRef<THREE.Mesh>()
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create cube
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: false,
    })
    const cube = new THREE.Mesh(geometry, material)
    cubeRef.current = cube
    scene.add(cube)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (cubeRef.current) {
        cubeRef.current.rotation.x += 0.01
        cubeRef.current.rotation.y += 0.01
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return <div ref={mountRef} className="w-full h-screen" />
}
```

### 📝 **Key Points to Highlight**

**Script Points**:

1. *"Notice how we use useRef to store Three.js objects - this prevents React from recreating them on each render."*

2. *"The cleanup function is crucial - without it, we'd have memory leaks when navigating between pages."*

3. *"The resize handler ensures our 3D scene looks good on all screen sizes."*

### 🎨 **Visual Enhancements**

```typescript
// Add these enhancements to make it more impressive:

// 1. Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(1, 1, 1)
scene.add(directionalLight)

// 2. Change material to respond to lighting
const material = new THREE.MeshPhongMaterial({
  color: 0x00ff88,
  shininess: 100
})

// 3. Add texture (optional)
const loader = new THREE.TextureLoader()
const texture = loader.load('/texture.jpg')
material.map = texture
```

### 💡 **Presentation Strategy**

**Progressive Revelation Approach:**
1. **Start with Fundamentals**: Show rotating cube for basic concepts
2. **Demonstrate Complexity**: Mention the advanced examples that exist

### 🎨 **Development Benefits**

- **Controlled Learning Curve**: Introduce complexity gradually
- **Presentation Control**: Show specific examples when relevant
- **Easy Enablement**: Single file change enables everything
- **Professional Polish**: Hide work-in-progress or overwhelming examples

### 📝 **Presentation Talking Points**

1. *"We've built a complete 3D development pipeline with four distinct examples"*
2. *"The rotating cube demonstrates our foundation - it's fully interactive right now"*
3. *"Behind the scenes, we have three more complex examples ready to showcase"*
4. *"This modular approach lets us introduce concepts progressively"*
5. *"With one simple code change, we can enable the full experience"*
6. *"Each example demonstrates different Three.js capabilities and techniques"*

---

## 8. Performance & Best Practices

### ⚡ **Optimization Techniques**

1. **Geometry Instancing**: For repeated objects
2. **Level of Detail (LOD)**: Different models based on distance
3. **Frustum Culling**: Only render visible objects
4. **Texture Optimization**: Proper sizing and compression

### 🛠️ **Development Tips**

```typescript
// Enable performance monitoring
const stats = new Stats()
document.body.appendChild(stats.dom)

// Frame rate monitoring in animation loop
function animate() {
  stats.begin()
  // ... rendering code
  stats.end()
}
```
---

## 🎉 Conclusion

**Script Closing**: 

> "We've journeyed from basic setup to 3D scenes, demonstrating how Three.js, Next.js, and TypeScript work together to create incredible web experiences. The combination of Three.js's powerful 3D capabilities, Next.js's production-ready framework, and TypeScript's development experience makes this stack perfect for modern 3D web applications."

### 🔗 **Next Steps**

- Explore WebXR for VR/AR experiences
- Learn about custom shaders for unique effects
- Investigate physics engines like Cannon.js
- Consider server-side rendering strategies for 3D content

### 📚 **Resources**

- [Three.js Documentation](https://threejs.org/docs/)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

---

*This guide serves as both a presentation script and comprehensive blog post for learning Three.js with Next.js and TypeScript. Each section can be expanded with live coding demonstrations and interactive examples.*
