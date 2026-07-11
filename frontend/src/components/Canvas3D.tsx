"use client";

import React, { useEffect, useRef } from "react";

export default function Canvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize listener
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 3D Particles Definition
    interface Particle {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      size: number;
      color: string;
      vx: number;
      vy: number;
      vz: number;
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(80, Math.floor((width * height) / 20000));
    const maxDistance = 140;

    // Seeding particles
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random() * 400 - 200; // Depth coordinate
      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 1.5 + 0.5,
        color: i % 2 === 0 ? "rgba(0, 229, 255, " : "rgba(124, 58, 237, ", // Cyan & Purple
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
      });
    }

    // 3D Wireframe Globe Definition
    interface Node3D {
      x: number;
      y: number;
      z: number;
    }
    const globeNodes: Node3D[] = [];
    const globeRadius = 150;
    const rings = 8;
    const segments = 12;

    // Generate globe vertices
    for (let r = 0; r <= rings; r++) {
      const theta = (r * Math.PI) / rings;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let s = 0; s < segments; s++) {
        const phi = (s * 2 * Math.PI) / segments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        globeNodes.push({
          x: globeRadius * sinTheta * cosPhi,
          y: globeRadius * sinTheta * sinPhi,
          z: globeRadius * cosTheta,
        });
      }
    }

    let globeRotationY = 0;
    let globeRotationX = 0.2;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Perspective values
      const fov = 400; // Field of View (depth factor)
      const cx = width / 2;
      const cy = height / 2;

      // Draw particle constellation
      particles.forEach((p, idx) => {
        // Drift movement
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Boundary bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (p.z < -300 || p.z > 300) p.vz *= -1;

        // Interaction with mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 2000;
          p.x += dx * force;
          p.y += dy * force;
        }

        // Project 3D coordinates to 2D screen coordinates
        const scale = fov / (fov + p.z);
        const screenX = (p.x - cx) * scale + cx;
        const screenY = (p.y - cy) * scale + cy;

        // Render nodes
        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          const alpha = Math.min(1, Math.max(0.1, scale * 0.5));
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = p.color + alpha + ")";
          ctx.fill();
        }
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const scale1 = fov / (fov + p1.z);
            const scale2 = fov / (fov + p2.z);

            const x1 = (p1.x - cx) * scale1 + cx;
            const y1 = (p1.y - cy) * scale1 + cy;
            const x2 = (p2.x - cx) * scale2 + cx;
            const y2 = (p2.y - cy) * scale2 + cy;

            const alpha = (1 - dist / maxDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            const grad = ctx.createLinearGradient(x1, y1, x2, y2);
            grad.addColorStop(0, `rgba(0, 229, 255, ${alpha})`);
            grad.addColorStop(1, `rgba(124, 58, 237, ${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5 * Math.min(scale1, scale2);
            ctx.stroke();
          }
        }
      }

      // Draw central 3D wireframe Globe
      globeRotationY += 0.002;
      globeRotationX = 0.1 + ((mouse.y - cy) / cy) * 0.15;
      const cosY = Math.cos(globeRotationY);
      const sinY = Math.sin(globeRotationY);
      const cosX = Math.cos(globeRotationX);
      const sinX = Math.sin(globeRotationX);

      // Project globe vertices
      const projectedNodes: { x: number; y: number; z: number }[] = [];
      const globeCenterZ = 200; // depth offset

      globeNodes.forEach((node) => {
        // Rotate around Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate around X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        // Center projection
        const scale = fov / (fov + z2 + globeCenterZ);
        // Tilt slightly towards cursor
        const offsetX = ((mouse.x - cx) / cx) * 30;
        const offsetY = ((mouse.y - cy) / cy) * 30;

        projectedNodes.push({
          x: x1 * scale + cx + offsetX,
          y: y2 * scale + (cy - 50) + offsetY, // Position slightly elevated
          z: z2,
        });
      });

      // Render wireframe segment lines
      ctx.strokeStyle = "rgba(0, 229, 255, 0.04)";
      ctx.lineWidth = 0.6;

      // Latitudinal lines (rings)
      for (let r = 0; r <= rings; r++) {
        ctx.beginPath();
        for (let s = 0; s < segments; s++) {
          const idx = r * segments + s;
          const nextIdx = r * segments + ((s + 1) % segments);
          ctx.moveTo(projectedNodes[idx].x, projectedNodes[idx].y);
          ctx.lineTo(projectedNodes[nextIdx].x, projectedNodes[nextIdx].y);
        }
        ctx.stroke();
      }

      // Longitudinal lines
      for (let s = 0; s < segments; s++) {
        ctx.beginPath();
        for (let r = 0; r < rings; r++) {
          const idx = r * segments + s;
          const nextIdx = (r + 1) * segments + s;
          ctx.moveTo(projectedNodes[idx].x, projectedNodes[idx].y);
          ctx.lineTo(projectedNodes[nextIdx].x, projectedNodes[nextIdx].y);
        }
        ctx.stroke();
      }

      // Draw a subtle halo glow behind the globe
      const globeCenterX = cx + ((mouse.x - cx) / cx) * 30;
      const globeCenterY = (cy - 50) + ((mouse.y - cy) / cy) * 30;
      const scaleGlobe = fov / (fov + globeCenterZ);

      const radialGrad = ctx.createRadialGradient(
        globeCenterX,
        globeCenterY,
        0,
        globeCenterX,
        globeCenterY,
        globeRadius * scaleGlobe * 1.5
      );
      radialGrad.addColorStop(0, "rgba(37, 99, 235, 0.08)");
      radialGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.03)");
      radialGrad.addColorStop(1, "transparent");
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius * scaleGlobe * 1.5, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanups
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />;
}
