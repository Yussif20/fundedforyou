// app/[slug]/page.tsx

import FirmOverview from "@/components/FirmDetails/FirmOverview";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; type: string; locale: string }>;
}) {
  const { slug, type, locale } = await params;
  return (
    <>
      <FirmOverview slug={slug} type={type} locale={locale} />
    </>
  );
}
