import { Button } from "@/components/ui/button";
import { useChangeIndexNewsMutation } from "@/redux/api/newsApi";
import { News } from "@/types/newsType";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewsIndexChange({
  news,
  nextNews,
  prevNews,
}: {
  news: News;
  nextNews: News;
  prevNews: News;
}) {
  const [changeIndex, { isLoading }] = useChangeIndexNewsMutation();

  const handleMoveTop = async () => {
    if (!prevNews) return;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: news.id, targetId: prevNews.id }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
      console.error("Move error:", error);
    }
  };

  const handleMoveBottom = async () => {
    if (!nextNews) return;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: news.id, targetId: nextNews.id }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
      console.error("Move error:", error);
    }
  };

  return (
    <>
      <Button
        disabled={isLoading}
        size="icon"
        variant="outline"
        onClick={handleMoveTop}
        className="h-8 w-8"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </Button>

      <Button
        disabled={isLoading}
        size="icon"
        variant="outline"
        onClick={handleMoveBottom}
        className="h-8 w-8"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}
