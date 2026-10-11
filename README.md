# SoloDesk

**A Freelancer Management Web Application**

SoloDesk is a freelancer management application designed to help independent freelancers organize their business workflow in one place, from managing leads and clients to tracking projects, approvals, invoices, and payments.

The project is being developed as a learning-focused, full-stack web application.

## Features

- **Dashboard** — An overview of freelance business activities.
- **Authentication** — Login, registration, and password recovery interfaces.
- **Clients and Leads** — Manage client relationships and potential opportunities.
- **Deals and Proposals** — Organize deals, proposals, and project agreements.
- **Projects and Tasks** — Track projects, tasks, deadlines, and progress.
- **Milestones** — Manage important project deliverables.
- **Approvals** — Track submissions, decisions, feedback, and revisions.
- **Invoices** — Create and manage invoices and outstanding balances.
- **Payments** — Review recorded payments and payment history.
- **Profile and Account Settings** — Manage profile information, business preferences, and notification settings.

## Technology Stack

### Frontend
- React
- JavaScript
- CSS

### Backend — Planned
- Node.js
- Express.js
- REST API with JSON

### Database — Planned
- MySQL
- MySQL Workbench 8.0

### Development Tools
- Git
- GitHub

Docker, CI/CD, and deployment will be considered in later development phases.

## Development Status

**Current phase: Frontend UI completed; database development next.**

The current frontend uses mock data. Database integration, backend APIs, real authentication, automated testing, and deployment are planned for subsequent phases.

Some interactions are currently demonstrations and do not persist data after a browser refresh.

## Planned Business Workflow

Lead → Client → Deal/Proposal → Project → Tasks and Milestones → Approvals → Invoice → Payment Tracking

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Run the frontend locally

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd solodesk
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server using the script configured in `package.json`. For a Vite project, this is typically:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

*Note: These instructions assume the repository contains the existing React application and the corresponding npm scripts.*

## Project Goals

- Build a functional freelancer management application.
- Learn relational database design and SQL using MySQL.
- Develop REST APIs using Node.js and Express.
- Integrate the frontend, backend, and database.
- Implement automated tests for important features and workflows.
- Introduce Docker, CI/CD, and deployment after the core application works locally.

## Future Improvements

- Persistent database storage.
- Secure backend authentication and authorization.
- Automated testing.
- Dashboard analytics based on real data.
- Containerization and continuous integration.
- Cloud deployment.

## Project Status

SoloDesk is an actively developed personal learning project. Features and documentation will evolve as development progresses.