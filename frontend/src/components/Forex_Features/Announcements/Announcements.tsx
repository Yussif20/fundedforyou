"use client";

import { Pagination } from "@/components/Global/Pagination";
import { useGetAllAnnouncementsQuery } from "@/redux/api/announcementApi";
import { useCurrentUser } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { useSearchParams } from "next/navigation";
import { AddEditAnnouncementDialog } from "./AddAnnouncementDialog";
import AnnouncementSort from "./AnnouncementSort";
import SingleAnnouncement, {
  SingleAnnouncementSkeleton,
} from "./SingleAnnouncement";

export default function Announcements({ firmId }: { firmId: string }) {
  const user = useAppSelector(useCurrentUser);

  // Get query params
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") ?? "";
  const page = searchParams.get("page") ?? "";

  const { data, isLoading, isFetching } = useGetAllAnnouncementsQuery({
    firmId,
    params: [
      {
        name: "sort",
        value: sort,
      },
      {
        name: "page",
        value: page,
      },
    ],
  });

  const announcements = data?.data?.announcements || [];
  const meta = data?.meta;

  return (
    <div className="space-y-10">
      <div className="flex gap-3 items-center ml-auto w-fit">
        <AnnouncementSort />
        {user?.role == "SUPER_ADMIN" && (
          <AddEditAnnouncementDialog firmId={firmId} />
        )}
      </div>

      {isLoading && isFetching ? (
        [1, 2, 3].map((i) => <SingleAnnouncementSkeleton key={i} />)
      ) : announcements.length > 0 ? (
        announcements.map((item, idx) => (
          <SingleAnnouncement key={idx} announcement={item} />
        ))
      ) : (
        <div className="text-center text-muted-foreground py-10">
          No announcements found
        </div>
      )}

      <Pagination totalPages={meta?.totalPage || 1} />
    </div>
  );
}
