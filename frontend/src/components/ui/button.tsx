import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { RiLoader2Fill } from "react-icons/ri";
import LinearBorder from "../Global/LinearBorder";

const buttonVariants = cva(
  "inline-flex relative items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-b from-primary1 to-primary2 text-primary-foreground shadow-xs hover:bg-primary/90",
        defaultBH:
          "bg-foreground text-background shadow-xs hover:bg-foreground/90",
        destructive:
          "bg-destructive text-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        "destructive-outline":
          "hover:bg-destructive/10 text-destructive hover:destructive/95",
        outline: "shadow-xs hover:text-accent-foreground dark:bg-input/30",
        outline2:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-md px-7 has-[>svg]:px-5 text-base",
        "2xl": "h-14 rounded-md px-8 has-[>svg]:px-6 text-base",
        icon: "size-9  !px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  linearClassName,
  linearClassName2,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean | string;
    linearClassName?: string;
    linearClassName2?: string;
  }) {
  const Comp = asChild ? Slot : "button";

  if (variant === "outline") {
    return (
      <LinearBorder
        className2={cn("", linearClassName2)}
        className={cn("max-w-full rounded-full", linearClassName)}
      >
        <Comp
          {...props}
          data-slot="button"
          className={cn(
            buttonVariants({ variant, size, className }),
            isLoading && "text-transparent",
            isLoading ||
              (props.disabled && "select-none px-6", "rounded-full px-6")
          )}
          type={props.type || "button"}
          disabled={!!isLoading || props.disabled}
        >
          <>
            {" "}
            {props.children}
            {typeof isLoading === "string" ? (
              <span
                className={cn(
                  "text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                )}
              >
                {isLoading}
              </span>
            ) : (
              isLoading && (
                <RiLoader2Fill className="text-primary-foreground absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              )
            )}
          </>
        </Comp>
      </LinearBorder>
    );
  }

  return (
    <Comp
      {...props}
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size, className }),
        isLoading && "text-transparent",
        isLoading || (props.disabled && "select-none", "rounded-full")
      )}
      type={props.type || "button"}
      disabled={!!isLoading || props.disabled}
    >
      {props.children}
      {typeof isLoading === "string" ? (
        <span
          className={cn(
            "text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
          )}
        >
          {isLoading}
        </span>
      ) : (
        isLoading && (
          <RiLoader2Fill className="text-primary-foreground absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        )
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
