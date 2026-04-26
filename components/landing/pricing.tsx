"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { SectionWrapper } from "./section-wrapper";
import { GradientButton } from "./gradient-button";

const plans = [
  {
    name: "Launch Beta",
    price: "₹0",
    period: "during beta",
    badge: "Active",
    highlighted: true,
    cta: "Start beta access",
    features: [
      "Full profile setup (role, skills, location)",
      "Daily curated job digest",
      "Dashboard history and settings",
      "Email support during launch",
    ],
  },
  {
    name: "Pro (Post-beta)",
    price: "₹99",
    period: "planned monthly",
    badge: "Planned",
    highlighted: false,
    cta: "Join pro waitlist",
    features: [
      "Higher daily match volume",
      "Stronger ranking controls",
      "Priority feature requests",
      "Advanced notifications",
    ],
  },
];

export function Pricing() {
  return (
    <SectionWrapper id="pricing">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Pricing
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          Clear launch pricing
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Beta access is free right now. Paid plans activate after launch
          stability targets are met.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-primary/35 bg-primary/5"
                : "border-border/70 bg-card/60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.period}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {plan.badge}
              </span>
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="font-mono text-4xl font-semibold tabular-nums text-foreground">
                {plan.price}
              </span>
            </div>

            <div className="mt-5">
              <GradientButton
                href="/login"
                variant={plan.highlighted ? "primary" : "outline"}
                trackingSource={plan.highlighted ? "pricing_beta" : "pricing_waitlist"}
                className="w-full text-center"
              >
                {plan.cta}
              </GradientButton>
            </div>

            <ul className="mt-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground/85">
                  <Icon icon="solar:check-circle-bold" className="h-4 w-4 shrink-0 text-success" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
