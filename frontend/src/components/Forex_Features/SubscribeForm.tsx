"use client";
import CustomInput from "../Forms/CustomInput";
import CustomForm from "../Forms/CustomForm";
import { FieldValues } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useCreateSubscribeMutation } from "@/redux/api/subscribe";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const defaultValues = {
  email: "",
};
export default function SubscribeForm() {
  const [createSubscribe] = useCreateSubscribeMutation();
  const t = useTranslations("Subscribe");
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSubmit = async (data: FieldValues) => {
    const payload = {
      ...data,
    };

    try {
      const result = await createSubscribe(payload).unwrap();

      if (result) {
        toast.success(t("subscribedSuccessfully"));
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || t("error")
      );
    }
  };

  return (
    <div className="w-full min-w-0 max-w-xl mx-auto">
      <CustomForm
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        className="w-full"
      >
        {/* Mobile: stacked so email is full width, button below. Desktop: email + button inline */}
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3 w-full">
          <div className="flex-1 min-w-0">
            <CustomInput
              type="email"
              name="email"
              fieldClassName="h-11 w-full"
              placeholder={t("emailPlaceholder")}
              Icon={<CiMail />}
              {...(!isMobile && {
                RightIcon: (
                  <Button type="submit" size="sm" className="h-10 w-full text-xs px-3 sm:text-sm sm:px-4 shrink-0">
                    {t("subscribeButton")}
                  </Button>
                ),
                RightIconWidth: 120,
              })}
            />
          </div>
          {isMobile && (
            <Button type="submit" size="sm" className="h-11 w-full shrink-0">
              {t("subscribeButton")}
            </Button>
          )}
        </div>
      </CustomForm>
    </div>
  );
}
