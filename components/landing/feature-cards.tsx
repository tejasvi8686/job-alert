"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";
import { GlassCard } from "./glass-card";

const features = [
  {
    icon: "solar:magic-stick-3-bold",
    title: "AI Job Filtering",
    description:
      "We scan thousands of jobs and pick only what matches your skills, experience, and preferences.",
    color: "text-primary",
  },
  {
    icon: "solar:letter-bold",
    title: "Daily Delivery",
    description:
      "Fresh, curated opportunities sent to your inbox every morning — no effort required.",
    color: "text-chart-5",
  },
  {
    icon: "solar:target-bold",
    title: "Smart Matching",
    description:
      "Our AI understands your role, skills, and location to find the perfect fit every time.",
    color: "text-success",
  },
  {
    icon: "solar:bolt-circle-bold",
    title: "Save Hours Daily",
    description:
      "No more endless scrolling on job boards. We do the heavy lifting so you don't have to.",
    color: "text-chart-4",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeatureCards() {
  return (
    <SectionWrapper id="features">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Features
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          Everything you need to land your next role
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Powerful features designed to automate your job search and deliver
          results that matter.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => (
          <motion.div key={feature.title} variants={cardVariants}>
            <GlassCard className="h-full">
              <Icon icon={feature.icon} className={`h-10 w-10 ${feature.color}`} />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
