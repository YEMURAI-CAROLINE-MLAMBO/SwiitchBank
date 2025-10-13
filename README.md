# SwitchBank : AI-Powered Banking Platform

![SwitchBank](https://img.shields.io/badge/Version-MVP-green.svg)
![Firebase](https://img.shields.io/badge/Platform-Firebase-orange.svg)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-green.svg)

## Overview

SwitchBank is a next-generation, AI-powered banking platform designed to bridge traditional finance with cryptocurrency ecosystems. Our platform provides a seamless, intelligent financial experience across devices, empowering users with innovative features for managing money, growing wealth, and building community.

**Key Value Proposition**: Combining traditional banking security with crypto flexibility through AI-driven automation.

## Core Features (MVP Scope)

### 🎯 Must-Have Features
- **Jools AI Assistant**: Basic transaction analysis, navigation assistance, and onboarding guidance
- **Fiat-Crypto Bridge**: Effortless trading between traditional and digital assets
- **Referral Program**: Automated rewards system fostering community growth
- **Basic Business Accounts**: Multi-user access with role-based permissions (Owner, Accountant, Operations)

<br>

### Jools AI Assistant

The Jools AI Assistant is an intelligent chatbot that provides users with a conversational interface for a variety of tasks, including:

*   **Transaction Analysis:** Ask questions about your spending habits, and Jools will provide you with insights and analysis.
*   **Navigation Assistance:** Can't find something in the app? Just ask Jools, and it will guide you to the right place.
*   **Onboarding Guidance:** New to SwitchBank? Jools will help you get started and make the most of the platform.

To use the Jools AI Assistant, simply tap on the chat icon in the app and start a conversation.

<br>

### 📈 Should-Have Features (Post-MVP)
- Yield vaults/reward earning post-trade
- Cross-chain swap capabilities
- Advanced gamification milestones
- Multi-currency support for global users

## Technology Stack

| **Layer** | **Technology** |
| :--- | :--- |
| **Backend** | Node.js, Express.js, Firebase Functions |
| **Database** | Firestore, Firebase Data Connect |
| **AI Service** | Gemini API integration (aiService.js) |
| **Payment Processing** | Stripe Webhooks |
| **Authentication** | Firebase Auth with multi-factor support |
| **Frontend** | React (Web), Flutter (Mobile) |

## Repository layout
- /backend — Express/Node API, business logic, services, migrations
  - src/
    - controllers/
    - services/
    - routes/
    - middleware/
    - config/
- /frontend — React app for web UI
  - src/
    - components/
    - pages/ (or routes)
    - context/
- /lib — Flutter application for mobile UI
- /functions — Firebase Cloud Functions (serverless logic)
- /api — **Legacy** Firebase Cloud Functions (do not add new functions here)
- /dataconnect-generated — generated SDK connectors (do not edit manually)
- /docker — dockerization (images, compose)
- firebase.json, firestore.rules, FirebaseConfig.js — Firebase configuration
- README.md — this file

## Installation & Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI tools
- Marqeta developer account (for card processing)
- Gemini API credentials (for AI services)

### Environment variables
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

### Quick start (local dev)

1.  **Clone repository**:
    ```bash
    git clone https://github.com/YEMURAI-CAROLINE-MLAMBO/SwiitchBank.git
    cd SwiitchBank
    ```

2.  **Backend**
    ```bash
    cd backend
    cp .env.example .env
    npm install
    npm run dev
    ```

3.  **Frontend**
    ```bash
    cd ../frontend
    cp .env.example .env
    npm install
    npm start
    ```

4.  **Firebase functions (emulator)**
    ```bash
    cd ../functions
    cp .env.example .env
    npm install
    firebase emulators:start --only functions,firestore,auth
    ```
5.  **Flutter (Mobile)**
    ```bash
    cd ../
    flutter pub get
    flutter run
    ```

## Development checklist / best practices
- Add ESLint + Prettier and shared config for consistent formatting
- Add commit hooks with Husky + lint-staged to lint & format staged files
- Unit and integration tests for critical flows (auth, payments, transfers) have been added.
- Validate env variables on startup with joi/convict/zod
- Centralized error handling and consistent error response format
- Avoid committing secrets — use GitHub Secrets for CI + Firebase environment config for deployment
- Add logging (e.g., winston or pino) and avoid console.log in production
- Add rate limiting and input validation for public endpoints
- Review firebase security rules before production deployment

## Deployment

Deploy securely using the provided script:

```bash
chmod +x deploy-secure.sh
./deploy-secure.sh
```

This deployment process includes:

· Cloud Function deployment
· Firestore rules configuration
· Data Connect schema implementation
· Security rule validation

- Use CI/CD that runs lint, tests, and build steps.
- Deploy backend to a managed host (Heroku, Render, Cloud Run) or container registry.
- Use Firebase Hosting + Functions for serverless parts if desired. Use `firebase deploy --only hosting,functions`.
- Use environment-specific Firebase project configs and secrets in CI (do not embed private keys in repo).

## Backend Architecture

This project has a multi-faceted backend, which is a combination of a traditional Node.js/Express server and serverless Firebase Functions. This structure is the result of evolving development and will be consolidated over time.

-   **/backend**: A traditional Node.js/Express server responsible for core business logic, services, and API routes. This server is intended to be the primary backend for the application.
-   **/functions**: The primary, modern, and organized location for all new Firebase Functions. All new serverless logic should be added here.
-   **/api**: This directory contains legacy Firebase Functions that are critical to the platform's operation. **Do not add new functions to this directory.** A future effort should be made to migrate these legacy functions to the `/functions` directory to consolidate the architecture.

This separation is a temporary measure to ensure the stability of the existing system while allowing for new, more organized development. By following these guidelines, we can maintain a clean and maintainable codebase.

## Project Status & Documentation

This project is currently in the MVP phase. The documentation is a work in progress, and there are some known gaps.

- **API Documentation**: The documentation for the backend APIs is not yet complete.
- **Code Comments**: While the code is generally well-structured, more detailed comments are needed in some areas to clarify the implementation.

We are actively working to improve the documentation. In the meantime, if you have any questions, please don't hesitate to reach out to the development team.

## Known Limitations & Issues (MVP Phase)

· Jools Onboarding: Business account onboarding via Jools is currently a guided assistant rather than fully autonomous implementation
· Currency Support: Limited to primary currency (USD) and major cryptocurrencies (BTC, ETH)
· Transaction Limits: Reduced limits during MVP testing phase
· Browser Support: Optimized for Chrome and Safari browsers

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the terms contained in the LICENSE file.
