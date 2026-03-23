"use client";

import CustomCombobox from "@/components/Forms/CustomCombobox";
import CustomForm from "@/components/Forms/CustomForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useGetAllFirmsQuery } from "@/redux/api/firms.api";
import { useState } from "react";
import CustomSelect from "@/components/Forms/CustomSelect";
import { FieldValues } from "react-hook-form";
import { useUpdateBestSellerMutation } from "@/redux/api/bestSellerApi";
import { toast } from "sonner";
import { BestSeller } from "@/types/best-seller.type";
import { Pencil } from "lucide-react";
import useIsFutures from "@/hooks/useIsFutures";

export default function Edit_BS({ bestSeller }: { bestSeller: BestSeller }) {
  const [open, setOpen] = useState(false);
  const [update, { isLoading }] = useUpdateBestSellerMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const isFutures = useIsFutures();
  const defaultValues = {
    firmId: bestSeller.firmId,
    type: bestSeller.type,
  };

  // ------------ Fetch Firms ------------
  const { data: firmsData, isLoading: isFirmsLoading } = useGetAllFirmsQuery([
    { name: "limit", value: 50 },
    { name: "searchTerm", value: searchTerm },
    {
      name: "firmType",
      value: isFutures ? "FUTURES" : "FOREX",
    },
  ]);

  const firmOptions =
    firmsData?.firms?.map((firm: any) => ({
      label: firm.title || firm.name,
      value: firm.id,
    })) || [];

  const handleSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Updating Best Seller...");
    try {
      const payload = {
        firmId: data.firmId,
        type: data.type,
      };

      const response = await update({
        id: bestSeller.id,
        data: payload,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Best Seller Updated Successfully", {
          id: toastId,
        });
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(
        (error?.data?.message ===
        "Duplicate value exists for: firmId. Please use a different value."
          ? "A Best seller already available with the firm"
          : error?.data?.message) || "Failed to Update Best Seller",
        {
          id: toastId,
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="w-4 h-4 mr-1" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Best Seller</DialogTitle>
        </DialogHeader>

        <CustomForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          className="grid gap-4 p-2"
        >
          {/* ---------------- Firm Selection ---------------- */}
          <CustomCombobox
            name="firmId"
            label="Select Firm"
            placeholder={isFirmsLoading ? "Loading firms..." : "Choose firm"}
            searchPlaceholder="Search firms..."
            emptyMessage="No firms found."
            options={firmOptions}
            required
            disabled={isFirmsLoading}
            buttonClassName="h-11"
            onSearchChange={setSearchTerm}
            isSearching={isFirmsLoading}
          />
          {/* ---------------- Type Selection ---------------- */}
          <CustomSelect
            options={[
              { label: "CRYPTO", value: "CRYPTO" },
              { label: "STOCK", value: "STOCK" },
            ]}
            name="type"
            label="Select Type"
            placeholder="Select type"
            required
            fieldClassName="h-11"
          />

          {/* ---------------- Footer ---------------- */}
          <DialogFooter className="grid grid-cols-2 mt-3">
            <DialogClose asChild>
              <Button disabled={isLoading} variant="outline2">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </CustomForm>
      </DialogContent>
    </Dialog>
  );
}
