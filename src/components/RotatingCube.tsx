"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

export default function RotatingCube() {
  // State for interactive controls
  const [cubeColor, setCubeColor] = useState("#00ff88");
  const [cubeSize, setCubeSize] = useState(1.5);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [cubeTexture, setCubeTexture] = useState("solid");

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  // Mouse interaction state using refs to avoid closure issues
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // ==================== COLOR PALETTE ====================
  // Predefined color swatches for easy cube customization
  // These provide a curated selection of vibrant colors for the presentation
  const colorPalette = [
    "#00ff88", // Mint green (default)
    "#ff0088", // Hot pink
    "#0088ff", // Sky blue
    "#ff8800", // Orange
    "#8800ff", // Purple
    "#88ff00", // Lime green
    "#ff0000", // Red
    "#bc8f8f", // Rosy brown
    "#0000ff", // Blue
    "#ffff00", // Yellow
    "#ff00ff", // Magenta
    "#00ffff", // Cyan
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Clear any existing content first
    while (mountRef.current.firstChild)
      mountRef.current.removeChild(mountRef.current.firstChild);

    // Prevent duplicate initialization using renderer reference
    if (rendererRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

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

    // ==================== CAMERA CONTROLS SETUP ====================
    // OrbitControls allow users to rotate, zoom, and pan the camera
    // However, we disable them because we want direct cube rotation instead
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Disable all camera movement - only cube should rotate
    controlsRef.current = controls; // Store reference for cleanup

    // Enhanced lighting setup for brighter scene
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Increased intensity
    scene.add(ambientLight);

    // Main directional light (brighter)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Top light for additional brightness
    const topLight = new THREE.PointLight(0xffffff, 1.2, 50);
    topLight.position.set(0, 15, 0); // Positioned at the top
    topLight.castShadow = true;
    scene.add(topLight);

    // Additional fill light from the front
    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 5, 10);
    scene.add(frontLight);

    // ==================== CUBE GEOMETRY AND MATERIAL ====================
    // Geometry defines the shape - BoxGeometry creates a cube with width, height, depth
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Material defines how the surface looks under light
    // Different materials respond to light in different ways
    let material: THREE.Material;

    if (cubeTexture === "wireframe") {
      // Wireframe shows only the edges of the geometry - great for understanding 3D structure
      material = new THREE.MeshPhongMaterial({
        color: cubeColor,
        wireframe: true, // Show only edges, not faces
      });
    } else if (cubeTexture === "metallic") {
      // PBR (Physically Based Rendering) material for realistic metal surfaces
      material = new THREE.MeshStandardMaterial({
        color: cubeColor,
        metalness: 0.8, // High metalness = reflective like metal
        roughness: 0.2, // Low roughness = smooth, shiny surface
      });
    } else if (cubeTexture === "glass") {
      // Advanced physical material with light transmission (see-through)
      material = new THREE.MeshPhysicalMaterial({
        color: cubeColor,
        metalness: 0, // Glass is not metallic
        roughness: 0, // Perfectly smooth
        transmission: 0.9, // Light passes through (transparency)
        transparent: true, // Enable transparency
        opacity: 0.8, // Slight opacity for visibility
      });
    } else {
      // Default Phong material - good balance of performance and visual quality
      material = new THREE.MeshPhongMaterial({
        color: cubeColor,
        shininess: 100, // How shiny the surface appears
        specular: 0x111111, // Color of the shiny highlights
        wireframe: false,
      });
    }

    // ==================== MESH CREATION ====================
    // Mesh combines geometry (shape) and material (appearance) into a renderable object
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true; // This object casts shadows on other objects
    cube.receiveShadow = true; // This object receives shadows from other objects
    cubeRef.current = cube; // Store reference for animation and interaction
    scene.add(cube); // Add the cube to the scene

    // Add a ground plane for shadows
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.5,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 4; // Keep plane flat/horizontal
    plane.position.y = -6;
    plane.receiveShadow = true;
    scene.add(plane);

    // ==================== ANIMATION LOOP ====================
    // The animation loop runs at ~60fps and updates the scene every frame
    // This is the heart of any Three.js application
    const animate = () => {
      // Schedule the next frame - creates smooth 60fps animation
      animationIdRef.current = requestAnimationFrame(animate);

      if (cubeRef.current) {
        // ==================== AUTO-ROTATION LOGIC ====================
        // Only apply automatic rotation when:
        // 1. Auto-rotate is enabled, AND
        // 2. User is not currently dragging the cube
        if (autoRotate && !isDraggingRef.current) {
          // Rotate around X and Y axes for interesting movement
          cubeRef.current.rotation.x += 0.01 * rotationSpeed; // X-axis rotation
          cubeRef.current.rotation.y += 0.01 * rotationSpeed; // Y-axis rotation
        }

        // Note: When user is dragging, mouse events directly modify cube.rotation
        // The animation loop respects this and doesn't override the user's input

        // ==================== FLOATING ANIMATION ====================
        // Add subtle floating motion only during auto-rotate mode
        if (autoRotate) {
          // Use sine wave for smooth up-and-down motion
          // Date.now() * 0.001 creates a slow time-based animation
          // Math.sin() creates smooth oscillation between -1 and 1
          // * 0.5 reduces the amplitude to a subtle float
          cubeRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        } else {
          // In manual mode, keep cube grounded for precise control
          cubeRef.current.position.y = 0;
        }
      }

      // ==================== CONTROLS UPDATE ====================
      // Even though camera controls are disabled, we still update them
      // This maintains the control system in case we enable them later
      if (controlsRef.current) controlsRef.current.update();

      // ==================== RENDER THE FRAME ====================
      // This is where the magic happens - render the scene to the canvas
      // Without this call, nothing would appear on screen
      renderer.render(scene, camera);
    };

    // Start the animation loop
    animate();

    // ==================== MOUSE EVENT HANDLERS ====================
    // These functions enable direct cube rotation with mouse interaction
    // We use custom mouse handling instead of OrbitControls for educational purposes

    // Handle mouse button press - start rotation
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault(); // Prevent browser default behavior (text selection, etc.)
      isDraggingRef.current = true; // Flag that we're now dragging
      // Store the starting mouse position for delta calculations
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    // Handle mouse movement - rotate the cube
    const handleMouseMove = (event: MouseEvent) => {
      // Only process if we're dragging and the cube exists
      if (!isDraggingRef.current || !cubeRef.current) return;

      // Calculate how far the mouse moved since last frame
      const deltaMove = {
        x: event.clientX - previousMousePositionRef.current.x, // Horizontal movement
        y: event.clientY - previousMousePositionRef.current.y, // Vertical movement
      };

      // ==================== MOUSE TO ROTATION CONVERSION ====================
      // Convert pixel movement to rotation angles
      const rotationSpeed = 0.01; // Sensitivity multiplier (lower = less sensitive)

      // Horizontal mouse movement rotates around Y-axis (left/right rotation)
      cubeRef.current.rotation.y += deltaMove.x * rotationSpeed;

      // Vertical mouse movement rotates around X-axis (up/down rotation)
      cubeRef.current.rotation.x += deltaMove.y * rotationSpeed;

      // Update mouse position for next frame's delta calculation
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    // Handle mouse button release - stop rotation
    const handleMouseUp = () => {
      isDraggingRef.current = false; // Flag that we're no longer dragging
    };

    // ==================== EVENT LISTENER SETUP ====================
    // Attach mouse event listeners to enable cube interaction
    renderer.domElement.addEventListener("mousedown", handleMouseDown); // Mouse press on canvas
    document.addEventListener("mousemove", handleMouseMove); // Mouse move anywhere on page
    document.addEventListener("mouseup", handleMouseUp); // Mouse release anywhere on page

    // Note: We use document for move/up events so dragging works even if mouse
    // leaves the canvas area (better user experience)

    // ==================== RESPONSIVE DESIGN ====================
    // Handle window resize to maintain proper aspect ratio and canvas size
    const handleResize = () => {
      if (!mountRef.current) return;

      // Get current container dimensions
      const width = mountRef.current.clientWidth || window.innerWidth;
      const height = mountRef.current.clientHeight || window.innerHeight;

      // Update camera aspect ratio to match new dimensions
      camera.aspect = width / height;
      camera.updateProjectionMatrix(); // Apply the aspect ratio change

      // Resize the renderer to match new container size
      renderer.setSize(width, height);
    };

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Force initial resize to ensure proper dimensions on first load
    // Small delay ensures the DOM is fully rendered
    setTimeout(() => handleResize(), 10);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      if (controlsRef.current) controlsRef.current.dispose();

      // Remove mouse event listeners
      if (renderer?.domElement) {
        renderer.domElement.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }

      // Clean up DOM elements - remove all canvases
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
      if (renderer) renderer.dispose();

      // Clear renderer ref to allow re-initialization
      rendererRef.current = null;
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (planeMaterial) planeMaterial.dispose();
      if (planeGeometry) planeGeometry.dispose();
    };
  }, [cubeColor, cubeSize, autoRotate, rotationSpeed, cubeTexture]);

  // Update cube properties when controls change
  useEffect(() => {
    if (cubeRef.current) {
      // Update color
      (cubeRef.current.material as any).color.setStyle(cubeColor);

      // Update size by scaling
      const scale = cubeSize / 1.5; // Original size was 1.5
      cubeRef.current.scale.set(scale, scale, scale);
    }
  }, [cubeColor, cubeSize]);

  return (
    <div className="relative w-full h-full">
      {/* Three.js canvas container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Overlay with information */}
      <div className="absolute top-24 left-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-2">Rotating Cube</h2>
        <p className="text-sm mb-2">
          This demonstrates the basic Three.js setup with Next.js and
          TypeScript.
        </p>
        <ul>
          <li>Scene, Camera, Renderer setup</li>
          <li>Interactive OrbitControls (drag to rotate)</li>
          <li>Lighting (Ambient + Directional)</li>
          <li>Materials with Phong shading</li>
          <li>Shadow mapping</li>
          <li>Animation loop with floating motion</li>
          <li>Responsive design</li>
        </ul>

        <div className="mt-4 bg-blue-600/20 p-2 rounded">
          <p className="text-sm font-bold pb-1">Controls:</p>
          <ul>
            <li>Click and drag to rotate the cube directly</li>
            <li>Use control panel to customize appearance</li>
            <li>Toggle auto-rotation or manual control</li>
            <li>Change colors, size, and materials</li>
          </ul>
        </div>
      </div>

      {/* Interactive Control Panel */}
      <div className="absolute top-24 right-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-3">Cube Controls</h3>

        <div className="space-y-4">
          {/* Color Palette */}
          <div>
            <label className="text-sm font-medium block mb-2">Color:</label>
            <div className="grid grid-cols-4 gap-2">
              {colorPalette.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setCubeColor(color)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    cubeColor === color
                      ? "border-white shadow-lg ring-2 ring-white/50"
                      : "border-gray-400 hover:border-white"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Control */}
          <label className="text-sm font-medium block mb-1">
            Size: {cubeSize.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.1"
            value={cubeSize}
            onChange={(e) => setCubeSize(parseFloat(e.target.value))}
            className="w-full"
          />

          {/* Texture/Material Control */}
          <label className="text-sm font-medium block mb-1">
            Material Type:
          </label>
          <select
            value={cubeTexture}
            onChange={(e) => setCubeTexture(e.target.value)}
            className="w-full mt-1 bg-gray-700 text-white rounded px-2 py-1 text-sm"
          >
            <option value="solid">Solid</option>
            <option value="wireframe">Wireframe</option>
            <option value="metallic">Metallic</option>
            <option value="glass">Glass</option>
          </select>

          {/* Auto Rotation Toggle */}
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
              className="rounded"
            />
            <span>Auto Rotation</span>
          </label>

          {/* Rotation Speed (when auto rotation is on) */}
          {autoRotate && (
            <>
              <label className="text-sm font-medium block mb-1">
                Speed: {rotationSpeed.toFixed(1)}x
              </label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-0 left-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">Try It Out</h3>
        <p className="text-sm">
          Click and drag directly on the cube to rotate it! Use the control
          panel to customize colors, size, and materials. The camera stays fixed
          while only the cube rotates with your mouse movements.
        </p>
      </div>
    </div>
  );
}
