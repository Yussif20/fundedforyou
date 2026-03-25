"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useCreateChallengeMutation } from "@/redux/api/challenge";
import { toast } from "sonner";
import ChallengeForm from "./ChallengeForm";

type TCreateChallengeModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  firmOptions: { label: string; value: string }[];
  firmsLoading: boolean;
};

export default function CreateChallengeModal({
  open,
  setOpen,
}: TCreateChallengeModalProps) {
  const t = useTranslations("CHALLENGEMANAGEMENT");
  const [createChallenge, { isLoading }] = useCreateChallengeMutation();

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
      contractSizeMini: "",
      contractSizeMicro: "",
      consistencyRuleChallenge: "",
      consistencyRuleFunded: "",

      newsTrading: true,
      copyTrading: false,
      EAs: true,
      weekend: false,
      overnightHolding: true,
      stopLossRequired: true,
      refundableFee: false,
    },
  });

  const { handleSubmit } = methods;

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
      contractSizeMini: data.contractSizeMini ? Number(data.contractSizeMini) : 0,
      contractSizeMicro: data.contractSizeMicro ? Number(data.contractSizeMicro) : 0,
      consistencyRuleChallenge: data.consistencyRuleChallenge ? Number(data.consistencyRuleChallenge) : 0,
      consistencyRuleFunded: data.consistencyRuleFunded ? Number(data.consistencyRuleFunded) : 0,
    };

    try {
      await createChallenge(payload).unwrap();
      toast.success(t("challengeCreated"));
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("challengeCreateFailed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createChallenge")}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            {/* Firm Select */}
            <ChallengeForm methods={methods} />
            <div className="flex justify-end col-span-full mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t("creating") : t("create")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
