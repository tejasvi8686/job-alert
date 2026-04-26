"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";
import { GlassCard } from "./glass-card";

const reasons = [
  {
    icon: "solar:rocket-2-bold",
    title: "Instant Results",
    description: "Get matched with relevant jobs from the moment you sign up.",
  },
  {
    icon: "solar:settings-bold",
    title: "Smart Automation",
    description: "Set it once and receive daily alerts without lifting a finger.",
  },
  {
    icon: "solar:user-bold",
    title: "Personalized Feed",
    description: "Jobs tailored to your role, skills, and preferred location.",
  },
  {
    icon: "solar:refresh-bold",
    title: "Real-time Updates",
    description: "New listings scanned and delivered every morning at 9 AM.",
  },
  {
    icon: "solar:stars-minimalistic-bold",
    title: "Clean Experience",
    description: "Minimal, focused UI with no clutter or distractions.",
  },
  {
    icon: "solar:shield-check-bold",
    title: "No Spam",
    description: "Only relevant jobs, never promotional content or noise.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export function WhyChooseUs() {
  return (
    <SectionWrapper>
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Benefits
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          Why Choose Us?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Incredible tools and powerful AI designed to elevate your job search
          experience.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {reasons.map((reason) => (
          <motion.div key={reason.title} variants={cardVariants}>
            <GlassCard className="text-center h-full">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon icon={reason.icon} className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
