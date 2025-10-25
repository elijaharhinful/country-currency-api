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
- Canvas (for image generation)

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

3. Setup MySQL database
```sql
CREATE DATABASE countries_db;
-- Run the SQL schema from Phase 2, Step 7
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
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

## Environment Variables
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=db_name
DB_PORT=3306
PORT=3000
```

## Testing
Test all endpoints using the provided curl commands or Postman.

## Deployment
This API can be deployed to Railway, Heroku, AWS, or similar platforms.

## License
MIT