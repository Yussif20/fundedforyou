import FAQ from "@/components/FAQ/FAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to common questions about prop trading firms, funded accounts, challenges, and how to use Funded For You.",
};

export default function page() {
  return <FAQ />;
}
