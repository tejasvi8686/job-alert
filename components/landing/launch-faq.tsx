"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionWrapper } from "./section-wrapper";
import { LAUNCH_FAQS } from "./launch-faq-data";

export function LaunchFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <SectionWrapper id="faq">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          FAQ
        </p>
        <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
          Practical answers before you sign up
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-4xl space-y-3">
        {LAUNCH_FAQS.map((faq, index) => (
          <div
            key={faq.question}
            className="rounded-xl border border-border/70 bg-card/65 p-4"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-start justify-between gap-3 text-left text-sm font-medium"
              aria-expanded={openIndex === index}
              aria-controls={`faq-panel-${index}`}
            >
              <span>{faq.question}</span>
              <span className="relative mt-0.5 block h-4 w-4 shrink-0">
                <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-muted-foreground" />
                <motion.span
                  initial={false}
                  animate={{
                    scaleY: openIndex === index ? 0 : 1,
                    opacity: openIndex === index ? 0 : 1,
                  }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rounded-full bg-muted-foreground"
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  id={`faq-panel-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
