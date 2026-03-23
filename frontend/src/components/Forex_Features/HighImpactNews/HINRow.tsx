"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { countryDataByCurrency } from "@/data";
import useIsArabic from "@/hooks/useIsArabic";
import { useCurrentGmt } from "@/redux/gmtSlice";
import { useAppSelector } from "@/redux/store";
import { News } from "@/types/newsType";
import { visibleText } from "@/utils/visibleText";
import Image from "next/image";
import { useCurrentUser } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { DeleteNews, EditNews } from "./NewsActions";
import NewsIndexChange from "./NewsIndexChange";

export default function HINRow({
  news,
  nextNews,
  prevNews,
  index: _index,
}: {
  news: News;
  nextNews: News;
  prevNews: News;
  index: number;
}) {
  const isArabic = useIsArabic();
  const gmt = useAppSelector(useCurrentGmt);
  const country = countryDataByCurrency(news.currency);
  const role = useAppSelector(useCurrentUser)?.role;

  const newsDate = new Date(news.dateAndTime);
  const gmtOffset = Number(gmt);

  const localTimeString = newsDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: `Etc/GMT${gmtOffset >= 0 ? "-" : "+"}${Math.abs(gmtOffset)}`,
  });

  return (
    <TableRow className="group transition-all duration-200 hover:bg-primary/[0.03] dark:hover:bg-primary/[0.06]">
      {/* Time */}
      <TableCell center className="border-border/30">
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg px-3.5 py-1.5 min-w-[100px] justify-center ring-1 ring-primary/10">
          <Clock className="size-3.5 text-primary/70" />
          <span className="text-sm font-semibold tabular-nums tracking-tight text-primary dark:text-primary/90">{localTimeString}</span>
        </div>
      </TableCell>
      {/* Currency */}
      <TableCell center className="border-border/30">
        <div className="inline-flex items-center gap-2.5 justify-center min-w-[100px] bg-muted/40 dark:bg-muted/20 rounded-lg px-3 py-1.5">
          <div className="w-7 h-7 relative rounded-full overflow-hidden ring-2 ring-primary/15 shadow-sm">
            <Image
              src={country?.flag || ""}
              alt={country?.currency || "flag"}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-bold tracking-wide">{country?.currency}</span>
        </div>
      </TableCell>
      {/* Event Title */}
      <TableCell center className="border-border/30">
        <div className="min-w-[200px] text-center whitespace-normal text-sm font-medium leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
          {visibleText(isArabic, news.title, news.titleArabic)}
        </div>
      </TableCell>
      {/* Admin Actions */}
      {role === "SUPER_ADMIN" && (
        <TableCell center className="border-border/30">
          <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-200">
            <EditNews news={news}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </EditNews>
            <DeleteNews news={news}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </DeleteNews>
            <NewsIndexChange
              news={news}
              prevNews={prevNews}
              nextNews={nextNews}
            />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
