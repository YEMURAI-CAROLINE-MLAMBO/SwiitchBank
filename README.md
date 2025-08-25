# SwiitchBank

The next-generation AI-powered, cross-platform banking platform designed for the modern user.

SwiitchBank aims to provide a seamless and intelligent financial experience across devices, empowering users with virtual cards, multi-currency wallets, AI-driven insights, viral growth features, and gamification.

## Key Features
- Virtual debit cards (Mastercard)
- Multi-currency wallets (fiat + crypto)
- Automated savings (round-ups + goals)
- AI-driven financial assistant (Jools)
- Referral & viral growth features
- Student onboarding experience
- Business account support (role-based access, APIs)

## Repository layout (quick)
- /backend — Express/Node API, business logic, services, migrations
  - src/
    - controllers/
    - services/
    - routes/
    - middleware/
    - config/
- /frontend — React app for web/mobile UI
  - src/
    - components/
    - pages/ (or routes)
    - context/
- /functions — Firebase Cloud Functions (serverless logic)
- /dataconnect-generated — generated SDK connectors (do not edit manually)
- /docker — dockerization (images, compose)
- firebase.json, firestore.rules, FirebaseConfig.js — Firebase configuration
- README.md — this file

## Prerequisites
- Node.js (LTS recommended, e.g. 18.x or 20.x)
- npm or yarn
- Firebase CLI (for functions & emulators)
- Docker (if you want to run via containers)

## Environment variables
Create a `.env` in each package (backend, functions, frontend as needed). Use `.env.example` (do not commit secrets). Example keys:
- PORT=3000
- NODE_ENV=development
- DATABASE_URL=<your-db-url>
- JWT_SECRET=<secret>
- FIREBASE_API_KEY=<your_firebase_api_key>
- FIREBASE_AUTH_DOMAIN=<your_project>.firebaseapp.com
- FIREBASE_PROJECT_ID=<your_firebase_project_id>
- FIREBASE_PRIVATE_KEY=<firebase_private_key_json_or_base64>
- STRIPE_SECRET_KEY=<stripe_secret>
- MAILER_HOST, MAILER_USER, MAILER_PASS

## Quick start (local dev)

1. Clone
   git clone https://github.com/YEMURAI-CAROLINE-MLAMBO/SwiitchBank.git
   cd SwiitchBank

2. Backend
   cd backend
   cp .env.example .env
   npm install
   npm run dev

3. Frontend
   cd ../frontend
   cp .env.example .env
   npm install
   npm start

4. Firebase functions (emulator)
   cd ../functions
   cp .env.example .env
   npm install
   firebase emulators:start --only functions,firestore,auth

5. Alternatively run via Docker:
   - See /docker/docker-compose.yml for service composition

## Common scripts (examples to add to package.json)
- "dev": start local dev server (backend: nodemon; frontend: react-scripts start)
- "build": build production artifacts
- "start": run production server
- "test": run unit tests
- "lint": run ESLint
- "format": run Prettier
- "emulate": run firebase emulators

## Development checklist / best practices
- Add ESLint + Prettier and shared config for consistent formatting
- Add commit hooks with Husky + lint-staged to lint & format staged files
- Add unit tests and integration tests for critical flows (auth, payments, transfers)
- Validate env variables on startup with joi/convict/zod
- Centralized error handling and consistent error response format
- Avoid committing secrets — use GitHub Secrets for CI + Firebase environment config for deployment
- Add logging (e.g., winston or pino) and avoid console.log in production
- Add rate limiting and input validation for public endpoints
- Review firebase security rules before production deployment

## Deployment
- Use CI/CD that runs lint, tests, and build steps.
- Deploy backend to a managed host (Heroku, Render, Cloud Run) or container registry.
- Use Firebase Hosting + Functions for serverless parts if desired. Use `firebase deploy --only hosting,functions`.
- Use environment-specific Firebase project configs and secrets in CI (do not embed private keys in repo).

## Troubleshooting
- "Missing ENV var" — check `.env.example` and ensure values copied in `.env`.
- "Emulator not connecting" — check firebase CLI version and run `firebase login` first.
- "CORS errors" — ensure frontend origin added in backend CORS config and in Firebase if using functions.

## Contributing
- Please open issues for bugs and feature requests.
- For code changes: open a PR, include tests, and ensure CI passes.
- Follow the coding standards (ESLint) and add changelog entries for notable changes.

## License
Specify your license here (e.g., MIT). Add a LICENSE file.

## Contact
- Repo owner / team contact: your-email@example.com
