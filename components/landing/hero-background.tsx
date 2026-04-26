"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!glowRef.current || !glow2Ref.current) return;

      // Primary glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.4,
        scale: 1.1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Secondary glow with offset
      gsap.to(glow2Ref.current, {
        opacity: 0.3,
        scale: 1.15,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(122,116,108,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,116,108,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Primary radial glow */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(184,80,58,0.28) 0%, rgba(184,80,58,0) 72%)",
        }}
      />

      {/* Secondary radial glow */}
      <div
        ref={glow2Ref}
        className="absolute left-[60%] top-[45%] h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(74,122,98,0.25) 0%, rgba(74,122,98,0) 72%)",
        }}
      />

      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
