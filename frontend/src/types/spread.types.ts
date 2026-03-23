import { SinglePropFirm } from "./firm.types";

export type Platform_T = {
  id: string;
  title: string;
  logoUrl: string;
};

type SpreadSymbolValue = {
  id: string;
  maxValue: number;
  minValue: number;
  symbolId: string;
};

export type Spread = {
  id: string;
  type: string;
  platform: Platform;
  spreadSymbolValues: SpreadSymbolValue[];
  firm: SinglePropFirm;
};

type Platform = {
  id: string;
  title: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
};
