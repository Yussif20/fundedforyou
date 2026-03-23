import { Button } from "@/components/ui/button";
import { useChangeIndexMutation } from "@/redux/api/firms.api";
import { SinglePropFirm } from "@/types/firm.types";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FirmIndexChange({
  firm,
  nextCompany,
  prevCompany,
}: {
  firm: SinglePropFirm;
  nextCompany: SinglePropFirm;
  prevCompany: SinglePropFirm;
}) {
  const [changeIndex, { isLoading }] = useChangeIndexMutation();

  const handleMoveTop = async () => {
    const target = prevCompany?.index;
    const newIndex = target !== undefined && target < firm.index
      ? target
      : firm.index - 1;
    if (newIndex < 0) return;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: firm.id, index: newIndex }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  const handleMoveBottom = async () => {
    const target = nextCompany?.index;
    const newIndex = target !== undefined && target > firm.index
      ? target
      : firm.index + 1;
    const toastId = toast.loading("Moving...");
    try {
      await changeIndex({ id: firm.id, index: newIndex }).unwrap();
      toast.dismiss(toastId);
      toast.success("Moved successfully");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Failed to move");
    }
  };

  return (
    <>
      <Button
        disabled={isLoading}
        size="icon"
        variant="outline"
        onClick={handleMoveTop}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </Button>

      {/* Move Bottom */}
      <Button
        disabled={isLoading}
        size="icon"
        variant="outline"
        onClick={handleMoveBottom}
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
