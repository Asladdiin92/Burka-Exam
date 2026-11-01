# EthioPrep

EthioPrep is an Ethiopian entrance exam preparation platform built with:

- Node.js
- Express.js
- MongoDB Atlas with Mongoose
- React.js for the web app
- React Native for mobile apps

## Repository structure

```text
Backend/
  src/
    config/         Environment, database, and JWT configuration
    controllers/    Business logic
    middleware/     Authentication and request validation
    models/         Mongoose data models
    routes/         Express API routes
  mongodb-schema.js Database reference schema
Web/
  HTML/             HTML entry point
  CSS/              Web stylesheets
  JavaScript/
    src/
      services/     REST API services
      components/   Reusable React components
      pages/        Page-level React views
      utils/        Web utilities
Mobile/
  iOS/              iOS-specific configuration notes
  Android/          Android-specific configuration notes
  src/              Shared React Native source
```

The backend, web client, and mobile client each have their own package
manifest and dependencies. The root package only provides convenience
scripts for running or checking each project.

## Run Backend, Web, and Mobile separately

Open three separate PowerShell terminals. Keep each process running in its
own terminal.

### Terminal 1: Backend API

```powershell
cd D:\ETHIOPREP_APP\Backend
npm install
npm run dev
```

The backend API runs at `http://localhost:5000`.

### Terminal 2: Web frontend

```powershell
cd D:\ETHIOPREP_APP\Web
npm install
npm run dev
```

Open the web application at
`http://localhost:5173/HTML/index.html`.

### Terminal 3: Mobile application

```powershell
cd D:\ETHIOPREP_APP\Mobile
npm install
npm start
```

Expo will display a QR code and available emulator commands. For Android,
you can run `npm run android`; for iOS, run `npm run ios` on macOS.

The mobile app must use an API URL reachable from the device or emulator.
Set `EXPO_PUBLIC_API_URL` in `Mobile/.env`; do not use `localhost` when
testing on a physical device.

### Optional root convenience commands

From `D:\ETHIOPREP_APP`, these commands run the projects through the root
package scripts:

```powershell
npm run dev          # Backend
npm run web:dev      # Web frontend
npm run mobile:start # Mobile Expo app
```

Run each command in a separate terminal.

## Backend setup

1. Copy [Backend/.env.example](./Backend/.env.example) to `.env` in the repository root
2. Create a MongoDB Atlas cluster and set its connection string in `.env`
3. Install dependencies:

   ```bash
   npm --prefix Backend install
   ```

4. Run the server:

   ```bash
   npm --prefix Backend run dev
   ```

From the repository root, the equivalent convenience commands are:

```bash
npm run dev
npm run check
```

The backend can also be run from its own directory:

```bash
cd Backend
npm install
npm run dev
```

## Web application

The React web client is in [Web/](./Web). Start it after the API:

```bash
cd Web
npm install
npm run dev
```

The web client defaults to `http://localhost:5000/api`. Set
`Web/.env` with `VITE_API_URL` when the API uses another URL. During
development, open `http://localhost:5173/HTML/index.html`.

## Mobile application

The React Native Expo client is in [Mobile/](./Mobile). Shared React Native
code is kept at the mobile project root and platform-specific configuration
folders are provided for iOS and Android:

```bash
cd Mobile
npm install
npm start
```

For a physical device or Android emulator, set
`EXPO_PUBLIC_API_URL` to an address reachable from that device. `localhost`
inside a device refers to the device itself, not the development computer.

## API endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requires bearer token)
- `GET /api/progress` (requires bearer token)
- `PUT /api/progress` (requires bearer token)
- `POST /api/notes/sync` (requires bearer token; applies up to 100 note, progress, or payment changes idempotently)
- `PATCH /api/exams/:examId/publish` (requires content manager or admin role)
- `PATCH /api/exams/:examId/archive` (requires content manager or admin role)
- `PATCH /api/question-bank/subjects/:subjectId/deactivate` (requires content manager or admin role)
- `PATCH /api/question-bank/chapters/:chapterId/deactivate` (requires content manager or admin role)
- `PATCH /api/question-bank/questions/:questionId/deactivate` (requires content manager or admin role)

The web and mobile clients use the same authentication token and REST API
contract. The web dashboard currently covers sign-in, registration, subjects,
published exams, complete exam answering/submission, notes CRUD, editable
progress, and payment submission. The mobile dashboard provides the same core
flows through the shared Expo client and additionally supports offline queue
synchronization.

The web client is online-only: all notes, progress, exam, and payment operations
are sent directly to the API and MongoDB Atlas.

Only the mobile client supports offline changes. Mobile notes, progress, and
payment submissions are temporarily queued in device storage with a device
identifier and client mutation ID, then sent to `POST /api/notes/sync` when
connectivity returns. The authoritative records remain in MongoDB Atlas; local
mobile storage is only a temporary synchronization queue. The backend scopes
replay records to the authenticated user and makes payment submissions
idempotent.

### Health

- `GET /api/health`

## Environment

Create a `.env` file using the values in [Backend/.env.example](./Backend/.env.example).
`MONGODB_URI` must be a MongoDB Atlas connection string. The normal Atlas
format is `mongodb+srv://`. If Node.js cannot resolve Atlas SRV DNS records
on your network, use the standard Atlas seed-list format described below.

For production, set `NODE_ENV=production` and use a randomly generated
`JWT_SECRET` of at least 32 characters.

### MongoDB Atlas DNS error

If the backend shows an error such as:

```text
querySrv EBADNAME _mongodb._tcp.<cluster>.mongodb.net
```

the root `.env` file still contains the example placeholder. In
`D:\ETHIOPREP_APP\.env`, replace the entire `MONGODB_URI` value with the
connection string copied from MongoDB Atlas:

```dotenv
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@your-real-cluster.mongodb.net/ethioprep?retryWrites=true&w=majority
```

Use the actual cluster hostname from MongoDB Atlas; do not leave
`<cluster>`, `<username>`, or `<password>` in the value. If the password
contains characters such as `@`, `:`, `/`, or `#`, URL-encode the password
before placing it in the URI.

The host must include the unique Atlas suffix. `cluster0.mongodb.net` by
itself is not a valid cluster hostname. A real Atlas host looks similar to
`cluster0.abc123.mongodb.net`; copy the complete value from **Database >
Connect > Drivers** instead of typing the hostname manually.

If the backend repeatedly reports `querySrv ECONNREFUSED`, the network DNS
resolver is blocking Node.js SRV queries. In that case, copy the Atlas
standard connection string or convert the SRV records to this format:

```dotenv
MONGODB_URI=mongodb://USERNAME:PASSWORD@ac-peav5lw-shard-00-00.gcnjkxr.mongodb.net:27017,ac-peav5lw-shard-00-01.gcnjkxr.mongodb.net:27017,ac-peav5lw-shard-00-02.gcnjkxr.mongodb.net:27017/ethioprep?tls=true&replicaSet=atlas-13btnf-shard-0&authSource=admin&retryWrites=true&w=majority
```

Keep your existing username and URL-encoded password. Atlas hostnames and
the replica-set name are specific to the cluster, so prefer copying the
standard URI from Atlas when available.

In MongoDB Atlas, also confirm that:

1. The database user exists and the username/password are correct.
2. Your current IP address is allowed under **Network Access**.
3. The database cluster is running.

After saving `.env`, restart the backend:

```powershell
cd D:\ETHIOPREP_APP\Backend
npm run dev
```

Parameterized API routes validate MongoDB IDs and return HTTP 400 for malformed
IDs before querying the database.
