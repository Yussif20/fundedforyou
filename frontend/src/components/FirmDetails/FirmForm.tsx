import CustomYesNoToggle from "../Forms/CustomYesNoToggle";
import CustomInput from "../Forms/CustomInput";
import {
  countries,
  drawDowns,
  otherFeatures,
  programTypes,
  propFirmInstrumentTypes,
} from "@/data";
import CustomComboBoxMultiple from "../Forms/CustomComboBoxMultiple";
import CustomSelect from "../Forms/CustomSelect";
import BMImageUpload from "../Overview/BrokerManagement/BMImageUpload";
import { DrawDownProgramTypes, DrawDownTexts, MonthAndYear } from "./ExtraField";
import { useTranslations } from "next-intl";
import useIsFutures from "@/hooks/useIsFutures";
import { useGetAllPaymentMethodQuery } from "@/redux/api/paymentMethodApi";
import { useGetAllPlatformQuery } from "@/redux/api/platformApi";
import { useGetBrokersQuery } from "@/redux/api/brokerApi";
import { Broker } from "@/types/broker.type";
import { Platform } from "@/types";
import { PaymentMethod } from "@/types/payment-method";
import { GripVertical, Pencil, X as XIcon } from "lucide-react";
import RichTextEditor2 from "../Forms/RichTextEditor2";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

type ChallengeNameItem = {
  id?: string;
  name: string;
  nameArabic: string;
  discountPercentage: number;
  cnMaxAllocation: number | string;
  cnConsistencyRules: number | string;
  cnNewsTrading: boolean;
  cnOvernightWeekends: boolean;
  cnCopyTrading: boolean;
  cnExperts: boolean;
  cnMinimumTradingDays: string;
  cnMinimumTradingDaysArabic: string;
};

function SortableChallengeItem({
  id,
  item,
  index,
  editingIndex,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onDiscountChange,
}: {
  id: string;
  item: ChallengeNameItem;
  index: number;
  editingIndex: number | null;
  onStartEdit: (index: number) => void;
  onSaveEdit: (index: number, value: string) => void;
  onCancelEdit: () => void;
  onRemove: (index: number) => void;
  onDiscountChange: (index: number, value: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  const [editValue, setEditValue] = useState(item.name);
  const [localDiscount, setLocalDiscount] = useState(item.discountPercentage ? String(item.discountPercentage) : "");
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingIndex === index;

  const style = {
    transform: transform
      ? CSS.Transform.toString({ ...transform, x: 0 })
      : undefined,
    transition,
  };

  const handleStartEdit = () => {
    setEditValue(item.name);
    onStartEdit(index);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onSaveEdit(index, trimmed);
    } else {
      onCancelEdit();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm transition-shadow ${
        isDragging ? "shadow-lg shadow-primary/20 ring-1 ring-primary/30 z-10" : "hover:border-primary/30"
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            } else if (e.key === "Escape") {
              onCancelEdit();
            }
          }}
          onBlur={handleSave}
          className="flex-1 border rounded border-chart-1 px-2 py-0.5 text-sm bg-background"
        />
      ) : (
        <span className="flex-1 font-medium">{item.name}</span>
      )}

      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          max={100}
          value={localDiscount}
          onChange={(e) => setLocalDiscount(e.target.value)}
          onBlur={() => onDiscountChange(index, Number(localDiscount) || 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onDiscountChange(index, Number(localDiscount) || 0);
            }
          }}
          className="w-16 border rounded border-chart-1 px-1.5 py-0.5 text-xs bg-background text-center"
          placeholder="0"
        />
        <span className="text-xs text-muted-foreground">%</span>
      </div>

      {!isEditing && (
        <button
          type="button"
          onClick={handleStartEdit}
          className="text-muted-foreground/50 hover:text-primary transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-muted-foreground/40 hover:text-destructive transition-colors"
      >
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function ChallengeNamesField() {
  const { watch, setValue, getValues } = useFormContext();
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addName = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const current: ChallengeNameItem[] = getValues("challengeNames") || [];
    if (!current.some((cn) => cn.name === trimmed)) {
      setValue("challengeNames", [...current, { name: trimmed, nameArabic: "", discountPercentage: 0, cnMaxAllocation: "", cnConsistencyRules: "", cnNewsTrading: false, cnOvernightWeekends: false, cnCopyTrading: false, cnExperts: false, cnMinimumTradingDays: "", cnMinimumTradingDaysArabic: "" }]);
    }
    setInput("");
  };

  const challengeNames: ChallengeNameItem[] = watch("challengeNames") || [];
  const sortableIds = challengeNames.map((_: ChallengeNameItem, i: number) => `challenge-${i}`);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sortableIds.indexOf(String(active.id));
    const newIndex = sortableIds.indexOf(String(over.id));
    setValue("challengeNames", arrayMove(challengeNames, oldIndex, newIndex));
  }

  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium mb-1">Challenge Names</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addName();
            }
          }}
          placeholder="Enter a challenge name"
          className="w-full border rounded-3xl border-chart-1 px-3 py-2"
        />
        <button
          type="button"
          onClick={addName}
          className="bg-primary1 text-foreground px-4 rounded-3xl"
        >
          Add
        </button>
      </div>
      {challengeNames.length > 0 && (
        <div className="mt-2 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
              {challengeNames.map((item: ChallengeNameItem, idx: number) => (
                <SortableChallengeItem
                  key={sortableIds[idx]}
                  id={sortableIds[idx]}
                  item={item}
                  index={idx}
                  editingIndex={editingIndex}
                  onStartEdit={setEditingIndex}
                  onSaveEdit={(i, value) => {
                    const updated = [...challengeNames];
                    updated[i] = { ...updated[i], name: value };
                    setValue("challengeNames", updated);
                    setEditingIndex(null);
                  }}
                  onCancelEdit={() => setEditingIndex(null)}
                  onRemove={(i) => {
                    setValue(
                      "challengeNames",
                      challengeNames.filter((_: ChallengeNameItem, idx: number) => idx !== i),
                    );
                    setEditingIndex(null);
                  }}
                  onDiscountChange={(i, value) => {
                    const updated = [...challengeNames];
                    updated[i] = { ...updated[i], discountPercentage: value };
                    setValue("challengeNames", updated);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

const SECTIONS = [
  { id: "section-basic-info", labelKey: "basicInfo", source: "t" as const, forexOnly: false },
  { id: "section-firm-overview", labelKey: "items.firmOverview", source: "tSidebar" as const, forexOnly: false },
  { id: "section-leverage", labelKey: "items.leverage", source: "tSidebar" as const, forexOnly: false },
  { id: "section-commissions", labelKey: "items.commissions", source: "tSidebar" as const, forexOnly: false },
  { id: "section-account-sizes", labelKey: "items.accountSizes", source: "tSidebar" as const, forexOnly: false },
  { id: "section-financial-details", labelKey: "financialDetails", source: "t" as const, forexOnly: false },
  { id: "section-daily-max-loss", labelKey: "items.dailyMaximumLoss", source: "tSidebar" as const, forexOnly: false },
  { id: "section-drawdown", labelKey: "items.drawdown", source: "tSidebar" as const, forexOnly: false },
  { id: "section-risk-management", labelKey: "items.riskManagement", source: "tSidebar" as const, forexOnly: true },
  { id: "section-consistency-rules", labelKey: "items.consistencyRules", source: "tSidebar" as const, forexOnly: false },
  { id: "section-minimum-trading-days", labelKey: "items.minimumTradingDays", source: "tSidebar" as const, forexOnly: true },
  { id: "section-news-trading", labelKey: "items.newsTrading", source: "tSidebar" as const, forexOnly: false },
  { id: "section-overnight-weekends", labelKey: "items.overnightWeekendsHolding", source: "tSidebar" as const, forexOnly: false },
  { id: "section-copy-trading", labelKey: "items.copyTrading", source: "tSidebar" as const, forexOnly: false },
  { id: "section-experts", labelKey: "items.experts", source: "tSidebar" as const, forexOnly: false },
  { id: "section-vpn-vps", labelKey: "items.vpnVps", source: "tSidebar" as const, forexOnly: false },
  { id: "section-profit-share", labelKey: "items.profitShare", source: "tSidebar" as const, forexOnly: true },
  { id: "section-payout-policy", labelKey: "items.payoutPolicy", source: "tSidebar" as const, forexOnly: false },
  { id: "section-scale-up", labelKey: "items.scaleUpPlan", source: "tSidebar" as const, forexOnly: true },
  { id: "section-inactivity-rules", labelKey: "items.inactivityRules", source: "tSidebar" as const, forexOnly: false },
  { id: "section-prohibited-strategies", labelKey: "items.prohibitedStrategies", source: "tSidebar" as const, forexOnly: false },
];

/** Isolated sidebar: uses getValues for count, each item watches only its own name. */
function ChallengeNameSidebarItems({
  activeSection,
  setActiveSection,
  isClickScrollingRef,
}: {
  activeSection: string;
  setActiveSection: (id: string) => void;
  isClickScrollingRef: React.MutableRefObject<boolean>;
}) {
  const { getValues } = useFormContext();
  const challengeNames: ChallengeNameItem[] = getValues("challengeNames") || [];
  const names = challengeNames.map((cn) => cn.name);

  return (
    <>
      {names.map((name, idx) => {
        const sectionId = `section-cn-${idx}`;
        return (
          <li key={sectionId}>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById(sectionId);
                if (!el) return;
                let container = el.parentElement;
                while (container) {
                  const overflow = getComputedStyle(container).overflowY;
                  if (overflow === "auto" || overflow === "scroll") break;
                  container = container.parentElement;
                }
                if (!container) return;
                isClickScrollingRef.current = true;
                setActiveSection(sectionId);
                const targetTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 80;
                container.scrollTo({ top: targetTop, behavior: "smooth" });
                const onScrollEnd = () => {
                  clearTimeout(timer);
                  timer = setTimeout(() => {
                    isClickScrollingRef.current = false;
                    container!.removeEventListener("scroll", onScrollEnd);
                  }, 100);
                };
                let timer: ReturnType<typeof setTimeout>;
                container.addEventListener("scroll", onScrollEnd, { passive: true });
              }}
              className={`w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                activeSection === sectionId
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {name || "Unnamed"} Settings
            </button>
          </li>
        );
      })}
    </>
  );
}

/** Single challenge-name section — watches only its own `.name` for the heading.
 *  All inputs use Controller which subscribes only to their individual field path. */
function SingleChallengeNameSection({ idx }: { idx: number }) {
  const t = useTranslations("FirmManagement");
  const { control } = useFormContext();
  // Only subscribe to the name field for the heading — not the whole object
  const name: string = useWatch({ control, name: `challengeNames.${idx}.name` }) || "";

  return (
    <div id={`section-cn-${idx}`} className="space-y-4">
      <h3 className="text-sm font-semibold border-b pb-2">
        {name || "Unnamed"} — {t("challengeNameSettings")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CustomInput
          type="number"
          label={t("cnMaxAllocation")}
          name={`challengeNames.${idx}.cnMaxAllocation`}
          fieldClassName="h-11"
          placeholder={t("cnMaxAllocation")}
        />
        <CustomInput
          type="number"
          label={t("cnConsistencyRules")}
          name={`challengeNames.${idx}.cnConsistencyRules`}
          fieldClassName="h-11"
          placeholder={t("cnConsistencyRules")}
        />
        <CustomInput
          type="text"
          label={t("cnMinimumTradingDays")}
          name={`challengeNames.${idx}.cnMinimumTradingDays`}
          fieldClassName="h-11"
          placeholder=""
        />
        <CustomInput
          type="text"
          label={t("cnMinimumTradingDaysArabic")}
          name={`challengeNames.${idx}.cnMinimumTradingDaysArabic`}
          fieldClassName="h-11"
          placeholder=""
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomYesNoToggle name={`challengeNames.${idx}.cnNewsTrading`} label={t("cnNewsTrading")} />
        <CustomYesNoToggle name={`challengeNames.${idx}.cnOvernightWeekends`} label={t("cnOvernightWeekends")} />
        <CustomYesNoToggle name={`challengeNames.${idx}.cnCopyTrading`} label={t("cnCopyTrading")} />
        <CustomYesNoToggle name={`challengeNames.${idx}.cnExperts`} label={t("cnExperts")} />
      </div>
    </div>
  );
}

/** Container: only reads challengeNames.length from getValues (no watch subscription).
 *  Re-renders only when the ChallengeNamesField adds/removes items (which triggers a parent re-render anyway). */
function ChallengeNameSettingsSections() {
  const { getValues } = useFormContext();
  const challengeNames: ChallengeNameItem[] = getValues("challengeNames") || [];

  if (challengeNames.length === 0) return null;

  return (
    <>
      {challengeNames.map((_: ChallengeNameItem, idx: number) => (
        <SingleChallengeNameSection key={idx} idx={idx} />
      ))}
    </>
  );
}

export default function FirmForm({
  logoUrl,
  open,
}: {
  logoUrl?: string;
  open: boolean;
}) {
  const t = useTranslations("FirmManagement");
  const tSidebar = useTranslations("FOSidebar");
  const isFutures = useIsFutures();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const isClickScrollingRef = useRef(false);

  const visibleSections = SECTIONS.filter((s) => !s.forexOnly || !isFutures);

  const getLabel = useCallback(
    (section: (typeof SECTIONS)[number]) => {
      return section.source === "t"
        ? t(section.labelKey as any)
        : tSidebar(section.labelKey as any);
    },
    [t, tSidebar],
  );

  useEffect(() => {
    // Find the scrollable ancestor (AlertDialogContent with overflow-y-auto)
    const firstEl = document.getElementById(visibleSections[0]?.id);
    if (!firstEl) return;

    let scrollContainer: HTMLElement | null = firstEl.parentElement;
    while (scrollContainer) {
      const overflow = getComputedStyle(scrollContainer).overflowY;
      if (overflow === "auto" || overflow === "scroll") break;
      scrollContainer = scrollContainer.parentElement;
    }
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Skip scroll-based detection while a click-initiated smooth scroll is in progress
      if (isClickScrollingRef.current) return;

      const containerRect = scrollContainer!.getBoundingClientRect();
      const detectionLine = containerRect.top + 100;

      let current = visibleSections[0].id;
      for (const section of visibleSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= detectionLine) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial active section
    handleScroll();
    return () => scrollContainer!.removeEventListener("scroll", handleScroll);
  }, [isFutures, visibleSections.length]);
  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
    useGetAllPaymentMethodQuery([{ name: "limit", value: 1000 }], {
      skip: !open,
    });
  const { data: platforms, isLoading: isLoadingPlatforms } =
    useGetAllPlatformQuery([{ name: "limit", value: 1000 }], { skip: !open });
  const { data: brokers, isLoading: isLoadingBrokers } = useGetBrokersQuery(
    [{ name: "limit", value: 1000 }],
    { skip: !open },
  );

  const allBrokers: Broker[] = brokers?.data.brokers || [];
  const allPlatforms: Platform[] = platforms?.data.platforms || [];
  const allPaymentMethods: PaymentMethod[] = paymentMethods?.data || [];
  const extraFunction = (
    value: string,
    values: any[],
    setValue: any,
    getValues: any,
  ) => {
    const currentMap = getValues("drawDownProgramTypeMap") || {};
    if (values.find((item) => item.drawdown === value)) {
      // Removing drawdown
      setValue(
        "drawDownTexts",
        getValues("drawDownTexts").filter(
          (drawDown: any) => drawDown.drawdown !== value,
        ),
      );
      const { [value]: _, ...rest } = currentMap;
      setValue("drawDownProgramTypeMap", rest);
    } else {
      // Adding drawdown - default to all selected program types
      setValue("drawDownTexts", [
        ...getValues("drawDownTexts"),
        { drawdown: value, englishText: "", arabicText: "" },
      ]);
      const currentProgramTypes = getValues("programTypes") || [];
      setValue("drawDownProgramTypeMap", {
        ...currentMap,
        [value]: [...currentProgramTypes],
      });
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar Navigation */}
      <nav className="w-52 shrink-0 sticky top-[4.5rem] self-start max-h-[calc(85vh-5.5rem)] overflow-y-auto hidden lg:block">
        <ul className="space-y-0.5 py-2">
          {visibleSections.map((section) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(section.id);
                  if (!el) return;
                  // Find the scroll container
                  let container = el.parentElement;
                  while (container) {
                    const overflow = getComputedStyle(container).overflowY;
                    if (overflow === "auto" || overflow === "scroll") break;
                    container = container.parentElement;
                  }
                  if (!container) return;
                  // Lock scroll detection so it doesn't overwrite during animation
                  isClickScrollingRef.current = true;
                  setActiveSection(section.id);

                  const targetTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 80;
                  container.scrollTo({
                    top: targetTop,
                    behavior: "smooth",
                  });

                  // Re-enable scroll detection after animation settles
                  const onScrollEnd = () => {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                      isClickScrollingRef.current = false;
                      container!.removeEventListener("scroll", onScrollEnd);
                    }, 100);
                  };
                  let timer: ReturnType<typeof setTimeout>;
                  container.addEventListener("scroll", onScrollEnd, { passive: true });
                }}
                className={`w-full text-left text-sm py-1.5 px-3 rounded transition-colors ${
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {getLabel(section)}
              </button>
            </li>
          ))}
          <ChallengeNameSidebarItems activeSection={activeSection} setActiveSection={setActiveSection} isClickScrollingRef={isClickScrollingRef} />
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-6">
      {/* Hidden Toggle */}
      <CustomYesNoToggle name="hidden" label="Hidden" />

      {/* Basic Information Section */}
      <div id="section-basic-info" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {t("basicInfo")}
        </h3>
        <BMImageUpload logoUrl={logoUrl} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomInput
            type="text"
            label={t("firmTitle")}
            name="title"
            fieldClassName="h-11"
            placeholder={t("firmTitlePlaceholder")}
            required
          />
          <CustomSelect
            name="isPopular"
            label={t("markPopular")}
            placeholder={t("selectStatus")}
            options={[
              { value: "true", label: t("yes") },
              { value: "false", label: t("no") },
            ]}
          />
          <CustomInput
            type="text"
            label={t("ceo")}
            name="ceo"
            fieldClassName="h-11"
            placeholder={t("ceoPlaceholder")}
            required
          />

          <MonthAndYear />
          <CustomComboBoxMultiple
            name="country"
            mode="single"
            label={t("primaryCountry")}
            placeholder={t("countryPlaceholder")}
            options={countries.map((country) => ({
              value: country.country,
              name: country.country,
              image: country?.flag,
            }))}
            required
          />

          <CustomComboBoxMultiple
            name="programTypes"
            label={t("programTypes")}
            placeholder={t("programTypesPlaceholder")}
            options={programTypes}
            required
          />

          <CustomComboBoxMultiple
            name="otherFeatures"
            label={t("otherFeatures")}
            placeholder={t("otherFeaturesPlaceholder")}
            options={otherFeatures.map((otherFeature) => ({
              value: otherFeature.value,
              name: otherFeature.name,
            }))}
          />

          <ChallengeNamesField />

          <div className="md:col-span-2 space-y-4">
            <CustomComboBoxMultiple
              name="restrictedCountries"
              label={t("restrictedCountries")}
              placeholder={t("restrictedCountriesPlaceholder")}
              options={countries.map((country) => ({
                value: country.country,
                name: country.country,
                image: country?.flag,
              }))}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RichTextEditor2 name="restrictedCountriesNote" label="Restricted Countries Note (English)" mobileFontSizeName="restrictedCountriesNoteMobileFontSize" />
              <RichTextEditor2 name="restrictedCountriesNoteArabic" label="Restricted Countries Note (Arabic)" />
            </div>
          </div>
        </div>
      </div>

      <div id="section-firm-overview" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.firmOverview")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomComboBoxMultiple
            name="brokers"
            isLoading={isLoadingBrokers}
            label={t("brokers")}
            placeholder={t("brokersPlaceholder")}
            options={allBrokers.map((broker) => ({
              value: broker.id,
              image: broker.logoUrl,
              name: broker.title,
            }))}
            required
          />
          <CustomComboBoxMultiple
            name="platforms"
            isLoading={isLoadingPlatforms}
            label={t("platforms")}
            placeholder={t("platformsPlaceholder")}
            options={allPlatforms.map((platform) => ({
              value: platform.id,
              image: platform.logoUrl,
              name: platform.title,
            }))}
            required
          />
          <CustomComboBoxMultiple
            name="paymentMethods"
            isLoading={isLoadingPaymentMethods}
            label={t("paymentMethods")}
            placeholder={t("paymentMethodsPlaceholder")}
            options={allPaymentMethods.map((paymentMethod) => ({
              value: paymentMethod.id,
              name: paymentMethod.title,
              image: paymentMethod.logoUrl,
            }))}
            required
          />
          <CustomComboBoxMultiple
            name="payoutMethods"
            isLoading={isLoadingPaymentMethods}
            label={t("payoutMethods")}
            placeholder={t("payoutMethodsPlaceholder")}
            options={allPaymentMethods.map((payoutMethod) => ({
              value: payoutMethod.id,
              name: payoutMethod.title,
              image: payoutMethod.logoUrl,
            }))}
            required
          />
          <CustomComboBoxMultiple
            name="typeOfInstruments"
            label={t("instruments")}
            placeholder={t("instrumentsPlaceholder")}
            options={propFirmInstrumentTypes}
            required
          />
        </div>
      </div>

      {/* Leverages Section */}
      <div id="section-leverage" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.leverage")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="leverage" label={"English"} required mobileFontSizeName="leverageMobileFontSize" />
          <RichTextEditor2 name="leverageArabic" label={"Arabic"} required />
        </div>
      </div>
      <div id="section-commissions" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.commissions")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="commission" label={"English"} required mobileFontSizeName="commissionMobileFontSize" />
          <RichTextEditor2 name="commissionArabic" label={"Arabic"} required />
        </div>
      </div>
      <div id="section-account-sizes" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.accountSizes")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="accountSizes" label={"English"} required mobileFontSizeName="accountSizesMobileFontSize" />
          <RichTextEditor2
            name="accountSizesArabic"
            label={"Arabic"}
            required
          />
        </div>
      </div>

      {/* Financial Information Section */}
      <div id="section-financial-details" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {t("financialDetails")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CustomInput
            type="number"
            label={t("maxAllocation")}
            name="maxAllocation"
            fieldClassName="h-11"
            placeholder={t("maxAllocationPlaceholder")}
            required
          />
          <CustomInput
            type="text"
            label={t("affiliateLink")}
            name="affiliateLink"
            fieldClassName="h-11"
            placeholder={t("affiliateLinkPlaceholder")}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="allocationRules"
            label={t("allocationRules")}
            required
            mobileFontSizeName="allocationRulesMobileFontSize"
          />
          <RichTextEditor2
            name="allocationRulesArabic"
            label={t("allocationRulesArabic")}
            required
          />
        </div>
      </div>

      <div id="section-daily-max-loss" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.dailyMaximumLoss")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="dailyMaxLoss" label={"English"} required mobileFontSizeName="dailyMaxLossMobileFontSize" />
          <RichTextEditor2
            name="dailyMaxLossArabic"
            label={"Arabic"}
            required
          />
        </div>
      </div>
      <div id="section-drawdown" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.drawdown")}
        </h3>
        <CustomComboBoxMultiple
          name="drawDowns"
          label={t("drawdowns")}
          placeholder={t("drawdownsPlaceholder")}
          options={drawDowns.map((drawDown) => ({
            value: drawDown.value,
            name: drawDown.name,
          }))}
          required
          extraFunction={extraFunction}
        />
        <DrawDownProgramTypes />
        <DrawDownTexts />
      </div>

      {!isFutures && (
        <div id="section-risk-management" className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">
            {tSidebar("items.riskManagement")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RichTextEditor2 name="riskManagement" label={"English"} required mobileFontSizeName="riskManagementMobileFontSize" />
            <RichTextEditor2
              name="riskManagementArabic"
              label={"Arabic"}
              required
            />
          </div>
        </div>
      )}

      <div id="section-consistency-rules" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.consistencyRules")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="consistencyRules" label={"English"} required mobileFontSizeName="consistencyRulesMobileFontSize" />
          <RichTextEditor2
            name="consistencyRulesArabic"
            label={"Arabic"}
            required
          />
        </div>
      </div>

      {!isFutures && (
        <div id="section-minimum-trading-days" className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">
            {tSidebar("items.minimumTradingDays")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RichTextEditor2
              name="minimumTradingDays"
              label={"English"}
              required
              mobileFontSizeName="minimumTradingDaysMobileFontSize"
            />
            <RichTextEditor2
              name="minimumTradingDaysArabic"
              label={"Arabic"}
              required
            />
          </div>
        </div>
      )}

      {/* News Trading Rules */}
      <div id="section-news-trading" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.newsTrading")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="newsTradingAllowedRules"
            label={"Allowed Rules"}
            required
            mobileFontSizeName="newsTradingAllowedRulesMobileFontSize"
          />
          <RichTextEditor2
            name="newsTradingAllowedRulesArabic"
            label={"Allowed Rules Arabic"}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="newsTradingNotAllowedRules"
            label={"Not Allowed Rules"}
            required
            mobileFontSizeName="newsTradingNotAllowedRulesMobileFontSize"
          />
          <RichTextEditor2
            name="newsTradingNotAllowedRulesArabic"
            label={"Not Allowed Rules Arabic"}
            required
          />
        </div>
      </div>

      <div id="section-overnight-weekends" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.overnightWeekendsHolding")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="overnightAndWeekendsHolding"
            label={"English"}
            required
            mobileFontSizeName="overnightAndWeekendsHoldingMobileFontSize"
          />
          <RichTextEditor2
            name="overnightAndWeekendsHoldingArabic"
            label={"Arabic"}
            required
          />
        </div>
      </div>

      {/* Copy Trading Rules */}
      <div id="section-copy-trading" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.copyTrading")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="copyTradingAllowedRules"
            label={"Allowed Rules English"}
            required
            mobileFontSizeName="copyTradingAllowedRulesMobileFontSize"
          />
          <RichTextEditor2
            name="copyTradingAllowedRulesArabic"
            label={"Allowed Rules Arabic"}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="copyTradingNotAllowedRules"
            label={"Not Allowed Rules English"}
            required
            mobileFontSizeName="copyTradingNotAllowedRulesMobileFontSize"
          />
          <RichTextEditor2
            name="copyTradingNotAllowedRulesArabic"
            label={"Not Allowed Rules Arabic"}
            required
          />
        </div>
      </div>

      {/* Experts Rules */}
      <div id="section-experts" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.experts")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="expertsAllowedRules"
            label={"Allowed Rules English"}
            mobileFontSizeName="expertsAllowedRulesMobileFontSize"
          />
          <RichTextEditor2
            name="expertsAllowedRulesArabic"
            label={"Allowed Rules Arabic"}
          />
          <RichTextEditor2
            name="expertsNotAllowedRules"
            label={"Not Allowed Rules English"}
            mobileFontSizeName="expertsNotAllowedRulesMobileFontSize"
          />
          <RichTextEditor2
            name="expertsNotAllowedRulesArabic"
            label={"Not Allowed Rules Arabic"}
          />
        </div>
      </div>

      <div id="section-vpn-vps" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.vpnVps")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="vpnVps" label={"English"} required mobileFontSizeName="vpnVpsMobileFontSize" />
          <RichTextEditor2 name="vpnVpsArabic" label={"Arabic"} required />
        </div>
      </div>

      {!isFutures && (
        <div id="section-profit-share" className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">
            {tSidebar("items.profitShare")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RichTextEditor2 name="profitShare" label={"English"} required mobileFontSizeName="profitShareMobileFontSize" />
            <RichTextEditor2
              name="profitShareArabic"
              label={"Arabic"}
              required
            />
          </div>
        </div>
      )}

      <div id="section-payout-policy" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.payoutPolicy")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="payoutPolicy" label={"English"} required mobileFontSizeName="payoutPolicyMobileFontSize" />
          <RichTextEditor2
            name="payoutPolicyArabic"
            label={"Arabic"}
            required
          />
        </div>
      </div>

      {!isFutures && (
        <div id="section-scale-up" className="space-y-4">
          <h3 className="text-sm font-semibold border-b pb-2">
            {tSidebar("items.scaleUpPlan")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RichTextEditor2 name="scaleupPlans" label={"English"} mobileFontSizeName="scaleupPlansMobileFontSize" />
            <RichTextEditor2 name="scaleupPlansArabic" label={"Arabic"} />
          </div>
        </div>
      )}

      <div id="section-inactivity-rules" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.inactivityRules")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2 name="inactivityRules" label={"English"} required mobileFontSizeName="inactivityRulesMobileFontSize" />
          <RichTextEditor2
            name="inactivityRulesArabic"
            label={"Arabic"}
            required
          />
        </div>
      </div>
      <div id="section-prohibited-strategies" className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          {tSidebar("items.prohibitedStrategies")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RichTextEditor2
            name="prohibitedStrategies"
            label={"English"}
            required
            mobileFontSizeName="prohibitedStrategiesMobileFontSize"
          />
          <RichTextEditor2
            name="prohibitedStrategiesArabic"
            label={"Arabic"}
            required
          />
        </div>
      </div>

      {/* Dynamic Per-Challenge-Name Settings Sections — isolated to avoid full form re-renders */}
      <ChallengeNameSettingsSections />
      </div>{/* end content */}
    </div>
  );
}
