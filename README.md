# College ERP System

A comprehensive, enterprise-grade College ERP system built with a modern tech stack.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16.0.7 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **State Management**: TanStack Query
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS (Modular Architecture)
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Cache/Queues**: Redis with BullMQ
- **Authentication**: JWT (Access + Refresh Tokens) + Passport
- **Documentation**: Swagger API

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Storage**: AWS S3 (or S3-compatible MinIO/DigitalOcean Spaces)

## 📂 Project Structure

This project is organized as a Monorepo using NPM Workspaces.

```text
.
├── apps
│   ├── api          # NestJS Backend Application
│   └── web          # Next.js Frontend Application
├── packages
│   ├── config       # Shared configurations (TypeScript, etc.)
│   ├── types        # Shared types (optional)
│   └── utils        # Shared utilities (optional)
└── docker-compose.yml
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/typeTeja/college-erp.git
   cd college-erp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   - Create `apps/api/.env` (refer to `apps/api/.env.example` if available, or use the provided sensitive defaults for dev).
   - Ensure Docker is running.

### Running the Application

1. **Start Infrastructure (DB & Redis)**
   ```bash
   docker-compose up -d db redis
   ```

2. **Generate Database Client**
   ```bash
   npm run db:generate
   ```

3. **Run Migrations**
   ```bash
   npm run db:migrate
   ```

4. **Start Development Servers**
   - **Backend API**:
     ```bash
     npm run dev:api
     ```
     Running on: `http://localhost:3001`
     Swagger Docs: `http://localhost:3001/api/docs`

   - **Frontend Web**:
     ```bash
     npm run dev:web
     ```
     Running on: `http://localhost:3000`

## 🧩 Modules Overview

- **Auth**: JWT-based authentication and Role-Based Access Control (RBAC).
- **Admissions**: Application handling, document uploads via S3 presigned URLs.
- **Students**: Student lifecycle management, extensive profile details.
- **Attendance**: (Coming Soon) Daily and subject-wise attendance tracking.
- **Academics**: (Coming Soon) Course, batch, and syllabus management.

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
