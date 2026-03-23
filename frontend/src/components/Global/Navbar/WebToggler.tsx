"use client";
import { useState, useEffect } from "react";
import { BsGrid3X3Gap } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

import imageOne from "@/assets/webToggler/funder-for-you.png";
import imageTwo from "@/assets/webToggler/funded-for-me.png";
import imageThree from "@/assets/webToggler/funded-for-us.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import logo1 from "@/assets/logo.png";
import useIsFutures from "@/hooks/useIsFutures";
import { cn } from "@/lib/utils";

export default function WebToggler() {
  const isFutures = useIsFutures();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);
  const data = [
    {
      image: imageOne,
      title: "Funded For You",
      link: "/#top",
      comingSoon: false,
    },
    {
      image: imageTwo,
      title: "Funded For Me",
      link: "/coming-soon",
      comingSoon: true,
    },
    {
      image: imageThree,
      title: "Funded For Us",
      link: "/coming-soon",
      comingSoon: true,
    },
  ];
  return (
    <>
      {/* Desktop Dropdown */}
      <div className="hidden tablet:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <BsGrid3X3Gap className="text-xl sm:text-2xl cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-background/80 border-none space-y-5 p-5"
            align="start"
          >
            {data?.map((item) => (
              <DropdownMenuItem
                asChild={!item.comingSoon}
                key={item?.title}
                className={cn(
                  "p-0 hover:bg-transparent!",
                  item.comingSoon ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                )}
              >
                {item.comingSoon ? (
                  <div className="aspect-[400/173] w-[400px] relative">
                    <Image
                      src={item?.image}
                      alt="image"
                      width={2000}
                      height={866}
                      className={cn(
                        "object-cover transition-all duration-300 border-2 rounded-[20px]",
                        isFutures ? "border-yellow-500/50" : "border-green-500/50"
                      )}
                    />
                    {isFutures && (
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-[20px]" />
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-[20px] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">Coming Soon</span>
                    </div>
                    <div className="flex items-center gap-2 absolute bottom-4 left-4 z-10">
                      <div className="w-10 h-10 relative">
                        <Image
                          src={logo1}
                          alt="image"
                          fill
                          className={"object-cover"}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{item?.title}</h3>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item?.link}
                    className="aspect-[400/173] w-[400px] relative"
                  >
                    <Image
                      src={item?.image}
                      alt="image"
                      width={2000}
                      height={866}
                      className={cn(
                        "object-cover hover:brightness-125 transition-all duration-300 border-2 rounded-[20px]",
                        isFutures
                          ? "border-transparent hover:border-yellow-500/50"
                          : "border-transparent hover:border-primary/50"
                      )}
                    />
                    {isFutures && (
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-[20px] pointer-events-none" />
                    )}
                    <div className="flex items-center gap-2 absolute bottom-4 left-4 z-10">
                      <div className="w-10 h-10 relative">
                        <Image
                          src={logo1}
                          alt="image"
                          fill
                          className={"object-cover"}
                        />
                      </div>
                      <h3 className="text-xl font-semibold">{item?.title}</h3>
                    </div>
                  </Link>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Button */}
      <div className="tablet:hidden">
        <BsGrid3X3Gap
          className="text-xl sm:text-2xl cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* Mobile Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-2xl text-foreground hover:opacity-70 transition-opacity z-10"
          >
            <IoClose />
          </button>

          {/* Cards Container */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm">
            {data?.map((item) => (
              <div key={item?.title} className="w-full">
                {item.comingSoon ? (
                  <div className="aspect-[400/173] w-full relative">
                    <Image
                      src={item?.image}
                      alt="image"
                      width={2000}
                      height={866}
                      className={cn(
                        "object-cover transition-all duration-300 border-2 rounded-[12px]",
                        isFutures ? "border-yellow-500/50" : "border-green-500/50"
                      )}
                    />
                    {isFutures && (
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-[12px]" />
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-[12px] flex items-center justify-center">
                      <span className="text-lg font-bold text-white">Coming Soon</span>
                    </div>
                    <div className="flex items-center gap-1.5 absolute bottom-2 left-2 z-10">
                      <div className="w-7 h-7 relative">
                        <Image
                          src={logo1}
                          alt="image"
                          fill
                          className={"object-cover"}
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-white">{item?.title}</h3>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item?.link}
                    className="aspect-[400/173] w-full relative block"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <Image
                      src={item?.image}
                      alt="image"
                      width={2000}
                      height={866}
                      className={cn(
                        "object-cover hover:brightness-125 transition-all duration-300 border-2 rounded-[12px]",
                        isFutures
                          ? "border-transparent hover:border-yellow-500/50"
                          : "border-transparent hover:border-primary/50"
                      )}
                    />
                    {isFutures && (
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-[12px] pointer-events-none" />
                    )}
                    <div className="flex items-center gap-1.5 absolute bottom-2 left-2 z-10">
                      <div className="w-7 h-7 relative">
                        <Image
                          src={logo1}
                          alt="image"
                          fill
                          className={"object-cover"}
                        />
                      </div>
                      <h3 className="text-sm font-semibold">{item?.title}</h3>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
