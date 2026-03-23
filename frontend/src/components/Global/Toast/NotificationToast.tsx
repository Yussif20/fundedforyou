"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import image from "@/assets/companyIcon.png";
import Image from "next/image";

const notifications = [
  { username: "John Doe", prize: "a Free Trip", userImg: image },
  { username: "Jane Smith", prize: "a Gift Card", userImg: "/jane.png" },
  { username: "Ali Khan", prize: "a Smartphone", userImg: "/ali.png" },
  { username: "Sara Lee", prize: "a Headphone", userImg: "/sara.png" },
];

export default function NotificationToast() {
  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (!notifications[index]) return null;
      const { username, prize } = notifications[index];
      toast(
        <div className="flex items-center gap-3 p-3 rounded-xl">
          <div className="p-1 bg-primary rounded-full">
            <div className="w-10 h-10 rounded-full relative overflow-hidden ">
              <Image src={image} alt="image" fill className="object-cover" />
            </div>
          </div>
          <div>
            <p className="font-semibold">
              {username} just won {prize}!
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "bottom-left",
          closeButton: true,
          style: {
            background: "var(--background)",
            boxShadow: "0px 0px 100px 0px  var(--primary)",
            color: "var(--color-foreground)",
            padding: "0px 0px",
            border: "0.5px solid var(--primary)",
            borderRadius: "16px",
          },
        }
      );

      index = index + 1;
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
