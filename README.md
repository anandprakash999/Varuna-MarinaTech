# Fuel EU Maritime Compliance Platform

## Overview
This project is a full-stack application designed to manage Fuel EU Maritime compliance. It allows users to view routes, compare GHG intensity against targets, calculate compliance balances, bank surpluses, and manage pooling.

## Architecture
The application follows a **Hexagonal Architecture (Ports & Adapters)** to ensure separation of concerns and testability.

### Backend (`/backend`)
- **Core**: Contains domain entities (`Route`, `ComplianceBalance`, `Pool`) and application logic (`RouteService`, `ComplianceService`, `PoolingService`). This layer is independent of frameworks.
- **Ports**: Interfaces defining how the Core interacts with the outside world (`RouteRepository`, `ComplianceRepository`).
- **Adapters**: Implementations of the ports.
    - **Inbound**: HTTP Controllers (Express) driving the application.
    - **Outbound**: PostgreSQL Repositories (Prisma) for data persistence.
- **Infrastructure**: Configuration and entry points (`server.ts`, `prisma/`).

### Frontend (`/frontend`)
- **React + TypeScript**: Built with Vite for fast development.
- **TailwindCSS**: For styling.
- **Components**: Functional components corresponding to the required tabs (`RoutesTable`, `CompareTab`, `BankingTab`, `PoolingTab`).

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (running on localhost:5432)

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/fueleu_db?schema=public"
   ```
4. Run migrations and seed data:
   ```bash
   npx prisma migrate dev --name init
   npx ts-node prisma/seed.ts
   ```
5. Start the server:
   ```bash
   npm start
   ```
   (Or `npx ts-node src/server.ts` for dev)

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing
- Backend Unit Tests: `npm test` (Uses Jest)
- Frontend Tests: `npm test` (Uses Vitest - *Note: Setup required*)

## Screenshots
(See application running on localhost:5173)
