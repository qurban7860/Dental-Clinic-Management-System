# Architecture

## Runtime

```text
React/Vite client -> centralized Fetch API service -> Express REST API -> Prisma -> PostgreSQL
```

The client is organized into shared components, page modules, and a centralized API service. The server separates routes, validation, middleware, database access, and scheduling logic.

## Frontend

- React functional components and hooks
- React Router refresh-safe route structure
- Responsive fixed/sidebar navigation
- Shared page, modal, confirmation, loading, empty, badge, and error components
- Debounced search and mutation refetching

## Backend

- Express JSON REST API
- Zod request validation
- Centralized AppError and error middleware
- Helmet, CORS, Morgan, and body-size limits
- Prisma connection lifecycle and graceful shutdown

## Database

`Doctor` has a one-to-many restricted relationship with `Appointment`. Doctor email is unique. Appointment indexes support doctor/time/status/date filtering.
