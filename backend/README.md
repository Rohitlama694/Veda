# VEDA Backend

## Prerequisites
- Python 3.11+ (record the exact version used)
- pip and a virtual environment

## Setup (Windows PowerShell)
From `backend/`:
```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

## Setup (macOS/Linux)
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

API base: http://127.0.0.1:8000/api/
Health check: http://127.0.0.1:8000/healthz/

The project files here are an initial scaffold. The seed command, models, permissions,
and endpoints must be implemented and tested before the app is considered complete.
