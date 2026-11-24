# API Documentation

Base URL: `http://localhost:5000/api`

All successful responses use:

```json
{ "success": true, "message": "Operation completed successfully", "data": {} }
```

Errors use:

```json
{ "success": false, "message": "A useful error message", "errors": [] }
```

## Health

`GET /api/health`

## Doctors

- `GET /api/doctors` — search (`search`), specialization, status, page, and limit
- `GET /api/doctors/:id`
- `POST /api/doctors`
- `PUT /api/doctors/:id`
- `DELETE /api/doctors/:id` — 409 if appointments exist

## Appointments

- `GET /api/appointments` — search, status, doctorId, date, sort, page, and limit
- `GET /api/appointments/:id`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

## Appointment lifecycle

`PENDING -> SCHEDULED -> CONFIRMED -> COMPLETED`, with `CANCELLED` available from active states.

Scheduling uses a 30-minute default or a form-provided duration. Create/update operations validate the doctor and reject overlaps with non-cancelled appointments.
