import OfferFilter from "@/components/Forex_Features/Offers/OfferFilter";
import OfferList from "@/components/Forex_Features/Offers/OfferList";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="space-y-8">
      <OfferFilter />
      <OfferList companySlug={slug} />
    </div>
  );
}
