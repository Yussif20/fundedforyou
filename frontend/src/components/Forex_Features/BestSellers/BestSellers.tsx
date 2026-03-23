import SectionTitle from "@/components/Global/SectionTitle";
import BS_Filter from "./BS_Filter";
import BS_Table from "./BS_Table";
import BSCandlestickClient from "./BSCandlestickClient";
import { getTranslations } from "next-intl/server";

export default async function BestSellers() {
     const t = await getTranslations('BestSellers')
    return (
        <div id="best-sellers-section" className='space-y-8 pb-10 md:pb-14 rounded-2xl bg-foreground/[0.02] border border-foreground/5 px-4 py-8 md:px-8 relative overflow-hidden'>
            <BSCandlestickClient />
            <SectionTitle
                title={t('title')}
                subtitle={t('subtitle')}
            />
            <BS_Filter />
            <BS_Table />
        </div>
    );
}