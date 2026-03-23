'use client'

import useIsArabic from "@/hooks/useIsArabic";
import { cn } from "@/lib/utils";

export default function HowItWorksLine({ isShow }: { isShow: boolean }) {
    const isArabic = useIsArabic()
    return (
        <>
            {isShow && (
                <div className={cn('absolute left-5 top-[30px] bottom-0 border-r-2 border-primary border-dashed bg-border h-full w-0', isArabic && 'right-5')} />
            )}
        </>
    );
}