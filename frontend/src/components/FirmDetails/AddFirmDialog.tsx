"use client";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FirmTypeEnum, StepsEnum } from "@/schema/firms.schema";
import { FieldValues } from "react-hook-form";
import CustomForm from "../Forms/CustomForm";
import { countries } from "@/data";
import { useState } from "react";
import useIsFutures from "@/hooks/useIsFutures";
import { useCreateFirmMutation } from "@/redux/api/firms.api";
import { toast } from "sonner";

import FirmForm from "./FirmForm";
import { X } from "lucide-react";

export const defaultValues = {
  hidden: false,
  logoUrl: "",
  firmType: FirmTypeEnum.FOREX,
  title: "",
  dateEstablished: undefined,
  ceo: "",
  isPopular: "false",
  affiliateLink: "",
  maxAllocation: 0,
  country: "",
  leverage: "",
  leverageArabic: "",
  commission: "",
  commissionArabic: "",
  accountSizes: "",
  accountSizesArabic: "",
  dailyMaxLoss: "",
  dailyMaxLossArabic: "",
  scaleupPlans: "",
  scaleupPlansArabic: "",
  minimumTradingDays: "",
  minimumTradingDaysArabic: "",

  brokers: [],
  platforms: [],
  paymentMethods: [],
  payoutMethods: [],
  restrictedCountries: [],
  restrictedCountriesNote: "",
  restrictedCountriesNoteArabic: "",
  typeOfInstruments: [],
  drawDowns: [],
  drawDownTexts: [],
  drawDownProgramTypeMap: {} as Record<string, string[]>,
  otherFeatures: [],
  challengeNames: [] as Array<{id?: string; name: string; nameArabic: string; discountPercentage: number; cnMaxAllocation: number | string; cnConsistencyRules: number | string; cnNewsTrading: boolean; cnOvernightWeekends: boolean; cnCopyTrading: boolean; cnExperts: boolean; cnMinimumTradingDays: string; cnMinimumTradingDaysArabic: string}>,
  programTypes: [StepsEnum.STEP1],

  allocationRules: "",
  newsTradingAllowedRules: "",
  newsTradingNotAllowedRules: "",
  overnightAndWeekendsHolding: "",
  copyTradingAllowedRules: "",
  copyTradingNotAllowedRules: "",
  expertsAllowedRules: "",
  expertsNotAllowedRules: "",
  riskManagement: "",
  vpnVps: "",
  profitShare: "",
  inactivityRules: "",
  prohibitedStrategies: "",

  payoutPolicyArabic: "",
  consistencyRulesArabic: "",
  allocationRulesArabic: "",
  newsTradingAllowedRulesArabic: "",
  newsTradingNotAllowedRulesArabic: "",
  overnightAndWeekendsHoldingArabic: "",
  copyTradingAllowedRulesArabic: "",
  copyTradingNotAllowedRulesArabic: "",
  expertsAllowedRulesArabic: "",
  expertsNotAllowedRulesArabic: "",
  riskManagementArabic: "",
  vpnVpsArabic: "",
  profitShareArabic: "",
  inactivityRulesArabic: "",
  prohibitedStrategiesArabic: "",

  // Mobile font size per section (one per bilingual pair)
  leverageMobileFontSize: undefined as number | undefined,
  commissionMobileFontSize: undefined as number | undefined,
  accountSizesMobileFontSize: undefined as number | undefined,
  allocationRulesMobileFontSize: undefined as number | undefined,
  dailyMaxLossMobileFontSize: undefined as number | undefined,
  riskManagementMobileFontSize: undefined as number | undefined,
  consistencyRulesMobileFontSize: undefined as number | undefined,
  minimumTradingDaysMobileFontSize: undefined as number | undefined,
  newsTradingAllowedRulesMobileFontSize: undefined as number | undefined,
  newsTradingNotAllowedRulesMobileFontSize: undefined as number | undefined,
  overnightAndWeekendsHoldingMobileFontSize: undefined as number | undefined,
  copyTradingAllowedRulesMobileFontSize: undefined as number | undefined,
  copyTradingNotAllowedRulesMobileFontSize: undefined as number | undefined,
  expertsAllowedRulesMobileFontSize: undefined as number | undefined,
  expertsNotAllowedRulesMobileFontSize: undefined as number | undefined,
  vpnVpsMobileFontSize: undefined as number | undefined,
  profitShareMobileFontSize: undefined as number | undefined,
  payoutPolicyMobileFontSize: undefined as number | undefined,
  scaleupPlansMobileFontSize: undefined as number | undefined,
  inactivityRulesMobileFontSize: undefined as number | undefined,
  prohibitedStrategiesMobileFontSize: undefined as number | undefined,
  restrictedCountriesNoteMobileFontSize: undefined as number | undefined,
};

export const AddFirmDialog = () => {
  const t = useTranslations("FirmManagement");
  const [open, setOpen] = useState(false);
  const [createFirm, { isLoading }] = useCreateFirmMutation();
  const isFutures = useIsFutures();
  const handleSubmit = async (data: FieldValues) => {
    const formData = {
      firmType: isFutures ? "FUTURES" : "FOREX",
      title: data.title,
      dateEstablished: new Date(data.dateEstablished),
      ceo: data.ceo,
      hidden: data.hidden === true || data.hidden === "true",
      brokers: data.brokers,
      platforms: data.platforms,
      paymentMethods: data.paymentMethods,
      payoutMethods: data.payoutMethods,
      restrictedCountries: data.restrictedCountries,
      restrictedCountriesNote: data.restrictedCountriesNote || "",
      restrictedCountriesNoteArabic: data.restrictedCountriesNoteArabic || "",
      countries: countries
        .filter((c) => !data.restrictedCountries.includes(c.country))
        .map((item) => item.country),
      typeOfInstruments: data.typeOfInstruments,
      drawDowns: data.drawDowns,
      drawDownTexts: data.drawDownTexts,
      drawDownProgramTypeMap: data.drawDownProgramTypeMap || {},
      otherFeatures: data.otherFeatures,
      challengeNames: (data.challengeNames || []).map((cn: any) => ({
        ...cn,
        cnMaxAllocation: Number(cn.cnMaxAllocation) || 0,
        cnConsistencyRules: Number(cn.cnConsistencyRules) || 0,
      })),
      programTypes: data.programTypes,
      affiliateLink: data.affiliateLink,
      maxAllocation: Number(data.maxAllocation),
      payoutPolicy: data.payoutPolicy,
      consistencyRules: data.consistencyRules,
      country: data.country,
      isPopular: data.isPopular === "true",
      leverage: data.leverage,
      leverageArabic: data.leverageArabic,
      commission: data.commission,
      commissionArabic: data.commissionArabic,
      accountSizes: data.accountSizes,
      accountSizesArabic: data.accountSizesArabic,
      dailyMaxLoss: data.dailyMaxLoss,
      dailyMaxLossArabic: data.dailyMaxLossArabic,
      scaleupPlans: data.scaleupPlans,
      scaleupPlansArabic: data.scaleupPlansArabic,
      minimumTradingDays: data.minimumTradingDays,
      minimumTradingDaysArabic: data.minimumTradingDaysArabic,
      allocationRules: data.allocationRules,
      newsTradingAllowedRules: data.newsTradingAllowedRules,
      newsTradingNotAllowedRules: data.newsTradingNotAllowedRules,
      overnightAndWeekendsHolding: data.overnightAndWeekendsHolding,
      copyTradingAllowedRules: data.copyTradingAllowedRules,
      copyTradingNotAllowedRules: data.copyTradingNotAllowedRules,
      expertsAllowedRules: data.expertsAllowedRules,
      expertsNotAllowedRules: data.expertsNotAllowedRules,
      riskManagement: data.riskManagement || "",
      vpnVps: data.vpnVps,
      profitShare: data.profitShare || "",
      inactivityRules: data.inactivityRules,
      prohibitedStrategies: data.prohibitedStrategies,

      payoutPolicyArabic: data.payoutPolicyArabic,
      consistencyRulesArabic: data.consistencyRulesArabic,
      allocationRulesArabic: data.allocationRulesArabic,
      newsTradingAllowedRulesArabic: data.newsTradingAllowedRulesArabic,
      newsTradingNotAllowedRulesArabic: data.newsTradingNotAllowedRulesArabic,
      overnightAndWeekendsHoldingArabic: data.overnightAndWeekendsHoldingArabic,
      copyTradingAllowedRulesArabic: data.copyTradingAllowedRulesArabic,
      copyTradingNotAllowedRulesArabic: data.copyTradingNotAllowedRulesArabic,
      expertsAllowedRulesArabic: data.expertsAllowedRulesArabic,
      expertsNotAllowedRulesArabic: data.expertsNotAllowedRulesArabic,
      riskManagementArabic: data.riskManagementArabic,
      vpnVpsArabic: data.vpnVpsArabic,
      profitShareArabic: data.profitShareArabic,
      inactivityRulesArabic: data.inactivityRulesArabic,
      prohibitedStrategiesArabic: data.prohibitedStrategiesArabic,
      ...(data.leverageMobileFontSize && { leverageMobileFontSize: Number(data.leverageMobileFontSize) }),
      ...(data.commissionMobileFontSize && { commissionMobileFontSize: Number(data.commissionMobileFontSize) }),
      ...(data.accountSizesMobileFontSize && { accountSizesMobileFontSize: Number(data.accountSizesMobileFontSize) }),
      ...(data.allocationRulesMobileFontSize && { allocationRulesMobileFontSize: Number(data.allocationRulesMobileFontSize) }),
      ...(data.dailyMaxLossMobileFontSize && { dailyMaxLossMobileFontSize: Number(data.dailyMaxLossMobileFontSize) }),
      ...(data.riskManagementMobileFontSize && { riskManagementMobileFontSize: Number(data.riskManagementMobileFontSize) }),
      ...(data.consistencyRulesMobileFontSize && { consistencyRulesMobileFontSize: Number(data.consistencyRulesMobileFontSize) }),
      ...(data.minimumTradingDaysMobileFontSize && { minimumTradingDaysMobileFontSize: Number(data.minimumTradingDaysMobileFontSize) }),
      ...(data.newsTradingAllowedRulesMobileFontSize && { newsTradingAllowedRulesMobileFontSize: Number(data.newsTradingAllowedRulesMobileFontSize) }),
      ...(data.newsTradingNotAllowedRulesMobileFontSize && { newsTradingNotAllowedRulesMobileFontSize: Number(data.newsTradingNotAllowedRulesMobileFontSize) }),
      ...(data.overnightAndWeekendsHoldingMobileFontSize && { overnightAndWeekendsHoldingMobileFontSize: Number(data.overnightAndWeekendsHoldingMobileFontSize) }),
      ...(data.copyTradingAllowedRulesMobileFontSize && { copyTradingAllowedRulesMobileFontSize: Number(data.copyTradingAllowedRulesMobileFontSize) }),
      ...(data.copyTradingNotAllowedRulesMobileFontSize && { copyTradingNotAllowedRulesMobileFontSize: Number(data.copyTradingNotAllowedRulesMobileFontSize) }),
      ...(data.expertsAllowedRulesMobileFontSize && { expertsAllowedRulesMobileFontSize: Number(data.expertsAllowedRulesMobileFontSize) }),
      ...(data.expertsNotAllowedRulesMobileFontSize && { expertsNotAllowedRulesMobileFontSize: Number(data.expertsNotAllowedRulesMobileFontSize) }),
      ...(data.vpnVpsMobileFontSize && { vpnVpsMobileFontSize: Number(data.vpnVpsMobileFontSize) }),
      ...(data.profitShareMobileFontSize && { profitShareMobileFontSize: Number(data.profitShareMobileFontSize) }),
      ...(data.payoutPolicyMobileFontSize && { payoutPolicyMobileFontSize: Number(data.payoutPolicyMobileFontSize) }),
      ...(data.scaleupPlansMobileFontSize && { scaleupPlansMobileFontSize: Number(data.scaleupPlansMobileFontSize) }),
      ...(data.inactivityRulesMobileFontSize && { inactivityRulesMobileFontSize: Number(data.inactivityRulesMobileFontSize) }),
      ...(data.prohibitedStrategiesMobileFontSize && { prohibitedStrategiesMobileFontSize: Number(data.prohibitedStrategiesMobileFontSize) }),
      ...(data.restrictedCountriesNoteMobileFontSize && { restrictedCountriesNoteMobileFontSize: Number(data.restrictedCountriesNoteMobileFontSize) }),
    };

    const sendingData = new FormData();
    sendingData.append("data", JSON.stringify(formData));
    sendingData.append("logo", data.logoUrl);
    const toastId = toast.loading("Creating firm...");
    try {
      await createFirm(sendingData).unwrap();
      setOpen(false);
      toast.success("Firm created successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to create firm", { id: toastId });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>{t("addFirm")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-full md:container! h-[85vh] overflow-y-auto pt-0">
        <div className="flex justify-between items-center sticky top-0 right-0 bg-background z-50 py-4">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("addNewFirm")}</AlertDialogTitle>
          </AlertDialogHeader>
          <Button
            size={"icon"}
            variant={"outline2"}
            onClick={() => setOpen(false)}
            className=""
          >
            <X />
          </Button>
        </div>
        <CustomForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          className="space-y-6 py-4"
        >
          <FirmForm
            open={open}
          />
          <Button disabled={isLoading} type="submit" className="w-full h-11">
            {isLoading ? t("creatingFirm") : t("createFirm")}
          </Button>
        </CustomForm>
      </AlertDialogContent>
    </AlertDialog>
  );
};
