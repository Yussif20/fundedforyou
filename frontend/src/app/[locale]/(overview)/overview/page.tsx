"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";

export default function Page() {
  const router = useRouter();
  const pathName = usePathname();
  const user = useAppSelector(useCurrentUser);

  useEffect(() => {
    if (pathName === "/overview") {
      if (user?.role === "MODERATOR") {
        router.replace("/overview/contact-messages");
      } else {
        router.replace("/overview/user-management");
      }
    }
  }, [pathName, router, user?.role]);

  return null;
}
