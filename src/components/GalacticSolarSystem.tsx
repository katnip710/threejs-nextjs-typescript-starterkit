"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

type Planet = {
  mesh: THREE.Mesh;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  angle: number;
  moons?: Array<{
    mesh: THREE.Mesh;
    orbitRadius: number;
    orbitSpeed: number;
    angle: number;
  }>;
};

export default function GalacticSolarSystem() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<Planet[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Aggressively clear any existing content first
    while (mountRef.current.firstChild)
      mountRef.current.removeChild(mountRef.current.firstChild);

    // Prevent duplicate initialization using renderer reference
    if (rendererRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - positioned to see both galaxy and solar system
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.set(0, 50, 150);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 20;
    controls.maxDistance = 800;
    controls.maxPolarAngle = Math.PI;
    controlsRef.current = controls;

    // ========== PARTICLE GALAXY BACKGROUND ==========
    const particleCount = 20000;
    const galaxyRadius = 200;
    const galaxyArms = 4;
    const randomness = 0.3;
    const randomnessPower = 3;
    const insideColor = new THREE.Color(0xff6030);
    const outsideColor = new THREE.Color(0x1b3984);

    // Create particle system
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Position calculation for spiral galaxy
      const radius = Math.random() * galaxyRadius;
      const spinAngle = radius * 0.2;
      const branchAngle = ((i % galaxyArms) / galaxyArms) * Math.PI * 2;

      // Random offset for spiral arms
      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY * 0.1; // Flatten the galaxy more
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color calculation
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / galaxyRadius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Random scale for size variation
      scales[i] = Math.random() * 0.5 + 0.5;

      // Random values for movement animation
      randoms[i3] = (Math.random() - 0.5) * 2;
      randoms[i3 + 1] = (Math.random() - 0.5) * 2;
      randoms[i3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));

    // Custom shader material for galaxy particles
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        
        attribute float aScale;
        attribute vec3 aRandom;
        
        varying vec3 vColor;
        
        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          // Add subtle movement
          modelPosition.x += sin(uTime + aRandom.x * 100.0) * aRandom.x * 0.01;
          modelPosition.y += cos(uTime + aRandom.y * 100.0) * aRandom.y * 0.01;
          modelPosition.z += sin(uTime + aRandom.z * 100.0) * aRandom.z * 0.01;
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
          
          gl_Position = projectedPosition;
          gl_PointSize = uSize * aScale;
          gl_PointSize *= (1.0 / -viewPosition.z);
          
          vColor = color;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Add subtle twinkling
          alpha *= sin(uTime * 2.0 + gl_PointCoord.x * 50.0) * 0.1 + 0.9;
          
          gl_FragColor = vec4(vColor, alpha * 0.7);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 25 * renderer.getPixelRatio() },
      },
      vertexColors: true,
      transparent: true,
      alphaTest: 0.001,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create particle system
    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
    particleSystemRef.current = particles;

    // ========== SOLAR SYSTEM ==========

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    // Central sun
    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 1.2,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Point light from sun
    const sunLight = new THREE.PointLight(0xffffff, 3, 400);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Planet data
    const planetData = [
      {
        name: "Mercury",
        size: 0.7,
        color: 0x8c7853,
        orbitRadius: 12,
        orbitSpeed: 0.025,
        rotationSpeed: 0.015,
      },
      {
        name: "Venus",
        size: 1.0,
        color: 0xffc649,
        orbitRadius: 18,
        orbitSpeed: 0.02,
        rotationSpeed: 0.01,
      },
      {
        name: "Earth",
        size: 1.2,
        color: 0x6b93d6,
        orbitRadius: 25,
        orbitSpeed: 0.015,
        rotationSpeed: 0.012,
        hasMoon: true,
      },
      {
        name: "Mars",
        size: 0.9,
        color: 0xc1440e,
        orbitRadius: 32,
        orbitSpeed: 0.012,
        rotationSpeed: 0.015,
      },
      {
        name: "Jupiter",
        size: 3.5,
        color: 0xd8ca9d,
        orbitRadius: 50,
        orbitSpeed: 0.008,
        rotationSpeed: 0.025,
        hasMoon: true,
      },
      {
        name: "Saturn",
        size: 3.0,
        color: 0xfab95b,
        orbitRadius: 65,
        orbitSpeed: 0.006,
        rotationSpeed: 0.022,
        hasRings: true,
      },
    ];

    // Create planets
    const planets: Planet[] = [];
    planetData.forEach((data, index) => {
      // Planet geometry and material
      const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.8,
        metalness: 0.1,
      });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;

      // Initial position
      planetMesh.position.set(data.orbitRadius, 0, 0);
      scene.add(planetMesh);

      // Create subtle orbit visualization
      const orbitGeometry = new THREE.RingGeometry(
        data.orbitRadius - 0.1,
        data.orbitRadius + 0.1,
        64
      );
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      });
      const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitRing.rotation.x = -Math.PI / 2;
      scene.add(orbitRing);

      const planet: Planet = {
        mesh: planetMesh,
        orbitRadius: data.orbitRadius,
        orbitSpeed: data.orbitSpeed,
        rotationSpeed: data.rotationSpeed,
        angle: (index * Math.PI * 2) / planetData.length,
      };

      // Add rings to Saturn
      if (data.hasRings) {
        const ringGeometry = new THREE.RingGeometry(
          data.size + 0.8,
          data.size + 2.0,
          32
        );
        const ringMaterial = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
          roughness: 0.6,
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2;
        planetMesh.add(rings);
      }

      // Add moons
      if (data.hasMoon) {
        planet.moons = [];
        const moonCount = data.name === "Jupiter" ? 4 : 1;

        for (let i = 0; i < moonCount; i++) {
          const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
          const moonMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.9,
          });
          const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
          moonMesh.castShadow = true;
          moonMesh.receiveShadow = true;

          const moonOrbitRadius = data.size + 2.0 + i * 1.2;
          moonMesh.position.set(moonOrbitRadius, 0, 0);
          planetMesh.add(moonMesh);

          planet.moons.push({
            mesh: moonMesh,
            orbitRadius: moonOrbitRadius,
            orbitSpeed: 0.08 + i * 0.03,
            angle: (i * Math.PI * 2) / moonCount,
          });
        }
      }

      planets.push(planet);
    });

    planetsRef.current = planets;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      timeRef.current += 0.01;

      // Rotate the galaxy slowly
      if (particleSystemRef.current)
        particleSystemRef.current.rotation.y = timeRef.current * 0.02;

      // Update galaxy shader uniforms
      if (particleMaterial.uniforms)
        particleMaterial.uniforms.uTime.value = timeRef.current;

      // Rotate sun
      sun.rotation.y += 0.005;

      // Update planets
      planets.forEach((planet) => {
        // Update orbital position
        planet.angle += planet.orbitSpeed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.orbitRadius;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.orbitRadius;

        // Rotate planet
        planet.mesh.rotation.y += planet.rotationSpeed;

        // Update moons
        if (planet.moons) {
          planet.moons.forEach((moon) => {
            moon.angle += moon.orbitSpeed;
            moon.mesh.position.x = Math.cos(moon.angle) * moon.orbitRadius;
            moon.mesh.position.z = Math.sin(moon.angle) * moon.orbitRadius;
          });
        }
      });

      // Update controls
      controls.update();

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;

      const width = mountRef.current.clientWidth || window.innerWidth;
      const height = mountRef.current.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Update particle size based on pixel ratio
      if (particleMaterial.uniforms)
        particleMaterial.uniforms.uSize.value = 25 * renderer.getPixelRatio();
    };

    window.addEventListener("resize", handleResize);

    // Initial resize to ensure proper dimensions
    setTimeout(() => handleResize(), 10);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);

      if (controlsRef.current) controlsRef.current.dispose();

      // Clean up DOM elements
      if (mountRef.current) {
        // Remove the specific renderer's canvas
        if (
          renderer.domElement &&
          mountRef.current.contains(renderer.domElement)
        )
          mountRef.current.removeChild(renderer.domElement);

        // Safety: remove any remaining canvas elements
        const remainingCanvases = mountRef.current.querySelectorAll("canvas");
        remainingCanvases.forEach((canvas) => {
          if (canvas.parentNode === mountRef.current && mountRef.current)
            mountRef.current.removeChild(canvas);
        });
      }

      // Dispose of resources
      renderer.dispose();

      // Clear renderer ref to allow re-initialization
      rendererRef.current = null;

      // Dispose galaxy resources
      geometry.dispose();
      particleMaterial.dispose();

      // Dispose solar system resources
      planets.forEach((planet) => {
        planet.mesh.geometry.dispose();
        (planet.mesh.material as THREE.Material).dispose();
        if (planet.moons)
          planet.moons.forEach((moon) => {
            moon.mesh.geometry.dispose();
            (moon.mesh.material as THREE.Material).dispose();
          });
      });
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Three.js canvas container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Overlay with information */}
      <div className="absolute top-24 left-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-2">Galactic Solar System</h2>
        <p className="text-sm mb-2">
          A complete solar system existing within a stunning spiral galaxy with
          20,000 animated particles and realistic planetary mechanics.
        </p>
        <ul>
          <li>6 planets with accurate orbital mechanics</li>
          <li>Earth and Jupiter have realistic moon systems</li>
          <li>Saturn with beautiful ring system</li>
          <li>20,000 particle galaxy with custom shaders</li>
          <li>Spiral galaxy formation with 4 arms</li>
          <li>Interactive camera with 360° exploration</li>
          <li>Real-time lighting and shadow casting</li>
        </ul>

        <div className="mt-4 bg-blue-600/20 p-2 rounded">
          <p className="text-sm font-bold pb-1">Controls:</p>
          <ul>
            <li>Left click + drag: Orbit around the scene</li>
            <li>Right click + drag: Pan camera</li>
            <li>Scroll wheel: Zoom in/out (20-800 units)</li>
            <li>Auto-rotation: Galaxy rotates, planets orbit</li>
          </ul>
        </div>
      </div>

      {/* Technical Features */}
      <div className="absolute bottom-0 right-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">Technical Features</h3>
        <ul>
          <li>20k Particles: GPU-accelerated rendering</li>
          <li>Custom Shaders: GLSL vertex/fragment shaders</li>
          <li>PBR Materials: Physically based rendering</li>
          <li>Shadow Mapping: Real-time shadows</li>
          <li>Smooth 60 FPS: Optimized animation loops</li>
        </ul>
      </div>
    </div>
  );
}
