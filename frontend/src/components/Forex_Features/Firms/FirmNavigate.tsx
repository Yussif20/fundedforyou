"use client";
import useIsFutures from "@/hooks/useIsFutures";
import { useRouter } from "@/i18n/navigation";

export default function FirmNavigate({ firmType }: { firmType: string }) {
  const isFutures = useIsFutures();
  const router = useRouter();
  console.log(isFutures, firmType);
  const routes = isFutures ? "/futures#top" : "/forex#top";
  if (isFutures && firmType !== "FUTURES") {
    router.push(routes);
  } else if (!isFutures && firmType !== "FOREX") {
    router.push(routes);
  }

  return null;
}
