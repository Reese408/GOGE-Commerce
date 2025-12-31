"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export function SearchInput({
  placeholder = "Search products...",
  onSearch
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // Keyboard shortcut: Cmd+K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div
        className={`relative flex items-center transition-all duration-200 ${
          isFocused
            ? "ring-2 ring-[#927194] dark:ring-[#D08F90]"
            : "ring-1 ring-gray-300 dark:ring-zinc-700"
        } rounded-full overflow-hidden bg-white dark:bg-zinc-800`}
      >
        <Search
          className="absolute left-4 text-gray-400 dark:text-zinc-500"
          size={18}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-2.5 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      {!isFocused && !query && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 pointer-events-none">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 rounded border border-gray-300 dark:border-zinc-600 font-mono">
            ⌘K
          </kbd>
        </div>
      )}
    </form>
  );
}
