"use client";
import { Link } from "@/i18n/navigation";
import Subtitle from "./Subtitle";
import useIsFutures from "@/hooks/useIsFutures";

export default function HomeHref({
  link,
}: {
  link: {
    label: string;
    href: string;
  };
}) {
  const isFutures = useIsFutures();
  const links = isFutures ? "/futures#top" : "/forex#top";
  return (
    <Link href={links} className="hover:underline">
      <Subtitle className="text-foreground/80">{link.label}</Subtitle>
    </Link>
  );
}
