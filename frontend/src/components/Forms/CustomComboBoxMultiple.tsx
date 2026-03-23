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
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TOption = {
  name: string;
  value: string;
  image?: string | StaticImageData;
};

type TOptionComboboxProps = {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  isError?: boolean;
  required?: boolean;
  disabled?: boolean;
  options: TOption[];
  mode?: "single" | "multiple"; // <-- new prop
  className?: string;
  labelClassName?: string;
  buttonClassName?: string;
  onSearchChange?: (value: string) => void;
  debounceMs?: number;
  extraFunction?: any;
};

export default function CustomComboBoxMultiple({
  name,
  label,
  isLoading = false,
  isError = false,
  placeholder = "Search options...",
  searchPlaceholder = "Search by option, currency, or code...",
  emptyMessage = "No option found.",
  required,
  disabled,
  options,
  mode = "multiple", // default to multiple
  className,
  labelClassName,
  buttonClassName,
  onSearchChange,
  extraFunction,
  debounceMs = 300,
}: TOptionComboboxProps) {
  const {
    control,
    setValue,
    getValues,
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

  const newOptions = options.map((option, index) => ({
    ...option,
    id: index,
  }));

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      defaultValue={mode === "multiple" ? [] : ""}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value
          : field.value
            ? [field.value]
            : [];

        let selectedOptions = options.filter((o) =>
          selectedValues.includes(o.value),
        );

        if (mode === "single") {
          selectedOptions = selectedOptions.slice(0, 1);
        }

        const toggleSelect = (value: string) => {
          if (mode === "multiple") {
            if (selectedValues.includes(value)) {
              field.onChange(selectedValues.filter((v) => v !== value));
            } else {
              field.onChange([...selectedValues, value]);
            }
            if (extraFunction) {
              extraFunction(
                value,
                getValues("drawDownTexts"),
                setValue,
                getValues,
              );
            }
          } else {
            field.onChange(value);
            setOpen(false); // close popover on single select
          }
        };

        return (
          <div className={cn("flex flex-col w-full space-y-2", className)}>
            {label && (
              <label className={cn("text-sm font-medium", labelClassName)}>
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
                    "w-full justify-between min-h-[42px] h-max rounded-[24px]!",
                    selectedValues.length === 0 && "text-muted-foreground",
                    buttonClassName,
                  )}
                  linearClassName="rounded-[24px]"
                  linearClassName2="rounded-[24px]"
                >
                  {selectedValues.length ? (
                    <div className="flex flex-wrap gap-1 z-10">
                      {selectedOptions.map((item, index) => (
                        <div
                          key={`${item.value}-${index}`}
                          className="flex items-center gap-1 bg-muted px-2 py-1.5 rounded text-sm font-normal"
                        >
                          {item.image && (
                            <div className="w-6 h-4 relative overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={24}
                                height={16}
                                className="object-cover"
                              />
                            </div>
                          )}
                          {item.name}
                          {mode === "multiple" && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelect(item.value);
                              }}
                            >
                              <X className="h-3 w-3 cursor-pointer z-10" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm font-normal">{placeholder}</span>
                  )}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    {isLoading ? (
                      <CommandItem>Loading...</CommandItem>
                    ) : isError ? (
                      <CommandItem>Something went wrong</CommandItem>
                    ) : (
                      <>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {newOptions.map((option) => {
                            const isSelected = selectedValues.includes(
                              option.value,
                            );

                            return (
                              <CommandItem
                                key={option.id}
                                value={option.name}
                                onSelect={() => toggleSelect(option.value)}
                                className="flex items-center gap-3 px-3 py-2.5"
                              >
                                <div
                                  className={cn(
                                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50",
                                  )}
                                >
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>

                                {option.image && (
                                  <Image
                                    src={option.image}
                                    alt={option.name}
                                    width={24}
                                    height={16}
                                    className="w-6 h-4 object-cover rounded-sm"
                                  />
                                )}

                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {option.name}
                                  </span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {errors?.[name] && (
              <small className="text-red-500 text-sm">
                {errors?.[name]?.message as string}
              </small>
            )}
          </div>
        );
      }}
    />
  );
}
