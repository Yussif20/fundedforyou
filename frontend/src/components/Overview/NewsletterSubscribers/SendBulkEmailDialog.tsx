"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSendBulkNewsLetterEmailMutation } from "@/redux/api/newsLetter";
import { toast } from "sonner";

export default function SendBulkEmailDialog() {
  const t = useTranslations("Overview.newsletterSubscribers");
  const [sendBulkEmail, { isLoading }] =
    useSendBulkNewsLetterEmailMutation();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;

    const toastId = toast.loading(t("sending"));

    try {
      const result = await sendBulkEmail({
        subject: subject.trim(),
        body: body.trim(),
      }).unwrap();

      const data = result?.data;
      if (data?.failed > 0) {
        toast.warning(
          `Sent to ${data.sent}, failed for ${data.failed} subscribers`,
          { id: toastId }
        );
      } else {
        toast.success(`${t("sendSuccess")} (${data?.sent ?? 0})`, {
          id: toastId,
        });
      }

      setSubject("");
      setBody("");
      setOpen(false);
    } catch {
      toast.error(t("sendError"), { id: toastId });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" />
          {t("sendEmail")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-lg"
        onInteractOutside={(e) => {
          if (isLoading) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("sendEmail")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("emailSubject")}</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("emailSubjectPlaceholder")}
              maxLength={200}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("emailBody")}</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("emailBodyPlaceholder")}
              maxLength={10000}
              rows={8}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || !subject.trim() || !body.trim()}
            >
              {isLoading ? t("sending") : t("sendEmail")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
