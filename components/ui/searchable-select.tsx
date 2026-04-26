"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
}: SearchableSelectProps) {
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

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm transition-colors hover:border-ring/40",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate text-left">{value || placeholder}</span>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
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
          <div className="mt-2 max-h-52 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                {emptyMessage}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const selected = option === value;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onValueChange(option);
                      setOpen(false);
                      setQuery("");
                    }}
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
        </div>
      )}
    </div>
  );
}
