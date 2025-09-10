"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

export default function ThreeDText() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Aggressively clear any existing content first
    while (mountRef.current.firstChild)
      mountRef.current.removeChild(mountRef.current.firstChild);

    // Prevent duplicate initialization using renderer reference
    if (rendererRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Store renderer reference
    rendererRef.current = renderer;

    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00ff88, 0.8, 100);
    pointLight1.position.set(-10, 5, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff0088, 0.8, 100);
    pointLight2.position.set(10, -5, -10);
    scene.add(pointLight2);

    // Create text using geometric shapes (letters as extruded geometry)
    const createTextMesh = (
      text: string,
      position: THREE.Vector3,
      color: number,
      size: number = 2
    ) => {
      const textGroup = new THREE.Group();

      const textMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.6,
        roughness: 0.3,
        emissive: color,
        emissiveIntensity: 0.1,
      });

      // Create letter-like shapes for each character
      const letterWidth = size * 0.6;
      const letterHeight = size;
      const letterDepth = size * 0.3;

      const letters = text.split("");
      letters.forEach((letter, index) => {
        let letterGeometry;

        // Create different shapes for different letters to simulate text
        switch (letter.toUpperCase()) {
          case "T":
            // T shape using two boxes
            const tTop = new THREE.BoxGeometry(
              letterWidth,
              letterHeight * 0.2,
              letterDepth
            );
            const tBottom = new THREE.BoxGeometry(
              letterWidth * 0.2,
              letterHeight * 0.8,
              letterDepth
            );
            const tGeometry = new THREE.BufferGeometry();

            const tTopMesh = new THREE.Mesh(tTop);
            tTopMesh.position.y = letterHeight * 0.4;
            tTopMesh.updateMatrix();

            const tBottomMesh = new THREE.Mesh(tBottom);
            tBottomMesh.position.y = -letterHeight * 0.2;
            tBottomMesh.updateMatrix();

            letterGeometry = tTop; // Fallback to simple box
            break;
          case "H":
            letterGeometry = new THREE.BoxGeometry(
              letterWidth,
              letterHeight,
              letterDepth
            );
            break;
          case "R":
            letterGeometry = new THREE.BoxGeometry(
              letterWidth * 0.8,
              letterHeight,
              letterDepth
            );
            break;
          case "E":
            letterGeometry = new THREE.BoxGeometry(
              letterWidth * 0.9,
              letterHeight,
              letterDepth
            );
            break;
          case "J":
            letterGeometry = new THREE.CylinderGeometry(
              letterWidth * 0.2,
              letterWidth * 0.2,
              letterHeight,
              8
            );
            break;
          case "S":
            letterGeometry = new THREE.TorusGeometry(
              letterWidth * 0.3,
              letterWidth * 0.1,
              8,
              16,
              Math.PI
            );
            break;
          case "N":
            letterGeometry = new THREE.BoxGeometry(
              letterWidth * 0.9,
              letterHeight,
              letterDepth
            );
            break;
          case "X":
            letterGeometry = new THREE.ConeGeometry(
              letterWidth * 0.4,
              letterHeight,
              4
            );
            break;
          case "Y":
            letterGeometry = new THREE.ConeGeometry(
              letterWidth * 0.3,
              letterHeight,
              3
            );
            break;
          case "P":
            letterGeometry = new THREE.CylinderGeometry(
              letterWidth * 0.3,
              letterWidth * 0.4,
              letterHeight,
              6
            );
            break;
          case "I":
            letterGeometry = new THREE.BoxGeometry(
              letterWidth * 0.3,
              letterHeight,
              letterDepth
            );
            break;
          case "C":
            letterGeometry = new THREE.TorusGeometry(
              letterWidth * 0.3,
              letterWidth * 0.1,
              8,
              16,
              Math.PI * 1.5
            );
            break;
          case "O":
            letterGeometry = new THREE.TorusGeometry(
              letterWidth * 0.3,
              letterWidth * 0.1,
              8,
              16
            );
            break;
          case ".":
            letterGeometry = new THREE.SphereGeometry(letterWidth * 0.1, 8, 6);
            break;
          default:
            letterGeometry = new THREE.BoxGeometry(
              letterWidth,
              letterHeight,
              letterDepth
            );
        }

        const letterMesh = new THREE.Mesh(letterGeometry, textMaterial);

        // Position letters side by side
        letterMesh.position.x =
          (index - letters.length / 2) * letterWidth * 1.2;
        letterMesh.castShadow = true;
        letterMesh.receiveShadow = true;

        textGroup.add(letterMesh);
      });

      textGroup.position.copy(position);
      return textGroup;
    };

    // Create multiple text elements with the tech stack
    const text1 = createTextMesh(
      "THREE.JS",
      new THREE.Vector3(0, 3, 0),
      0x00ff88,
      1.2
    );
    const text2 = createTextMesh(
      "NEXT.JS",
      new THREE.Vector3(0, 0, 0),
      0xff0088,
      1.2
    );
    const text3 = createTextMesh(
      "TYPESCRIPT",
      new THREE.Vector3(0, -3, 0),
      0x0088ff,
      1.0
    );

    scene.add(text1);
    scene.add(text2);
    scene.add(text3);

    // Add floating geometric shapes for visual interest
    const shapes: THREE.Mesh[] = [];
    for (let i = 0; i < 30; i++) {
      const geometries = [
        new THREE.SphereGeometry(0.1, 8, 6),
        new THREE.BoxGeometry(0.2, 0.2, 0.2),
        new THREE.ConeGeometry(0.1, 0.3, 8),
        new THREE.OctahedronGeometry(0.15),
        new THREE.TetrahedronGeometry(0.15),
      ];

      const geometry =
        geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        metalness: 0.7,
        roughness: 0.3,
        emissive: new THREE.Color().setHSL(Math.random(), 0.5, 0.1),
        emissiveIntensity: 0.2,
      });

      const shape = new THREE.Mesh(geometry, material);
      shape.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 25
      );

      shape.castShadow = true;
      shapes.push(shape);
      scene.add(shape);
    }

    // Camera position
    camera.position.set(0, 2, 15);
    camera.lookAt(0, 0, 0);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.maxDistance = 30;
    controls.minDistance = 5;

    // Ground plane with grid
    const planeGeometry = new THREE.PlaneGeometry(40, 40);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
      transparent: true,
      opacity: 0.3,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -6;
    plane.receiveShadow = true;
    scene.add(plane);

    // Grid helper for depth perception
    const gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x222222);
    gridHelper.position.y = -5.9;
    scene.add(gridHelper);

    // Animation
    let animationId: number;
    const clock = new THREE.Clock();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Animate text groups with different patterns
      text1.rotation.y = Math.sin(time * 0.3) * 0.2;
      text1.position.y = 3 + Math.sin(time * 0.8) * 0.3;

      text2.rotation.y = Math.sin(time * 0.4 + Math.PI) * 0.15;
      text2.position.y = Math.sin(time * 1.1) * 0.2;

      text3.rotation.y = Math.sin(time * 0.5) * 0.1;
      text3.position.y = -3 + Math.sin(time * 0.9 + Math.PI) * 0.25;

      // Animate individual letters within each text group
      [text1, text2, text3].forEach((textGroup, groupIndex) => {
        textGroup.children.forEach((letter, letterIndex) => {
          const mesh = letter as THREE.Mesh;
          mesh.rotation.x =
            Math.sin(time * 1.5 + letterIndex * 0.5 + groupIndex) * 0.1;
          mesh.position.z =
            Math.sin(time * 2 + letterIndex * 0.3 + groupIndex) * 0.1;
        });
      });

      // Animate floating shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 * ((index % 3) + 1);
        shape.rotation.y += 0.015 * ((index % 2) + 1);
        shape.rotation.z += 0.008 * ((index % 4) + 1);

        // Floating motion
        shape.position.y += Math.sin(time * 1.5 + index) * 0.003;
        shape.position.x += Math.sin(time * 0.5 + index * 0.1) * 0.002;
      });

      // Animate lights for dynamic atmosphere
      pointLight1.position.x = Math.sin(time * 0.7) * 20;
      pointLight1.position.z = Math.cos(time * 0.7) * 20;
      pointLight1.intensity = 0.5 + Math.sin(time * 2) * 0.3;

      pointLight2.position.x = Math.sin(time * 0.9 + Math.PI) * 15;
      pointLight2.position.z = Math.cos(time * 0.9 + Math.PI) * 15;
      pointLight2.intensity = 0.5 + Math.cos(time * 2.5) * 0.3;

      // Update controls
      controls.update();

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    // Set initial size after a brief delay to ensure container is rendered
    setTimeout(() => handleResize(), 100);

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      // Remove event listeners
      window.removeEventListener("resize", handleResize);

      // Cancel animation frame
      if (animationId) cancelAnimationFrame(animationId);

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

      // Dispose geometries and materials
      shapes.forEach((shape) => {
        (shape.geometry as THREE.BufferGeometry).dispose();
        (shape.material as THREE.Material).dispose();
      });

      planeGeometry.dispose();
      planeMaterial.dispose();

      // Dispose controls
      controls.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Three.js canvas container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Overlay with information */}
      <div className="absolute top-24 left-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-2">3D Text Geometry</h2>
        <p className="text-sm mb-2">
          Dynamic 3D typography created using geometric shapes to represent
          letters, with animated floating motion and interactive controls.
        </p>
        <ul>
          <li>Custom letter geometries (boxes, cylinders, torus, etc.)</li>
          <li>Three distinct text elements with different colors</li>
          <li>30+ floating geometric shapes for atmosphere</li>
          <li>PBR materials with metalness and emissive properties</li>
          <li>Dynamic lighting animation with color shifts</li>
          <li>Individual letter animations and rotations</li>
          <li>Auto-rotating camera with interactive controls</li>
        </ul>

        <div className="mt-4 bg-blue-600/20 p-2 rounded">
          <p className="text-sm font-bold pb-1">Controls:</p>
          <ul>
            <li>Drag to rotate view</li>
            <li>Scroll to zoom in/out (5-30 units)</li>
            <li>Right-click + drag to pan</li>
            <li>Auto-rotation enabled</li>
          </ul>
        </div>
      </div>

      {/* Technical Features */}
      <div className="absolute bottom-0 right-0 bg-black/50 backdrop-blur-sm text-white m-4 p-4 rounded-lg max-w-sm">
        <h3 className="font-semibold mb-2">Technical Features</h3>
        <ul>
          <li>Custom geometric text rendering</li>
          <li>PBR materials with dynamic lighting</li>
          <li>Individual letter animations</li>
          <li>Procedural floating shapes</li>
          <li>Grid-based ground plane</li>
        </ul>
      </div>
    </div>
  );
}
