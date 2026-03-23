import Contact from "@/components/Contact/Contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Funded For You team. We're here to help with questions about prop trading firms, challenges, and our platform.",
};

export default function page() {
    return (
        <Contact />
    );
}