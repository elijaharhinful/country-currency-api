import axios from 'axios';
import { ExternalCountry, ExchangeRates } from '../types';

export class ExternalApiService {
  private countriesUrl = process.env.COUNTRIES_API!;
  private exchangeUrl = process.env.EXCHANGE_API!;

  async fetchCountries(): Promise<ExternalCountry[]> {
    try {
      const response = await axios.get(this.countriesUrl, { timeout: 10000 });
      return response.data;
    } catch (error) {
      throw new Error('Could not fetch data from REST Countries API');
    }
  }

  async fetchExchangeRates(): Promise<ExchangeRates> {
    try {
      const response = await axios.get(this.exchangeUrl, { timeout: 10000 });
      return response.data;
    } catch (error) {
      throw new Error('Could not fetch data from Exchange Rate API');
    }
  }
}