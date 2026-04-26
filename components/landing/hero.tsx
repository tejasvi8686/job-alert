"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { HeroBackground } from "./hero-background";
import { GradientButton } from "./gradient-button";
import { Icon } from "@iconify/react";

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!headlineRef.current) return;

    const words = headlineRef.current.querySelectorAll(".word");
    gsap.from(words, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.3,
    });
  });

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
      <HeroBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm"
        >
          <Icon icon="solar:stars-minimalistic-bold" className="h-3.5 w-3.5 text-primary" />
          AI-Powered Job Matching
        </motion.div>

        {/* Headline with GSAP word-by-word reveal */}
        <h1
          ref={headlineRef}
          className="font-heading text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="word inline-block">
            Stop&nbsp;
          </span>
          <span className="word inline-block">
            Searching&nbsp;
          </span>
          <span className="word inline-block">
            Jobs.
          </span>
          <br />
          <span className="word inline-block text-primary">
            Let&nbsp;
          </span>
          <span className="word inline-block text-primary">
            Them&nbsp;
          </span>
          <span className="word inline-block text-primary">
            Come&nbsp;
          </span>
          <span className="word inline-block text-primary">
            to&nbsp;
          </span>
          <span className="word inline-block text-primary">
            You.
          </span>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          Our AI scans thousands of job listings and sends you only the most
          relevant opportunities every morning.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <GradientButton href="/login">Start Free</GradientButton>
          <GradientButton href="#preview" variant="outline">
            View Demo
          </GradientButton>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground/80"
        >
          <div>
            <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              10K+
            </span>
            <p className="mt-1">Jobs Scanned Daily</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="font-mono text-2xl font-semibold tabular-nums text-primary">
              95%
            </span>
            <p className="mt-1">Match Accuracy</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              2K+
            </span>
            <p className="mt-1">Active Users</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
