import ChallengesWithSearchState from "@/components/Forex_Features/Challenges/ChallengesWithSearchState";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  return (
    <ChallengesWithSearchState locale={locale} companySlug={slug} />
  );
}
