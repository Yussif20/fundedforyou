import { cn } from "@/lib/utils";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontSize from "tiptap-extension-font-size";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Underline as LucideUnderline,
  Strikethrough,
  Link2,
  Image as LucideImage,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Code,
  Quote,
  ChevronDown,
  Plus,
  Table as LucideTable,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FieldErrors, FieldValues } from "react-hook-form";

export default function TTTextEditor({
  value,
  onChange,
  errors,
}: {
  value: string;
  onChange: any;
  errors?: FieldErrors<FieldValues>;
}) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [savedSelection, setSavedSelection] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const [, forceUpdate] = useState({});

  // Memoize extensions to prevent duplicate extension warnings on re-renders
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      FontSize as unknown as Extension,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border bg-muted font-bold p-2",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border p-2",
        },
      }),
    ],
    []
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4"
        ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      const currentFontSize = editor.getAttributes("textStyle").fontSize;
      if (currentFontSize) {
        const size = parseInt(currentFontSize);
        if (!isNaN(size)) {
          setFontSize(size);
        }
      } else {
        setFontSize(14);
      }
    };

    const handleUpdate = () => {
      updateFontSize();
      forceUpdate({});
    };

    editor.on("selectionUpdate", handleUpdate);
    editor.on("update", handleUpdate);
    editor.on("transaction", handleUpdate);

    updateFontSize();
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }

    return () => {
      editor.off("selectionUpdate", handleUpdate);
      editor.off("update", handleUpdate);
      editor.off("transaction", handleUpdate);
    };
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setLinkDialogOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setImageDialogOpen(false);
    }
  };

  const increaseFontSize = () => {
    const newSize = fontSize + 1;
    setFontSize(newSize);
    editor.chain().focus().setFontSize(`${newSize}px`).run();
  };

  const decreaseFontSize = () => {
    if (fontSize > 8) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      editor.chain().focus().setFontSize(`${newSize}px`).run();
    }
  };

  const settFontSize = (size: string) => {
    let numberSize = parseFloat(size);
    console.log(numberSize);
    if (isNaN(numberSize)) numberSize = 0;
    setFontSize(numberSize);

    if (savedSelection) {
      editor
        .chain()
        .focus()
        .setTextSelection(savedSelection)
        .setFontSize(`${numberSize}px`)
        .run();
    } else {
      editor.chain().focus().setFontSize(`${numberSize}px`).run();
    }
  };

  return (
    <div className={cn("flex flex-col gap-2")}>
      <div className="border rounded-md overflow-hidden">
        {/* Toolbar */}
        <div className="border-b bg-muted/50 p-2 flex gap-1 flex-wrap items-center">
          {/* Text Formatting Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <span className="text-sm">
                  {editor.isActive("heading", { level: 1 })
                    ? "Heading 1"
                    : editor.isActive("heading", { level: 2 })
                    ? "Heading 2"
                    : editor.isActive("heading", { level: 3 })
                    ? "Heading 3"
                    : "Paragraph"}
                </span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
              >
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
              >
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
              >
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border" />

          {/* Font Size Controls */}
          <div className="flex items-center gap-1 border rounded-md px-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={decreaseFontSize}
              disabled={fontSize <= 8}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              withoutLinearBorder
              type="text"
              value={fontSize}
              onFocus={() => {
                const { from, to } = editor.state.selection;
                setSavedSelection({ from, to });
              }}
              onChange={(e) => settFontSize(e.target.value)}
              onBlur={() => {
                setSavedSelection(null);
              }}
              className="w-8 h-7 px-0 text-center rounded-lg!"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={increaseFontSize}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Basic Formatting */}
          <Button
            type="button"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("underline") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <LucideUnderline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("strike") ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Lists */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <List className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4 mr-2" />
                Bulleted List
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4 mr-2" />
                Numbered List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border" />

          {/* Alignment */}
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={
              editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"
            }
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          {/* Table Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                <LucideTable className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                <LucideTable className="h-4 w-4 mr-2" />
                Insert Table (3x3)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                disabled={!editor.can().addColumnBefore()}
              >
                Add Column Before
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                disabled={!editor.can().addColumnAfter()}
              >
                Add Column After
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteColumn().run()}
                disabled={!editor.can().deleteColumn()}
              >
                Delete Column
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addRowBefore().run()}
                disabled={!editor.can().addRowBefore()}
              >
                Add Row Before
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().addRowAfter().run()}
                disabled={!editor.can().addRowAfter()}
              >
                Add Row After
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteRow().run()}
                disabled={!editor.can().deleteRow()}
              >
                Delete Row
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.can().deleteTable()}
              >
                Delete Table
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().mergeCells().run()}
                disabled={!editor.can().mergeCells()}
              >
                Merge Cells
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().splitCell().run()}
                disabled={!editor.can().splitCell()}
              >
                Split Cell
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border" />

          {/* Insert Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="sm">
                Insert
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus className="h-4 w-4 mr-2" />
                Horizontal Rule
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
                <LucideImage className="h-4 w-4 mr-2" />
                Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLinkDialogOpen(true)}>
                <Link2 className="h-4 w-4 mr-2" />
                Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              >
                <Code className="h-4 w-4 mr-2" />
                Code Block
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <Quote className="h-4 w-4 mr-2" />
                Quote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="bg-background danger-html max-h-[450px] overflow-y-auto pl-2">
          <EditorContent editor={editor} />
        </div>
      </div>

      {errors?.name && (
        <p className="text-sm text-destructive">
          {errors?.name?.message as string}
        </p>
      )}

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
            <DialogDescription>Enter the URL for the link</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addLink();
              }
            }}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addLink}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
            <DialogDescription>Enter the URL for the image</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addImage();
              }
            }}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={addImage}>
              Insert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
