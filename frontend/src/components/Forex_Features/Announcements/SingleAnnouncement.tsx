import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { Announcement_T } from "@/types/announcement.types";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { AddEditAnnouncementDialog } from "./AddAnnouncementDialog";

export default function SingleAnnouncement({
  announcement,
  smallVersion,
}: {
  announcement: Announcement_T;
  smallVersion?: boolean;
}) {
  const user = useAppSelector(useCurrentUser);

  return (
    <Card className="w-full border-border relative">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-6">
          {!smallVersion && (
            <div className="shrink-0">
              <img
                src={announcement?.thumbnailUrl}
                alt={announcement?.title}
                className="w-full md:w-80 h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {user?.role === "SUPER_ADMIN" && (
            <div className="absolute top-2 right-2">
              <AddEditAnnouncementDialog
                firmId={announcement?.firmId}
                announcement={announcement}
              />
            </div>
          )}

          <div className="flex-1">
            <CardTitle
              className={cn(
                "text-lg lg:text-2xl mb-4",
                smallVersion && "text-base lg:text-lg"
              )}
            >
              {announcement?.title}
            </CardTitle>

            {/* HTML CONTENT */}
            <div
              className="mfs-content space-y-4 text-sm text-muted-foreground danger-html"
              dir="ltr"
              style={
                announcement?.mobileFontSize
                  ? ({
                      "--mobile-fs": `${announcement.mobileFontSize}px`,
                    } as React.CSSProperties)
                  : undefined
              }
              dangerouslySetInnerHTML={{ __html: announcement?.description }}
            />
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent>
        <div
          className={cn(
            "flex sm:items-center justify-between flex-col sm:flex-row gap-3",
            smallVersion && "flex-col!"
          )}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(announcement?.date).toLocaleDateString()}</span>
          </div>

          <Link
            href={announcement?.redirectUrl || ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="w-full">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function SingleAnnouncementSkeleton({
  smallVersion,
}: {
  smallVersion?: boolean;
}) {
  return (
    <div className="w-full border border-border rounded-lg p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {!smallVersion && (
          <Skeleton className="w-full md:w-80 h-48 rounded-lg" />
        )}
        <div className="flex-1 space-y-4">
          <Skeleton className={smallVersion ? "h-6 w-3/4" : "h-8 w-full"} />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}
