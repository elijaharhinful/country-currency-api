import pool from '../config/database';
import { Country, CountryQuery } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class CountryModel {
  async findByName(name: string): Promise<Country | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM countries WHERE LOWER(name) = LOWER(?)',
      [name]
    );
    return rows.length > 0 ? (rows[0] as Country) : null;
  }

  async findAll(query: CountryQuery): Promise<Country[]> {
    let sql = 'SELECT * FROM countries WHERE 1=1';
    const params: any[] = [];

    if (query.region) {
      sql += ' AND region = ?';
      params.push(query.region);
    }

    if (query.currency) {
      sql += ' AND currency_code = ?';
      params.push(query.currency);
    }

    // Sorting
    if (query.sort === 'gdp_desc') {
      sql += ' ORDER BY estimated_gdp DESC';
    } else if (query.sort === 'gdp_asc') {
      sql += ' ORDER BY estimated_gdp ASC';
    } else if (query.sort === 'name_asc') {
      sql += ' ORDER BY name ASC';
    } else if (query.sort === 'name_desc') {
      sql += ' ORDER BY name DESC';
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows as Country[];
  }

  async create(country: Country): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO countries 
       (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        country.name,
        country.capital,
        country.region,
        country.population,
        country.currency_code,
        country.exchange_rate,
        country.estimated_gdp,
        country.flag_url
      ]
    );
    return result.insertId;
  }

  async update(name: string, country: Country): Promise<void> {
    await pool.query(
      `UPDATE countries 
       SET capital = ?, region = ?, population = ?, currency_code = ?, 
           exchange_rate = ?, estimated_gdp = ?, flag_url = ?, last_refreshed_at = NOW()
       WHERE LOWER(name) = LOWER(?)`,
      [
        country.capital,
        country.region,
        country.population,
        country.currency_code,
        country.exchange_rate,
        country.estimated_gdp,
        country.flag_url,
        name
      ]
    );
  }

  async delete(name: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM countries WHERE LOWER(name) = LOWER(?)',
      [name]
    );
    return result.affectedRows > 0;
  }

  async getTopByGdp(limit: number): Promise<Country[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT name, estimated_gdp FROM countries WHERE estimated_gdp IS NOT NULL ORDER BY estimated_gdp DESC LIMIT ?',
      [limit]
    );
    return rows as Country[];
  }

  async updateMetadata(totalCountries: number): Promise<void> {
    await pool.query(
      'UPDATE app_metadata SET last_refreshed_at = NOW(), total_countries = ? WHERE id = 1',
      [totalCountries]
    );
  }

  async getMetadata(): Promise<{ total_countries: number; last_refreshed_at: Date | null }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT total_countries, last_refreshed_at FROM app_metadata WHERE id = 1'
    );
    return rows[0] as any;
  }
}