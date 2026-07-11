"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 7;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Capped at 1.5 for performance
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Colored point lights
    const blueLight = new THREE.PointLight(0x00e5ff, 3, 12);
    blueLight.position.set(-3, 3, 2);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x7c3aed, 3, 12);
    purpleLight.position.set(3, -3, 2);
    scene.add(purpleLight);

    // Mouse tracking spotlight
    const mouseLight = new THREE.PointLight(0xd946ef, 4, 8);
    mouseLight.position.set(0, 0, 3);
    scene.add(mouseLight);

    // 5. Geometries (Optimized standard materials)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Base Laptop representation
    const baseGeo = new THREE.BoxGeometry(3, 0.1, 2);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0e1224,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.5;
    mainGroup.add(baseMesh);

    // Screen
    const screenGeo = new THREE.BoxGeometry(2.8, 1.8, 0.05);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      metalness: 0.2,
      roughness: 0.2,
      transparent: true,
      opacity: 0.2
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.5, -0.9);
    screenMesh.rotation.x = -0.2;
    mainGroup.add(screenMesh);

    // Wireframe outline for screen
    const screenWireGeo = new THREE.EdgesGeometry(screenGeo);
    const screenWireMat = new THREE.LineBasicMaterial({ color: 0x00e5ff });
    const screenWire = new THREE.LineSegments(screenWireGeo, screenWireMat);
    screenWire.position.copy(screenMesh.position);
    screenWire.rotation.copy(screenMesh.rotation);
    mainGroup.add(screenWire);

    // Orbiting Torus rings
    const ringGeo = new THREE.TorusGeometry(2.1, 0.02, 8, 50); // Reduced segments
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.25 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    mainGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // Floating Glass geometries (Reduced count to 4)
    const glassObjects: THREE.Mesh[] = [];
    const geometries = [
      new THREE.IcosahedronGeometry(0.35),
      new THREE.TetrahedronGeometry(0.3)
    ];

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.1,
      transparent: true,
      opacity: 0.55
    });

    for (let i = 0; i < 4; i++) {
      const geo = geometries[i % geometries.length];
      const mesh = new THREE.Mesh(geo, glassMat);
      mesh.position.set(
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mainGroup.add(mesh);
      glassObjects.push(mesh);
    }

    // Orbiting particles (Reduced to 100)
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 9;
      positions[i + 1] = (Math.random() - 0.5) * 9;
      positions[i + 2] = (Math.random() - 0.5) * 9;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Interactive Mouse Movement
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = -((e.clientY - rect.top) / height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 7. Intersection Observer (Pause rendering when out of viewport)
    let isElementVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isElementVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const tick = () => {
      // Skip rendering if not visible (saves GPU resources)
      if (!isElementVisible) {
        animId = requestAnimationFrame(tick);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Track cursor spotlight
      mouseLight.position.x = mouse.x * 4.5;
      mouseLight.position.y = mouse.y * 3.5;

      // Rotations
      mainGroup.rotation.y = elapsedTime * 0.12 + mouse.x * 0.35;
      mainGroup.rotation.x = 0.08 + mouse.y * 0.15;

      // Float main laptop model
      mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;

      // Float glass pieces
      glassObjects.forEach((mesh, index) => {
        mesh.rotation.x += 0.008;
        mesh.rotation.y += 0.006;
        mesh.position.y += Math.sin(elapsedTime + index) * 0.002;
      });

      particles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    tick();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 10. Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Garbage Collection
      baseGeo.dispose();
      baseMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenWireGeo.dispose();
      screenWireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      geometries.forEach((g) => g.dispose());
      glassMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[350px] md:min-h-[500px] relative z-10" />;
}
