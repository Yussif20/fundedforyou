export type TChallenge = {
  id: string;
  accountSize: number;
  copyTrading: boolean;
  createdAt: string;
  dailyLoss: number;
  EAs: boolean;
  maxLeverage: string;
  activationFees: number | null;
  contractSizeMini?: number | null;
  contractSizeMicro?: number | null;
  consistencyRuleChallenge?: number | null;
  consistencyRuleFunded?: number | null;
  maxLoss: number;
  maxLostType: "STATIC" | "DYNAMIC";
  minTradingDays: number;
  newsTrading: boolean;
  overnightHolding: boolean;
  payoutFrequency: string;
  payoutFrequencyArabic: string;
  profitSplit: number;
  price: number;
  resetType: "Weekly" | "Monthly";
  profitTarget: number[];
  refundableFee: boolean;
  steps: "STEP1" | "STEP2" | "STEP3";
  stopLossRequired: boolean;
  timeLimit: number;
  weekend: boolean;
  title: string;
  updatedAt: string;
  firmId: string;
  affiliateLink: string;
  order: number;
  challengeNameId?: string;
  challengeNameRel?: {
    id: string;
    name: string;
    nameArabic: string;
    discountPercentage: number;
  };

  challengeName?: string;

  firm: {
    id: string;
    title: string;
    slug: string;
    logoUrl: string;
    platforms: string[];
    programTypes: string[];
    challengeNameRecords?: {
      id: string;
      name: string;
      nameArabic: string;
      discountPercentage: number;
      order: number;
    }[];
    maxAllocation: number;
    country: string;
    firmType?: string;
    restrictedCountries?: string[];
  };
};
