import SectionTitle from '@/components/Global/SectionTitle';
import { getTranslations } from 'next-intl/server';
import HINFilter from './HINFilter';
import HINTable from './HINTable';

export default async function HighImpactNews() {
    const t = await getTranslations('HighImpactNews');

    return (
        <div id="high-impact-news-section" className='space-y-8 pb-10 md:pb-14'>
            <SectionTitle
                title={t('title')}
                subtitle={t('subtitle')}
                subtitleClass="font-semibold"
            />
            <HINFilter />
            <HINTable />
        </div>
    );
}