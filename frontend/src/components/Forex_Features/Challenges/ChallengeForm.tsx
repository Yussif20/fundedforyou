"use client";
import CustomComboBoxMultiple from "@/components/Forms/CustomComboBoxMultiple";
import CustomInput from "@/components/Forms/CustomInput";
import CustomSelect from "@/components/Forms/CustomSelect";
import CustomYesNoToggle from "@/components/Forms/CustomYesNoToggle";
import { useGetFirmsQuery } from "@/redux/api/spreadApi";
import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import useIsFutures from "@/hooks/useIsFutures";

export default function ChallengeForm({ methods }: { methods: any }) {
  const { data: getAllFirms, isLoading } = useGetFirmsQuery({ limit: 500 });
  const t = useTranslations("CHALLENGEMANAGEMENT");
  const isFutures = useIsFutures();
  const [profitInput, setProfitInput] = useState<string>("");
  const { watch, setValue, getValues } = methods;
  const firmId = watch("firmId");

  const challengeNameOptions = useMemo(() => {
    const firm = (getAllFirms?.data || []).find((f: any) => f.id === firmId);
    return (firm?.challengeNameRecords || firm?.challengeNames || []).map((cn: any) => ({
      label: typeof cn === "string" ? cn : cn.name,
      value: typeof cn === "string" ? cn : cn.id,
    }));
  }, [firmId, getAllFirms?.data]);
  const handleProfitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && profitInput.trim() !== "") {
      const currentTargets = getValues("profitTarget") || [];
      const numValue = Number(profitInput);
      if (!isNaN(numValue)) {
        setValue("profitTarget", [...currentTargets, numValue]);
        setProfitInput("");
      }
      e.preventDefault();
    }
  };
  return (
    <>
      <div className="col-span-full">
        <CustomYesNoToggle name="hidden" label="Hidden" />
      </div>
      <CustomComboBoxMultiple
        name="firmId"
        mode="single"
        isLoading={isLoading}
        label={t("firmLogo")}
        placeholder={t("selectFirm")}
        options={(getAllFirms?.data || [])?.map((firm: any) => ({
          value: firm.id,
          image: firm.logoUrl,
          name: firm.title,
        }))}
        required
      />

      <CustomInput
        label={t("title")}
        type="text"
        name="title"
        placeholder={t("titlePlaceholder")}
      />
      <div className="col-span-full">
        <CustomInput
          label={t("affiliateLink")}
          type="text"
          name="affiliateLink"
          placeholder={t("affiliateLinkPlaceholder")}
        />
      </div>

      {/* Profit Target */}
      <div className="col-span-full">
        <label className="block text-sm font-medium mb-1">
          {t("profitTarget")}
        </label>

        <div className="flex gap-2">
          <input
            type="number"
            value={profitInput}
            onChange={(e) => setProfitInput(e.target.value)}
            onKeyDown={handleProfitKeyDown}
            placeholder={t("profitTargetPlaceholder")}
            className="w-full border rounded-3xl border-chart-1 px-3 py-2"
          />

          <button
            type="button"
            onClick={() => {
              if (profitInput.trim() !== "") {
                const numValue = Number(profitInput);
                if (!isNaN(numValue)) {
                  const currentTargets = getValues("profitTarget") || [];
                  setValue("profitTarget", [...currentTargets, numValue]);
                  setProfitInput("");
                }
              }
            }}
            className="bg-primary1 text-foreground px-4 rounded-3xl"
          >
            {t("add")}
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {watch("profitTarget")?.map((pt: number, idx: number) => (
            <span
              key={idx}
              className="bg-primary1 text-foreground px-2 py-1 rounded flex items-center gap-1"
            >
              {pt}%
              <button
                type="button"
                onClick={() =>
                  setValue(
                    "profitTarget",
                    getValues("profitTarget").filter(
                      (_: any, i: number) => i !== idx
                    )
                  )
                }
                className="text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Challenge Name - options from selected firm */}
      <CustomSelect
        label={t("challengeName")}
        name="challengeNameId"
        options={challengeNameOptions}
      />

      <CustomInput
        label={t("accountSize")}
        name="accountSize"
        type="number"
        placeholder={t("accountSizePlaceholder")}
      />

      <CustomSelect
        label={t("steps")}
        name="steps"
        options={[
          { label: "STEP1", value: "STEP1" },
          { label: "STEP2", value: "STEP2" },
          { label: "STEP3", value: "STEP3" },
          { label: "STEP4", value: "STEP4" },
          { label: "INSTANT", value: "INSTANT" },
        ]}
      />

      <CustomInput
        label={t("dailyLoss")}
        name="dailyLoss"
        type="number"
        placeholder={t("dailyLossPlaceholder")}
      />

      <CustomInput
        label={t("maxLoss")}
        name="maxLoss"
        type="number"
        placeholder={t("maxLossPlaceholder")}
      />

      <CustomSelect
        label={t("maxLossType")}
        name="maxLostType"
        options={[
          { label: "Static Balance", value: "Static Balance" },
          { label: "Static Equiry", value: "Static Equiry" },
          { label: "Trailing EOD", value: "Trailing EOD" },
          { label: "Trailing Inraday", value: "Trailing Inraday" },
          { label: "Smart", value: "Smart" },
        ]}
      />

      <CustomInput
        label={t("profitSplit")}
        name="profitSplit"
        type="number"
        placeholder={t("profitSplitPlaceholder")}
      />

      <CustomInput
        label={t("price")}
        name="price"
        type="number"
        placeholder={t("pricePlaceholder")}
      />

      <CustomInput
        label={t("payoutFrequency")}
        name="payoutFrequency"
        type="text"
        placeholder={t("payoutFrequency")}
      />
      <CustomInput
        label={t("payoutFrequencyArabic")}
        name="payoutFrequencyArabic"
        type="text"
        placeholder={t("payoutFrequencyArabic")}
        inputDir="rtl"
      />

      <CustomInput
        label={t("minTradingDays")}
        name="minTradingDays"
        type="number"
        placeholder={t("minTradingDaysPlaceholder")}
      />

      <CustomInput
        label={t("timeLimit")}
        name="timeLimit"
        type="number"
        placeholder={t("timeLimitPlaceholder")}
      />

      {isFutures ? (
        <>
          <CustomInput
            label={t("activationFees")}
            name="activationFees"
            type="number"
            placeholder={t("activationFeesPlaceholder")}
          />
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-2">
              {t("maxContractSize")}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label={t("contractSizeMini")}
                name="contractSizeMini"
                type="number"
                placeholder={t("contractSizeMiniPlaceholder")}
              />
              <CustomInput
                label={t("contractSizeMicro")}
                name="contractSizeMicro"
                type="number"
                placeholder={t("contractSizeMicroPlaceholder")}
              />
            </div>
          </div>
        </>
      ) : (
        <CustomInput
          label={t("maxLeverage")}
          name="maxLeverage"
          type="text"
          placeholder={t("maxLeveragePlaceholder")}
        />
      )}

      <div className="col-span-full">
        <label className="block text-sm font-medium mb-2">
          {t("consistencyRule")}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            label={t("consistencyRuleChallenge")}
            name="consistencyRuleChallenge"
            type="number"
            placeholder={t("consistencyRuleChallengePlaceholder")}
          />
          <CustomInput
            label={t("consistencyRuleFunded")}
            name="consistencyRuleFunded"
            type="number"
            placeholder={t("consistencyRuleFundedPlaceholder")}
          />
        </div>
      </div>
    </>
  );
}
