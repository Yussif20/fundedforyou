import { XCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title = "No data available",
  description = "There are no items to display at the moment.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12 px-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        {/* Icon */}
        <div className="rounded-full bg-muted/50 p-6">
          {icon || <XCircle className="w-12 h-12 text-muted-foreground/60" />}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Action */}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
