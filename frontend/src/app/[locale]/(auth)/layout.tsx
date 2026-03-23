import GoogleProviderWrapper from "@/components/Auth/GoogleProviderWrapper";
import Container from "@/components/Global/Container";
import NavLanguageChange from "@/components/Global/Navbar/NavLanguageChange";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import "@/styles/globals.css";
import { getCurrentSession } from "@/utils/user";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = await getCurrentSession();

  if (session) redirect("/");

  const t = await getTranslations("Navbar");
  return (
    <div>
      <Container className="w-full min-h-screen  flex justify-center items-center py-20 px-5 relative">
        <div className="absolute top-5 left-5 flex gap-3 z-10">
          <Link href={"/#top"}>
            <Button variant={"outline"} size="lg">
              <ArrowLeft /> {t("home")}
            </Button>
          </Link>
        </div>
        <div className="absolute top-5 right-5 z-20">
          <NavLanguageChange triggerClassName="px-3 py-2 text-base gap-2" />
        </div>
        <div className="flex justify-center items-center flex-col gap-5  min-h-full w-full">
          <GoogleProviderWrapper>{children}</GoogleProviderWrapper>
        </div>
        {/* Right Column: Promotional Section */}
      </Container>
    </div>
  );
}
