# Docsyde - Document Creation and Signing Tool

Docsyde is a SaaS application that allows users to create, edit, and sign documents online. Built with modern web technologies, it provides a simple and intuitive interface for document management.

## Tech Stack

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: Firebase Auth
- **Hosting**: Vercel (frontend) + Railway (backend)

## Features

- User authentication (email/password)
- Document creation and editing
- Draggable text blocks
- Document signing
- Comments system (basic implementation)

## Project Structure

```
docsyde/
├── client/               # Frontend Next.js application
│   ├── src/
│   │   ├── app/         # Next.js app router pages
│   │   ├── components/  # React components
│   │   ├── lib/        # Utilities and configurations
│   │   └── styles/     # Global styles
│   └── public/         # Static assets
│
└── server/              # Backend Express application
    ├── src/
    │   └── index.ts    # Main server file
    └── prisma/
        └── schema.prisma # Database schema
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Firebase project
- Vercel account (for frontend deployment)
- Railway account (for backend deployment)

### Environment Variables

#### Frontend (.env.local)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (.env)
```
DATABASE_URL=your_postgresql_url
FIREBASE_PROJECT_ID=your_project_id
PORT=3001
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/docsyde.git
cd docsyde
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development servers:

Frontend:
```bash
cd client
npm run dev
```

Backend:
```bash
cd server
npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:3001`.

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

### Backend (Railway)

1. Push your code to GitHub
2. Create a new project on Railway
3. Connect your repository
4. Add PostgreSQL plugin
5. Configure environment variables
6. Deploy

## License

MIT
