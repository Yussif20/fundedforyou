import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrencyLong, formatMaxAllocationToK } from "@/lib/formatCurrencyShort ";
import { Button } from "@/components/ui/button";
import BatteryIndicator from "@/components/Global/BatteryIndecator";
import FirmCell from "../Firms/FirmCell";
import { TChallenge } from "@/types/Challenge ";
import { Edit, Trash } from "lucide-react";
import EditChallengeModal from "./EditChallengeModal";
import { type ReactNode, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteModal from "./DeleteChallengeModal";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { visibleText } from "@/utils/visibleText";
import { cn } from "@/lib/utils";

const stepStyles: Record<string, string> = {
  STEP1: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  STEP2: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  STEP3: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  STEP4: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
  INSTANT: "bg-green-500/15 text-green-400 border border-green-500/30",
};

export default function ChallengeRow({
  challenge,
  isArabic,
  visibleColumns,
  showDiscount,
}: {
  challenge: TChallenge;
  isArabic: boolean;
  nextChallenge?: TChallenge;
  prevChallenge?: TChallenge;
  visibleColumns?: string[];
  showDiscount?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("Challenges");
  const user = useAppSelector(useCurrentUser);
  const role = user?.role;
  const [openModal, setOpenModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenEditModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", challenge.id);
    router.push(`?${params.toString()}`, { scroll: false });
    setOpenModal(true);
  };

  const handleOpenDeleteModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("id", challenge.id);
    router.push(`?${params.toString()}`, { scroll: false });
    setIsDeleteModalOpen(true);
  };

  const cellRenderers: Record<string, ReactNode> = {
    challengeName: (
      <TableCell key="challengeName" center className="text-xs md:text-base text-white" dir="ltr">
        {challenge.challengeNameRel
          ? visibleText(isArabic, challenge.challengeNameRel.name, challenge.challengeNameRel.nameArabic)
          : challenge.challengeName || "-"}
      </TableCell>
    ),
    accountSize: (
      <TableCell key="accountSize" center className="text-sm md:text-base">
        {formatMaxAllocationToK(challenge.accountSize)}
      </TableCell>
    ),
    steps: (
      <TableCell key="steps" center className="text-[11px] md:text-sm">
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs md:text-sm font-semibold",
          stepStyles[challenge?.steps] ?? "bg-foreground/10 text-foreground/60"
        )}>
          {t(challenge?.steps)}
        </span>
      </TableCell>
    ),
    profitTarget: (
      <TableCell key="profitTarget" center className="text-sm md:text-base">
        <div className="flex flex-col items-center">
          <div className="text-white">
            {challenge?.profitTarget.length > 0
              ? challenge.profitTarget.map((item) => item + "%").join(" | ")
              : "-"}
          </div>
          {challenge?.profitTarget.length > 0 && challenge.profitTarget.some((item) => Number(item) > 0) && (
            <div className="text-[10px] md:text-xs text-muted-foreground/60 mt-0.5">
              ({challenge.profitTarget
                .filter((item) => Number(item) > 0)
                .map((item) => formatCurrencyLong(challenge.accountSize * Number(item) / 100))
                .join(" | ")})
            </div>
          )}
        </div>
      </TableCell>
    ),
    dailyLoss: (
      <TableCell key="dailyLoss" center className="text-sm md:text-base text-white">
        <div className="flex flex-col items-center">
          <div>{challenge?.dailyLoss ? `${challenge.dailyLoss}%` : "-"}</div>
          {!!challenge?.dailyLoss && challenge.dailyLoss > 0 && (
            <div className="text-[10px] md:text-xs text-muted-foreground/60 mt-0.5">
              ({formatCurrencyLong(challenge.accountSize * challenge.dailyLoss / 100)})
            </div>
          )}
        </div>
      </TableCell>
    ),
    maxLoss: (
      <TableCell key="maxLoss" center className="text-sm md:text-base text-white">
        <div className="flex flex-col items-center">
          <div>{challenge?.maxLoss ? `${challenge.maxLoss}%` : "-"}</div>
          {!!challenge?.maxLoss && challenge.maxLoss > 0 && (
            <div className="text-[10px] md:text-xs text-muted-foreground/60 mt-0.5">
              ({formatCurrencyLong(challenge.accountSize * challenge.maxLoss / 100)})
            </div>
          )}
        </div>
      </TableCell>
    ),
    activationFees: (
      <TableCell key="activationFees" center className="text-sm md:text-base text-white">
        {challenge?.activationFees ? formatCurrencyLong(challenge.activationFees) : "-"}
      </TableCell>
    ),
    maxContractSize: (() => {
      const mini = challenge?.contractSizeMini;
      const micro = challenge?.contractSizeMicro;
      const miniLabel = mini ? String(mini) : <span className="text-xs md:text-sm text-muted-foreground">{t("none")}</span>;
      const microLabel = micro ? String(micro) : <span className="text-xs md:text-sm text-muted-foreground">{t("none")}</span>;
      return (
        <TableCell key="maxContractSize" center className="text-sm md:text-base text-white">
          {miniLabel} <span className="mx-2">|</span> {microLabel}
        </TableCell>
      );
    })(),
    consistencyRule: (() => {
      const ch = challenge?.consistencyRuleChallenge;
      const fu = challenge?.consistencyRuleFunded;
      const chLabel = ch ? String(ch) : <span className="text-xs md:text-sm text-muted-foreground">{t("none")}</span>;
      const fuLabel = fu ? String(fu) : <span className="text-xs md:text-sm text-muted-foreground">{t("none")}</span>;
      return (
        <TableCell key="consistencyRule" center className="text-sm md:text-base text-white">
          {chLabel} <span className="mx-2">|</span> {fuLabel}
        </TableCell>
      );
    })(),
    profitSplit: (
      <TableCell key="profitSplit" center className="text-sm md:text-base">
        <div className="flex items-center justify-center gap-2">
          <BatteryIndicator percentage={challenge?.profitSplit} showNumber={false} />
          <span className="text-sm md:text-base font-semibold text-white">
            {challenge?.profitSplit}%
          </span>
        </div>
      </TableCell>
    ),
    payoutFrequency: (
      <TableCell key="payoutFrequency" center className="whitespace-normal max-w-[130px] text-center leading-snug text-[11px] md:text-sm">
        {visibleText(
          isArabic,
          challenge.payoutFrequency,
          challenge.payoutFrequencyArabic,
        )}
      </TableCell>
    ),
    price: (() => {
      const discount = showDiscount
        ? (challenge.challengeNameRel?.discountPercentage
          ?? challenge.firm?.challengeNameRecords?.find(
            (cn) => cn.id === challenge.challengeNameId || cn.name === challenge.challengeName
          )?.discountPercentage
          ?? 0)
        : 0;
      const hasDiscount = discount > 0;
      const discountedPrice = challenge.price * (1 - discount / 100);

      return (
        <TableCell key="price" center className={cn(
            "text-sm md:text-base",
            "md:sticky md:z-20 md:bg-background group-hover:md:bg-background",
            isArabic
              ? "md:left-0 md:shadow-[2px_0_4px_rgba(0,0,0,0.1)]"
              : "md:right-0 md:shadow-[-2px_0_4px_rgba(0,0,0,0.1)]",
          )}>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1 bg-primary/[0.06] rounded-xl px-3 py-2 border border-primary/15">
              {hasDiscount ? (
                <>
                  <p className="text-xs md:text-lg font-bold text-primary leading-none">
                    {formatCurrencyLong(discountedPrice)}
                  </p>
                  <p className="text-[10px] md:text-xs font-medium text-muted-foreground/50 line-through leading-none">
                    {formatCurrencyLong(challenge?.price)}
                  </p>
                </>
              ) : (
                <p className="text-xs md:text-lg font-bold text-primary">
                  {formatCurrencyLong(challenge?.price)}
                </p>
              )}
            </div>
            <div className="self-stretch w-px bg-border/40 my-1" />
            <Link href={challenge.affiliateLink || ""} target="_blank">
              <Button size="sm" className="h-7 px-3 text-xs font-bold">{t("buy")}</Button>
            </Link>
          </div>
        </TableCell>
      );
    })(),
  };

  const columnsToRender = visibleColumns ?? [
    "accountSize", "steps", "profitTarget", "dailyLoss",
    "maxLoss", "profitSplit", "payoutFrequency", "price",
  ];

  return (
    <>
      <TableRow className="font-semibold group">
        <FirmCell
          company={{
            image: challenge?.firm?.logoUrl,
            name: challenge?.firm?.title,
            slug: challenge?.firm?.slug,
          }}
        />
        {columnsToRender.map((key) => cellRenderers[key])}
        {role === "SUPER_ADMIN" && (
          <TableCell>
            <div className="flex gap-2 flex-nowrap">
              <Button
                onClick={handleOpenEditModal}
                variant="outline"
                className=" w-9 h-9"
                size={"icon"}
                linearClassName="w-max"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleOpenDeleteModal}
                variant="outline"
                className=" w-9 h-9"
                size={"icon"}
                linearClassName="w-max"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        )}
      </TableRow>

      <EditChallengeModal
        open={openModal}
        setOpen={setOpenModal}
        challenge={challenge}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        id={challenge.id}
      />
    </>
  );
}
