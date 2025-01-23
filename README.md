# Kewl - Next.js + tRPC Demo Application

A modern web application showcasing the integration of Next.js with tRPC, featuring interactive demos and API endpoints.

## Features

- **Hello World Demo**: Simple greeting API demonstration
- **Complex Data API**: Advanced data fetching with filtering capabilities
- **Modern UI**: Clean and responsive interface using Tailwind CSS
- **Type-Safe API**: End-to-end type safety with tRPC

## Tech Stack

- Next.js 15.1.6
- React 19
- tRPC 10
- TypeScript
- Tailwind CSS
- Zod for validation

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Run the development server:

```bash
 npm run dev
 # or
 yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

### Hello World
- **Endpoint**: `/api/trpc/hello`
- **Input**: `{ name?: string }`
- **Response**: `{ greeting: string }`

### Complex Data
- **Endpoint**: `/api/trpc/complexData`
- **Input**: `{ id: number, filter?: string }`
- **Response**: Complex object with nested data

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── api/          # API routes
│   └── page.tsx      # Main page component
├── server/           # tRPC server definitions
│   └── trpc.ts       # tRPC router and procedures
└── utils/            # Utility functions
    └── trpc.ts       # tRPC client configuration
```

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT license.
