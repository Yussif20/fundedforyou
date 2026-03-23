import { Offer } from "@/redux/api/offerApi";
import { Platform } from "./platform.type";

export interface Broker {
  id: string;
  title: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  title: string;
  logoUrl: string;
}

export interface PayoutMethod {
  id: string;
  title: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeNameRecord {
  id: string;
  name: string;
  nameArabic: string;
  discountPercentage: number;
  order: number;
}

export type SinglePropFirm = {
  id: string;
  affiliateLink: string;
  title: string;
  logoUrl: string;
  slug: string;
  ceo: string;
  dateEstablished: string;
  brokers: Broker[];
  platforms: Platform[];
  payoutMethods: PayoutMethod[];
  typeOfInstruments: string[];
  countries: string[];
  leverage: string;
  leverageArabic: string;
  commission: string;
  commissionArabic: string;
  accountSizes: string;
  accountSizesArabic: string;
  dailyMaxLoss: string;
  dailyMaxLossArabic: string;
  minimumTradingDays: string;
  minimumTradingDaysArabic: string;
  scaleupPlans: string;
  scaleupPlansArabic: string;
  maxAllocation: number;
  country: string;
  commissions: any[];
  instrumentType: any[];
  payoutPolicy: string;
  consistencyRules: string;
  firmType: string;
  restrictedCountries: string[];
  restrictedCountriesNote?: string;
  restrictedCountriesNoteArabic?: string;
  spreads: any[];
  programTypes: string[];
  challengeNames: string[];
  challengeNameRecords: ChallengeNameRecord[];
  assets: string[];
  paymentMethods: PaymentMethod[];
  drawDowns: string[];
  drawDownProgramTypeMap?: Record<string, string[]>;
  offers: Offer[];
  drawDownTexts: DrawDownText[];
  count: {
    offers: number;
    challenges: number;
    announcements: number;
  };
  allocationRules: string;
  newsTradingAllowedRules: string;
  newsTradingNotAllowedRules: string;
  overnightAndWeekendsHolding: string;
  copyTradingAllowedRules: string;
  copyTradingNotAllowedRules: string;
  expertsAllowedRules: string;
  expertsNotAllowedRules: string;
  riskManagement: string;
  vpnVps: string;
  profitShare: string;
  inactivityRules: string;
  prohibitedStrategies: string;

  payoutPolicyArabic?: string;
  consistencyRulesArabic?: string;
  allocationRulesArabic?: string;
  newsTradingAllowedRulesArabic?: string;
  newsTradingNotAllowedRulesArabic?: string;
  overnightAndWeekendsHoldingArabic?: string;
  copyTradingAllowedRulesArabic?: string;
  copyTradingNotAllowedRulesArabic?: string;
  expertsAllowedRulesArabic?: string;
  expertsNotAllowedRulesArabic?: string;
  riskManagementArabic?: string;
  vpnVpsArabic?: string;
  profitShareArabic?: string;
  inactivityRulesArabic?: string;
  prohibitedStrategiesArabic?: string;
  index: number;

  leverageMobileFontSize?: number | null;
  commissionMobileFontSize?: number | null;
  accountSizesMobileFontSize?: number | null;
  allocationRulesMobileFontSize?: number | null;
  dailyMaxLossMobileFontSize?: number | null;
  riskManagementMobileFontSize?: number | null;
  consistencyRulesMobileFontSize?: number | null;
  minimumTradingDaysMobileFontSize?: number | null;
  newsTradingAllowedRulesMobileFontSize?: number | null;
  newsTradingNotAllowedRulesMobileFontSize?: number | null;
  overnightAndWeekendsHoldingMobileFontSize?: number | null;
  copyTradingAllowedRulesMobileFontSize?: number | null;
  copyTradingNotAllowedRulesMobileFontSize?: number | null;
  expertsAllowedRulesMobileFontSize?: number | null;
  expertsNotAllowedRulesMobileFontSize?: number | null;
  vpnVpsMobileFontSize?: number | null;
  profitShareMobileFontSize?: number | null;
  payoutPolicyMobileFontSize?: number | null;
  scaleupPlansMobileFontSize?: number | null;
  inactivityRulesMobileFontSize?: number | null;
  prohibitedStrategiesMobileFontSize?: number | null;
  restrictedCountriesNoteMobileFontSize?: number | null;
};

export type AccountSize = {
  id: string;
  type: string;
  typeArabic: string;
  englishText: string;
  arabicText: string;
};

export type DailyMaxLoss = {
  id: string;
  type: string;
  typeArabic: string;
  englishText: string;
  arabicText: string;
};

export type MinimumTradingDaysType = {
  id: string;
  type: string;
  typeArabic: string;
  englishText: string;
  arabicText: string;
};

export type ScaleupPlans = {
  id: string;
  rules: string;
  rulesArabic: string;
};

export type DrawDownText = {
  drawdown: string;
  englishText: string;
  arabicText: string;
};
