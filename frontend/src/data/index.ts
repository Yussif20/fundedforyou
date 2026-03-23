export * from "./announcements.data";
export * from "./challenge.data";
export * from "./companies.data";
export * from "./country.data";
export * from "./news.data";
export * from "./offer.data";
export * from "./news.data";

export const programTypes = [
  { name: "1 Step", value: "STEP1" },
  { name: "2 Step", value: "STEP2" },
  { name: "3 Step", value: "STEP3" },
  { name: "4 Step", value: "STEP4" },
  { name: "Instant", value: "INSTANT" },
];

export const drawDowns = [
  { name: "Fixed on Capital", value: "balanceBased" },
  { name: "Fixed on Equity", value: "equityBased" },
  { name: "Moving End of Day", value: "trailingEod" },
  { name: "Moving During Day", value: "trailingIntraday" },
  { name: "Smart Loss", value: "smartDd" },
];

export const otherFeatures = [
  { name: "Expert Advisor", value: "expertAdvisor" },
  { name: "News Trading", value: "newsTrading" },
  { name: "Overnight & Weekend Holding", value: "overnightHolding" },
  { name: "Copy trading", value: "tradeCopying" },
];

export const propFirmInstrumentTypes = [
  { name: "Forex", value: "forex" },
  { name: "CFD", value: "cfd" },
  { name: "Stocks", value: "stocks" },
  { name: "Futures", value: "futures" },
  { name: "Options", value: "options" },
  { name: "Crypto", value: "crypto" },
  { name: "Metals", value: "metals" },
  { name: "Energy", value: "energy" },
];
