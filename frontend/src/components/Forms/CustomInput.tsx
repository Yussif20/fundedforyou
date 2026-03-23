"use client";

import { Input } from "@/components/ui/input";
import { JSX, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import useIsArabic from "@/hooks/useIsArabic";

type TInputProps = {
  type: string;
  name: string;
  accept?: string;
  ref?: any;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string; // container class
  labelClassName?: string;
  fieldClassName?: string; // input class
  Icon?: JSX.Element;
  RightIcon?: JSX.Element;
  onRightIconClick?: () => void;
  RightIconWidth?: number;
  inputDir?: "ltr" | "rtl" | "auto";
};

const CustomInput = ({
  type,
  name,
  label,
  disabled,
  ref,
  accept,
  required,
  placeholder,
  className,
  labelClassName,
  fieldClassName,
  RightIconWidth,
  Icon,
  RightIcon,
  onRightIconClick,
  inputDir = "auto",
}: TInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const isArabic = useIsArabic();
  useEffect(() => {
    if (type === "number") {
      const inputElement = document.getElementById(name);
      if (inputElement) {
        inputElement.addEventListener("wheel", (e) => e.preventDefault(), {
          passive: false,
        });
      }
    }
  }, [name, type]);
  const handleRightClick = () => {
    if (onRightIconClick) {
      onRightIconClick();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => {
        return (
          <div className={cn("flex flex-col", className)}>
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
            <div className={`w-full  relative`}>
              {Icon && (
                <div className="absolute text-lg w-8 h-full flex justify-end items-center z-10">
                  {Icon}
                </div>
              )}
              {RightIcon && (
                <div
                  onClick={handleRightClick}
                  className={cn(
                    "absolute z-10 text-sm h-full flex justify-center items-center cursor-pointer",
                    isArabic ? "left-0" : "right-0"
                  )}
                  style={{
                    width: (RightIconWidth || 32) + "px",
                  }}
                >
                  {RightIcon}
                </div>
              )}
              <Input
                {...field}
                onChange={(e) => {
                  console.log(e.target.value);
                  field.onChange(e);
                }}
                {...(ref && { ref })}
                {...(accept && { accept })}
                type={type}
                dir={inputDir}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                min={type === "number" ? 0 : undefined}
                step={type === "number" ? 0.01 : undefined}
                style={{
                  ...(RightIcon && RightIconWidth != null
                    ? isArabic
                      ? { paddingLeft: `${RightIconWidth}px` }
                      : { paddingRight: `${RightIconWidth}px` }
                    : {}),
                }}
                className={cn(
                  "w-full min-w-0 text-sm disabled:opacity-95",
                  fieldClassName,
                  Icon && (isArabic ? "pr-9" : "pl-9"),
                  RightIcon && RightIconWidth == null && (isArabic ? "pl-10" : "pr-10"),
                  RightIcon && RightIconWidth != null && (isArabic ? "pl-0" : "pr-0"),
                  isArabic && "text-right"
                )}
              />
            </div>
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
};

export default CustomInput;
