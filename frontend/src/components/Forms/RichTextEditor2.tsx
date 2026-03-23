"use client";

import { useCallback } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import TTTextEditor from "./TTTextEditor";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

const MFS_MIN = 10;
const MFS_MAX = 24;
const MFS_DEFAULT = 12;

type TEditorFieldProps = {
  name: string;
  mobileFontSizeName?: string;
  label?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  editorClassName?: string;
  placeholder?: string;
};

const RichTextEditor2 = ({
  name,
  mobileFontSizeName,
  label,
  required,
  className,
  labelClassName,
}: TEditorFieldProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const watchedMfs = useWatch({
    control,
    name: (mobileFontSizeName ?? "__mfs_unused__") as string,
    defaultValue: undefined,
  });

  const mfsValue: number =
    mobileFontSizeName && watchedMfs != null
      ? (watchedMfs as number)
      : MFS_DEFAULT;

  const handleMfsChange = useCallback(
    (size: number) => {
      if (mobileFontSizeName) {
        const clamped = Math.min(Math.max(size, MFS_MIN), MFS_MAX);
        setValue(mobileFontSizeName, clamped, { shouldDirty: true });
      }
    },
    [mobileFontSizeName, setValue],
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? "This field is required" : false }}
      render={({ field }) => {
        return (
          <div className={cn("flex flex-col gap-2", className)}>
            {label && (
              <Label htmlFor={name} className={labelClassName}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <TTTextEditor
              onChange={field.onChange}
              value={field.value}
              errors={errors}
            />
            {mobileFontSizeName && (
              <div className="flex items-center gap-2 pt-1 border-t">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Mobile px:
                </span>
                <ButtonGroup>
                  <Button
                    variant="outline2"
                    className="!size-7"
                    type="button"
                    onClick={() => handleMfsChange(mfsValue - 1)}
                    disabled={mfsValue <= MFS_MIN}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <Input
                    withoutLinearBorder
                    type="number"
                    value={mfsValue}
                    onChange={(e) =>
                      handleMfsChange(
                        parseInt(e.target.value) || MFS_DEFAULT,
                      )
                    }
                    className="!h-7 w-12 text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
                    min={MFS_MIN}
                    max={MFS_MAX}
                  />
                  <Button
                    variant="outline2"
                    className="!size-7"
                    type="button"
                    onClick={() => handleMfsChange(mfsValue + 1)}
                    disabled={mfsValue >= MFS_MAX}
                  >
                    <Plus className="size-3" />
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default RichTextEditor2;
