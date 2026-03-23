import { Link } from "@/i18n/navigation";
import { useGetAllAnnouncementsQuery } from "@/redux/api/announcementApi";
import { useTranslations } from "next-intl";
import { IoMegaphone } from "react-icons/io5";
import SingleAnnouncement from "../Forex_Features/Announcements/SingleAnnouncement";
import { Button } from "../ui/button";

export default function SideAnnouncements({ slug }: { slug: string }) {
  const t = useTranslations("SideAnnouncements");
  const { data, isLoading } = useGetAllAnnouncementsQuery({
    firmId: slug,
    params: [
      {
        name: "limit",
        value: 1,
      },
    ],
  });

  const announcement = (data?.data?.announcements || [])[0];

  if (isLoading) return;

  return (
    <div className="w-full lg:w-74 space-y-2 text-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <IoMegaphone className="text-primary" size={24} />
          <h2 className="font-semibold">{t("title")}</h2>
        </div>
        <Link href={`${slug}/announcements`}>
          <Button className="px-0!" variant={"link"}>
            {t("seeAll")}
          </Button>
        </Link>
      </div>
      <SingleAnnouncement smallVersion announcement={announcement} />
    </div>
  );
}
