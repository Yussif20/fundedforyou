"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

export default function SortableColumnItem({
  id,
  label,
  onRemove,
}: {
  id: string;
  label: string;
  onRemove?: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: transform
      ? CSS.Transform.toString({ ...transform, x: 0 })
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 sm:gap-3 rounded-md sm:rounded-lg border border-border/60 bg-card/50 px-1.5 sm:px-3 py-1.5 sm:py-2.5 text-[11px] sm:text-sm transition-shadow ${
        isDragging ? "shadow-lg shadow-primary/20 ring-1 ring-primary/30 z-10" : "hover:border-primary/30"
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
      <span className="flex-1 font-medium">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(id)}
          className="text-muted-foreground/40 hover:text-destructive transition-colors"
        >
          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      )}
    </div>
  );
}
