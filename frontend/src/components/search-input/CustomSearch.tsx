"use client";
import { useQueryBuilder } from "@/hooks/usePagination";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import useIsArabic from "@/hooks/useIsArabic";
import { cn } from "@/lib/utils";

type CustomSearchProps<T> = {
  data: T[];
  render: (item: T) => React.ReactNode;
  isLoading?: boolean;
  onClick: (item: T) => void;
};

function CustomSearch<T>({
  data,
  render,
  isLoading,
  onClick,
}: CustomSearchProps<T>) {
  const { setParam } = useQueryBuilder();
  const isArabic = useIsArabic();
  const [query, setQuery] = useState("");
  const [queryDebounce] = useDebounce(query, 400);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setParam("searchTerm", queryDebounce);
  }, [queryDebounce]);

  return (
    <div ref={containerRef} className="w-full relative">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder="Search..."
        className={cn("border rounded px-3 py-2 w-full", isArabic && "text-right")}
        containerClass="z-10"
      />

      {isDropdownOpen && (
        <Card className="absolute bg-card top-full mt-1 w-full gap-0 p-0 rounded-md overflow-hidden z-20 border-border shadow max-h-60 overflow-y-auto">
          {isLoading ? (
            <p className="p-2">Loading...</p>
          ) : !data.length ? (
            <p className="p-2">No results found.</p>
          ) : (
            data.map((item, index) => (
              <button
                key={index}
                type="button"
                className="text-start bg-card py-2 px-3 border-b last:border-b-0 hover:bg-secondary w-full"
                onClick={() => {
                  onClick(item);
                  setQuery(""); // optional: clear input
                  setIsDropdownOpen(false); // close dropdown after selection
                }}>
                {render(item)}
              </button>
            ))
          )}
        </Card>
      )}
    </div>
  );
}

export default CustomSearch;
