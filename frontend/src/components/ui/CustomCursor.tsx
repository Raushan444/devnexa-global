"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      rafId = requestAnimationFrame(animate);
    };

    const onMouseEnterLink = () => ringRef.current?.classList.add("is-hovering");
    const onMouseLeaveLink = () => ringRef.current?.classList.remove("is-hovering");

    document.addEventListener("mousemove", onMouseMove);
    document.querySelectorAll("a, button, [data-cursor-hover]").forEach(el => {
      el.addEventListener("mouseenter", onMouseEnterLink);
      el.addEventListener("mouseleave", onMouseLeaveLink);
    });

    rafId = requestAnimationFrame(animate);
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
