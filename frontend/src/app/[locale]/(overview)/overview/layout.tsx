import Sidebar from "@/components/Overview/Sidebar";
import "@/styles/globals.css";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function OverviewLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <div className="flex relative min-h-screen bg-card/80">
      <div className="h-max sticky top-0 z-50">
        <Sidebar />
      </div>
      <main className="flex-1 min-h-screen w-full min-w-0 transition-[padding] duration-300">
        <div className="w-full pt-16 px-4 md:px-6 lg:px-8 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}
