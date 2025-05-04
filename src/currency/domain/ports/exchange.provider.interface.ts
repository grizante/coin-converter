export const IExchangeRateProviderToken = 'IExchangeRateProvider';

export interface IExchangeRateProvider {
  getRate(from: string, to: string): Promise<number>;
}
