# Feedback Management System

A centralized web-based platform for collecting, managing, searching, and analyzing feedback from participants, employees, and customers. Built as a full-stack capstone project using React, FastAPI, and MySQL.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup Guide](#installation--setup-guide)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Screenshots](#screenshots)
  - [UI Screenshots](#ui-screenshots)
  - [API Testing Screenshots](#api-testing-screenshots)
- [Future Scope](#future-scope)

---

## Project Overview

Organizations currently collect feedback using Google Forms, Excel sheets, and emails — resulting in scattered data, no centralized management, and limited search capability.

This system solves that by providing a single platform to:

- Submit feedback with structured fields and star ratings
- View and manage all feedback records
- Search and filter feedback by keyword, rating, or program
- View dashboard statistics including total count, average rating, and rating distribution

---

## Tech Stack

| Layer      | Technology          | Version  |
|------------|---------------------|----------|
| Frontend   | React + Vite        | React 19 |
| Backend    | Python FastAPI      | 0.115+   |
| Database   | MySQL               | 8.0      |
| ORM        | SQLAlchemy          | 2.0+     |
| API Client | Axios               | 1.x      |
| Routing    | React Router DOM    | 7.x      |

---

## Prerequisites

Ensure the following are installed before running the project:

- **Python** 3.10 or higher
- **Node.js** 18 or higher and **npm**
- **MySQL** 8.0 running locally
- **Git**

---

## Project Structure

```
Feedback Management System/
│
├── backend/
│   ├── main.py               # FastAPI app entry point, CORS, router registration
│   ├── config.py             # Environment variable configuration
│   ├── database.py           # SQLAlchemy engine, session, auto DB creation
│   ├── models.py             # ORM model — Feedback table
│   ├── schemas.py            # Pydantic request/response schemas
│   ├── crud.py               # Database CRUD operations
│   ├── routers/
│   │   └── feedback.py       # All API route handlers
│   ├── services/
│   │   └── feedback_service.py  # Business logic layer
│   ├── .env                  # Environment variables (DB credentials)
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx        # Sidebar navigation
│       │   ├── StarRating.jsx    # Interactive/readonly star rating
│       │   └── Pagination.jsx    # Page navigation component
│       ├── pages/
│       │   ├── Dashboard.jsx     # Stats overview and recent feedback
│       │   ├── FeedbackList.jsx  # Paginated table with filters
│       │   ├── FeedbackDetail.jsx# Detail view with edit/delete
│       │   ├── SubmitFeedback.jsx# Feedback submission form
│       │   └── Search.jsx        # Advanced search and filter
│       ├── services/
│       │   └── feedbackService.js # Axios API service layer
│       ├── App.jsx               # Router setup
│       └── api.js                # Axios instance configuration
│
└── README.md
```

---

## Installation & Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd "Feedback Management System"
```

---

### 2. Backend Setup

#### a. Navigate to the backend folder

```bash
cd backend
```

#### b. Create a virtual environment (recommended)

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

#### c. Install dependencies

```bash
pip install -r requirements.txt
```

#### d. Configure environment variables

Open `.env` and set your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=feedback_management
```

> The database `feedback_management` is created automatically on first run if it does not exist.

#### e. Start the backend server

```bash
python -m uvicorn main:app --reload --port 8000
```

The API will be available at: `http://localhost:8000`  
Interactive API docs (Swagger UI): `http://localhost:8000/docs`

---

### 3. Frontend Setup

#### a. Navigate to the frontend folder

```bash
cd ../frontend
```

#### b. Install dependencies

```bash
npm install
```

#### c. Start the development server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

> Make sure the backend server is running before opening the frontend.

---

## Database

The database and table are created automatically when the backend starts for the first time.

### Schema — `feedback` table

| Column Name      | Data Type    | Description                        |
|------------------|--------------|------------------------------------|
| feedback_id      | INT (PK, AI) | Auto-incremented primary key       |
| participant_name | VARCHAR(255) | Name of the feedback submitter     |
| program_name     | VARCHAR(255) | Name of the training/event/product |
| rating           | INT          | Rating value between 1 and 5       |
| comments         | TEXT         | Optional feedback comments         |
| submitted_at     | DATETIME     | Timestamp of submission (UTC)      |

### Rating Scale

| Value | Label     |
|-------|-----------|
| 1     | Poor      |
| 2     | Fair      |
| 3     | Good      |
| 4     | Very Good |
| 5     | Excellent |

---

## API Documentation

Base URL: `http://localhost:8000/api/v1`

### Feedback Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/feedback`           | Retrieve all feedback (paginated)  |
| GET    | `/feedback/{id}`      | Retrieve feedback by ID            |
| POST   | `/feedback`           | Submit new feedback                |
| PUT    | `/feedback/{id}`      | Update existing feedback           |
| DELETE | `/feedback/{id}`      | Delete a feedback record           |
| GET    | `/search`             | Search and filter feedback         |
| GET    | `/dashboard/stats`    | Get dashboard statistics           |

---

### Query Parameters

**GET `/feedback`**

| Parameter    | Type    | Required | Description                        |
|--------------|---------|----------|------------------------------------|
| page         | integer | No       | Page number (default: 1)           |
| page_size    | integer | No       | Items per page (default: 20)       |
| rating       | integer | No       | Filter by exact rating (1–5)       |
| program_name | string  | No       | Filter by program name (partial)   |

**GET `/search`**

| Parameter    | Type    | Required | Description                              |
|--------------|---------|----------|------------------------------------------|
| keyword      | string  | No       | Search in name, program, and comments    |
| rating       | integer | No       | Exact rating match (1–5)                 |
| min_rating   | integer | No       | Minimum rating filter                    |
| max_rating   | integer | No       | Maximum rating filter                    |
| program_name | string  | No       | Filter by program name (partial match)   |
| page         | integer | No       | Page number (default: 1)                 |
| page_size    | integer | No       | Items per page (default: 20)             |

---

### Request & Response Examples

**POST `/feedback`** — Submit feedback

Request body:
```json
{
  "participant_name": "Alice Johnson",
  "program_name": "Python Bootcamp 2025",
  "rating": 5,
  "comments": "Excellent course! Highly structured and very informative."
}
```

Response `201 Created`:
```json
{
  "feedback_id": 1,
  "participant_name": "Alice Johnson",
  "program_name": "Python Bootcamp 2025",
  "rating": 5,
  "comments": "Excellent course! Highly structured and very informative.",
  "submitted_at": "2026-05-14T08:41:23"
}
```

**GET `/feedback`** — List all feedback

Response `200 OK`:
```json
{
  "total": 5,
  "page": 1,
  "page_size": 20,
  "data": [
    {
      "feedback_id": 1,
      "participant_name": "Alice Johnson",
      "program_name": "Python Bootcamp 2025",
      "rating": 5,
      "comments": "Excellent course!",
      "submitted_at": "2026-05-14T08:41:23"
    }
  ]
}
```

**PUT `/feedback/{id}`** — Update feedback

Request body (all fields optional):
```json
{
  "rating": 4,
  "comments": "Updated comment after review."
}
```

**DELETE `/feedback/{id}`** — Delete feedback

Response `200 OK`:
```json
{
  "message": "Feedback 1 deleted successfully"
}
```

**GET `/dashboard/stats`** — Dashboard statistics

Response `200 OK`:
```json
{
  "total_feedback": 5,
  "average_rating": 4.2,
  "rating_distribution": {
    "Excellent": 2,
    "Very Good": 1,
    "Good": 2,
    "Fair": 0,
    "Poor": 0
  },
  "recent_feedback": []
}
```

---

## Features

- Submit feedback with participant name, program name, star rating (1–5), and comments
- View all feedback in a paginated, filterable table
- Filter feedback by rating or program name
- Full-text keyword search across participant name, program name, and comments
- Advanced search with rating range (min/max) filters
- View detailed feedback entry with full information
- Edit any feedback record via an inline modal
- Delete feedback with confirmation dialog
- Dashboard with total feedback count, average rating, rating distribution chart, and recent entries
- Responsive layout with sidebar navigation
- Client-side form validation with inline error messages
- Auto-creates the MySQL database and table on first backend start

---

## Screenshots

> **Note:** Replace each placeholder below with the actual screenshot image file placed in the `screenshots/` folder.

### UI Screenshots

**Dashboard — Overview & Stats**

![Dashboard](screenshots/ui/01_dashboard.png)

---

**Submit Feedback — Form Page**

![Submit Feedback](screenshots/ui/02_submit_feedback.png)

---

**All Feedback — Listing with Filters**

![Feedback List](screenshots/ui/03_feedback_list.png)

---

**Feedback Detail — View, Edit & Delete**

![Feedback Detail](screenshots/ui/04_feedback_detail.png)

---

**Search & Filter Page**

![Search](screenshots/ui/05_search.png)

---

### API Testing Screenshots

> Screenshots taken from Postman / Swagger UI (`http://localhost:8000/docs`)

**GET /feedback — Retrieve All Feedback**

![GET All Feedback](screenshots/api/01_get_all_feedback.png)

---

**GET /feedback/{id} — Retrieve by ID**

![GET Feedback by ID](screenshots/api/02_get_feedback_by_id.png)

---

**POST /feedback — Submit New Feedback**

![POST Feedback](screenshots/api/03_post_feedback.png)

---

**PUT /feedback/{id} — Update Feedback**

![PUT Feedback](screenshots/api/04_put_feedback.png)

---

**DELETE /feedback/{id} — Delete Feedback**

![DELETE Feedback](screenshots/api/05_delete_feedback.png)

---

**GET /search — Search & Filter**

![Search Feedback](screenshots/api/06_search_feedback.png)

---

**GET /dashboard/stats — Dashboard Statistics**

![Dashboard Stats](screenshots/api/07_dashboard_stats.png)

---

## Future Scope

Phase 2 of this project is planned to include:

- **Data Engineering Pipelines** — Automated ETL pipelines for feedback data processing
- **Analytics Dashboards** — Visual charts and trend analysis using aggregated feedback data
- **Sentiment Analysis** — NLP-based classification of feedback comments as positive, neutral, or negative
- **AI-Powered Semantic Search** — Context-aware search using vector embeddings
- **GenAI Summarization** — Automated summary generation of feedback using large language models
- **Authentication & Authorization** — Role-based access control for participants and administrators
- **Cloud Deployment** — Containerized deployment on AWS / GCP / Azure
