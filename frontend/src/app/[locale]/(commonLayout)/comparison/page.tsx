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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftRight,
  Check,
  Plus,
  X,
  Ban,
  Building2,
  Trophy,
  DollarSign,
} from "lucide-react";

type FirmData = {
  id: string;
  title: string;
  logoUrl: string;
  firmType: string;
  restrictedCountries: string[];
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

  const { data: firmsData } = useGetAllFirmsQuery([
    { name: "limit", value: 1000 },
  ]);
  const { data: challengesData } = useGetAllChallengesQuery([
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

  const addColumn = () => {
    if (columns.length < 4) {
      setColumns([
        ...columns,
        { firmId: "", challengeNameSteps: "", accountSize: "" },
      ]);
    }
  };

  const removeColumn = (idx: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== idx));
    }
  };

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
      {/* Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col, idx) => {
          const selectedFirm = col.firmId ? getFirm(col.firmId) : undefined;
          const cnStepsOptions = col.firmId
            ? getChallengeNameStepsOptions(col.firmId)
            : [];
          const accountSizeOptions = col.challengeNameSteps
            ? getAccountSizeOptions(col.firmId, col.challengeNameSteps)
            : [];

          return (
            <Card
              key={idx}
              className={`relative transition-all duration-300 border-primary/30 ${
                col.accountSize
                  ? "shadow-md shadow-primary/10"
                  : "border-dashed"
              }`}
            >
              {columns.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColumn(idx)}
                  className="absolute top-3 ltr:right-3 rtl:left-3 z-10 p-1 rounded-full text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              )}

              <CardHeader className="pb-0">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  {t("selectFirm")}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* 1. Firm dropdown */}
                <Select
                  value={col.firmId || undefined}
                  onValueChange={(val) => updateColumn(idx, "firmId", val)}
                >
                  <SelectTrigger withoutLinearBorder className="w-full">
                    <SelectValue placeholder={t("chooseFirm")} />
                  </SelectTrigger>
                  <SelectContent>
                    {firms.map((firm) => (
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
                    ))}
                  </SelectContent>
                </Select>

                {/* Show selected firm logo */}
                {selectedFirm?.logoUrl && (
                  <div className="flex items-center gap-2 px-1">
                    <img
                      src={selectedFirm.logoUrl}
                      alt={selectedFirm.title}
                      className="size-8 rounded-md object-contain"
                    />
                    <span className="text-sm font-medium truncate">
                      {selectedFirm.title}
                    </span>
                  </div>
                )}

                {/* 2. Challenge Name + Steps dropdown (visible only after firm selected) */}
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
                        <SelectValue
                          placeholder={t("chooseChallengeName")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cnStepsOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 3. Account Size dropdown (visible only after challenge name + steps selected) */}
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
                        {accountSizeOptions.map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            ${formatK(size)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {columns.length < 4 && (
          <button
            type="button"
            onClick={addColumn}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/20 py-10 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
          >
            <Plus className="size-6" />
            <span className="text-sm font-medium">{t("addColumn")}</span>
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {hasAnySelection ? (
        <Card className="overflow-hidden border-primary/30">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary/5">
                    <th className="ltr:text-left rtl:text-right p-4 text-sm font-semibold text-muted-foreground min-w-[180px] border-b border-primary/10">
                      {t("field")}
                    </th>
                    {columns.map((col, idx) => {
                      const firm = col.firmId
                        ? getFirm(col.firmId)
                        : undefined;
                      const ch = getSelectedChallenge(col);
                      return (
                        <th
                          key={idx}
                          className="text-center p-4 text-sm min-w-[180px] border-b border-primary/10"
                        >
                          {firm && ch ? (
                            <div className="flex flex-col items-center gap-2">
                              {firm.logoUrl && (
                                <img
                                  src={firm.logoUrl}
                                  alt={firm.title}
                                  className="size-10 rounded-lg object-contain"
                                />
                              )}
                              <div className="space-y-0.5">
                                <div className="font-bold text-foreground">
                                  {firm.title}
                                </div>
                                <div className="text-xs text-primary font-medium">
                                  {isArabic
                                    ? ch.challengeNameRel?.nameArabic ||
                                      ch.challengeNameRel?.name ||
                                      ""
                                    : ch.challengeNameRel?.name || ""}{" "}
                                  ({STEPS_LABEL[ch.steps] || ch.steps})
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  ${formatK(ch.accountSize)}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground/40 text-xs italic">
                              {t("chooseChallengeName")}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-sm font-medium text-muted-foreground">
                        {row.label}
                      </td>
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className="p-4 text-center">
                          {row.render(getSelectedChallenge(col))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
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
