export interface Country {
  id?: number;
  name: string;
  capital?: string;
  region?: string;
  population: number;
  currency_code?: string | null;
  exchange_rate?: number | null;
  estimated_gdp?: number | null;
  flag_url?: string;
  last_refreshed_at?: Date;
}

export interface ExternalCountry {
  name: string;
  capital?: string;
  region?: string;
  population: number;
  flag?: string;
  currencies?: Array<{ code: string; name: string; symbol: string }>;
}

export interface ExchangeRates {
  rates: { [key: string]: number };
}

export interface CountryQuery {
  region?: string;
  currency?: string;
  sort?: string;
}