import Privacy from "@/components/Privacy/Privacy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Funded For You privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function page() {
  return (
    <>
      <Privacy />
    </>
  );
}
