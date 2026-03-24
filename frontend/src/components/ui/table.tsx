"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, containerClassName, ...props }: React.ComponentProps<"table"> & { containerClassName?: string }) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [showTopScroll, setShowTopScroll] = React.useState(false);
  const [thumbWidth, setThumbWidth] = React.useState(0);
  const [thumbLeft, setThumbLeft] = React.useState(0);
  const dragging = React.useRef(false);
  const dragStartX = React.useRef(0);
  const dragStartLeft = React.useRef(0);

  React.useEffect(() => {
    const container = tableContainerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const isRTL = () => getComputedStyle(container).direction === "rtl";

    const update = () => {
      const { scrollWidth, clientWidth, scrollLeft } = container;
      const overflows = scrollWidth > clientWidth;
      setShowTopScroll(overflows);
      if (!overflows) return;

      const trackW = track.clientWidth;
      const ratio = clientWidth / scrollWidth;
      const tw = Math.max(ratio * trackW, 40);
      const maxThumbLeft = trackW - tw;
      const maxScroll = scrollWidth - clientWidth;

      let scrollRatio: number;
      if (isRTL()) {
        // RTL: scrollLeft is 0 at right edge, negative as you scroll left
        scrollRatio = Math.abs(scrollLeft) / maxScroll;
      } else {
        scrollRatio = scrollLeft / maxScroll;
      }

      setThumbWidth(tw);
      setThumbLeft(isRTL() ? (1 - scrollRatio) * maxThumbLeft : scrollRatio * maxThumbLeft);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(track);
    const table = container.querySelector("table");
    if (table) ro.observe(table);

    container.addEventListener("scroll", update);
    return () => {
      ro.disconnect();
      container.removeEventListener("scroll", update);
    };
  }, []);

  const handleTrackClick = (e: React.MouseEvent) => {
    const container = tableContainerRef.current;
    const track = trackRef.current;
    if (!container || !track || dragging.current) return;

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const trackW = track.clientWidth;
    const { scrollWidth, clientWidth } = container;
    const maxScroll = scrollWidth - clientWidth;
    const ratio = clickX / trackW;
    const rtl = getComputedStyle(container).direction === "rtl";
    container.scrollLeft = rtl ? -((1 - ratio) * maxScroll) : ratio * maxScroll;
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current = true;
    dragStartX.current = e.clientX;
    dragStartLeft.current = thumbLeft;

    const handleMouseMove = (ev: MouseEvent) => {
      const container = tableContainerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const delta = ev.clientX - dragStartX.current;
      const trackW = track.clientWidth;
      const maxThumbLeft = trackW - thumbWidth;
      const newLeft = Math.min(Math.max(0, dragStartLeft.current + delta), maxThumbLeft);
      const scrollRatio = newLeft / maxThumbLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const rtl = getComputedStyle(container).direction === "rtl";
      container.scrollLeft = rtl ? -((1 - scrollRatio) * maxScroll) : scrollRatio * maxScroll;
    };

    const handleMouseUp = () => {
      dragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative w-full">
      {/* Custom top scrollbar – always in DOM for ref, hidden when not needed */}
      <div
        ref={trackRef}
        className={cn(
          "mx-1 rounded-full bg-white/[0.06] border border-white/[0.08] cursor-pointer relative",
          showTopScroll
            ? "hidden md:block h-[14px] mb-2"
            : "h-0 overflow-hidden border-0 mb-0",
        )}
        onClick={handleTrackClick}
        aria-hidden
      >
        <div
          ref={thumbRef}
          className="absolute top-[2px] bottom-[2px] rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb,34,197,94),0.4)] cursor-grab active:cursor-grabbing transition-[background] duration-150 hover:bg-primary/90"
          style={{ width: thumbWidth, left: thumbLeft }}
          onMouseDown={handleThumbMouseDown}
        />
      </div>

      <div
        ref={tableContainerRef}
        data-slot="table-container"
        className={cn(
          "relative w-full overflow-x-auto scrollbar-hide",
          containerClassName,
        )}
      >
        <table
          data-slot="table"
          className={cn(
            "w-full caption-bottom border-collapse",
            "text-[11px] md:text-xs",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-border/30",
        className,
      )}
      {...props}
    />
  );
}

function TableBody({
  className,
  children,
  emptyMessage = "No data found.",
  colSpan,
  ...props
}: React.ComponentProps<"tbody"> & { emptyMessage?: string; colSpan: number }) {
  const newProps = { children, ...props };
  const hasChildren = React.Children.count(children) > 0;
  return (
    <tbody
      data-slot="table-body"
      className={cn(className)}
      {...newProps}
    >
      {hasChildren ? (
        children
      ) : (
        <tr data-slot="table-row" className="border-b border-border/40">
          <td
            data-slot="table-cell"
            className="py-8 px-3 md:py-12 md:px-4 align-middle text-center text-muted-foreground text-[11px] md:text-xs italic"
            colSpan={colSpan}
          >
            {emptyMessage}
          </td>
        </tr>
      )}
    </tbody>
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border/30 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border/30 transition-all duration-200",
        "hover:bg-primary/[0.04] data-[state=selected]:bg-primary/[0.08]",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  children,
  center = false,
  ...props
}: React.ComponentProps<"th"> & { center?: boolean }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground/90 text-left align-middle font-semibold whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        "py-2.5 px-2.5 md:py-4 md:px-3.5 tracking-tight",
        "relative after:absolute after:top-[20%] after:bottom-[20%] after:w-px after:bg-border/40 ltr:after:right-0 rtl:after:left-0 last:after:hidden",
        className,
      )}
      {...props}
    >
      {center ? (
        <div className="flex justify-center items-center">{children}</div>
      ) : (
        children
      )}
    </th>
  );
}

function TableCell({
  className,
  children,
  center = false,
  ...props
}: React.ComponentProps<"td"> & { center?: boolean }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle whitespace-nowrap text-foreground/85",
        "[&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        "py-2.5 px-2.5 md:py-3.5 md:px-3.5",
        "relative after:absolute after:top-[20%] after:bottom-[20%] after:w-px after:bg-border/40 ltr:after:right-0 rtl:after:left-0 last:after:hidden",
        className,
      )}
      {...props}
    >
      {center ? (
        <div className="flex justify-center items-center">{children}</div>
      ) : (
        children
      )}
    </td>
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-xs font-medium", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
