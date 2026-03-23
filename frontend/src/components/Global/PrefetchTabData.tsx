"use client";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useGetAllChallengesQuery } from "@/redux/api/challenge";
import { useGetAllOffersQuery } from "@/redux/api/offerApi";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function PrefetchTabData() {
  const pathname = usePathname();
  const isFutures = pathname.includes("futures");
  const firmType = isFutures ? "FUTURES" : "FOREX";

  const isOnFirms = !pathname.includes("/challenges") && !pathname.includes("/offers");
  const isOnChallenges = pathname.includes("/challenges");
  const isOnOffers = pathname.includes("/offers");

  const firmParams = useMemo(
    () => [
      { name: "page", value: 1 },
      { name: "limit", value: 10 },
      { name: "firmType", value: firmType },
    ],
    [firmType]
  );

  const challengeParams = useMemo(
    () => [
      { name: "page", value: 1 },
      { name: "limit", value: 10 },
      { name: "size", value: 100000 },
      { name: "in_steps", value: "STEP1" },
      { name: "firmType", value: firmType },
    ],
    [firmType]
  );

  const offerParams = useMemo(
    () => ({
      page: 1,
      limit: 10,
      firmType,
      isExclusive: false,
      isCurrentMonth: false,
    }),
    [firmType]
  );

  useGetAllFirmsQuery(firmParams, { skip: isOnFirms });
  useGetAllChallengesQuery(challengeParams, { skip: isOnChallenges });
  useGetAllOffersQuery(offerParams, { skip: isOnOffers });

  return null;
}
