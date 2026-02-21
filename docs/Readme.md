# Intern Job Tracking Application

A role-based internship management platform built using Spring Boot and React.  
This system enables candidates to apply for internships and recruiters to manage applications in a structured, secure workflow.

---

## 1. Overview

The Intern Job Tracking Application is a lightweight Applicant Tracking System (ATS) designed for small-scale use such as campus hiring or portfolio demonstration.

It implements:

- Role-Based Access Control (RBAC)
- JWT Authentication
- Internship Management
- Application Workflow
- Status Tracking with Audit History
- Database Versioning via Flyway
- Clean Layered Architecture

This project is intentionally designed as a monolithic system for simplicity and maintainability.

---

## 2. Tech Stack

### Backend

- Java 17+
- Spring Boot 3.x
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- PostgreSQL
- Flyway (Database Migrations)
- OpenAPI (Swagger)

### Frontend

- React (Vite)
- TypeScript
- Tailwind CSS
- Axios

### Infrastructure

- Backend Hosting: Render
- Database: Neon PostgreSQL
- Frontend Hosting: Vercel
- Resume Storage: Cloudinary

---

## 3. Features

### Authentication

- User registration (Candidate / Recruiter)
- Secure login with JWT
- Role-based endpoint protection

### Internship Management

- Recruiter can create internships
- Recruiter can update internships
- Public can browse open internships
- Pagination supported

### Application Workflow

- Candidate can apply to internship
- Duplicate applications prevented at DB level
- Resume URL stored as snapshot

### Application Management

- Recruiter can view applicants
- Recruiter can update application status
- Status transitions validated
- Full status history maintained

---

## 4. Architecture

The system follows a layered monolithic architecture. For detailed insights, refer to `4. System arch document.md`.

---

## 5. Getting Started (Local Development)

### 5.1 Prerequisites

- Java 17+
- Maven
- Node.js 18+
- PostgreSQL

---

### 5.2 Backend Setup

1. Clone repository:

```bash
git clone <repository-url>
```

1. Configure database in `application-dev.yml`.

2. Set environment variables:

```bash
JWT_SECRET=your_secret
SPRING_PROFILES_ACTIVE=dev
```

1. Run application:

```bash
./mvnw spring-boot:run
```

1. Access Swagger:

`http://localhost:8080/swagger-ui.html`

---

### 5.3 Frontend Setup

1. Navigate to frontend directory.
2. Install dependencies:

```bash
npm install
```

1. Set environment variable:

```text
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

1. Run development server:

```bash
npm run dev
```

---

## 6. API Overview

Base URL:

`/api/v1`

Main Endpoints:

- POST `/auth/register`
- POST `/auth/login`
- GET `/internships`
- POST `/internships`
- POST `/internships/{id}/apply`
- GET `/candidate/applications`
- PATCH `/applications/{id}/status`

Swagger UI available for full API documentation.

---

## 7. Database

Managed via PostgreSQL and Flyway.
Refer to `6. Database Design Document.md` for schema details and constraints.

---

## 8. Security Highlights

Authentication and authorization are secured via stateless JWT, BCrypt, and Role-Based Access Control.
Refer to `9. Security Design Document.md` and `10. Threat Model.md` for full context.

---

## 9. Deployment

### Backend Deployment

- Deploy to Render
- Configure environment variables
- Flyway runs automatically

### Frontend Deployment

- Deploy to Vercel
- Configure API base URL

Ensure HTTPS enabled in production.

---

## 10. Project Structure (Backend)

```text
src/main/java/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── security/
└── config/
```

---

## 11. Design Principles

- Keep it simple.
- Avoid overengineering.
- Enforce integrity at database level.
- Separate authentication from profile data.
- Maintain clean layering.
- Build for clarity, not scale complexity.

---

## 12. Future Enhancements & Limitations

For a detailed list of known limitations, accepted risks, and post-MVP enhancements, please refer to the `1. Product Requirments Document.md` and `13. Development Roadmap.md`.

---

## 14. Development Status

This project includes:

- Complete backend API
- Structured database schema
- Secure authentication
- Functional frontend
- Production deployment support
- Full documentation suite

---

## 15. License

This project is intended for educational and demonstration purposes.

---

## 16. Final Notes

This application demonstrates:

- Clean backend architecture
- Secure authentication patterns
- Database integrity enforcement
- Professional documentation practices
- Structured development methodology

It is intentionally built as a simple, maintainable monolith suitable for internship-scale deployment and portfolio presentation.
