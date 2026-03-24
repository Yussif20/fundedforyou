"use client";

import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useCurrentToken } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

type ChallengeNameRecord = {
  id: string;
  name: string;
  nameArabic: string;
  discountPercentage: number;
  order: number;
  cnMaxAllocation: number;
  cnNewsTrading: boolean;
  cnOvernightWeekends: boolean;
  cnCopyTrading: boolean;
  cnExperts: boolean;
  cnMinimumTradingDays: string;
  cnMinimumTradingDaysArabic: string;
};

type FirmData = {
  id: string;
  title: string;
  logoUrl: string;
  challengeNameRecords: ChallengeNameRecord[];
};

type ComparisonColumn = {
  firmId: string;
  challengeNameId: string;
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

  const { data: firmsData } = useGetAllFirmsQuery([
    { name: "limit", value: 1000 },
  ]);

  const firms: FirmData[] = (firmsData as any)?.firms || [];

  const [columns, setColumns] = useState<ComparisonColumn[]>([
    { firmId: "", challengeNameId: "" },
    { firmId: "", challengeNameId: "" },
  ]);

  const addColumn = () => {
    if (columns.length < 4) {
      setColumns([...columns, { firmId: "", challengeNameId: "" }]);
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
      updated[idx].challengeNameId = "";
    }
    setColumns(updated);
  };

  const getSelectedCN = (col: ComparisonColumn): ChallengeNameRecord | null => {
    if (!col.firmId || !col.challengeNameId) return null;
    const firm = firms.find((f) => f.id === col.firmId);
    if (!firm) return null;
    return (
      firm.challengeNameRecords.find((cn) => cn.id === col.challengeNameId) ||
      null
    );
  };

  const getFirmCNs = (firmId: string): ChallengeNameRecord[] => {
    const firm = firms.find((f) => f.id === firmId);
    return firm?.challengeNameRecords || [];
  };

  const getFirm = (firmId: string): FirmData | undefined => {
    return firms.find((f) => f.id === firmId);
  };

  if (meLoading) return null;
  if (userRole !== "SUPER_ADMIN" && userRole !== "MODERATOR") return null;

  const hasAnySelection = columns.some((c) => c.challengeNameId);

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

  const rows: {
    label: string;
    render: (cn: ChallengeNameRecord | null) => React.ReactNode;
  }[] = [
    {
      label: t("maxAllocation"),
      render: (cn) =>
        cn ? (
          <span className="font-semibold text-base">
            {formatK(cn.cnMaxAllocation)}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      label: t("newsTrading"),
      render: (cn) => <BooleanCell value={cn ? cn.cnNewsTrading : null} />,
    },
    {
      label: t("overnightWeekends"),
      render: (cn) => (
        <BooleanCell value={cn ? cn.cnOvernightWeekends : null} />
      ),
    },
    {
      label: t("copyTrading"),
      render: (cn) => <BooleanCell value={cn ? cn.cnCopyTrading : null} />,
    },
    {
      label: t("experts"),
      render: (cn) => <BooleanCell value={cn ? cn.cnExperts : null} />,
    },
    {
      label: t("minimumTradingDays"),
      render: (cn) =>
        cn ? (
          <span className="font-medium">
            {isArabic
              ? cn.cnMinimumTradingDaysArabic || cn.cnMinimumTradingDays || "-"
              : cn.cnMinimumTradingDays || "-"}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
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
          return (
            <Card
              key={idx}
              className={`relative transition-all duration-300 border-primary/30 ${
                col.challengeNameId
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

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Trophy className="size-3.5" />
                    {t("selectChallengeName")}
                  </label>
                  <Select
                    value={col.challengeNameId || undefined}
                    onValueChange={(val) =>
                      updateColumn(idx, "challengeNameId", val)
                    }
                    disabled={!col.firmId}
                  >
                    <SelectTrigger withoutLinearBorder className="w-full">
                      <SelectValue placeholder={t("chooseChallengeName")} />
                    </SelectTrigger>
                    <SelectContent>
                      {getFirmCNs(col.firmId).map((cn) => (
                        <SelectItem key={cn.id} value={cn.id}>
                          {isArabic ? cn.nameArabic || cn.name : cn.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
                      const cn = getSelectedCN(col);
                      return (
                        <th
                          key={idx}
                          className="text-center p-4 text-sm min-w-[180px] border-b border-primary/10"
                        >
                          {firm && cn ? (
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
                                    ? cn.nameArabic || cn.name
                                    : cn.name}
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
                          {row.render(getSelectedCN(col))}
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
