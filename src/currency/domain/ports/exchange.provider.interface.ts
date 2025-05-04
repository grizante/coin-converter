export const IExchangeRateProviderToken = 'IExchangeRateProvider';

export interface IExchangeRateProvider {
  getRate(from: string, to: string): Promise<number>;
  convertCurrency(from: string, to: string, amount: number): Promise<number>;
}
