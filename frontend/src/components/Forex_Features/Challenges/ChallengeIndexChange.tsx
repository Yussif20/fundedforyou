import { Button } from "@/components/ui/button";
import { useChangeIndexChallengeMutation } from "@/redux/api/challenge";
import { TChallenge } from "@/types/Challenge ";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ChallengeIndexChange({
  challenge,
  nextChallenge,
  prevChallenge,
}: {
  challenge: TChallenge;
  nextChallenge: TChallenge;
  prevChallenge: TChallenge;
}) {
  const [changeIndex, { isLoading }] = useChangeIndexChallengeMutation();

  const handleMoveTop = async () => {
    // Use prev challenge's order, but if it's the same (duplicates) or missing, use order - 1
    const target = prevChallenge?.order;
    const newOrder = target !== undefined && target < challenge.order
      ? target
      : challenge.order - 1;
    if (newOrder < 0) return;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: challenge.id, order: newOrder }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  const handleMoveBottom = async () => {
    // Use next challenge's order, but if it's the same (duplicates) or missing, use order + 1
    const target = nextChallenge?.order;
    const newOrder = target !== undefined && target > challenge.order
      ? target
      : challenge.order + 1;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: challenge.id, order: newOrder }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  // Only disable up when there's nothing above (no prev and already at 0)
  const canMoveUp = !isLoading && (!!prevChallenge || challenge.order > 0);
  const canMoveDown = !isLoading;

  return (
    <>
      <Button
        disabled={!canMoveUp}
        size="icon"
        variant="outline"
        onClick={handleMoveTop}
        title={canMoveUp ? "Move up" : "Cannot move up"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </Button>

      {/* Move Bottom */}
      <Button
        disabled={!canMoveDown}
        size="icon"
        variant="outline"
        onClick={handleMoveBottom}
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