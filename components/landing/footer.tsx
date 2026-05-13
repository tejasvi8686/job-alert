"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Preview", href: "#preview" },
    { label: "Compare", href: "#comparison" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  Company: [
    { label: "Launch board", href: "#testimonials" },
    { label: "Founder note", href: "#launch" },
    { label: "Contact", href: "mailto:support@jobalert.app" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: "solar:chat-square-bold", label: "X", href: "#" },
  { icon: "solar:code-square-bold", label: "GitHub", href: "#" },
  { icon: "solar:share-circle-bold", label: "LinkedIn", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/80 bg-muted/35">
      {/* Subtle background glow — kept small so it doesn't overwhelm the footer */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[400px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(184,80,58,0.12) 0%, rgba(184,80,58,0) 70%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Icon icon="solar:suitcase-bold" className="h-5 w-5 text-primary" />
              <span className="font-heading text-lg text-foreground">
                JobAlert
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Launch-stage job matching tool for developers. Built in public and
              updated frequently.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {title}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground/90 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/70 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} JobAlert. All rights
            reserved.
          </p>
          <div className="flex gap-5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon icon={social.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
