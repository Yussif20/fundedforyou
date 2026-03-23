import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function BS_ArrowBtn() {
    const locale = useLocale();
    return (
        <Button
            size={'icon'}
            variant={'outline2'}
            className={locale === 'ar' ? 'rotate-180' : ''}
        >
            <ArrowRight />
        </Button>
    );
}