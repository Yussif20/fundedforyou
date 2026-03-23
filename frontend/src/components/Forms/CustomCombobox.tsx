"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TComboboxOption = {
  label: string;
  value: string;
};

type TCustomComboboxProps = {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  required?: boolean;
  disabled?: boolean;
  options?: TComboboxOption[];
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  // Server-side search props
  onSearchChange?: (searchTerm: string) => void;
  isSearching?: boolean;
  debounceMs?: number;
};

export default function CustomCombobox({
  name,
  label,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  required,
  disabled,
  options = [],
  className,
  labelClassName,
  buttonClassName,
  onSearchChange,
  isSearching = false,
  debounceMs = 200,
}: TCustomComboboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    if (!onSearchChange) return;

    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs, onSearchChange]);

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => {
        const selectedOption = options.find((opt) => opt.value === field.value);

        return (
          <div className={cn("flex flex-col w-full", className)}>
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  "text-sm md:text-sm font-semibold pb-2",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    "w-full justify-between font-normal",
                    !field.value && "text-muted-foreground",
                    buttonClassName
                  )}
                >
                  {selectedOption?.label || placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full sm:w-[300px] md:w-[450px] p-0">
                <Command shouldFilter={!onSearchChange} className="">
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    {isSearching ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Searching...
                        </span>
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                          {options.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={(currentValue) => {
                                field.onChange(
                                  currentValue === field.value
                                    ? ""
                                    : currentValue
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {errors?.[name] && (
              <small className="text-red-500 text-sm mt-1">
                {errors?.[name]?.message as string}
              </small>
            )}
          </div>
        );
      }}
    />
  );
}
