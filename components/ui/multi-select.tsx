"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: readonly string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select options",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) =>
      option.toLowerCase().includes(normalizedQuery)
    );
  }, [options, query]);

  function toggleOption(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((entry) => entry !== option));
      return;
    }

    onChange([...value, option]);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors hover:border-ring/40"
      >
        {value.length > 0 ? (
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {value.map((entry) => (
              <span
                key={entry}
                className="inline-flex max-w-full items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-foreground"
              >
                <span className="truncate">{entry}</span>
                <span
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onChange(value.filter((item) => item !== entry));
                  }}
                  className="inline-flex h-3.5 w-3.5 items-center justify-center rounded hover:bg-background"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border border-border bg-popover p-2 shadow-lg">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-9"
            autoFocus
          />

          <div className="mt-2 max-h-56 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const selected = value.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-muted",
                      selected && "bg-muted font-medium"
                    )}
                  >
                    <span className="truncate">{option}</span>
                    {selected && <Check className="h-4 w-4 text-success" />}
                  </button>
                );
              })
            )}
          </div>

          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-2 w-full rounded-md border border-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Clear selection
            </button>
          )}
        </div>
      )}
    </div>
  );
}
