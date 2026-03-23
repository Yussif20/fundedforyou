"use client";

import { cn } from "@/lib/utils";
import { htmlToLexical } from "@/lib/htmlToLexical";
import TTTextEditor from "./TTTextEditor";

type TEditorFieldProps = {
  label?: string;
  className?: string; // container class
  labelClassName?: string;
  editorClassName?: string; // editor wrapper class
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

const EMPTY_EDITOR_STATE = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: null,
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

const RichTextEditorWithoutFormControl = ({
  label,
  className,
  labelClassName,
  editorClassName,
  value,
  onChange,
}: TEditorFieldProps) => {
  let parsedValue;
  try {
    parsedValue = value
      ? JSON.parse(htmlToLexical(value || ""))
      : EMPTY_EDITOR_STATE;

    // Validate that the parsed value has the required structure
    if (!parsedValue?.root || !parsedValue.root.type) {
      parsedValue = EMPTY_EDITOR_STATE;
    }
  } catch (error) {
    console.error("Error parsing editor value:", error);
    parsedValue = EMPTY_EDITOR_STATE;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <label className={cn("text-sm font-semibold pb-2", labelClassName)}>
          {label}
        </label>
      )}

      <div className={cn("border rounded p-2 min-h-[100px]", editorClassName)}>
        <TTTextEditor value={value} onChange={onChange} />
      </div>
    </div>
  );
};

export default RichTextEditorWithoutFormControl;
