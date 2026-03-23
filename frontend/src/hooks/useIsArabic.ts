import { usePathname } from 'next/navigation';

export default function useIsArabic() {
    const pathName = usePathname()
    return pathName.startsWith('/ar')

}