# Ultra

## Overview
Ultra is a web scraping and data upload project that fetches structured program-related data from the Standout Search API and uploads it to Trieve.

## Folder Structure
```
Ultra
├───client
│   ├───public
│   └───src
│       ├───assets
│       ├───components
│       │   └───ui
│       └───lib
└───server
    ├───controllers
    ├───logs
    ├───middleware
    ├───routes
    └───utils
```

## Setup Instructions

### Prerequisites
Make sure you have the following installed:
- Node.js (v16 or later)
- npm or yarn
- Puppeteer for web scraping
- A `.env` file with Trieve API credentials

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/patelaryan0914/ultra.git
   cd ultra/server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the `server` directory and add:
   ```sh
   TRIEVE_API_KEY=your_trieve_api_key
   TRIEVE_DATASET_ID=your_trieve_dataset_id
   ```

### Running the Server
To start the server, run:
```sh
node index.js
```

## API Endpoints
### 1. Scrape Data
#### `GET /data`
**Description:**
Scrapes data from [Standout Search](https://standoutsearch.pory.app/) and saves it as `data.json`.

**Response:**
- `200 OK`: Data successfully scraped.
- `500 Internal Server Error`: If scraping fails.

### 2. Upload Data to Trieve
#### `GET /upload`
**Description:**
Reads `data.json` and uploads its content to Trieve in chunks of 50 records.

**Response:**
- `200 OK`: Data uploaded successfully.
- `500 Internal Server Error`: If upload fails.

### Logs
Errors are logged using a custom logging utility inside the `utils/logger.js` file.

## Technologies Used
- **Node.js** - Backend runtime
- **Express.js** - API framework
- **Puppeteer** - Web scraping
- **Trieve API** - Data storage and retrieval
- **Logger** - Custom logging utility

## Contributing
Feel free to open issues or submit pull requests to improve this project.

## License
MIT License

