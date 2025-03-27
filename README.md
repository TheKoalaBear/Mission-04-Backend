# Insurance Chat Bot API

A Node.js backend service that provides an AI-powered chat interface for insurance consultation. The service uses Google's Gemini AI to help users find the most suitable car insurance policy based on their needs and requirements.

## Features

- AI-powered insurance consultation
- Session-based chat history
- Support for multiple insurance products:
  - Mechanical Breakdown Insurance (MBI)
  - Comprehensive Car Insurance
  - Third Party Car Insurance
- Smart policy recommendations based on:
  - Vehicle make and model
  - Vehicle age
  - Budget
  - Usage patterns
  - Specific needs

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API key

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

## Usage

1. Start the server:

```bash
npm start
```

2. The server will run on `http://localhost:3000`

3. Send POST requests to `/api/chat` with the following body:

```json
{
  "message": "Your message here",
  "sessionId": "unique_session_id"
}
```

## API Endpoints

### POST /api/chat

Send messages to the AI insurance consultant.

**Request Body:**

```json
{
  "message": "string",
  "sessionId": "string"
}
```

**Response:**

```json
{
  "response": "string"
}
```

**Error Response:**

```json
{
  "error": "Failed to process chat message"
}
```

## Insurance Product Rules

- Mechanical Breakdown Insurance (MBI):

  - Not available for trucks or sports cars
  - Available for other vehicle types

- Comprehensive Car Insurance:

  - Only available for vehicles less than 10 years old
  - Available for all vehicle types

- Third Party Car Insurance:
  - Available for all vehicle types
  - No age restrictions

## Error Handling

The API includes error handling for:

- Invalid API requests
- AI processing errors
- Server errors

## Security

- API key is stored securely in environment variables
- CORS enabled for cross-origin requests
- Input validation for all requests

## License

[Your License Here]
