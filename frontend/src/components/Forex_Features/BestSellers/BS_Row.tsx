"use client";

import DiscountCard from "@/components/Global/DiscountCard";
import LinearBorder from "@/components/Global/LinearBorder";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import BS_ArrowBtn from "./BS_ArrowBtn";
import { useTranslations } from "next-intl";
import { BestSeller } from "@/types/best-seller.type";
import { Link } from "@/i18n/navigation";
import { Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import Edit_BS from "./Edit_BS";
import {
  useChangeMonthlyIndexMutation,
  useChangeRankMutation,
  useChangeWeeklyIndexMutation,
  useDeleteBestSellerMutation,
} from "@/redux/api/bestSellerApi";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const rankMedals: Record<number, { emoji: string; className: string }> = {
  1: { emoji: "🥇", className: "text-yellow-400" },
  2: { emoji: "🥈", className: "text-slate-400" },
  3: { emoji: "🥉", className: "text-amber-600" },
};

export default function BS_Row({
  company,
  prevCompany,
  nextCompany,
  rank,
}: {
  company: BestSeller;
  prevCompany: BestSeller | null;
  nextCompany: BestSeller | null;
  rank: number;
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const user = useAppSelector(useCurrentUser);
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");
  const changeIndex: "monthly" | "weekly" | "rank" =
    sort === "weeklyRank"
      ? "weekly"
      : sort === "monthlyRank"
      ? "monthly"
      : "rank";
  const [deleteBestSeller, { isLoading: isDeleting }] =
    useDeleteBestSellerMutation();
  const [changeMonthIndex, { isLoading: isChangingMonthIndex }] =
    useChangeMonthlyIndexMutation();
  const [changeWeeklyIndex, { isLoading: isChangingWeeklyIndex }] =
    useChangeWeeklyIndexMutation();
  const [changeRank, { isLoading: isChangingRank }] = useChangeRankMutation();
  const role = user?.role;
  const t = useTranslations("BestSellers");

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteBestSeller(company.id).unwrap();
      toast.dismiss(toastId);
      toast.success("Deleted successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to delete");
    }
  };

  const handleMoveTop = async () => {
    let newIndex =
      changeIndex === "monthly"
        ? prevCompany?.monthlyRank || company.monthlyRank
        : changeIndex === "weekly"
        ? prevCompany?.weeklyRank || company.weeklyRank
        : prevCompany?.rank || company.rank;
    if (newIndex < 1) return;
    const toastId = toast.loading("Moving...");
    try {
      if (changeIndex === "monthly") {
        await changeMonthIndex({ id: company.id, index: newIndex }).unwrap();
      } else if (changeIndex === "weekly") {
        await changeWeeklyIndex({ id: company.id, index: newIndex }).unwrap();
      } else {
        await changeRank({ id: company.id, index: newIndex }).unwrap();
      }
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  const handleMoveBottom = async () => {
    let newIndex =
      changeIndex === "monthly"
        ? nextCompany?.monthlyRank || company.monthlyRank
        : changeIndex === "weekly"
        ? nextCompany?.weeklyRank || company.weeklyRank
        : nextCompany?.rank || company.rank;
    const toastId = toast.loading("Moving...");
    try {
      if (changeIndex === "monthly") {
        await changeMonthIndex({ id: company.id, index: newIndex }).unwrap();
      } else if (changeIndex === "weekly") {
        await changeWeeklyIndex({ id: company.id, index: newIndex }).unwrap();
      } else {
        await changeRank({ id: company.id, index: newIndex }).unwrap();
      }
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  return (
    <LinearBorder className="rounded-2xl max-w-full" className2="rounded-2xl">
      <div className="p-4 md:p-8 flex justify-between items-center gap-4 md:gap-10">
        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-3">
          {/* Rank medal */}
          {rankMedals[rank] ? (
            <span className={`text-xl flex-shrink-0 ${rankMedals[rank].className}`} title={`#${rank}`}>
              {rankMedals[rank].emoji}
            </span>
          ) : (
            <span className="text-sm text-foreground/40 font-semibold w-6 text-center flex-shrink-0">
              #{rank}
            </span>
          )}

          <Link
            href={`/firms/${company.firm?.slug}`}
            className="flex items-center gap-2"
          >
            <div className="bg-primary3 max-w-max rounded-lg overflow-hidden border border-border flex-shrink-0">
              <div className="w-8 xl:w-12 aspect-square relative">
                <Image
                  src={company.firm?.logoUrl || ""}
                  alt="image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h2 className="text-sm sm:text-base md:text-lg xl:text-xl font-semibold">
              {company.firm?.title || ""}
            </h2>
          </Link>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex justify-center items-center gap-2 md:gap-4">
          {/* -------- Discount -------- */}
          {!!company.firm?.offers?.length && (
            <>
              <DiscountCard
                discount={{
                  code: company.firm?.offers[0]?.code || "",
                  description: company.firm?.offers[0]?.code || "",
                  offerPercentage:
                    company.firm?.offers[0]?.offerPercentage || 0,
                }}
              />
              <div className="h-12 border-r border-foreground/30 hidden md:block" />
            </>
          )}

          {/* -------- See All Offers -------- */}
          <Link
            className="flex justify-center items-center gap-2 md:gap-4"
            href={`/firms/${company.firm?.slug}/exclusive-offers`}
          >
            <Button linearClassName="hidden md:block" variant="outline">
              {t("seeAllOffers")}
            </Button>
            <BS_ArrowBtn />
          </Link>

          {role === "SUPER_ADMIN" && (
            <>
              <div className="h-12 border-r border-foreground/30 hidden md:block" />

              {/* ================= ACTION BUTTONS ================= */}
              <div className="flex items-center gap-1 md:gap-2">
                {/* Edit */}
                <Edit_BS bestSeller={company} />

                {/* Delete */}
                <Dialog
                  open={openDeleteDialog}
                  onOpenChange={setOpenDeleteDialog}
                >
                  <DialogTrigger asChild>
                    <Button size="icon" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this best seller?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose disabled={isDeleting}>Cancel</DialogClose>
                      <Button
                        disabled={isDeleting}
                        variant="destructive"
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Move Top */}
                <Button
                  disabled={
                    isChangingRank ||
                    isChangingWeeklyIndex ||
                    isChangingMonthIndex
                  }
                  size="icon"
                  variant="outline"
                  onClick={handleMoveTop}
                >
                  {isChangingRank ||
                  isChangingWeeklyIndex ||
                  isChangingMonthIndex ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </Button>

                {/* Move Bottom */}
                <Button
                  disabled={
                    isChangingRank ||
                    isChangingWeeklyIndex ||
                    isChangingMonthIndex
                  }
                  size="icon"
                  variant="outline"
                  onClick={handleMoveBottom}
                >
                  {isChangingRank ||
                  isChangingWeeklyIndex ||
                  isChangingMonthIndex ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </LinearBorder>
  );
}
