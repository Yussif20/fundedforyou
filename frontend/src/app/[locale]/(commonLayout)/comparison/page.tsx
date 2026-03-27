"use client";

import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useGetAllChallengesQuery } from "@/redux/api/challenge";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useCurrentToken } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { TChallenge } from "@/types/Challenge ";
import { countries } from "@/data/country.data";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useIsArabic from "@/hooks/useIsArabic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Check,
  Ban,
  Building2,
  Trophy,
  DollarSign,
  Loader2,
  Copy,
  CheckCheck,
} from "lucide-react";

type FirmOffer = {
  code: string;
  offerPercentage: number;
  discountType: string;
  discountText: string;
  discountTextArabic: string;
};

type FirmData = {
  id: string;
  title: string;
  logoUrl: string;
  firmType: string;
  affiliateLink: string;
  restrictedCountries: string[];
  offers: FirmOffer[];
  challengeNameRecords: {
    id: string;
    name: string;
    nameArabic: string;
    discountPercentage: number;
    order: number;
  }[];
};

type ComparisonColumn = {
  firmId: string;
  challengeNameSteps: string; // encoded as "challengeNameId::steps"
  accountSize: string;
};

const STEPS_LABEL: Record<string, string> = {
  STEP1: "1 Step",
  STEP2: "2 Steps",
  STEP3: "3 Steps",
  STEP4: "4 Steps",
  INSTANT: "Instant",
};

const formatK = (n: number) =>
  n >= 1000 && n % 1000 === 0 ? `${n / 1000}K` : n.toString();

export default function ComparisonPage() {
  const t = useTranslations("Comparison");
  const isArabic = useIsArabic();
  const router = useRouter();
  const token = useAppSelector(useCurrentToken);
  const { data: meData, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const userRole = meData?.data?.user?.role;

  useEffect(() => {
    if (!meLoading && userRole !== "SUPER_ADMIN" && userRole !== "MODERATOR") {
      router.push("/");
    }
  }, [meLoading, userRole, router]);

  const searchParams = useSearchParams();
  const firmType = searchParams.get("type")?.toUpperCase() === "FUTURES" ? "FUTURES" : "FOREX";

  const { data: firmsData, isLoading: firmsLoading } = useGetAllFirmsQuery([
    { name: "limit", value: 1000 },
  ]);
  const { data: challengesData, isLoading: challengesLoading } = useGetAllChallengesQuery([
    { name: "limit", value: 5000 },
  ]);

  const allFirms: FirmData[] = (firmsData as any)?.firms || [];
  const allChallenges: TChallenge[] = (challengesData as any)?.data || [];

  const firms = allFirms.filter((f) => f.firmType === firmType);
  const challenges = allChallenges.filter((c) => c.firm?.firmType === firmType);

  const [columns, setColumns] = useState<ComparisonColumn[]>([
    { firmId: "", challengeNameSteps: "", accountSize: "" },
    { firmId: "", challengeNameSteps: "", accountSize: "" },
  ]);

  const [copiedFirmId, setCopiedFirmId] = useState<string | null>(null);

  const handleCopyCode = async (code: string, firmId: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedFirmId(firmId);
      setTimeout(() => setCopiedFirmId(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Fixed to 2 columns for side-by-side comparison

  const updateColumn = (
    idx: number,
    field: keyof ComparisonColumn,
    value: string
  ) => {
    const updated = [...columns];
    updated[idx] = { ...updated[idx], [field]: value };
    if (field === "firmId") {
      updated[idx].challengeNameSteps = "";
      updated[idx].accountSize = "";
    }
    if (field === "challengeNameSteps") {
      updated[idx].accountSize = "";
    }
    setColumns(updated);
  };

  // Get challenges for a specific firm
  const getFirmChallenges = (firmId: string): TChallenge[] => {
    return challenges.filter((c) => c.firmId === firmId);
  };

  // Get unique (challengeNameId, steps) pairs for a firm
  const getChallengeNameStepsOptions = (
    firmId: string
  ): { value: string; label: string }[] => {
    const firmChallenges = getFirmChallenges(firmId);
    const seen = new Set<string>();
    const options: { value: string; label: string }[] = [];

    for (const ch of firmChallenges) {
      if (!ch.challengeNameId) continue;
      const key = `${ch.challengeNameId}::${ch.steps}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const cnName = isArabic
        ? ch.challengeNameRel?.nameArabic || ch.challengeNameRel?.name || ch.challengeName || ""
        : ch.challengeNameRel?.name || ch.challengeName || "";
      const stepsLabel = STEPS_LABEL[ch.steps] || ch.steps;

      options.push({
        value: key,
        label: `${cnName} (${stepsLabel})`,
      });
    }

    return options;
  };

  // Get available account sizes for a (firm, challengeName, steps) combo
  const getAccountSizeOptions = (
    firmId: string,
    challengeNameSteps: string
  ): number[] => {
    if (!challengeNameSteps) return [];
    const [cnId, steps] = challengeNameSteps.split("::");
    const sizes = getFirmChallenges(firmId)
      .filter((c) => c.challengeNameId === cnId && c.steps === steps)
      .map((c) => c.accountSize);
    return [...new Set(sizes)].sort((a, b) => a - b);
  };

  // Get the specific challenge matching all 3 selections
  const getSelectedChallenge = (col: ComparisonColumn): TChallenge | null => {
    if (!col.firmId || !col.challengeNameSteps || !col.accountSize) return null;
    const [cnId, steps] = col.challengeNameSteps.split("::");
    const size = Number(col.accountSize);
    return (
      challenges.find(
        (c) =>
          c.firmId === col.firmId &&
          c.challengeNameId === cnId &&
          c.steps === steps &&
          c.accountSize === size
      ) || null
    );
  };

  const getFirm = (firmId: string): FirmData | undefined => {
    return firms.find((f) => f.id === firmId);
  };

  if (meLoading) return null;
  if (userRole !== "SUPER_ADMIN" && userRole !== "MODERATOR") return null;

  const hasAnySelection = columns.some(
    (c) => c.firmId && c.challengeNameSteps && c.accountSize
  );

  const BooleanCell = ({ value }: { value: boolean | null }) => {
    if (value === null) return <span className="text-muted-foreground">-</span>;
    return value ? (
      <span className="flex items-center justify-center gap-1 font-semibold text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
        <Check className="size-3" />
        {t("allowed")}
      </span>
    ) : (
      <span className="flex items-center justify-center gap-1 font-semibold text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
        <Ban className="size-3" />
        {t("notAllowed")}
      </span>
    );
  };

  // Determine firm type from the first column that has a selection
  const firstSelectedFirm = columns
    .filter((c) => c.firmId)
    .map((c) => getFirm(c.firmId))
    .find(Boolean);
  const isFutures = firstSelectedFirm?.firmType === "FUTURES";

  const TextCell = ({ value }: { value: string | number | null | undefined }) =>
    value !== null && value !== undefined && value !== "" ? (
      <span className="font-medium">{value}</span>
    ) : (
      <span className="text-muted-foreground">-</span>
    );

  type Row = {
    label: string;
    render: (ch: TChallenge | null) => React.ReactNode;
  };

  const commonRows: Row[] = [
    {
      label: t("price"),
      render: (ch) =>
        ch ? (
          <span className="font-semibold text-base">${ch.price}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: t("maxAllocation"),
      render: (ch) =>
        ch ? (
          <span className="font-semibold text-base">
            {formatK(ch.firm.maxAllocation)}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  const forexOnlyRows: Row[] = [
    {
      label: t("minimumTradingDays"),
      render: (ch) => <TextCell value={ch ? ch.minTradingDays : null} />,
    },
  ];

  const futuresOnlyRows: Row[] = [
    {
      label: t("maxContractSize"),
      render: (ch) =>
        ch ? (
          <span className="font-medium">
            {ch.contractSizeMini ?? 0} | {ch.contractSizeMicro ?? 0}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  const sharedMiddleRows: Row[] = [
    {
      label: t("dailyLoss"),
      render: (ch) =>
        ch ? (
          <span className="font-medium">{ch.dailyLoss}%</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: t("maxLoss"),
      render: (ch) =>
        ch ? (
          <span className="font-medium">{ch.maxLoss}%</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: t("drawdownType"),
      render: (ch) => <TextCell value={ch?.maxLostType} />,
    },
    {
      label: t("profitTarget"),
      render: (ch) =>
        ch ? (
          <span className="font-medium">
            {ch.profitTarget.map((p) => `${p}%`).join(" / ")}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];

  const futuresActivationFeeRow: Row[] = isFutures
    ? [
        {
          label: t("activationFees"),
          render: (ch) =>
            ch?.activationFees ? (
              <span className="font-medium">${ch.activationFees}</span>
            ) : (
              <span className="text-muted-foreground">-</span>
            ),
        },
      ]
    : [];

  const sharedBottomRows: Row[] = [
    {
      label: t("consistencyChallenge"),
      render: (ch) =>
        ch?.consistencyRuleChallenge ? (
          <span className="font-medium">{ch.consistencyRuleChallenge}%</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: t("consistencyFunded"),
      render: (ch) =>
        ch?.consistencyRuleFunded ? (
          <span className="font-medium">{ch.consistencyRuleFunded}%</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: t("copyTrading"),
      render: (ch) => <BooleanCell value={ch ? ch.copyTrading : null} />,
    },
    {
      label: t("newsTrading"),
      render: (ch) => <BooleanCell value={ch ? ch.newsTrading : null} />,
    },
    {
      label: t("overnightWeekends"),
      render: (ch) => <BooleanCell value={ch ? ch.overnightHolding : null} />,
    },
    {
      label: t("experts"),
      render: (ch) => <BooleanCell value={ch ? ch.EAs : null} />,
    },
    {
      label: t("profitShare"),
      render: (ch) =>
        ch ? (
          <span className="font-medium">{ch.profitSplit}%</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: t("payoutPolicy"),
      render: (ch) => (
        <TextCell
          value={
            ch
              ? isArabic
                ? ch.payoutFrequencyArabic || ch.payoutFrequency
                : ch.payoutFrequency
              : null
          }
        />
      ),
    },
    {
      label: t("restrictedCountries"),
      render: (ch) => {
        const firm = ch ? getFirm(ch.firmId) : null;
        const matched = (firm?.restrictedCountries || [])
          .map((name) => countries.find((c) => c.country === name))
          .filter(Boolean);
        return matched.length ? (
          <div className="flex flex-wrap items-center justify-center gap-1">
            {matched.map((item) => (
              <div
                key={item!.country}
                title={item!.country}
                className="w-5 h-3.5 relative overflow-hidden shrink-0 cursor-pointer rounded-[2px]"
              >
                {item!.flag && (
                  <Image
                    src={item!.flag}
                    alt={item!.country}
                    width={20}
                    height={14}
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
  ];

  const rows: Row[] = [
    ...commonRows,
    ...(isFutures ? futuresOnlyRows : forexOnlyRows),
    ...sharedMiddleRows,
    ...futuresActivationFeeRow,
    ...sharedBottomRows,
  ];

  return (
    <div
      className="container mx-auto py-10 px-4 space-y-8 min-h-[calc(100vh-200px)]"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Comparison Table */}
      <Table containerClassName="overflow-visible" className="table-fixed">
          <colgroup>
            <col className="w-[180px]" />
            {columns.map((_, idx) => (
              <col key={idx} style={{ width: `${(100 - 20) / columns.length}%` }} />
            ))}
          </colgroup>
          <TableHeader>
            {/* Selector Row */}
            <TableRow className="border-b-0! hover:bg-transparent!">
              <TableHead className="after:hidden" />
              {columns.map((col, idx) => {
                const cnStepsOptions = col.firmId
                  ? getChallengeNameStepsOptions(col.firmId)
                  : [];
                const accountSizeOptions = col.challengeNameSteps
                  ? getAccountSizeOptions(col.firmId, col.challengeNameSteps)
                  : [];

                return (
                  <TableHead key={idx} className="py-3 align-top after:hidden">
                    <div className="p-4 space-y-3">
                      {/* Firm dropdown */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Building2 className="size-3.5" />
                          {t("selectFirm")}
                        </label>
                        <Select
                          value={col.firmId || undefined}
                          onValueChange={(val) => updateColumn(idx, "firmId", val)}
                        >
                          <SelectTrigger withoutLinearBorder className="w-full">
                            <SelectValue placeholder={t("chooseFirm")} />
                          </SelectTrigger>
                          <SelectContent>
                            {firmsLoading ? (
                              <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                <span className="text-sm">{t("loading")}</span>
                              </div>
                            ) : firms.length === 0 ? (
                              <div className="py-4 text-center text-sm text-muted-foreground">
                                {t("noData")}
                              </div>
                            ) : (
                              firms.map((firm) => (
                                <SelectItem key={firm.id} value={firm.id}>
                                  <div className="flex items-center gap-2">
                                    {firm.logoUrl && (
                                      <img
                                        src={firm.logoUrl}
                                        alt={firm.title}
                                        className="size-5 rounded object-contain"
                                      />
                                    )}
                                    {firm.title}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Challenge Name + Steps dropdown */}
                      {col.firmId && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <Trophy className="size-3.5" />
                            {t("selectChallengeName")}
                          </label>
                          <Select
                            value={col.challengeNameSteps || undefined}
                            onValueChange={(val) =>
                              updateColumn(idx, "challengeNameSteps", val)
                            }
                          >
                            <SelectTrigger withoutLinearBorder className="w-full">
                              <SelectValue placeholder={t("chooseChallengeName")} />
                            </SelectTrigger>
                            <SelectContent>
                              {challengesLoading ? (
                                <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                                  <Loader2 className="size-4 animate-spin" />
                                  <span className="text-sm">{t("loading")}</span>
                                </div>
                              ) : cnStepsOptions.length === 0 ? (
                                <div className="py-4 text-center text-sm text-muted-foreground">
                                  {t("noData")}
                                </div>
                              ) : (
                                cnStepsOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Account Size dropdown */}
                      {col.challengeNameSteps && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            <DollarSign className="size-3.5" />
                            {t("accountSize")}
                          </label>
                          <Select
                            value={col.accountSize || undefined}
                            onValueChange={(val) =>
                              updateColumn(idx, "accountSize", val)
                            }
                          >
                            <SelectTrigger withoutLinearBorder className="w-full">
                              <SelectValue placeholder={t("chooseAccountSize")} />
                            </SelectTrigger>
                            <SelectContent>
                              {challengesLoading ? (
                                <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                                  <Loader2 className="size-4 animate-spin" />
                                  <span className="text-sm">{t("loading")}</span>
                                </div>
                              ) : accountSizeOptions.length === 0 ? (
                                <div className="py-4 text-center text-sm text-muted-foreground">
                                  {t("noData")}
                                </div>
                              ) : (
                                accountSizeOptions.map((size) => (
                                  <SelectItem key={size} value={String(size)}>
                                    ${formatK(size)}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
            {/* Banner Row (only when selections made) */}
            {hasAnySelection && <TableRow className="border-b-0! hover:bg-transparent!">
              <TableHead className="after:hidden" />
              {columns.map((col, idx) => {
                const firm = col.firmId ? getFirm(col.firmId) : undefined;
                const ch = getSelectedChallenge(col);
                const offer = firm?.offers?.[0];
                const isCopied = copiedFirmId === firm?.id;

                return (
                  <TableHead key={idx} className="py-3 align-top after:hidden">
                    {firm && ch ? (
                      <div className="led-border rounded-2xl grid grid-cols-[1fr_1.2fr_1fr] gap-0 items-stretch min-h-[120px]">
                        {/* Col 1: Logo */}
                        <div className="flex items-center justify-center p-3 border-r border-border/20 overflow-hidden rounded-s-2xl">
                          {firm.logoUrl && (
                            <img
                              src={firm.logoUrl}
                              alt={firm.title}
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>

                        {/* Col 2: Name + Challenge Info */}
                        <div className="flex flex-col justify-center gap-2 min-w-0 py-4 px-4 border-r border-border/20 items-start text-start">
                          <h3 className="text-xl font-bold text-foreground truncate leading-tight">
                            {firm.title}
                          </h3>
                          <div className="space-y-1">
                            <div className="text-sm text-primary font-semibold leading-tight truncate">
                              {isArabic
                                ? ch.challengeNameRel?.nameArabic ||
                                  ch.challengeNameRel?.name ||
                                  ""
                                : ch.challengeNameRel?.name || ""}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {STEPS_LABEL[ch.steps] || ch.steps}
                              {" · "}
                              <span className="text-foreground font-semibold">${formatK(ch.accountSize)}</span>
                            </div>
                          </div>
                          {firm.affiliateLink && (
                            <a
                              href={firm.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/visit inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_12px_rgba(var(--primary-rgb,34,197,94),0.3)] hover:scale-[1.03] active:scale-[0.97] w-fit"
                            >
                              {t("visitFirm")}
                              <ArrowUpRight className="size-3.5 shrink-0 transition-transform duration-200 group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5 rtl:-scale-x-100" />
                            </a>
                          )}
                        </div>

                        {/* Col 3: Coupon + Discount */}
                        <div className="flex flex-col gap-0 items-stretch h-full overflow-hidden rounded-e-2xl">
                          {offer?.code && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyCode(offer.code, firm.id)
                              }
                              className="flex-1 flex items-center justify-center gap-2 px-3 border-b border-border/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
                            >
                              <span className="text-base font-bold uppercase tracking-wider text-primary">
                                {offer.code}
                              </span>
                              {isCopied ? (
                                <CheckCheck className="size-3.5 text-green-500" />
                              ) : (
                                <Copy className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                              )}
                            </button>
                          )}

                          {offer &&
                            (offer.offerPercentage > 0 ||
                              offer.discountType === "TEXT") && (
                              <div className="flex-1 flex flex-col items-center justify-center gap-1 px-3 bg-gradient-to-b from-primary/90 to-primary/60">
                                <span className="text-[11px] font-medium text-primary-foreground/80">
                                  🎉 {isArabic ? "كود الخصم:" : "Discount Code:"}
                                </span>
                                <span className="text-lg font-extrabold text-primary-foreground tabular-nums leading-none">
                                  {offer.discountType === "TEXT"
                                    ? isArabic
                                      ? offer.discountTextArabic ||
                                        offer.discountText
                                      : offer.discountText
                                    : `${offer.offerPercentage}%`}
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/30 p-8 flex items-center justify-center">
                        <span className="text-muted-foreground/40 text-xs italic">
                          {t("chooseChallengeName")}
                        </span>
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>}
          </TableHeader>
          {hasAnySelection && <TableBody colSpan={columns.length + 1}>
            {rows.map((row, rIdx) => (
              <TableRow key={rIdx}>
                <TableCell className="text-sm font-medium text-muted-foreground whitespace-normal">
                  {row.label}
                </TableCell>
                {columns.map((col, cIdx) => (
                  <TableCell key={cIdx} center className="whitespace-normal">
                    {row.render(getSelectedChallenge(col))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>}
        </Table>

        {!hasAnySelection && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <ArrowLeftRight className="size-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{t("emptyTitle")}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {t("emptyDescription")}
            </p>
          </div>
        )}
    </div>
  );
}
