"use client";

import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "../ui/button";

type TYesNoToggleProps = {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  yesValue?: any;
  noValue?: any;
  yesLabel?: string;
  noLabel?: string;
};

export default function CustomYesNoToggle({
  name,
  label,
  disabled,
  className,
  labelClassName,
  yesValue = true,
  noValue = false,
  yesLabel = "Yes",
  noLabel = "No",
}: TYesNoToggleProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className={cn("flex items-center justify-between", className)}>
            {label && (
              <label
                className={cn(
                  "text-sm md:text-sm font-semibold",
                  labelClassName
                )}
              >
                {label}
              </label>
            )}

            <div className="inline-flex rounded-lg bg-background p-1 space-x-2">
              <Button
                type="button"
                disabled={disabled}
                variant={field.value === yesValue ? "default" : "outline"}
                onClick={() => field.onChange(yesValue)}
              >
                {yesLabel}
              </Button>

              <Button
                type="button"
                variant={field.value === noValue ? "default" : "outline"}
                disabled={disabled}
                onClick={() => field.onChange(noValue)}
              >
                {noLabel}
              </Button>
            </div>

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
