"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

import { StepsEnum } from "@/schema/firms.schema";
import { FieldValues } from "react-hook-form";
import CustomForm from "../Forms/CustomForm";
import { countries } from "@/data";

import { useEffect, useState } from "react";

import { Pencil, X } from "lucide-react";
import {
  useGetSingleFirmQuery,
  useUpdateFirmMutation,
} from "@/redux/api/firms.api";
import FirmForm from "./FirmForm";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface EditFirmDialogProps {
  firmId: string;
}

export const EditFirmDialog = ({ firmId }: EditFirmDialogProps) => {
  const t = useTranslations("FirmManagement");
  const [open, setOpen] = useState(false);
  const [updateFirm, { isLoading: isUpdating }] = useUpdateFirmMutation();
  const { data: firmData, isLoading: isFetchingFirm } = useGetSingleFirmQuery(
    { id: firmId, queryParams: [{ name: "formData", value: "true" }] },
    { skip: !open },
  );

  const [defaultValues, setDefaultValues] = useState<any>(null);

  useEffect(() => {
    if (firmData?.data) {
      const firm = firmData.data;
      // Set default values
      setDefaultValues({
        hidden: firm.hidden ?? false,
        logoUrl: firm.logoUrl || "",
        title: firm.title || "",
        dateEstablished: firm.dateEstablished
          ? new Date(firm.dateEstablished).toISOString().split("T")[0]
          : undefined,
        ceo: firm.ceo || "",
        isPopular: firm.isPopular ? "true" : "false",
        affiliateLink: firm.affiliateLink || "",
        maxAllocation: firm.maxAllocation || 0,
        country: firm.country || "",
        brokers: firm.brokers?.map((b: any) => b.id || b) || [],
        platforms: firm.platforms?.map((p: any) => p.id || p) || [],
        paymentMethods:
          firm.paymentMethods?.map((pm: any) => pm.id || pm) || [],
        payoutMethods: firm.payoutMethods?.map((pm: any) => pm.id || pm) || [],
        restrictedCountries: firm.restrictedCountries || [],
        restrictedCountriesNote: firm.restrictedCountriesNote || "",
        restrictedCountriesNoteArabic: firm.restrictedCountriesNoteArabic || "",
        countries: firm.countries || [],
        typeOfInstruments: firm.typeOfInstruments || [],
        drawDowns: firm.drawDowns || [],
        drawDownTexts:
          (firm.drawDownTexts || []).length > 0
            ? firm.drawDownTexts.filter((drawDownText: any) =>
                firm.drawDowns.includes(drawDownText.drawdown),
              )
            : firm.drawDowns.map((drawDown: any) => ({
                drawdown: drawDown,
                englishText: "",
                arabicText: "",
              })),
        otherFeatures: firm.otherFeatures || [],
        challengeNames: (firm.challengeNameRecords || []).map((cn: any) => ({
          id: cn.id,
          name: cn.name,
          nameArabic: cn.nameArabic || "",
          discountPercentage: cn.discountPercentage || 0,
          cnMaxAllocation: cn.cnMaxAllocation || "",
          cnConsistencyRules: cn.cnConsistencyRules || "",
          cnNewsTrading: cn.cnNewsTrading ?? false,
          cnOvernightWeekends: cn.cnOvernightWeekends ?? false,
          cnCopyTrading: cn.cnCopyTrading ?? false,
          cnExperts: cn.cnExperts ?? false,
          cnMinimumTradingDays: cn.cnMinimumTradingDays || "",
          cnMinimumTradingDaysArabic: cn.cnMinimumTradingDaysArabic || "",
        })),
        drawDownProgramTypeMap:
          firm.drawDownProgramTypeMap && Object.keys(firm.drawDownProgramTypeMap).length > 0
            ? firm.drawDownProgramTypeMap
            : (firm.drawDowns || []).reduce(
                (acc: Record<string, string[]>, dd: string) => {
                  acc[dd] = firm.programTypes || [];
                  return acc;
                },
                {},
              ),
        leverage: firm.leverage,
        leverageArabic: firm.leverageArabic,
        commission: firm.commission,
        commissionArabic: firm.commissionArabic,
        accountSizes: firm.accountSizes,
        accountSizesArabic: firm.accountSizesArabic,
        dailyMaxLoss: firm.dailyMaxLoss,
        dailyMaxLossArabic: firm.dailyMaxLossArabic,
        scaleupPlans: firm.scaleupPlans,
        scaleupPlansArabic: firm.scaleupPlansArabic,
        minimumTradingDays: firm.minimumTradingDays,
        minimumTradingDaysArabic: firm.minimumTradingDaysArabic,
        programTypes: firm.programTypes || [StepsEnum.STEP1],

        allocationRules: firm.allocationRules || "",
        newsTradingAllowedRules: firm.newsTradingAllowedRules || "",
        newsTradingNotAllowedRules: firm.newsTradingNotAllowedRules || "",
        overnightAndWeekendsHolding: firm.overnightAndWeekendsHolding || "",
        copyTradingAllowedRules: firm.copyTradingAllowedRules || "",
        copyTradingNotAllowedRules: firm.copyTradingNotAllowedRules || "",
        expertsAllowedRules: firm.expertsAllowedRules || "",
        expertsNotAllowedRules: firm.expertsNotAllowedRules || "",
        payoutPolicy: firm.payoutPolicy || "",
        consistencyRules: firm.consistencyRules || "",
        riskManagement: firm.riskManagement || "",
        vpnVps: firm.vpnVps || "",
        profitShare: firm.profitShare || "",
        inactivityRules: firm.inactivityRules || "",
        prohibitedStrategies: firm.prohibitedStrategies || "",

        payoutPolicyArabic: firm.payoutPolicyArabic || "",
        consistencyRulesArabic: firm.consistencyRulesArabic || "",
        allocationRulesArabic: firm.allocationRulesArabic || "",
        newsTradingAllowedRulesArabic: firm.newsTradingAllowedRulesArabic || "",
        newsTradingNotAllowedRulesArabic:
          firm.newsTradingNotAllowedRulesArabic || "",
        overnightAndWeekendsHoldingArabic:
          firm.overnightAndWeekendsHoldingArabic || "",
        copyTradingAllowedRulesArabic: firm.copyTradingAllowedRulesArabic || "",
        copyTradingNotAllowedRulesArabic:
          firm.copyTradingNotAllowedRulesArabic || "",
        expertsAllowedRulesArabic: firm.expertsAllowedRulesArabic || "",
        expertsNotAllowedRulesArabic: firm.expertsNotAllowedRulesArabic || "",
        riskManagementArabic: firm.riskManagementArabic || "",
        vpnVpsArabic: firm.vpnVpsArabic || "",
        profitShareArabic: firm.profitShareArabic || "",
        inactivityRulesArabic: firm.inactivityRulesArabic || "",
        prohibitedStrategiesArabic: firm.prohibitedStrategiesArabic || "",

        leverageMobileFontSize: firm.leverageMobileFontSize ?? undefined,
        commissionMobileFontSize: firm.commissionMobileFontSize ?? undefined,
        accountSizesMobileFontSize: firm.accountSizesMobileFontSize ?? undefined,
        allocationRulesMobileFontSize: firm.allocationRulesMobileFontSize ?? undefined,
        dailyMaxLossMobileFontSize: firm.dailyMaxLossMobileFontSize ?? undefined,
        riskManagementMobileFontSize: firm.riskManagementMobileFontSize ?? undefined,
        consistencyRulesMobileFontSize: firm.consistencyRulesMobileFontSize ?? undefined,
        minimumTradingDaysMobileFontSize: firm.minimumTradingDaysMobileFontSize ?? undefined,
        newsTradingAllowedRulesMobileFontSize: firm.newsTradingAllowedRulesMobileFontSize ?? undefined,
        newsTradingNotAllowedRulesMobileFontSize: firm.newsTradingNotAllowedRulesMobileFontSize ?? undefined,
        overnightAndWeekendsHoldingMobileFontSize: firm.overnightAndWeekendsHoldingMobileFontSize ?? undefined,
        copyTradingAllowedRulesMobileFontSize: firm.copyTradingAllowedRulesMobileFontSize ?? undefined,
        copyTradingNotAllowedRulesMobileFontSize: firm.copyTradingNotAllowedRulesMobileFontSize ?? undefined,
        expertsAllowedRulesMobileFontSize: firm.expertsAllowedRulesMobileFontSize ?? undefined,
        expertsNotAllowedRulesMobileFontSize: firm.expertsNotAllowedRulesMobileFontSize ?? undefined,
        vpnVpsMobileFontSize: firm.vpnVpsMobileFontSize ?? undefined,
        profitShareMobileFontSize: firm.profitShareMobileFontSize ?? undefined,
        payoutPolicyMobileFontSize: firm.payoutPolicyMobileFontSize ?? undefined,
        scaleupPlansMobileFontSize: firm.scaleupPlansMobileFontSize ?? undefined,
        inactivityRulesMobileFontSize: firm.inactivityRulesMobileFontSize ?? undefined,
        prohibitedStrategiesMobileFontSize: firm.prohibitedStrategiesMobileFontSize ?? undefined,
        restrictedCountriesNoteMobileFontSize: firm.restrictedCountriesNoteMobileFontSize ?? undefined,
      });
    }
  }, [firmData]);

  const handleSubmit = async (data: FieldValues) => {
    const formData = {
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
      isPopular: data.isPopular === "true" ? true : false,

      allocationRules: data.allocationRules,
      newsTradingAllowedRules: data.newsTradingAllowedRules,
      newsTradingNotAllowedRules: data.newsTradingNotAllowedRules,
      overnightAndWeekendsHolding: data.overnightAndWeekendsHolding,
      copyTradingAllowedRules: data.copyTradingAllowedRules,
      copyTradingNotAllowedRules: data.copyTradingNotAllowedRules,
      expertsAllowedRules: data.expertsAllowedRules,
      expertsNotAllowedRules: data.expertsNotAllowedRules,
      riskManagement: data.riskManagement,
      vpnVps: data.vpnVps,
      profitShare: data.profitShare,
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

    // Only append logo if a new file is provided
    if (data.logoUrl instanceof File) {
      sendingData.append("logo", data.logoUrl);
    }

    const toastId = toast.loading("Updating firm...");

    try {
      await updateFirm({ id: firmId, data: sendingData }).unwrap();
      setOpen(false);
      toast.success("Firm updated successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to update firm", { id: toastId });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button linearClassName="w-9 h-9" variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-full md:container! h-[85vh] overflow-y-auto pt-0">
        <div className="flex justify-between items-center sticky top-0 right-0 bg-background z-50 py-4">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("editFirm")}</AlertDialogTitle>
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

        <AlertDialogDescription asChild>
          <div className="text-muted-foreground text-sm">
            {isFetchingFirm ? (
              <div className="flex items-center justify-center py-8">
                Loading firm data...
              </div>
            ) : defaultValues ? (
              <CustomForm
                onSubmit={handleSubmit}
                defaultValues={defaultValues}
                className="space-y-6 py-4"
              >
                <FirmForm
                  open={open}
                  logoUrl={firmData.data.logoUrl}
                />
                <Button
                  disabled={isUpdating}
                  type="submit"
                  className="w-full h-11"
                >
                  {isUpdating ? t("updatingFirm") : t("updateFirm")}
                </Button>
              </CustomForm>
            ) : null}
          </div>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
};
