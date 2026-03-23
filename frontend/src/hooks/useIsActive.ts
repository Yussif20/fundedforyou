import { usePathname } from "@/i18n/navigation";

export default function useIsActive() {
  const pathName = usePathname();
  const isActive = (path: string, strictCheck: string[] = ["/"]) => {
    // Strip query params so "/challenges?size=100000" matches pathname "/challenges"
    const cleanPath = path.split("?")[0];
    if (strictCheck.includes(cleanPath)) {
      return pathName === cleanPath;
    }
    return pathName.startsWith(cleanPath);
  };
  return isActive;
}
