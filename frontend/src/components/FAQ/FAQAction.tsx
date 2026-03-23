"use client";
import { useCurrentUser } from "@/redux/authSlice";
import { useAppSelector } from "@/redux/store";
import { DeleteFaq, EditFaq } from "./FAQForms";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { FAQ } from "@/types";
import FAQIndexChange from "./FAQIndexChange";

export default function FAQAction({ faq, nextFaq, prevFaq }: { faq: FAQ; nextFaq: FAQ; prevFaq: FAQ }) {
  const role = useAppSelector(useCurrentUser)?.role;
  if (role !== "SUPER_ADMIN") {
    return null;
  }
  return (
    <div className="flex gap-2">
      <EditFaq faq={faq}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </EditFaq>
      <DeleteFaq faq={faq}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DeleteFaq>
      <FAQIndexChange faq={faq} nextFaq={nextFaq} prevFaq={prevFaq} />
    </div>
  );
}
