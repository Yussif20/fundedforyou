import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FAQ } from "@/types";
import { startTransition } from "../editor/shared/react-patches";
import { updateFaqIndexAction } from "../editor/plugins/actions/faq-actions";
import { useState } from "react";

export default function FAQIndexChange({
    faq,
    nextFaq,
    prevFaq,
}: {
    faq: FAQ;
    nextFaq: FAQ;
    prevFaq: FAQ;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const handleMoveTop = async () => {
        let newIndex = prevFaq?.index || faq.index;
        if (newIndex < 1) return;
        setIsLoading(true);
        const toastId = toast.loading("Moving...");
        startTransition(async () => {


            const result = await updateFaqIndexAction(faq.id!, newIndex);

            if (result.success) {
                toast.success(result.message, { id: toastId });
                setIsLoading(false);
            } else {
                toast.error(result.message, { id: toastId });
                setIsLoading(false);
            }
        });

    };

    const handleMoveBottom = async () => {
        let newIndex = nextFaq?.index || faq.index;
        setIsLoading(true);
        const toastId = toast.loading("Moving...");
        startTransition(async () => {


            const result = await updateFaqIndexAction(faq.id!, newIndex);

            if (result.success) {
                toast.success(result.message, { id: toastId });
                setIsLoading(false);
            } else {
                toast.error(result.message, { id: toastId });
                setIsLoading(false);
            }
        });
    };
    return (
        <>
            <Button
                disabled={isLoading}
                size="icon"
                variant="outline"
                onClick={handleMoveTop}
            >
                <ArrowUp className="w-4 h-4" />
            </Button>

            {/* Move Bottom */}
            <Button
                disabled={isLoading}
                size="icon"
                variant="outline"
                onClick={handleMoveBottom}
            >
                <ArrowDown className="w-4 h-4" />
            </Button>
        </>
    );
}