"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import AuthContainer from "../Auth/AuthContainer";
import SelectCountry from "../Global/SelectCountry";
import { countries, countriesByCode } from "@/data";
import { Button } from "../ui/button";
import Image from "next/image";
import { ChevronLeft, CircleQuestionMark } from "lucide-react";
import useIsArabic from "@/hooks/useIsArabic";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import {
  useCompleteSurveyMutation,
  useGetSurveyUserQuery,
} from "@/redux/api/userApi";
import { Skeleton } from "../ui/skeleton";
import LinearBorder from "../Global/LinearBorder";
import { Card, CardContent } from "../ui/card";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setUser, useCurrentUser, useCurrentToken } from "@/redux/authSlice";

const tradingExperienceTimes = [
  { value: "0-3 months", name: "0-3months" },
  { value: "4-12 months", name: "4-12months" },
  { value: "1-2 years", name: "1-2years" },
  { value: "3-5 years", name: "3-5years" },
  { value: "5+ years", name: "5plus" },
];

const assetsTraded = [
  { value: "Forex", name: "forex" },
  { value: "Futures", name: "futures" },
  { value: "Crypto", name: "crypto" },
  { value: "Stocks", name: "stocks" },
];

const tookChallenge = [
  { value: "Never", name: "never" },
  { value: "1-3", name: "1-3" },
  { value: "4-9", name: "4-9" },
  { value: "10*", name: "10plus" },
];

const OnboardingSkeleton = () => {
  return (
    <div className="w-full max-w-xl">
      <LinearBorder
        className2="rounded-xl max-w-full"
        className="rounded-xl max-w-full!"
      >
        <Card className="w-full max-w-xl p-4 md:p-8 border-none">
          <CardContent className="space-y-10 w-full">
            {/* Title and Subtitle Skeletons */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-5 w-96" />
            </div>

            {/* Content */}
            <div className="space-y-8">
              {/* Country Select Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              {/* Grid of Country Buttons Skeleton */}
              <div className="grid grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 h-11 px-4 py-2 border rounded-lg"
                  >
                    <Skeleton className="h-3.5 w-5 rounded-sm" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>

              {/* Info Button Skeleton */}
              <div className="flex items-center gap-2 h-11 px-4 py-2 border rounded-lg">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>

              {/* Next Button Skeleton */}
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </LinearBorder>
    </div>
  );
};

const defaultCountries = countriesByCode(["US", "UK", "AE", "KW", "BD", "CA"]);

export default function Onboarding() {
  const [completeSurveyMutation] = useCompleteSurveyMutation();
  const { data, isLoading: surveyLoading } = useGetSurveyUserQuery(undefined);
  const router = useRouter();
  const t = useTranslations("Onboarding");
  const isArabic = useIsArabic();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(useCurrentUser);
  const currentToken = useAppSelector(useCurrentToken);

  const [formData, setFormData] = useState<{
    country: string;
    tradingExperience: string;
    assetsTraded: string[];
    tookChallenge: string;
  }>({
    country: "",
    tradingExperience: "",
    assetsTraded: [],
    tookChallenge: "",
  });

  const [step, setStep] = useState<"country" | "about">("country");
  const [direction, setDirection] = useState<1 | -1>(-1);

  useEffect(() => {
    if (surveyLoading) return;
    if (data) {
      const surveyData = data?.data;
      if (!surveyData) {
        return;
      }
      setFormData({
        country: surveyData.country,
        tradingExperience: surveyData.tradingExperience,
        assetsTraded: surveyData.assetsTraded,
        tookChallenge: surveyData.tookChallenge,
      });
    }
  }, [surveyLoading, data]);

  const setCountryValue = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleNext = () => {
    if (!formData.country) return;
    setDirection(1);
    setStep("about");
  };

  const handlePrev = () => {
    setDirection(-1);
    setStep("country");
  };

  const handleSetTradeExperience = (value: string) => {
    setFormData({
      ...formData,
      tradingExperience: value,
    });
  };

  const handleSetTookChallenge = (value: string) => {
    setFormData({
      ...formData,
      tookChallenge: value,
    });
  };

  const handleAssetsTraded = (value: string) => {
    const newAssets = formData.assetsTraded.includes(value)
      ? formData.assetsTraded.filter((item) => item !== value)
      : [...formData.assetsTraded, value];
    setFormData({
      ...formData,
      assetsTraded: newAssets,
    });
  };

  const handleComplete = async () => {
    if (formData.tookChallenge && formData.tradingExperience) {
      const toastId = toast.loading(t("loading"));
      const countryForApi = (() => {
        const c = countries.find(
          (x) => x.code === formData.country || x.country === formData.country
        );
        return c ? c.country : formData.country;
      })();
      try {
        await completeSurveyMutation({
          data: { ...formData, country: countryForApi },
        }).unwrap();
        if (currentUser) {
          dispatch(setUser({ user: { ...currentUser, hasTakenSurvey: true }, token: currentToken }));
        }
        toast.success(t("success"), { id: toastId });
        router.push("/");
      } catch (error) {
        toast.error(t("error"), { id: toastId });
      }
    }
  };

  if (surveyLoading) {
    return <OnboardingSkeleton />;
  }

  return (
    <div className="w-full max-w-xl">
      <AnimatePresence mode="wait">
        {step === "country" && (
          <motion.div
            key="country"
            initial={{ x: 300 * direction, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300 * direction, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AuthContainer
              title={t("country.title")}
              subtitle={t("country.subtitle")}
              className="w-full"
            >
              <div className="space-y-8">
                <SelectCountry
                  state={{
                    setValue: setCountryValue,
                    value: formData.country,
                  }}
                />
                <div className="grid grid-cols-2 gap-5">
                  {defaultCountries?.map((item) => {
                    const isSelected =
                      formData.country === item.code ||
                      formData.country === item.country;
                    return (
                    <Button
                      key={item.code}
                      size={"lg"}
                      variant={isSelected ? "outline" : "outline2"}
                      className={cn(
                        "overflow-hidden w-full transition-colors",
                        isSelected && "bg-primary/15 text-primary font-semibold ring-2 ring-primary ring-offset-2 hover:bg-primary/20 hover:text-primary dark:bg-primary/20 dark:text-primary-foreground dark:ring-primary"
                      )}
                      onClick={() => setCountryValue(item.code)}
                    >
                      <div className="flex gap-2 items-center w-full">
                        <div className="w-5 min-w- h-3.5 relative">
                          <Image
                            src={item.flag || ""}
                            alt={item.country}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="truncate">{item.country}</p>
                      </div>
                    </Button>
                    );
                  })}
                </div>
                <Button
                  variant={"outline2"}
                  type="button"
                  className="w-full justify-start text-primary hover:text-primary cursor-default!"
                >
                  <CircleQuestionMark />
                  {t("country.info")}
                </Button>
                <Button size={"lg"} onClick={handleNext} className="w-full">
                  {t("country.next")}
                </Button>
                <Button
                  variant={"ghost"}
                  size={"lg"}
                  onClick={() => router.push("/forex")}
                  className="w-full text-muted-foreground"
                >
                  {t("skip")}
                </Button>
              </div>
            </AuthContainer>
          </motion.div>
        )}
        {step === "about" && (
          <motion.div
            key="about"
            initial={{ x: 300 * direction, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300 * direction, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AuthContainer
              title={t("about.title")}
              subtitle={t("about.subtitle")}
              className="w-full"
            >
              <div className="space-y-10">
                <OptionButtons
                  label={t("about.tradingExperience.label")}
                  points={tradingExperienceTimes}
                  action={handleSetTradeExperience}
                  singleValue={formData.tradingExperience}
                  translationKey="about.tradingExperience.options"
                />
                <OptionButtons
                  label={t("about.assetsTraded.label")}
                  points={assetsTraded}
                  action={handleAssetsTraded}
                  values={formData.assetsTraded}
                  multiple
                  translationKey="about.assetsTraded.options"
                />
                <OptionButtons
                  label={t("about.tookChallenge.label")}
                  points={tookChallenge}
                  action={handleSetTookChallenge}
                  singleValue={formData.tookChallenge}
                  translationKey="about.tookChallenge.options"
                />
                <div className="space-y-2">
                  <div className={cn("flex gap-3", isArabic && "flex-row-reverse")}>
                    <Button
                      size={"icon"}
                      variant={"outline2"}
                      onClick={handlePrev}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      size={"lg"}
                      className="flex-1"
                      onClick={handleComplete}
                    >
                      {t("about.complete")}
                    </Button>
                  </div>
                  <Button
                    variant={"ghost"}
                    size={"lg"}
                    onClick={() => router.push("/forex")}
                    className="w-full text-muted-foreground"
                  >
                    {t("skip")}
                  </Button>
                </div>
              </div>
            </AuthContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const OptionButtons = ({
  label,
  points,
  values = [],
  singleValue = "",
  multiple,
  action,
  translationKey,
}: {
  label: string;
  points: Array<{ value: string; name: string }>;
  singleValue?: string;
  values?: string[];
  multiple?: boolean;
  action: (value: string) => void;
  translationKey: string;
}) => {
  const t = useTranslations("Onboarding");
  const pointsLength = points.length;

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div
        className={cn(
          "grid grid-cols-6 gap-3",
          pointsLength < 5 && "grid-cols-4",
        )}
      >
        {points.map((item, index) => {
          const isSelected = multiple
            ? values?.includes(item.value)
            : item.value === singleValue;
          return (
            <div
              key={item.value}
              className={cn(
                "col-span-2 w-full",
                pointsLength > 4 &&
                  pointsLength % 3 &&
                  (index === Number(Math.ceil(pointsLength / 3)) * 3 - 3 ||
                    index === Number(Math.ceil(pointsLength / 3)) * 3 - 2) &&
                  "col-span-3",
              )}
            >
              <Button
                variant={isSelected ? "outline" : "outline2"}
                onClick={() => action(item.value)}
                size={"lg"}
                linearClassName="max-w-full!"
                className={cn(
                  "w-full transition-colors",
                  isSelected &&
                    "bg-primary/15 text-primary font-semibold ring-2 ring-primary ring-offset-2 hover:bg-primary/20 hover:text-primary dark:bg-primary/20 dark:text-primary-foreground dark:ring-primary",
                )}
              >
                {t(`${translationKey}.${item.name}`)}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
