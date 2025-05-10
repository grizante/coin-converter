import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CurrencyLayerClient } from './currency-layer.client';
import {
  CurrencyLayerLiveResponse,
  CurrencyLayerConvertResponse,
} from '../../../domain/models/currency-layer.response';

describe('CurrencyLayerClient', () => {
  let client: CurrencyLayerClient;

  const configServiceMock = {
    getOrThrow: jest.fn(),
  };

  const mockRate = 1.2;
  const mockConvert = 120;

  const fetchMock = jest.fn();

  beforeEach(async () => {
    global.fetch = fetchMock;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyLayerClient,
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    client = module.get<CurrencyLayerClient>(CurrencyLayerClient);
  });

  it('should be defined', () => {
    expect(client).toBeDefined();
  });

  it('should return exchange rate from API', async () => {
    const mockResponse: CurrencyLayerLiveResponse = {
      success: true,
      privacy: 'https://currencylayer.com/privacy',
      source: 'USD',
      terms: 'https://currencylayer.com/terms',
      timestamp: 1686000000,
      quotes: {
        USDEUR: mockRate,
      },
    };

    configServiceMock.getOrThrow.mockImplementation((key: string) => {
      if (key === 'currencyLayer.accessKey') return 'test-access-key';
      if (key === 'currencyLayer.endpoint')
        return 'https://api.currencylayer.com';
      return '';
    });

    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const rate = await client.getRate('USD', 'EUR');

    expect(rate.rate).toEqual(mockRate);
  });

  it('should throw InternalServerErrorException if API response is unsuccessful', async () => {
    const mockResponse: CurrencyLayerLiveResponse = {
      success: false,
      privacy: 'https://currencylayer.com/privacy',
      quotes: {},
      source: 'USD',
      terms: 'https://currencylayer.com/terms',
      timestamp: 1686000000,
    };

    configServiceMock.getOrThrow.mockImplementation((key: string) => {
      if (key === 'currencyLayer.accessKey') return 'test-access-key';
      if (key === 'currencyLayer.endpoint')
        return 'https://api.currencylayer.com';
      return '';
    });

    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    try {
      await client.getRate('USD', 'EUR');
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('should return converted amount from API', async () => {
    const mockResponse: CurrencyLayerConvertResponse = {
      success: true,
      terms: 'https://currencylayer.com/terms',
      privacy: 'https://currencylayer.com/privacy',
      timestamp: 1686000000,
      source: 'USD',
      result: mockConvert,
    };

    configServiceMock.getOrThrow.mockImplementation((key: string) => {
      if (key === 'currencyLayer.accessKey') return 'test-access-key';
      if (key === 'currencyLayer.endpoint')
        return 'https://api.currencylayer.com';
      return '';
    });

    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const convertedAmount = await client.convertCurrency('USD', 'EUR', 100);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.currencylayer.com/convert?access_key=test-access-key&from=USD&to=EUR&amount=100&format=1',
    );
    expect(convertedAmount).toEqual(mockConvert);
  });

  it('should throw InternalServerErrorException if convertCurrency API response is unsuccessful', async () => {
    const mockResponse: CurrencyLayerConvertResponse = {
      success: false,
      terms: 'https://currencylayer.com/terms',
      privacy: 'https://currencylayer.com/privacy',
      timestamp: 1686000000,
      source: 'USD',
      result: mockConvert,
    };

    configServiceMock.getOrThrow.mockImplementation((key: string) => {
      if (key === 'currencyLayer.accessKey') return 'test-access-key';
      if (key === 'currencyLayer.endpoint')
        return 'https://api.currencylayer.com';
      return '';
    });

    fetchMock.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    try {
      await client.convertCurrency('USD', 'EUR', 100);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });
});
