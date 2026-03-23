/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { Check, Edit3, X } from "lucide-react";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import CustomForm from "../Forms/CustomForm";
import CustomInput from "../Forms/CustomInput";
import Spinner from "../Global/Spinner";

type DefaultValues = {
  fullName: string;
  email: string;
  location: string;
};

export default function ProfileDetails({
  userData,
}: {
  userData: DefaultValues;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, { isLoading }] = useUpdateProfileMutation();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: FieldValues) => {
    try {
      const { email, ...rest } = data;

      await editProfile(rest).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CustomForm
      onSubmit={handleSave}
      defaultValues={userData}
      className="rounded-lg border  p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold ">Personal Information</h3>
        {!isEditing ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={isLoading}
          >
            <Edit3 className="w-4 h-4 mr-2" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-gray-600"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90  flex items-center"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : <Check className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </div>
        )}
      </div>

      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            required
            name="fullName"
            type="text"
            label="Name"
            disabled={!isEditing || isLoading}
          />
          <CustomInput
            required
            name="email"
            type="email"
            label="Email"
            disabled={true}
          />
          <CustomInput
            className="md:col-span-2"
            name="location"
            type="text"
            label="Location"
            placeholder="Location"
            disabled={!isEditing || isLoading}
          />
        </div>
      </div>
    </CustomForm>
  );
}
