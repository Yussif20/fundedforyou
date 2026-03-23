import { StaticImageData } from "next/image";

export type Offer = {
  id: string;
  discountPercentage: number;
  companyName: string;
  companyImage: string | StaticImageData;
  code: string;
  // Fields for editing
  offerPercentage?: number;
  isExclusive?: boolean;
  firmId?: string;
  showGift?: boolean;
  text?: string;
  textArabic?: string;
};
export interface OfferCardData {
  firmId?: string;
  firmTitle?: string;
  firmLogoUrl?: string;
  offer: Offer[];
}
