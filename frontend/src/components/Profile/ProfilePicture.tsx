"use client";

import defaultUser from "@/assets/user.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { Edit } from "lucide-react";
import { useRef } from "react";
import Spinner from "../Global/Spinner";
import { Button } from "../ui/button";

export default function ProfilePicture({
  profileImg,
  fullName,
}: {
  profileImg: string | null | undefined;
  fullName: string;
}) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("profile", file);
        await updateProfile(formData).unwrap();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Trigger input file click
  const triggerUpload = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center border-2 max-w-max lg:max-w-full max-h-max py-5 lg:py-10 px-16 rounded-sm">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        disabled={isLoading}
      />

      {/* Clickable Avatar */}
      <div
        onClick={triggerUpload}
        className={`relative cursor-pointer ${
          isLoading ? "opacity-70 pointer-events-none" : ""
        }`}>
        <Avatar className="w-32 h-32 relative">
          <AvatarImage
            className="object-cover"
            src={profileImg ? profileImg : defaultUser.src}
            alt="Profile"
          />
          <AvatarFallback>
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full">
              {/* <Spinner /> */}
            </div>
          )}
        </Avatar>

        {/* Edit Button (Also triggers upload) */}
        <div className="absolute bottom-0 right-0">
          <Button variant="outline" size="icon">
            {!isLoading ? <Edit className="w-4 h-4" /> : <Spinner />}
          </Button>
        </div>
      </div>

      {/* Name */}
      <div className="mt-4 text-center pointer-events-none select-none">
        <h2 className="text-xl font-semibold">{fullName}</h2>
      </div>
    </div>
  );
}
