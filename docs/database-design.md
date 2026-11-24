# Database Design

## Doctor

| Field | Type | Rules |
|---|---|---|
| id | UUID | primary key |
| name | text | required, 2-100 characters |
| specialization | text | required |
| phone | text | required |
| email | text | unique, required |
| availability | text | required |
| isActive | boolean | default true |
| createdAt, updatedAt | timestamp | managed by Prisma |

## Appointment

| Field | Type | Rules |
|---|---|---|
| id | UUID | primary key |
| patientName | text | required |
| patientContact | text | required |
| doctorId | UUID | foreign key, restrict delete |
| appointmentDate | timestamp | clinic date |
| startTime | timestamp | UTC |
| endTime | timestamp | UTC |
| reason | text | required |
| status | enum | lifecycle status |
| createdAt, updatedAt | timestamp | managed by Prisma |

Indexes support doctor, date, status, and time filtering. Doctor deletion is restricted while appointments exist. Overlaps are checked transactionally inside create and update operations.
