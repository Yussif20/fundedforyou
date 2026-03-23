"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useCreateSymbolMutation } from "@/redux/api/spreadApi";
import { Plus, X, Check, ChevronsUpDown } from "lucide-react";
import { countries } from "@/data";
import Image, { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type TCountry = {
  country: string;
  code: string;
  flag?: string | StaticImageData;
  currency: string;
};

export default function AddSymbolModal() {
  const t = useTranslations("ManageSpread"); // 'common' namespace
  const [open, setOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<TCountry[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [createSymbol, { isLoading: creating }] = useCreateSymbolMutation();

  const handleSubmit = async () => {
    if (selectedSymbol.length === 0) {
      toast.error(t("please_select_at_least_one_country"));
      return;
    }

    const payload = selectedSymbol.map((item) => item.country);
    try {
      await createSymbol({ countries: payload }).unwrap();
      toast.success(t("symbol_created_successfully"));
      setSelectedSymbol([]);
      setOpen(false);
      setSearchValue("");
    } catch (err: any) {
      const msg = err?.data?.message ?? t("failed_to_create_symbol");
      toast.error(msg);
    }
  };

  const handleCountrySelect = (country: TCountry) => {
    const isSelected = selectedSymbol.some(
      (item) => item.code === country.code,
    );

    if (isSelected) {
      setSelectedSymbol(
        selectedSymbol.filter((item) => item.code !== country.code),
      );
    } else {
      setSelectedSymbol([...selectedSymbol, country]);
    }
  };

  const removeCountry = (countryCode: string) => {
    setSelectedSymbol(
      selectedSymbol.filter((item) => item.code !== countryCode),
    );
  };

  const clearAll = () => {
    setSelectedSymbol([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size={"icon"}>
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("add_symbol")}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden flex flex-col">
          {selectedSymbol.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("selected")} ({selectedSymbol.length})
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-7 text-xs"
                >
                  {t("clear_all")}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-muted/30">
                {selectedSymbol.map((country) => (
                  <Badge
                    key={country.code}
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {country.flag && (
                        <Image
                          src={country.flag}
                          alt={country.country}
                          width={20}
                          height={20}
                          className="w-5 h-4 object-cover rounded-sm"
                        />
                      )}
                      <span className="text-sm font-medium">
                        {country.currency}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-destructive/20"
                      onClick={() => removeCountry(country.code)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {t("search_and_select_countries")}
            </p>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  <span className="text-muted-foreground">
                    {t("search_countries")}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={t("search_by_country_currency_or_code")}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>{t("no_country_found")}</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {countries.map((country) => {
                        const isSelected = selectedSymbol.some(
                          (item) => item.code === country.code,
                        );
                        return (
                          <CommandItem
                            key={country.code}
                            value={`${country.country} ${country.currency} ${country.code}`}
                            onSelect={() => handleCountrySelect(country)}
                            className="flex items-center gap-3 px-3 py-2.5"
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "opacity-50",
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            {country.flag && (
                              <Image
                                src={country.flag}
                                alt={country.country}
                                width={24}
                                height={24}
                                className="w-6 h-4 object-cover rounded-sm"
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {country.country}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {country.currency} • {country.code}
                              </span>
                            </div>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedSymbol([]);
              setSearchValue("");
            }}
            className="flex-1"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={creating || selectedSymbol.length === 0}
            className="flex-1"
          >
            {creating
              ? t("creating")
              : t("create_symbol", { count: selectedSymbol.length })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
