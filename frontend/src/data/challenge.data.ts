import defaultCompanyImg from "@/assets/companyIcon.png";
import { StaticImageData } from "next/image";

export type PayoutFrequency =
  | "immediate"
  | "7days"
  | "14days"
  | "21days"
  | "30days"
  | "biWeekly"
  | "onDemand"
  | "payoutOnDemandThen7Days";

export type ChallengeType = {
  name: string;
  slug: string;
  image: StaticImageData;
  accountSize: number;
  steps: string;
  profitTarget: number;
  dailyLoss: number;
  maxLoss: number;
  profitSplit: number;
  payoutFreq: PayoutFrequency;
  price: number;
};

export const challengeDummyData: ChallengeType[] = [
  {
    name: "Alpha Futures",
    slug: "alpha-futures",
    image: defaultCompanyImg,
    accountSize: 100000,
    steps: "STEP1",
    profitTarget: 9,
    dailyLoss: 8,
    maxLoss: 10,
    profitSplit: 80,
    payoutFreq: "7days",
    price: 253.65,
  },
  {
    name: "Beta Trading",
    slug: "beta-trading",
    image: defaultCompanyImg,
    accountSize: 50000,
    steps: "STEP2",
    profitTarget: 8,
    dailyLoss: 5,
    maxLoss: 10,
    profitSplit: 75,
    payoutFreq: "14days",
    price: 149.99,
  },
  {
    name: "Gamma Capital",
    slug: "gamma-capital",
    image: defaultCompanyImg,
    accountSize: 200000,
    steps: "STEP1",
    profitTarget: 10,
    dailyLoss: 10,
    maxLoss: 12,
    profitSplit: 85,
    payoutFreq: "onDemand",
    price: 499.0,
  },
  {
    name: "Delta Traders",
    slug: "delta-traders",
    image: defaultCompanyImg,
    accountSize: 25000,
    steps: "STEP3",
    profitTarget: 6,
    dailyLoss: 4,
    maxLoss: 8,
    profitSplit: 70,
    payoutFreq: "21days",
    price: 89.0,
  },
  {
    name: "Epsilon Markets",
    slug: "epsilon-markets",
    image: defaultCompanyImg,
    accountSize: 150000,
    steps: "STEP2",
    profitTarget: 9,
    dailyLoss: 7,
    maxLoss: 11,
    profitSplit: 80,
    payoutFreq: "7days",
    price: 349.99,
  },
  {
    name: "Zeta Fund",
    slug: "zeta-fund",
    image: defaultCompanyImg,
    accountSize: 75000,
    steps: "STEP1",
    profitTarget: 7,
    dailyLoss: 6,
    maxLoss: 9,
    profitSplit: 75,
    payoutFreq: "14days",
    price: 199.0,
  },
  {
    name: "Eta Securities",
    slug: "eta-securities",
    image: defaultCompanyImg,
    accountSize: 300000,
    steps: "STEP1",
    profitTarget: 12,
    dailyLoss: 12,
    maxLoss: 15,
    profitSplit: 90,
    payoutFreq: "immediate",
    price: 799.0,
  },
  {
    name: "Theta Trading Co",
    slug: "theta-trading-co",
    image: defaultCompanyImg,
    accountSize: 50000,
    steps: "STEP2",
    profitTarget: 8,
    dailyLoss: 5,
    maxLoss: 10,
    profitSplit: 80,
    payoutFreq: "7days",
    price: 129.99,
  },
  {
    name: "Iota Investments",
    slug: "iota-investments",
    image: defaultCompanyImg,
    accountSize: 100000,
    steps: "STEP3",
    profitTarget: 7,
    dailyLoss: 5,
    maxLoss: 8,
    profitSplit: 70,
    payoutFreq: "14days",
    price: 179.0,
  },
  {
    name: "Kappa Partners",
    slug: "kappa-partners",
    image: defaultCompanyImg,
    accountSize: 250000,
    steps: "STEP2",
    profitTarget: 10,
    dailyLoss: 9,
    maxLoss: 12,
    profitSplit: 85,
    payoutFreq: "payoutOnDemandThen7Days",
    price: 599.99,
  },
];
