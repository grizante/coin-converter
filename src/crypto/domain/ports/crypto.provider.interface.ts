export const ICryptoProviderToken = 'ICryptoProvider';

export interface ICryptoProvider {
  getTopTenCryptos(currency?: string): Promise<
    {
      symbol: string;
      name: string;
      current_price: number;
      market_cap: number;
      market_cap_rank: number;
    }[]
  >;
}
