import HowItWorks from "@/components/HowItWorks/HowItWorks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Compare & Choose Your Prop Firm",
  description:
    "Learn how Funded For You helps you compare prop trading firms, challenges, and spreads to find the perfect funded account for your trading style.",
};

export default function page() {
    return (
        <>
            <HowItWorks />
        </>
    );
}