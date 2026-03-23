import CustomCombobox from "@/components/Forms/CustomCombobox";
import CustomInput from "@/components/Forms/CustomInput";
import CustomYesNoToggle from "@/components/Forms/CustomYesNoToggle";
import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function OfferForm() {
  const t = useTranslations("Offers");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: firmsData, isLoading: isFirmsLoading } = useGetAllFirmsQuery([
    { name: "limit", value: 50 },
    { name: "searchTerm", value: searchTerm },
  ]);

  const firmOptions =
    firmsData?.firms?.map((firm: any) => ({
      label: firm.title || firm.name,
      value: firm.id,
    })) || [];
  const { watch } = useFormContext();
  const showGift = watch("showGift");
  const discountType = watch("discountType");
  const endDateValue = watch("endDate");
  const timerDiscountType = watch("timerDiscountType");
  return (
    <>
      {/* Firm Selection */}
      <CustomCombobox
        name="firmId"
        label={t("selectFirm")}
        placeholder={isFirmsLoading ? t("loadingFirms") : t("chooseFirm")}
        searchPlaceholder="Search firms..."
        emptyMessage="No firms found."
        options={firmOptions}
        required
        disabled={isFirmsLoading}
        buttonClassName="h-11"
        onSearchChange={setSearchTerm}
        isSearching={isFirmsLoading}
      />

      {/* Offer Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          type="text"
          name="code"
          label={t("offerCode")}
          placeholder={t("offerCodePlaceholder")}
          fieldClassName="h-11"
        />

        <CustomYesNoToggle
          name="discountType"
          label={t("discountType")}
          yesValue="PERCENTAGE"
          noValue="TEXT"
          yesLabel={t("percentage")}
          noLabel={t("discountTextLabel")}
        />
      </div>

      {discountType !== "TEXT" ? (
        <CustomInput
          type="number"
          name="offerPercentage"
          label={t("discountPercentage")}
          placeholder={t("discountPlaceholder")}
          required
          fieldClassName="h-11"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            type="text"
            name="discountText"
            label={t("discountTextEnglish")}
            placeholder="e.g., Buy 1 Get 1"
            fieldClassName="h-11"
          />
          <CustomInput
            type="text"
            name="discountTextArabic"
            label={t("discountTextArabicLabel")}
            placeholder="e.g., اشتر 1 واحصل على 1"
            inputDir="rtl"
            fieldClassName="h-11"
          />
        </div>
      )}
      <CustomInput
        type="text"
        name="text"
        label={t("text")}
        placeholder={t("textPlaceholder")}
        required
        fieldClassName="h-11"
      />
      <CustomInput
        type="textArabic"
        name="textArabic"
        label={t("textArabic")}
        placeholder={t("textArabicPlaceholder")}
        required
        fieldClassName="h-11"
      />
      <CustomInput
        type="datetime-local"
        name="endDate"
        label={t("endDate")}
        fieldClassName="h-11"
      />

      {/* Timer override fields — only shown when endDate is set */}
      {endDateValue && (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Timer Override Fields (shown while timer is active)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="text"
              name="timerCode"
              label={t("offerCode") + " (Timer)"}
              placeholder={t("offerCodePlaceholder")}
              fieldClassName="h-11"
            />
            <CustomYesNoToggle
              name="timerDiscountType"
              label={t("discountType") + " (Timer)"}
              yesValue="PERCENTAGE"
              noValue="TEXT"
              yesLabel={t("percentage")}
              noLabel={t("discountTextLabel")}
            />
          </div>

          {timerDiscountType !== "TEXT" ? (
            <CustomInput
              type="number"
              name="timerOfferPercentage"
              label={t("discountPercentage") + " (Timer)"}
              placeholder={t("discountPlaceholder")}
              fieldClassName="h-11"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                type="text"
                name="timerDiscountText"
                label={t("discountTextEnglish") + " (Timer)"}
                placeholder="e.g., Buy 1 Get 1"
                fieldClassName="h-11"
              />
              <CustomInput
                type="text"
                name="timerDiscountTextArabic"
                label={t("discountTextArabicLabel") + " (Timer)"}
                placeholder="e.g., اشتر 1 واحصل على 1"
                inputDir="rtl"
                fieldClassName="h-11"
              />
            </div>
          )}

          <CustomInput
            type="text"
            name="timerText"
            label={t("text") + " (Timer)"}
            placeholder={t("textPlaceholder")}
            fieldClassName="h-11"
          />
          <CustomInput
            type="text"
            name="timerTextArabic"
            label={t("textArabic") + " (Timer)"}
            placeholder={t("textArabicPlaceholder")}
            inputDir="rtl"
            fieldClassName="h-11"
          />
        </div>
      )}

      <CustomYesNoToggle
        name="showGift"
        label={t("showGift")}
        //   required
      />

      {showGift && (
        <>
          <CustomInput
            type="text"
            name="giftText"
            label={t("giftText")}
            placeholder={t("giftTextPlaceholder")}
            fieldClassName="h-11"
          />
          <CustomInput
            type="text"
            name="giftTextArabic"
            label={t("giftTextArabic")}
            placeholder={t("giftTextArabicPlaceholder")}
            inputDir="rtl"
            fieldClassName="h-11"
          />
        </>
      )}

      {/* Is Exclusive Toggle */}
      <CustomYesNoToggle
        name="isExclusive"
        label={t("offerType")}
        //   required
      />

      {/* Hidden Toggle */}
      <CustomYesNoToggle name="hidden" label="Hidden" />

      {/* Show in Firm Banner Toggle */}
      <CustomYesNoToggle name="showInBanner" label={t("showInBanner")} />
    </>
  );
}
