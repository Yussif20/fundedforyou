import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import TTTextEditor from "../Forms/TTTextEditor";
import { DrawDownText } from "@/types/firm.types";
import { Badge } from "../ui/badge";
const drawDowns = {
  balanceBased: "Balance Based",
  equityBased: "Equity Based",
  trailingEod: "Trailing EOD",
  trailingIntraday: "Trailing Intraday",
  smartDd: "Smart DD",
} as const;
type DrawDownKey = keyof typeof drawDowns;
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateDate } from "@/utils/updateDate";

const programTypeLabels: Record<string, string> = {
  STEP1: "1 Step",
  STEP2: "2 Step",
  STEP3: "3 Step",
  STEP4: "4 Step",
  INSTANT: "Instant",
};

export function MonthAndYear() {
  const t = useTranslations("FirmManagement");
  const { control } = useFormContext();

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2000 + 1 },
    (_, i) => currentYear - i,
  ).map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));
  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];
  return (
    <>
      <Controller
        name="dateEstablished"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => {
          const dateEstablished = field.value as string | null;
          const year = dateEstablished?.split("-")[0] || "";
          return (
            <div className="space-y-4">
              <Label>{t("year")}</Label>
              <Select
                value={year}
                onValueChange={(value) =>
                  field.onChange(
                    updateDate({
                      date: dateEstablished || undefined,
                      year: value,
                    }),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectYear")} />
                </SelectTrigger>
                <SelectContent>
                  {years.map((opt) => (
                    <SelectItem key={opt.label} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }}
      />
      <Controller
        name="dateEstablished"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => {
          const dateEstablished = field.value as string | null;
          return (
            <div className="space-y-4">
              <Label>{t("month")}</Label>
              <Select
                value={dateEstablished?.split("-")[1] || ""}
                onValueChange={(value) =>
                  field.onChange(
                    updateDate({
                      date: dateEstablished || undefined,
                      month: value,
                    }),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("selectMonth")} />
                </SelectTrigger>
                <SelectContent>
                  {months.map((opt) => (
                    <SelectItem key={opt.label} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }}
      />
    </>
  );
}

export function DrawDownProgramTypes() {
  const { control, watch } = useFormContext();
  const selectedDrawDowns: string[] = watch("drawDowns") || [];
  const selectedProgramTypes: string[] = watch("programTypes") || [];

  if (selectedDrawDowns.length === 0 || selectedProgramTypes.length === 0) {
    return null;
  }

  return (
    <Controller
      name="drawDownProgramTypeMap"
      control={control}
      render={({ field }) => {
        const map = (field.value || {}) as Record<string, string[]>;
        const toggleProgramType = (dd: string, pt: string) => {
          const current = map[dd] || [];
          const updated = current.includes(pt)
            ? current.filter((v) => v !== pt)
            : [...current, pt];
          field.onChange({ ...map, [dd]: updated });
        };
        return (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              Drawdown Program Types
            </Label>
            <div className="space-y-2">
              {selectedDrawDowns.map((dd) => (
                <div
                  key={dd}
                  className="flex flex-wrap items-center gap-2 p-2 rounded-md border bg-foreground/5"
                >
                  <span className="text-sm font-medium min-w-[140px]">
                    {drawDowns[dd as DrawDownKey] || dd}:
                  </span>
                  {selectedProgramTypes.map((pt) => (
                    <Badge
                      key={pt}
                      className="cursor-pointer"
                      variant={
                        (map[dd] || []).includes(pt)
                          ? "defaultBH"
                          : "outline"
                      }
                      onClick={() => toggleProgramType(dd, pt)}
                    >
                      {programTypeLabels[pt] || pt}
                    </Badge>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}

export function DrawDownTexts() {
  const tSidebar = useTranslations("FOSidebar");
  const { control } = useFormContext();

  return (
    <Controller
      name="drawDownTexts"
      control={control}
      rules={{ required: "This field is required" }}
      render={({ field }) => {
        const drawDownTexts = field.value as DrawDownText[];
        const handleChangeValue = (
          index: number,
          key: keyof DrawDownText,
          newValue: string,
        ) => {
          const newDrawDownTexts = [...drawDownTexts];
          newDrawDownTexts[index] = {
            ...newDrawDownTexts[index],
            [key]: newValue,
          };
          field.onChange(newDrawDownTexts);
        };
        return (
          <div className="space-y-4">
            <Label>{tSidebar("items.drawdownTexts")}</Label>
            <div className="space-y-4">
              {drawDownTexts.map((drawDownText, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-sm font-semibold border-b pb-2">
                    {drawDowns[drawDownText.drawdown as DrawDownKey]}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>English Text</Label>
                      <TTTextEditor
                        value={drawDownText.englishText}
                        onChange={(value: string) =>
                          handleChangeValue(index, "englishText", value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Arabic Text</Label>
                      <TTTextEditor
                        value={drawDownText.arabicText}
                        onChange={(value: string) =>
                          handleChangeValue(index, "arabicText", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
