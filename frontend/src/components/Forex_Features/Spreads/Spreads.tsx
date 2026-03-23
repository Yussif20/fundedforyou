import SpreadFilter from "./SpreadFilter";
import SpreadTable from "./SpreadTable";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";

export default async function Spreads() {
  const t = await getTranslations("Spread");
  const locale = await getLocale();
  const isArabic = locale === "ar";

  return (
    <div className="space-y-8">
      <div className="text-center flex justify-center items-center flex-col gap-3">
        <h1 className="font-bold text-4xl lg:text-5xl xl:text-6xl max-w-2xl">
          {t("title")}
        </h1>
        <p className="text-sm md:text-sm text-foreground/80 max-w-3xl">
          {t("subtitle")}
        </p>
      </div>
      
      {/* Coming Soon Section */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background p-12 md:p-16">
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative flex flex-col items-center justify-center gap-6 text-center">
          {/* Main Title */}
          <h2 className={`text-5xl md:text-7xl bg-gradient-to-r from-primary1 via-primary to-primary2 bg-clip-text text-transparent ${isArabic ? 'font-bold' : 'font-bold'} leading-tight pb-2`}>
            {t("comingSoon")}
          </h2>
          
          {/* Description - Split into 2 lines */}
          <div className={`text-base md:text-lg text-muted-foreground max-w-xl ${isArabic ? 'font-bold' : ''}`}>
            <p className="leading-relaxed whitespace-pre-line">{t("comingSoonMessage")}</p>
          </div>
        </div>
      </div>

      {/* Original Components - Hidden for easy rollback */}
      <div className="hidden">
        <SpreadFilter />
        <SpreadTable />
      </div>
    </div>
  );
}
