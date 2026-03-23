"use client";
import Image from "next/image";
import logo1 from "@/assets/logo.png";
import logo2 from "@/assets/logo-yellow.png";
import { cn } from "@/lib/utils";
import { usePathname } from "@/i18n/navigation";
export default function Logo() {
  const pathName = usePathname();
  const logo = pathName.startsWith("/futures") ? logo2 : logo1;
  return <Image src={logo} alt="image" fill className={cn("object-cover")} />;
}
