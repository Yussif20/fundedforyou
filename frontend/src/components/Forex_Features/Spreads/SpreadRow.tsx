"use client";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { cn } from "@/lib/utils";
import AddEditSymbolValueModal from "./AddEditSymbolValueModal";
import { useState } from "react";
import { useAppSelector } from "@/redux/store";
import { useCurrentUser } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import EditSpread from "./EditSpread";
import DeleteSpread from "./DeleteSpread";

export default function SpreadRow({
  spreadItem,
  currencyIds,
  userRole,
}: {
  spreadItem: any;
  currencyIds: string[];
  userRole?: string | null;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const user = useAppSelector(useCurrentUser);
  const role = user?.role;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [symbolId, setSymbolId] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>(null);

  const visibleSpreads = currencyIds.map((symbolId) => {
    const s =
      (spreadItem.spreadSymbolValues || []).find(
        (v: any) => v.symbolId === symbolId,
      ) || null;
    return { spread: s, symbolId };
  });

  const firm = spreadItem.firm || {};
  const platform = spreadItem.platform || {};

  const handleCellClick = (symbolId: string, spreadObj: any) => {
    // only allow admins to open modal
    if (userRole !== "SUPER_ADMIN") return;
    setSymbolId(symbolId);
    setSelectedValue(spreadObj?.spread ?? null);
    setIsAddModalOpen(true);
  };
  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2">
            <div className="bg-primary3 max-w-max rounded-lg overflow-hidden border border-border flex-shrink-0">
              <div className="w-8 xl:w-12 aspect-square relative">
                <Image
                  src={firm.logoUrl}
                  alt="image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <h2 className="text-base md:text-lg xl:text-xl font-semibold">
              {firm.title || firm.name}
            </h2>
          </div>
        </TableCell>
        <TableCell center>
          <div className="flex justify-center items-center gap-1 bg-primary/20 max-w-max px-1.5 py-1 rounded-full">
            <div className="w-5 h-5 rounded-full overflow-hidden relative">
              {platform.logoUrl ? (
                <Image
                  src={platform.logoUrl}
                  alt={platform.title || "platform"}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <p className="text-xs font-semibold">
              {platform.title || platform.name}
            </p>
          </div>
        </TableCell>
        {visibleSpreads.map((item, idx: number) => (
          <TableCell
            center
            key={idx}
            onClick={() => handleCellClick(item.symbolId, item)}
          >
            <SpreadCell spread={item} />
          </TableCell>
        ))}
        {role === "SUPER_ADMIN" && (
          <TableCell className="flex gap-2">
            <Button
              onClick={() => {
                setOpenModal(true);
              }}
              variant="outline"
              className=" w-9 h-9"
              size={"icon"}
              linearClassName="w-max"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setIsDeleteModalOpen(true);
              }}
              variant="outline"
              className=" w-9 h-9"
              size={"icon"}
              linearClassName="w-max"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </TableCell>
        )}
      </TableRow>
      <AddEditSymbolValueModal
        open={isAddModalOpen}
        setOpen={setIsAddModalOpen}
        symbolId={symbolId}
        spreadId={spreadItem?.id}
        initialValue={selectedValue}
      />
      <EditSpread spread={spreadItem} open={openModal} setOpen={setOpenModal} />
      <DeleteSpread
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        id={spreadItem?.id}
      />
    </>
  );
}

function SpreadCell({
  spread,
}: {
  spread: {
    symbolId: string;
    spread: {
      minValue?: number;
      maxValue?: number;
      min?: number;
      max?: number;
      id?: string;
    } | null;
  };
}) {
  const spreadValue = spread.spread;
  if (!spreadValue) return "-";
  const min = spreadValue?.minValue ?? spreadValue?.min ?? 0;
  const max = spreadValue?.maxValue ?? spreadValue?.max ?? 0;
  const valueStr = `${min}-${max}`;
  const spreadLastValue = Number(max || 0);
  const status: "high" | "low" | "medium" =
    spreadLastValue < 2 ? "low" : spreadLastValue < 10 ? "medium" : "high";

  return (
    <Badge
      variant={"outline"}
      className={cn(
        "",
        status === "high" && "bg-red-500/20 text-red-300",
        status === "low" && "bg-green-500/20 text-green-300",
        status === "medium" && "bg-yellow-500/20 text-yellow-300",
      )}
    >
      {valueStr}
    </Badge>
  );
}
