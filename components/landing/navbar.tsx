"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#preview", label: "Preview" },
  { href: "#comparison", label: "Compare" },
  { href: "#launch", label: "Launch" },
  { href: "#faq", label: "FAQ" },
];

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const ctaHref = isAuthenticated ? "/dashboard" : "/login";
  const authCtaLabel = isAuthenticated ? "Dashboard" : "Log in";

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 150);
    setScrolled(latest > 50);
  });

  function handleAuthCtaClick(source: string) {
    if (isAuthenticated) return;

    trackEvent("landing_cta_click", {
      source,
      href: ctaHref,
    });
  }

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Icon icon="solar:suitcase-bold" className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg text-foreground">JobAlert</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={ctaHref}
              onClick={() => handleAuthCtaClick("navbar_auth_button")}
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_rgba(184,80,58,0.18)] transition-shadow hover:shadow-[0_14px_28px_rgba(184,80,58,0.24)]"
            >
              {authCtaLabel}
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
