const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectTimeout: 60000, // 60 seconds
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Connected to Railway MySQL');

  // Create countries table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS countries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      capital VARCHAR(255),
      region VARCHAR(100),
      population BIGINT NOT NULL,
      currency_code VARCHAR(10),
      exchange_rate DECIMAL(15, 6),
      estimated_gdp DECIMAL(20, 2),
      flag_url VARCHAR(500),
      last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_region (region),
      INDEX idx_currency (currency_code)
    )
  `);
  console.log('Countries table created');

  // Create metadata table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS app_metadata (
      id INT PRIMARY KEY DEFAULT 1,
      last_refreshed_at TIMESTAMP,
      total_countries INT DEFAULT 0,
      CHECK (id = 1)
    )
  `);
  console.log('Metadata table created');

  await connection.query(`INSERT IGNORE INTO app_metadata (id, total_countries) VALUES (1, 0)`);
  
  await connection.end();
  console.log('Tables setup complete!');
}

setupTables().catch(console.error);