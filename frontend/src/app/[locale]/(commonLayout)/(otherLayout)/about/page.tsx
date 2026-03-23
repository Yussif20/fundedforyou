import About from "@/components/About/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Funded For You",
  description:
    "Learn about Funded For You — the leading platform for comparing prop trading firms, funded account challenges, spreads, and exclusive offers.",
};

export default function page() {
    return (
        <>
            <About />
        </>
    );
}