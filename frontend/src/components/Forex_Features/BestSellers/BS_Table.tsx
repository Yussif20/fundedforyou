"use client";
import { Pagination } from "@/components/Global/Pagination";
import BS_Row from "./BS_Row";
import { useGetAllBestSellersQuery } from "@/redux/api/bestSellerApi";
import { motion } from "framer-motion";
import { OfferCardSkeleton } from "../Offers/Skeleton";
import { useSearchParams } from "next/navigation";
import { TQueryParam } from "@/types";
import useIsFutures from "@/hooks/useIsFutures";

export default function BS_Table() {
  const isFutures = useIsFutures();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "";
  const type = searchParams.get("type") || "";
  const page = searchParams.get("page") || "";
  const queryParams: TQueryParam[] = [];
  if (sort) queryParams.push({ name: "sort", value: sort });
  if (type) queryParams.push({ name: "type", value: type });
  if (page) queryParams.push({ name: "page", value: page });
  queryParams.push({
    name: "firm.firmType",
    value: isFutures ? "FUTURES" : "FOREX",
  });
  const { data, isLoading, isFetching } =
    useGetAllBestSellersQuery(queryParams);

  if (isLoading || isFetching)
    return (
      <div className="space-y-8">
        <OfferCardSkeleton />
        <OfferCardSkeleton />
        <OfferCardSkeleton />
      </div>
    );
  const bestSellers = data?.data || [];

  return (
    <div className="space-y-8">
      {bestSellers?.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: idx * 0.07, ease: "easeOut" }}
        >
          <BS_Row
            company={item}
            prevCompany={bestSellers[idx - 1] || null}
            nextCompany={bestSellers[idx + 1] || null}
            rank={idx + 1}
          />
        </motion.div>
      ))}
      <Pagination totalPages={data?.meta?.totalPage || 0} />
    </div>
  );
}
