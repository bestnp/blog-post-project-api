# Blog Post Project API

Express API Server for hh. website

## Installation

```bash
npm install
```

## Run Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### GET /profiles
Get John's profile

**Response (200)**
```json
{
  "data": {
    "name": "john",
    "age": 20
  }
}
```

### GET /health
Health check

**Response (200)**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Tech Stack

- Node.js
- Express.js
- CORS

## Port

Server runs on port `3001` by default
