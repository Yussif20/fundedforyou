import { SinglePropFirm } from "./firm.types";

export enum BestSellerTypeEnum {
  CRYPTO = "CRYPTO",
  STOCK = "STOCK",
}

export type BestSeller = {
  id: string;

  type?: BestSellerTypeEnum | null;

  weeklyRank: number;
  monthlyRank: number;
  rank: number;

  firmId: string;
  firm?: SinglePropFirm;

  createdAt: Date;
  updatedAt: Date;
};
