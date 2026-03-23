import Logo from "@/utils/Logo";
import ForexFeatureToggle from "./ForexFeatureToggle";
import "@/styles/globals.css";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
export default async function ComingSoon() {
  const t = await getTranslations("Navbar");
  return (
    <div className="bg-primary h-screen overflow-hidden relative">
      <div className="absolute top-5 left-5 flex gap-3 z-20">
        <Link href={"/#top"}>
          <Button variant={"outline"}>
            <ArrowLeft /> {t("home")}
          </Button>
        </Link>
      </div>
      <div className="pt-8 flex justify-center  bg-background h-[calc(100vh-260px)] md:h-[calc(100vh-420px)] relative">
        <div className="relative z-20">
          <ForexFeatureToggle />
        </div>
        <div className="fixed w-full h-full top-0 flex justify-center items-center flex-col gap-5 z-10 p-5">
          <div className="aspect-8/9 h-45 md:h-[220px] lg:h-[280px]  xl:h-[303px] relative">
            <Logo />
          </div>
          <div className="space-y-3.5 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
              Coming Soon
            </h1>
            <p className="text-sm font-normal text-gray-200">
              Be ready for the best platform for comparing funded for you
            </p>
          </div>
        </div>
        <div className="w-[calc(100vw+100px)] h-80 md:h-150 absolute -bottom-40 md:-bottom-75 blur-xl bg-shadow-500 bg-background rounded-[50%] shadow-[0_80px_80px_rgba(0,0,0,0.8)]"></div>
      </div>
    </div>
  );
}
