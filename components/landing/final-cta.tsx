"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { Icon } from "@iconify/react";
import { GradientButton } from "./gradient-button";

export function FinalCta() {
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!glowRef.current) return;

    gsap.to(glowRef.current, {
      background:
        "radial-gradient(circle at 50% 50%, rgba(184,80,58,0.2) 0%, rgba(74,122,98,0.1) 50%, transparent 80%)",
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });

  return (
    <section className="relative overflow-hidden py-32">
      {/* GSAP animated background glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(184,80,58,0.2) 0%, rgba(74,122,98,0.1) 50%, transparent 80%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(122,116,108,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(122,116,108,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="font-heading text-4xl leading-tight tracking-tight sm:text-5xl">
          Never Miss the Right{" "}
          <span className="text-primary">
            Opportunity
          </span>{" "}
          Again
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Join early users and help shape the next version while getting
          relevant opportunities in your inbox.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <GradientButton href="/login" trackingSource="final_cta">
            Start Free Today
            <Icon icon="solar:arrow-right-bold" className="ml-2 h-4 w-4" />
          </GradientButton>
        </div>
        <p className="mt-6 text-xs text-muted-foreground/80">
          No credit card required. Free during launch beta.
        </p>
      </motion.div>
    </section>
  );
}
