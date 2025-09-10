"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

export default function ImmersiveScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [cameraMode, setCameraMode] = useState("orbital");
  const [timeOfDay, setTimeOfDay] = useState("night");
  const [effectsEnabled, setEffectsEnabled] = useState(true);
  const flyingObjectsRef = useRef<THREE.Group[]>([]);
  const particleSystemsRef = useRef<THREE.Points[]>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Aggressively clear any existing content first
    while (mountRef.current.firstChild)
      mountRef.current.removeChild(mountRef.current.firstChild);

    // Prevent duplicate initialization using renderer reference
    if (rendererRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 50);

    // Renderer setup with advanced features
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2.2;
    controlsRef.current = controls;

    // Advanced lighting system
    const setupLighting = (timeOfDay: string) => {
      // Clear existing lights
      scene.children
        .filter((child) => child instanceof THREE.Light)
        .forEach((light) => scene.remove(light));

      if (timeOfDay === "day") {
        // Day lighting
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(50, 100, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);

        const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.6);
        scene.add(ambientLight);

        scene.fog = new THREE.Fog(0x87ceeb, 100, 300);
      } else {
        // Night lighting
        const moonLight = new THREE.DirectionalLight(0x6666ff, 0.3);
        moonLight.position.set(-50, 80, -50);
        moonLight.castShadow = true;
        scene.add(moonLight);

        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.4);
        scene.add(ambientLight);

        scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);
      }
    };

    setupLighting(timeOfDay);

    // Create futuristic city
    const createBuilding = (
      width: number,
      height: number,
      depth: number,
      x: number,
      z: number
    ) => {
      const building = new THREE.Group();

      // Main structure
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.5, 0.7, 0.3),
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 0.3,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, height / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      building.add(mesh);

      // Add glowing windows
      const windowsGeometry = new THREE.PlaneGeometry(
        width * 0.8,
        height * 0.9
      );
      const windowsMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x004444,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
      });

      // Add windows to multiple faces
      for (let i = 0; i < 4; i++) {
        const windows = new THREE.Mesh(windowsGeometry, windowsMaterial);
        windows.position.set(x, height / 2, z);
        windows.rotation.y = (i * Math.PI) / 2;

        if (i % 2 === 0) {
          windows.position.z += i === 0 ? depth / 2 + 0.01 : -depth / 2 - 0.01;
        } else {
          windows.position.x += i === 1 ? width / 2 + 0.01 : -width / 2 - 0.01;
        }

        building.add(windows);
      }

      // Add antenna/spire on top
      const antennaGeometry = new THREE.CylinderGeometry(
        0.1,
        0.2,
        height * 0.3
      );
      const antennaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0000,
      });
      // Set emissive separately to avoid TypeScript issues
      antennaMaterial.emissive.setHex(0x440000);
      antennaMaterial.emissiveIntensity = 1.0;
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(x, height + height * 0.15, z);
      building.add(antenna);

      return building;
    };

    // Generate city grid
    for (let x = -60; x <= 60; x += 20) {
      for (let z = -60; z <= 60; z += 20) {
        if (Math.abs(x) < 10 && Math.abs(z) < 10) continue; // Leave center area clear

        const width = 4 + Math.random() * 6;
        const height = 10 + Math.random() * 40;
        const depth = 4 + Math.random() * 6;

        const building = createBuilding(width, height, depth, x, z);
        scene.add(building);
      }
    }

    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111111,
      metalness: 0.8,
      roughness: 0.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create flying objects
    const createFlyingVehicle = () => {
      const vehicle = new THREE.Group();

      // Main body
      const bodyGeometry = new THREE.SphereGeometry(1, 8, 6);
      const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ff88,
        metalness: 1.0,
        roughness: 0.1,
      });
      // Set emissive separately to avoid TypeScript issues
      bodyMaterial.emissive.setHex(0x002200);
      bodyMaterial.emissiveIntensity = 0.3;
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      vehicle.add(body);

      // Add lights
      const lightGeometry = new THREE.SphereGeometry(0.1);
      const lightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0,
      });

      for (let i = 0; i < 4; i++) {
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        const angle = (i / 4) * Math.PI * 2;
        light.position.set(Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2);
        vehicle.add(light);
      }

      // Random starting position and path
      vehicle.position.set(
        (Math.random() - 0.5) * 100,
        20 + Math.random() * 30,
        (Math.random() - 0.5) * 100
      );

      // Add movement properties
      (vehicle as any).speed = 0.1 + Math.random() * 0.3;
      (vehicle as any).direction = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 2
      ).normalize();

      return vehicle;
    };

    // Add flying vehicles
    for (let i = 0; i < 8; i++) {
      const vehicle = createFlyingVehicle();
      scene.add(vehicle);
      flyingObjectsRef.current.push(vehicle);
    }

    // Create particle systems
    const createParticleSystem = (type: "rain" | "sparks" | "fog") => {
      const count = type === "rain" ? 1000 : type === "sparks" ? 500 : 300;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Positions
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = Math.random() * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;

        // Velocities
        if (type === "rain") {
          velocities[i3] = (Math.random() - 0.5) * 0.1;
          velocities[i3 + 1] = -2 - Math.random() * 3;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
        } else if (type === "sparks") {
          velocities[i3] = (Math.random() - 0.5) * 2;
          velocities[i3 + 1] = Math.random() * 2;
          velocities[i3 + 2] = (Math.random() - 0.5) * 2;
        } else {
          velocities[i3] = (Math.random() - 0.5) * 0.5;
          velocities[i3 + 1] = Math.random() * 0.2;
          velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
        }

        // Colors
        if (type === "rain") {
          colors[i3] = 0.7;
          colors[i3 + 1] = 0.8;
          colors[i3 + 2] = 1.0;
        } else if (type === "sparks") {
          colors[i3] = 1.0;
          colors[i3 + 1] = 0.6;
          colors[i3 + 2] = 0.0;
        } else {
          colors[i3] = 0.8;
          colors[i3 + 1] = 0.8;
          colors[i3 + 2] = 0.9;
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: type === "rain" ? 0.1 : type === "sparks" ? 0.3 : 0.2,
        transparent: true,
        opacity: type === "fog" ? 0.3 : 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(geometry, material);
      (particles as any).type = type;
      return particles;
    };

    if (effectsEnabled) {
      const rainSystem = createParticleSystem("rain");
      const sparksSystem = createParticleSystem("sparks");
      const fogSystem = createParticleSystem("fog");

      scene.add(rainSystem);
      scene.add(sparksSystem);
      scene.add(fogSystem);

      particleSystemsRef.current = [rainSystem, sparksSystem, fogSystem];
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Update flying objects
      flyingObjectsRef.current.forEach((vehicle) => {
        vehicle.position.add(
          (vehicle as any).direction
            .clone()
            .multiplyScalar((vehicle as any).speed)
        );

        // Rotate vehicle
        vehicle.rotation.y += 0.02;

        // Boundary check and redirect
        if (vehicle.position.length() > 80) (vehicle as any).direction.negate();
      });

      // Update particle systems
      particleSystemsRef.current.forEach((system) => {
        const positions = system.geometry.attributes.position
          .array as Float32Array;
        const velocities = (system.geometry.attributes as any).velocity
          .array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Reset particles that fall too low or go too far
          if (
            positions[i + 1] < 0 ||
            Math.abs(positions[i]) > 100 ||
            Math.abs(positions[i + 2]) > 100
          ) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = 50 + Math.random() * 50;
            positions[i + 2] = (Math.random() - 0.5) * 200;
          }
        }

        system.geometry.attributes.position.needsUpdate = true;
      });

      // Update lighting for time of day
      if (timeOfDay !== (timeOfDay === "day" ? "day" : "night"))
        setupLighting(timeOfDay);

      // Update camera based on mode
      if (cameraMode === "cinematic") {
        camera.position.x = Math.cos(time * 0.1) * 50;
        camera.position.z = Math.sin(time * 0.1) * 50;
        camera.position.y = 20 + Math.sin(time * 0.05) * 10;
        camera.lookAt(0, 10, 0);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (controlsRef.current) controlsRef.current.dispose();
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
      renderer.dispose();

      // Clear renderer ref to allow re-initialization
      rendererRef.current = null;
    };
  }, [cameraMode, timeOfDay, effectsEnabled]);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />

      {/* Overlay with information */}
      <div className="absolute top-24 left-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-2">Immersive Cyberpunk City</h2>
        <p className="text-sm mb-2">
          A complete futuristic environment showcasing advanced Three.js
          techniques and real-time effects.
        </p>
        <ul>
          <li>50+ Procedural buildings with PBR materials</li>
          <li>Flying vehicles with autonomous movement</li>
          <li>Dynamic particle systems (rain, sparks, fog)</li>
          <li>Advanced lighting with day/night cycle</li>
          <li>Multiple camera modes</li>
          <li>Real-time shadows and reflections</li>
        </ul>

        <div className="mt-4 bg-blue-600/20 p-2 rounded">
          <p className="text-sm font-bold pb-1">Controls:</p>
          <ul>
            <li>Drag to orbit camera around city</li>
            <li>Scroll to zoom in/out</li>
            <li>Use control panel for advanced options</li>
            <li>Switch between orbital and cinematic modes</li>
          </ul>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-24 right-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">Scene Controls</h3>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Camera Mode:</label>
            <select
              value={cameraMode}
              onChange={(e) => setCameraMode(e.target.value)}
              className="w-full mt-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="orbital">Orbital Controls</option>
              <option value="cinematic">Cinematic Flight</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Time of Day:</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full mt-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="night">Night</option>
              <option value="day">Day</option>
            </select>
          </div>

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={effectsEnabled}
              onChange={(e) => setEffectsEnabled(e.target.checked)}
              className="rounded"
            />
            <span>Particle Effects</span>
          </label>
        </div>
      </div>

      {/* Technical Features */}
      <div className="absolute bottom-0 right-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">Technical Features</h3>
        <ul>
          <li>Procedural city generation</li>
          <li>Autonomous object AI</li>
          <li>Multi-layered particle systems</li>
          <li>Dynamic time-of-day lighting</li>
          <li>Multiple camera modes</li>
          <li>Performance optimization</li>
          <li>Real-time shadow mapping</li>
          <li>Atmospheric fog effects</li>
        </ul>
      </div>
    </div>
  );
}
