# Community Events Platform

This is a community-driven events platform that allows users to browse, create, and participate in local events. Please see below for a [Live Hosted Version](#live-hosted-version) and instructions on [Self-Hosting](#self-hosting-instructions).

## Table of Contents

- [Live Hosted Version](#live-hosted-version)
  - [Test Accounts](#test-accounts)
- [Self-Hosting Instructions](#self-hosting-instructions)
  - [Database & Seed Data](#database--seed-data)
  - [Local Setup](#local-setup)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Setup Instructions](#setup-instructions)
  - [Production Deployment](#production-deployment)
    - [Backend Setup](#backend-setup)
    - [Frontend Hosting](#frontend-hosting)

## Live Hosted Version

- **Frontend:** [The Community Hub](https://thecommunityhub.netlify.app/)

### Test Accounts

For testing, use the following test accounts:

#### Superuser

```
   email: alice@example.com
   password: hashed_password_123
```

#### Staff User

```
   email: bob@example.com
   password: hashed_password_456
```

#### Regular User

```
   email: charlie@example.com
   password: hashed_password_789
```

## Self-Hosting Instructions

Below are the setup instructions for both local development and production deployment.

### Database & Seed Data

- Seed data is located in `/apps/backend/db/data/dev-data`.
- You can remove data from `events` and `subscribed_events` tables.
- Ensure the first user has `staff: true` and is not deleted, as user 1 will be the superuser and the only user that cannot remove their staff permissions. This ensures there is always one staff user.

## Local Setup

### Prerequisites

1. Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).
2. Install [PostgreSQL](https://www.postgresql.org/) and ensure you have either:
   - Your `pgpass` file set up, or
   - The correct database credentials in `.env.dev`.
3. Create an account on [Cloudinary](https://cloudinary.com/) for image storage.

### Environment Variables

Create a `.env.dev` file in the project root with the following variables:

#### Required

```env
PGDATABASE=events_platform
SECRET_KEY=your_secure_key
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

#### Optional PG Credentials

```env
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGHOST=your_pg_host
PGPORT=your_pg_port
```

### Setup Instructions

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up the database:
   ```sh
   npm run setup-dbs
   npm run seed
   ```
3. Start the backend:
   ```sh
   npm run start-server
   ```
4. Configure the frontend:
   - Create a [Google Cloud](https://console.cloud.google.com/) project with Calendar API enabled.
   - Generate an API key and Client ID.
   - Add `http://localhost:5173` to the authorized JavaScript origins.
   - Add these to `.env`:
     ```env
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     VITE_GOOGLE_API_KEY=your_google_api_key
     ```
   - Ensure `requestUrl.js` contains:
     ```js
     export const baseURL = "http://localhost:9090/";
     ```
   - Start the frontend:
     ```sh
     npm run web-local
     ```

## Production Deployment

### Backend Setup

1. Create a `.env.production` file with:
   ```env
   DATABASE_URL=your_supabase_database_url
   SECRET_KEY=your_secure_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
2. Seed the production database:
   ```sh
   npm run seed-prod
   ```
3. Deploy using [Render](https://render.com/), ensuring `.env.production` variables are included.

### Frontend Hosting

1. Ensure your Google Cloud project is set up and environment variables are configured in `.env` as above.
2. Update `requestUrl.js` with the hosted backend URL:
   ```js
   export const baseURL = "your_hosted_backend_url";
   ```
3. Build the frontend:
   ```sh
   npm run web build
   ```
4. Deploy using [Netlify](https://www.netlify.com/):
   ```sh
   netlify deploy
   ```
   - Select `apps/web` as the directory.
   - Set `dist` as the publish directory.
   - Use `netlify deploy --prod` for production deployment.
5. Update authorized JavaScript origins in Google Cloud with your hosted frontend URL.

