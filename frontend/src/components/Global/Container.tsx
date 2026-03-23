import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <section className={cn("max-w-[1460px] mx-auto ps-5 pe-5", className)}>
      {children}
    </section>
  );
}
