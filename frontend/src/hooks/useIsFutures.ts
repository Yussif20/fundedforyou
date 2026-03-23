import { usePathname } from "@/i18n/navigation"

export default function useIsFutures() {
    const pathName = usePathname()
    return pathName.startsWith('/futures')

}