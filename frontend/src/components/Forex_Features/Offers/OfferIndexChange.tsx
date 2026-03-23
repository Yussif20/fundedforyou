import { Button } from "@/components/ui/button";
import { useChangeIndexOfferMutation, FirmWithOffers } from "@/redux/api/offerApi";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OfferIndexChange({
  firm,
  prevFirm,
  nextFirm,
}: {
  firm: FirmWithOffers;
  prevFirm?: FirmWithOffers;
  nextFirm?: FirmWithOffers;
}) {
  const [changeIndex, { isLoading }] = useChangeIndexOfferMutation();

  const handleMoveUp = async () => {
    const currentIndex = firm.index ?? 0;
    const target = prevFirm?.index;
    const newIndex =
      target !== undefined && target < currentIndex
        ? target
        : currentIndex - 1;
    if (newIndex < 0) return;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: firm.id, index: newIndex }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  const handleMoveDown = async () => {
    const currentIndex = firm.index ?? 0;
    const target = nextFirm?.index;
    const newIndex =
      target !== undefined && target > currentIndex
        ? target
        : currentIndex + 1;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: firm.id, index: newIndex }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  const canMoveUp = !isLoading && (!!prevFirm || (firm.index ?? 0) > 0);
  const canMoveDown = !isLoading;

  return (
    <>
      <Button
        disabled={!canMoveUp}
        size="icon"
        variant="outline"
        onClick={handleMoveUp}
        title={canMoveUp ? "Move up" : "Cannot move up"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </Button>
      <Button
        disabled={!canMoveDown}
        size="icon"
        variant="outline"
        onClick={handleMoveDown}
        title={canMoveDown ? "Move down" : "Cannot move down"}
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
