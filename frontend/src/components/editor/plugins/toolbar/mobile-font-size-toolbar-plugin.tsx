"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

const MIN = 10;
const MAX = 24;
const DEFAULT = 12;

export function MobileFontSizeToolbarPlugin({
  value,
  onChange,
}: {
  value: number;
  onChange: (size: number) => void;
}) {
  const clamp = (n: number) => Math.min(Math.max(n, MIN), MAX);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        Mobile px:
      </span>
      <ButtonGroup>
        <Button
          variant="outline2"
          className="!size-8"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= MIN}
          type="button"
        >
          <Minus className="size-3" />
        </Button>
        <Input
          withoutLinearBorder
          value={value}
          onChange={(e) => onChange(clamp(parseInt(e.target.value) || DEFAULT))}
          className="!h-8 w-12 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
          min={MIN}
          max={MAX}
          type="number"
        />
        <Button
          variant="outline2"
          className="!size-8"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= MAX}
          type="button"
        >
          <Plus className="size-3" />
        </Button>
      </ButtonGroup>
    </div>
  );
}
