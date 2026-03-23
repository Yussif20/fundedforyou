import { FileTypePattern } from "@/types/index.types";

export const LogoFileValidation = {
  allowedFileTypes: ["image/*"] as FileTypePattern[],
  maxFileSize: 5, // 2 MB
};
