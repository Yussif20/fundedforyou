import { useState } from "react";
import { toast } from "sonner";

interface UseCopyToClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  resetDelay?: number;
}

export const useCopyToClipboard = (options?: UseCopyToClipboardOptions) => {
  const [isCopied, setIsCopied] = useState(false);

  const {
    successMessage = "Copied to clipboard!",
    errorMessage = "Failed to copy",
    resetDelay = 1500,
  } = options || {};

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textArea);

    return success;
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // HTTPS / localhost
        await navigator.clipboard.writeText(text);
      } else {
        // HTTP / VPS fallback
        const success = fallbackCopy(text);
        if (!success) throw new Error("Fallback copy failed");
      }

      toast.success(successMessage);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), resetDelay);
      return true;
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error(errorMessage);
      return false;
    }
  };

  return { isCopied, copyToClipboard };
};
