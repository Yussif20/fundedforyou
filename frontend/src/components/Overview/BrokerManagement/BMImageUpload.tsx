"use client";
import { useFormContext } from "react-hook-form";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Upload } from "lucide-react";
export default function BMImageUpload({ logoUrl }: { logoUrl?: string }) {
  const { setValue } = useFormContext();
  const [imagePreview, setImagePreview] = useState<string>(logoUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the actual File object in the form
      setValue("logoUrl", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((reader.result as string) || logoUrl || "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue("logoUrl", null);
    setImagePreview(logoUrl || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Logo</Label>
      <div className="space-y-3">
        {imagePreview ? (
          <div className="relative w-max">
            <div
              onClick={handleImageClick}
              className="relative w-32 h-32 border-2 border-dashed border-primary/70 rounded-full overflow-hidden bg-foreground/10 cursor-pointer"
            >
              <img
                src={imagePreview}
                alt="Broker logo"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleImageClick}
            className="w-32 rounded-full h-32 border-2 border-dashed border-primary/70 hover:border-foreground/70 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="h-6 w-6 text-foreground/70" />
            <span className="text-xs  text-foreground/70 px-3">
              Click to upload logo
            </span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
