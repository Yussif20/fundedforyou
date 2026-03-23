"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { toast } from "sonner";
import { useUpdateChallengeMutation } from "@/redux/api/challenge";
import ChallengeForm from "./ChallengeForm";

type TCreateChallengeModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  challenge: any;
};

export default function EditChallengeModal({
  open,
  setOpen,
  challenge,
}: TCreateChallengeModalProps) {
  const t = useTranslations("CHALLENGEMANAGEMENT");

  const singleData = challenge;

  const [updateChallenge, { isLoading }] = useUpdateChallengeMutation();

  const methods = useForm({
    defaultValues: {
      hidden: false,
      firmId: "",
      title: "",
      resetType: "",
      challengeNameId: "",
      accountSize: "",
      steps: "",
      profitTarget: [] as number[],
      dailyLoss: "",
      maxLoss: "",
      maxLostType: "",
      profitSplit: "",
      payoutFrequency: "",
      payoutFrequencyArabic: "",
      price: "",
      minTradingDays: "",
      timeLimit: "",
      maxLeverage: "",
      activationFees: "",
      newsTrading: true,
      copyTrading: false,
      EAs: true,
      weekend: false,
      overnightHolding: true,
      stopLossRequired: true,
      refundableFee: false,
      affiliateLink: "",
    },
  });

  const { handleSubmit, reset } = methods;

  // Load existing challenge data
  useEffect(() => {
    if (singleData) {
      const { firm, createdAt, updatedAt, ...rest } = singleData;

      reset({
        ...rest,
        challengeNameId: rest.challengeNameId || "",
        firmId: firm?.id,
        accountSize: rest.accountSize?.toString(),
        dailyLoss: rest.dailyLoss?.toString(),
        maxLoss: rest.maxLoss?.toString(),
        minTradingDays: rest.minTradingDays?.toString(),
        price: rest.price?.toString(),
        profitSplit: rest.profitSplit?.toString(),
        timeLimit: rest.timeLimit?.toString(),
        affiliateLink: rest.affiliateLink,
      });
    }
  }, [singleData, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      accountSize: Number(data.accountSize),
      dailyLoss: data.dailyLoss ? Number(data.dailyLoss) : null,
      maxLoss: data.maxLoss ? Number(data.maxLoss) : null,
      minTradingDays: Number(data.minTradingDays),
      price: Number(data.price),
      profitSplit: Number(data.profitSplit),
      timeLimit: Number(data.timeLimit),
      activationFees: data.activationFees ? Number(data.activationFees) : null,
      profitTarget: data.profitTarget,
      firmId: data.firmId,
      affiliateLink: data.affiliateLink,
    };

    try {
      await updateChallenge({ id: challenge.id, data: payload }).unwrap();
      toast.success(t("challengeUpdated"));
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("challengeUpdateFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editChallenge")}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            <ChallengeForm methods={methods} />

            <div className="flex justify-end col-span-full mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("updating") : t("update")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
