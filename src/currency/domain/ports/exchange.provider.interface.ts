export const IExchangeRateProviderToken = 'IExchangeRateProvider';

export interface IExchangeRateProvider {
  getRate(
    from: string,
    to: string,
  ): Promise<{ rate: number; success: boolean }>;
  convertCurrency(from: string, to: string, amount: number): Promise<number>;
}
