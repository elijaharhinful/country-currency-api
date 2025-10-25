import { Request, Response } from 'express';
import { CountryModel } from '../models/countryModel';
import { ExternalApiService } from '../services/externalApi';
import { ImageService } from '../services/imageService';
import { Country } from '../types';

const countryModel = new CountryModel();
const externalApiService = new ExternalApiService();
const imageService = new ImageService();

export class CountryController {
  async refreshCountries(req: Request, res: Response) {
    try {
      // Fetch external data
      const [countriesData, exchangeData] = await Promise.all([
        externalApiService.fetchCountries(),
        externalApiService.fetchExchangeRates()
      ]);

      const rates = exchangeData.rates;
      let processedCount = 0;

      // Process each country
      for (const extCountry of countriesData) {
        const currencyCode = extCountry.currencies?.[0]?.code || null;
        const exchangeRate = currencyCode ? rates[currencyCode] || null : null;

        // Calculate estimated GDP
        let estimatedGdp: number | null = null;
        if (exchangeRate && currencyCode) {
          const randomMultiplier = Math.random() * (2000 - 1000) + 1000;
          estimatedGdp = (extCountry.population * randomMultiplier) / exchangeRate;
        } else if (!currencyCode) {
          estimatedGdp = 0;
        }

        const country: Country = {
          name: extCountry.name,
          capital: extCountry.capital,
          region: extCountry.region,
          population: extCountry.population,
          currency_code: currencyCode,
          exchange_rate: exchangeRate,
          estimated_gdp: estimatedGdp,
          flag_url: extCountry.flag
        };

        // Check if country exists
        const existing = await countryModel.findByName(country.name);
        if (existing) {
          await countryModel.update(country.name, country);
        } else {
          await countryModel.create(country);
        }
        processedCount++;
      }

      // Update metadata
      await countryModel.updateMetadata(processedCount);

      // Generate image
      const topCountries = await countryModel.getTopByGdp(5);
      await imageService.generateSummaryImage({
        totalCountries: processedCount,
        topCountries: topCountries as any,
        timestamp: new Date().toISOString()
      });

      res.json({
        message: 'Countries refreshed successfully',
        total_processed: processedCount
      });
    } catch (error: any) {
      console.error('Refresh error:', error);
      res.status(503).json({
        error: 'External data source unavailable',
        details: error.message
      });
    }
  }

  async getAllCountries(req: Request, res: Response) {
    try {
      const query = {
        region: req.query.region as string,
        currency: req.query.currency as string,
        sort: req.query.sort as string
      };

      const countries = await countryModel.findAll(query);
      res.json(countries);
    } catch (error) {
      console.error('Get all error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCountryByName(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const country = await countryModel.findByName(name);

      if (!country) {
        return res.status(404).json({ error: 'Country not found' });
      }

      res.json(country);
    } catch (error) {
      console.error('Get by name error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteCountry(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const deleted = await countryModel.delete(name);

      if (!deleted) {
        return res.status(404).json({ error: 'Country not found' });
      }

      res.json({ message: 'Country deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getStatus(req: Request, res: Response) {
    try {
      const metadata = await countryModel.getMetadata();
      res.json({
        total_countries: metadata.total_countries,
        last_refreshed_at: metadata.last_refreshed_at
      });
    } catch (error) {
      console.error('Status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getImage(req: Request, res: Response) {
    try {
      if (!imageService.imageExists()) {
        return res.status(404).json({ error: 'Summary image not found' });
      }

      res.sendFile(imageService.getImagePath());
    } catch (error) {
      console.error('Image error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}