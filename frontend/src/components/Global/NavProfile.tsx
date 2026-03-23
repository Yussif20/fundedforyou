"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMeQuery } from "@/redux/api/userApi";
import { logout, useCurrentToken } from "@/redux/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";

// icons
import useIsArabic from "@/hooks/useIsArabic";
import { Link } from "@/i18n/navigation";
import { ArrowLeftRight, Box, LayoutDashboard, LogOut, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";

export default function NavProfile() {
  const t = useTranslations("Navbar"); // 🔥 For i18n
  const isArabic = useIsArabic();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector(useCurrentToken);
  const { data, isLoading } = useGetMeQuery(undefined, { skip: !token });

  const profileUrl = data?.data?.user?.profile;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/sign-in");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoading ? (
          <Skeleton className="h-11 w-11 rounded-full" />
        ) : (
          <Avatar className="w-9 h-9 md:w-10 md:h-10 aspect-square cursor-pointer border-primary/60 border">
            <AvatarImage
              className="object-cover"
              src={profileUrl || ""}
              alt={t("profileImage")}
            />
            <AvatarFallback>
              <p className="text-xs md:text-base">
                {data?.data?.user?.fullName?.slice(0, 2) || "N"}
              </p>
            </AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="p-4">
        <div className="flex gap-3 items-center pb-4">
          <Avatar className="w-9 h-9 md:w-11 md:h-11 aspect-square cursor-pointer">
            <AvatarImage
              className="object-cover"
              src={profileUrl || ""}
              alt={t("profileImage")}
            />
            <AvatarFallback>
              <p className="text-xs md:text-base">
                {data?.data?.user?.fullName?.slice(0, 2) || "N"}
              </p>
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-base md:text-lg font-semibold">
              {data?.data?.user?.fullName}
            </h3>
            <p className="text-sm">{data?.data?.user?.email}</p>
          </div>
        </div>

        {(data?.data?.user?.role === "SUPER_ADMIN" || data?.data?.user?.role === "MODERATOR") && (
          <DropdownMenuItem dir={isArabic ? "rtl" : "ltr"} asChild>
            <Link href="/overview" className="flex items-center gap-2">
              <LayoutDashboard size={16} /> {t("overview")}
            </Link>
          </DropdownMenuItem>
        )}

        {(data?.data?.user?.role === "SUPER_ADMIN" || data?.data?.user?.role === "MODERATOR") && (
          <DropdownMenuItem dir={isArabic ? "rtl" : "ltr"} asChild>
            <Link href="/comparison" className="flex items-center gap-2">
              <ArrowLeftRight size={16} /> {t("comparison")}
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem dir={isArabic ? "rtl" : "ltr"} asChild>
          <Link href="profile" className="flex items-center gap-2">
            <User size={16} /> {t("profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem dir={isArabic ? "rtl" : "ltr"} asChild>
          <Link href="/onboarding" className="flex items-center gap-2">
            <Box size={16} /> {t("onboarding")}
          </Link>
        </DropdownMenuItem>

        <Separator />

        <DropdownMenuItem
          dir={isArabic ? "rtl" : "ltr"}
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 cursor-pointer font-medium"
        >
          <LogOut size={16} /> {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
