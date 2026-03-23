import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ServerCrash, WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface ErrorStateProps {
  error?: any;
  onRetry?: () => void;
  title?: string;
  description?: string;
  type?: "network" | "server" | "notFound" | "generic";
}

export default function ErrorState({
  error,
  onRetry,
  title,
  description,
  type = "generic",
}: ErrorStateProps) {
  const t = useTranslations("Error");

  // Determine error type if not specified
  const getErrorType = () => {
    if (type !== "generic") return type;

    if (error?.status === 404) return "notFound";
    if (error?.status === 500 || error?.status === 503) return "server";
    if (error?.status === "FETCH_ERROR" || !navigator.onLine) return "network";

    return "generic";
  };

  const errorType = getErrorType();

  // Get icon based on error type
  const getIcon = () => {
    switch (errorType) {
      case "network":
        return <WifiOff className="w-16 h-16 text-destructive/80" />;
      case "server":
        return <ServerCrash className="w-16 h-16 text-destructive/80" />;
      case "notFound":
        return <AlertCircle className="w-16 h-16 text-destructive/80" />;
      default:
        return <AlertCircle className="w-16 h-16 text-destructive/80" />;
    }
  };

  // Get default messages based on error type
  const getDefaultTitle = () => {
    if (title) return title;

    switch (errorType) {
      case "network":
        return t("networkError", { defaultValue: "Network Error" });
      case "server":
        return t("serverError", { defaultValue: "Server Error" });
      case "notFound":
        return t("notFoundError", { defaultValue: "Not Found" });
      default:
        return t("genericError", { defaultValue: "Something went wrong" });
    }
  };

  const getDefaultDescription = () => {
    if (description) return description;

    switch (errorType) {
      case "network":
        return t("networkErrorDesc", {
          defaultValue:
            "Unable to connect. Please check your internet connection.",
        });
      case "server":
        return t("serverErrorDesc", {
          defaultValue:
            "The server encountered an error. Please try again later.",
        });
      case "notFound":
        return t("notFoundErrorDesc", {
          defaultValue: "The requested resource could not be found.",
        });
      default:
        return t("genericErrorDesc", {
          defaultValue: "An unexpected error occurred. Please try again.",
        });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12 px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        {/* Icon */}
        <div className="rounded-full bg-destructive/10 p-6 animate-pulse">
          {getIcon()}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {getDefaultTitle()}
          </h2>
          <p className="text-muted-foreground text-sm">
            {getDefaultDescription()}
          </p>
        </div>

        {/* Error details (for development) */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="w-full p-4 bg-muted/50 rounded-lg border border-border text-left">
            <p className="text-xs font-mono text-muted-foreground break-all">
              {error?.status && (
                <span className="font-bold">Status: {error.status}</span>
              )}
              {error?.data?.message && (
                <span className="block mt-1">
                  Message: {error.data.message}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Retry Button */}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            className="gap-2 min-w-[140px]"
          >
            <RefreshCw className="w-4 h-4" />
            {t("retry", { defaultValue: "Try Again" })}
          </Button>
        )}
      </div>
    </div>
  );
}
