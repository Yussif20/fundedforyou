"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { countries } from "@/data"
import Image from "next/image"



export default function SelectCountry({ state }: { state?: { value: string, setValue: (value: string) => void } }) {
    const [open, setOpen] = React.useState(false)
    const [defaultValue, setDefaultValue] = React.useState("")
    const usedValue = state ? state.value : defaultValue;
    const usedSetValue = state ? state.setValue : setDefaultValue;
    const selectedValue = countries.find(
        (c) => c.code === usedValue || c.country === usedValue
    );
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    size={"lg"}
                    variant="outline2"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedValue
                        ? <div className="flex gap-2 items-center">
                            <div className="w-5 h-3.5 relative">
                                <Image
                                    src={selectedValue.flag || ''}
                                    alt="image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {selectedValue.country}
                        </div>
                        : "Select Country..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search Country..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No Country found.</CommandEmpty>
                        <CommandGroup>
                            {countries.map((country) => (
                                <CommandItem
                                    key={`${country.code}-${country.country}`}
                                    value={country.country}
                                    onSelect={() => {
                                        const next = usedValue === country.code ? "" : country.code;
                                        usedSetValue(next);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex gap-2 items-center">
                                        <div className="w-5 h-3.5 relative">
                                            <Image
                                                src={country.flag || ''}
                                                alt="image"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {country.country}
                                    </div>
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            usedValue === country.code ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
