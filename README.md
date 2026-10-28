# VEDA Internship Task Portal

A full-stack internship task submission and mentor review portal.

## Stack
- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: Django, Django REST Framework, Simple JWT
- Database: SQLite for local development

## Project layout
- `frontend/` — pages, UI components, API client and auth helpers
- `backend/` — Django project, role-based apps, API and tests

## Local development
See `frontend/README.md` and `backend/README.md` for setup commands.
Do not commit `.env` files, SQLite databases, tokens, passwords, virtual environments,
`node_modules`, or build output.

## Important implementation rules
- Enforce role and object-level permissions in the backend.
- Resubmissions create new attempts; never overwrite earlier attempts.
- Corrections requests require written feedback.
- Use synthetic users and data only.
