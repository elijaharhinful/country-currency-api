# Country Currency & Exchange API

A RESTful API that fetches country data and exchange rates, stores them in MySQL, and provides various query operations.

## Features
- Fetch and cache country data with exchange rates
- Filter countries by region and currency
- Sort by GDP, name
- Generate summary images
- Full CRUD operations

## Tech Stack
- Node.js + TypeScript
- Express.js
- MySQL
- Canvas (image generation)

## Prerequisites
- Node.js 16+
- MySQL 8+
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd country-currency-api
```

2. Install dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Railway MySQL (Recommended for Production)

1. Create Railway account at https://railway.app
2. Create new project → Database → MySQL
3. Copy connection details from Variables tab:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

4. Create tables using one of these methods:

**Method 1 - Node.js Script (Easiest):**
```bash
# Update .env with Railway public credentials first
node setup-tables.js
```

**Method 2 - MySQL Workbench:**
- Download from https://dev.mysql.com/downloads/workbench/
- Create new connection with Railway credentials
- Enable SSL in connection settings
- Run the SQL schema below

**Method 3 - MySQL CLI:**
```bash
mysql -h [RAILWAY_HOST] -P [PORT] -u root -p[PASSWORD] [DATABASE] --ssl-mode=REQUIRED
```

#### Option B: Local MySQL

1. Install MySQL:
   - **Windows:** https://dev.mysql.com/downloads/mysql/
   - **Mac:** `brew install mysql && brew services start mysql`
   - **Linux:** `sudo apt install mysql-server`

2. Create database:
```sql
CREATE DATABASE countries_db;
CREATE USER 'dev_user'@'localhost' IDENTIFIED BY 'dev_password123';
GRANT ALL PRIVILEGES ON countries_db.* TO 'dev_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Run schema (see below)

### Database Schema
```sql
CREATE TABLE countries (
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
);

CREATE TABLE app_metadata (
  id INT PRIMARY KEY DEFAULT 1,
  last_refreshed_at TIMESTAMP,
  total_countries INT DEFAULT 0,
  CHECK (id = 1)
);

INSERT INTO app_metadata (id, total_countries) VALUES (1, 0);
```

4. Configure environment variables
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=db_name
DB_PORT=3306

PORT=3000
NODE_ENV=development

COUNTRIES_API=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_API=https://open.er-api.com/v6/latest/USD
```

5. Run the application
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### POST /countries/refresh
Fetches fresh data from external APIs and updates the database.

### GET /countries
Get all countries with optional filters:
- `?region=Africa` - Filter by region
- `?currency=USD` - Filter by currency
- `?sort=gdp_desc` - Sort by GDP

### GET /countries/:name
Get a specific country by name.

### DELETE /countries/:name
Delete a country from the database.

### GET /status
Get total countries and last refresh timestamp.

### GET /countries/image
Get the generated summary image.

## Testing
Test all endpoints using the provided curl commands or Postman.

## Deployment
This API can be deployed to Railway, Heroku, AWS, or similar platforms.

## License
MIT