import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorCardProps {
  error?: any;
  onRetry?: () => void;
  message?: string;
  compact?: boolean;
}

export default function ErrorCard({
  error,
  onRetry,
  message,
  compact = false,
}: ErrorCardProps) {
  const defaultMessage =
    message || error?.data?.message || "Unable to load data. Please try again.";

  if (compact) {
    return (
      <div className="flex items-center justify-between p-4 border border-destructive/50 bg-destructive/5 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
          <p className="text-sm text-foreground">{defaultMessage}</p>
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="gap-2 shrink-0 ml-4"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground">
            {defaultMessage}
          </p>
          {process.env.NODE_ENV === "development" && error?.status && (
            <p className="text-xs text-muted-foreground">
              Error Code: {error.status}
            </p>
          )}
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
