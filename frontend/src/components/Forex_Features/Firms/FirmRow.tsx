import DiscountCard from "@/components/Global/DiscountCard";
import GaugeMeter from "@/components/Global/Icons/GaugeMeter";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  countryData,
  countryDataByCountry,
} from "@/data";
import { formatCurrencyShort, formatMaxAllocationToK } from "@/lib/formatCurrencyShort ";
import { SinglePropFirm } from "@/types/firm.types";
import Image from "next/image";
import React, { type ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import FirmCell from "./FirmCell";
import PlatformCell from "./PlatformCell";
import { ArrowUpRight } from "lucide-react";
import { EditFirmDialog } from "@/components/FirmDetails/EditFirmDialog";
import DeleteFirmDialog from "@/components/FirmDetails/DeleteFirmDialog";
import FirmIndexChange from "./FirmIndexChange";
import { calculateYearsInOperation } from "@/utils/calculateYearsInOperation";

function FirmRow({
  company,
  prevCompany,
  nextCompany,
  visibleColumns,
  userRole,
}: {
  company: SinglePropFirm;
  prevCompany: SinglePropFirm;
  nextCompany: SinglePropFirm;
  visibleColumns?: string[];
  userRole?: string;
}) {
  const t = useTranslations("Firms");
  const country =
    countryDataByCountry(company.country) || countryData(company.country);

  const cellRenderers: Record<string, ReactNode> = {
    country: (
      <TableCell key="country">
        <div className="flex items-center gap-1 justify-center">
          <div className="w-5 h-3.5 md:w-6 md:h-4 relative">
            <Image
              src={country?.flag || ""}
              alt="image"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <p className="text-xs md:text-base font-semibold"> {country?.code}</p>
        </div>
      </TableCell>
    ),
    yearsInOperation: (
      <TableCell key="yearsInOperation">
        <GaugeMeter
          value={calculateYearsInOperation(company.dateEstablished)}
        />
      </TableCell>
    ),
    platforms: (
      <PlatformCell key="platforms" platforms={company.platforms} />
    ),
    maxAllocation: (
      <TableCell key="maxAllocation">
        <p className="text-center font-bold text-xs md:text-base text-primary">
          {(() => {
            const n = Number(company.maxAllocation);
            return !Number.isNaN(n)
              ? `$${formatMaxAllocationToK(company.maxAllocation)}`
              : formatCurrencyShort(company.maxAllocation);
          })()}
        </p>
      </TableCell>
    ),
    discount: (
      <TableCell key="discount">
        {(company.offers?.[0]?.offerPercentage || company.offers?.[0]?.discountType === "TEXT") ? (
          <DiscountCard
            discount={{
              code: company.offers[0].code || "",
              description: company.offers[0].code || "",
              offerPercentage: company.offers[0].offerPercentage,
              discountType: company.offers[0].discountType,
              discountText: company.offers[0].discountText,
              discountTextArabic: company.offers[0].discountTextArabic,
            }}
          />
        ) : (
          <p className="text-center text-foreground/30 text-xs md:text-base font-medium">—</p>
        )}
      </TableCell>
    ),
    visitFirm: (
      <TableCell key="visitFirm">
        <div className="flex justify-center">
          <Link href={company.affiliateLink || "#"} target="_blank">
            <span className="group/visit inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_12px_rgba(var(--primary-rgb,34,197,94),0.3)] hover:scale-[1.03] active:scale-[0.97] cursor-pointer">
              {t("visitFirm")}
              <ArrowUpRight className="size-3.5 shrink-0 transition-transform duration-200 group-hover/visit:translate-x-0.5 group-hover/visit:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/visit:-translate-x-0.5 rtl:group-hover/visit:translate-x-0" />
            </span>
          </Link>
        </div>
      </TableCell>
    ),
  };

  // Fallback: show all columns in default order when no customization
  const columnsToRender = visibleColumns ?? ["country", "yearsInOperation", "platforms", "maxAllocation", "discount", "visitFirm"];

  return (
    <TableRow className="relative group">
      <FirmCell
        company={{
          image: company.logoUrl,
          name: company.title,
          slug: company.slug,
        }}
      />
      {columnsToRender.map((key) => cellRenderers[key])}
      {userRole === "SUPER_ADMIN" && (
        <TableCell>
          <div className="flex gap-2">
            <EditFirmDialog firmId={company.id} />
            <DeleteFirmDialog id={company.id} />
            <FirmIndexChange
              firm={company}
              prevCompany={prevCompany}
              nextCompany={nextCompany}
            />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export default React.memo(FirmRow);
