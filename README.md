# Python Course AI Platform

## Seed course data

Run the idempotent course seed from the backend directory:

```bash
cd backend
python -m app.seeds.seed_courses
```

The seed creates/updates 3 published courses, their sections, lessons, demo videos, transcripts, and summaries.

## Run backend

```bash
cd backend
npm run dev
```

## Run frontend

```bash
cd frontend
npm run dev
```
