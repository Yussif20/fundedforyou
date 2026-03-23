import Announcements from "@/components/Forex_Features/Announcements/Announcements";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <Announcements firmId={slug} />
    </>
  );
}
