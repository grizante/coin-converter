export const ICryptoProviderToken = 'ICryptoProvider';

export interface ICryptoProvider {
  getTopTenCryptos(): Promise<
    {
      symbol: string;
      name: string;
      current_price: number;
      market_cap: number;
    }[]
  >;
}
