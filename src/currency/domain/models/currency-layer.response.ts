export interface CurrencyLayerLiveResponse {
  success: boolean;
  terms: string;
  privacy: string;
  timestamp: number;
  source: string;
  quotes: Record<string, number>;
}

export interface CurrencyLayerConvertResponse {
  success: boolean;
  terms: string;
  privacy: string;
  timestamp: number;
  source: string;
  result: number;
}
