"use client";
import { cn } from "@/lib/utils";
import { FirmWithOffers } from "@/redux/api/offerApi";
import { useEffect, useState } from "react";
import SingleOffer from "../Forex_Features/Offers/SingleOffer";
import Container from "../Global/Container";

export default function TopOffer({ company }: { company: FirmWithOffers }) {
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowOffer(scrollPosition > 550);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup correctly
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (company.offers.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-30  top-22 w-full right-0 bg-background transition-all duration-300",
        !showOffer && "-top-30"
      )}
    >
      <Container>
        <SingleOffer
          isTopOffer={true}
          hideBlackHoles
          data={company}
          onlyShowMatch
        />
      </Container>
    </div>
  );
}
