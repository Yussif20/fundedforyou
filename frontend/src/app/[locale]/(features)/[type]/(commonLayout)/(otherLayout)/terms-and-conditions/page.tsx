import Terms from "@/components/Terms/Terms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Review the Funded For You terms and conditions. Understand the rules governing your use of our prop trading firm comparison platform.",
};

export default function page() {
  return (
    <>
      <Terms />
    </>
  );
}
