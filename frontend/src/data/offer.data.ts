import defaultCompanyImg from "@/assets/companyIcon.png";
import { OfferCardData } from "@/components/Forex_Features/Offers/types/offer.types";

export const dummyOffers: OfferCardData[] = [
  {
    offer: [
      {
        id: "offer-1",
        discountPercentage: 15,
        companyName: "Alpha Futures",
        companyImage: defaultCompanyImg,
        code: "MATCH",
      },
      {
        id: "offer-2",
        discountPercentage: 20,
        companyName: "Nova Tech",
        companyImage: defaultCompanyImg,
        code: "SAVE20",
      },
      {
        id: "offer-2",
        discountPercentage: 20,
        companyName: "Nova Tech",
        companyImage: defaultCompanyImg,
        code: "SAVE20",
      },
      {
        id: "offer-2",
        discountPercentage: 20,
        companyName: "Nova Tech",
        companyImage: defaultCompanyImg,
        code: "SAVE20",
      },
    ],
  },
  {
    offer: [
      {
        id: "offer-3",
        discountPercentage: 10,
        companyName: "Quantum Motors",
        companyImage: defaultCompanyImg,
        code: "DRIVE10",
      },
    ],
  },
  {
    offer: [
      {
        id: "offer-4",
        discountPercentage: 25,
        companyName: "Eco Energy",
        companyImage: defaultCompanyImg,
        code: "GREEN25",
      },
      {
        id: "offer-5",
        discountPercentage: 30,
        companyName: "Skyline Traders",
        companyImage: defaultCompanyImg,
        code: "SKY30",
      },
    ],
  },
];
