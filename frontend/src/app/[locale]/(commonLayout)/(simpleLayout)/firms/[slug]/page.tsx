// app/[slug]/page.tsx

import FirmOverview from "@/components/FirmDetails/FirmOverview";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; locale: string; type: string }>;
}) {
  const { slug, locale, type } = await params;

  return (
    <>
      <FirmOverview slug={slug} locale={locale} type={type} />
    </>
  );
}
