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

### 📈 Should-Have Features (Post-MVP)
- Yield vaults/reward earning post-trade
- Cross-chain swap capabilities
- Advanced gamification milestones
- Multi-currency support for global users

### 🤖 Autonomous Communication System

SwiitchBank features a sophisticated, autonomous communication system to handle all user and developer notifications. This system operates with zero required human intervention, ensuring timely, relevant, and personalized communication.

The system is built around a `CoreCommunication` engine that manages two primary channels: **Email** and **In-App Messaging**.

#### Key Capabilities:

-   **Automated Message Triggers**: The system automatically sends messages based on user behavior and system events.
    -   **Welcome Sequence**: New users receive a welcome message and a follow-up to guide them through onboarding.
    -   **Security Alerts**: High-priority security events (e.g., suspicious logins) instantly trigger alerts to the user's email and in-app inbox.
    -   **Weekly Financial Insights**: Jools AI generates and sends a personalized financial summary to each active user every week.

-   **Dual-Channel Delivery**:
    -   **In-App Messaging**: All notifications are delivered as in-app messages, accessible through a dedicated message center. A real-time notification badge with an unread count keeps users informed.
    -   **Email Notifications**: Critical messages, such as security alerts and high-priority financial updates, are also sent via email to ensure they are not missed.

-   **Developer & System Notifications**:
    -   The system keeps the development team informed about its operational status.
    -   **System Health Alerts**: Important events, like system startup or critical errors, trigger an email notification to a designated developer address (`ymlamo21@gmail.com`).
    -   **High-Priority CC**: The developer email is automatically CC'd on high-priority user communications, like security alerts, for oversight.

-   **Intelligent Scheduling & Prioritization**: The system uses a priority system (`high`, `medium`, `low`) and message type (`security`, `financial`, `system`) to determine the appropriate communication channel and timing, preventing user spam.

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
- **/backend** — Express/Node API, business logic, services, migrations
- **/frontend** — React app for web UI
- **/lib** — Flutter application for mobile UI. Follows a feature-first structure.
  - **ui/**
    - **screens/** — Contains all the screen widgets for the app.
    - **widgets/** — Contains reusable widgets.
  - **core/** — Core services, models, and utilities.
  - **services/** — Business logic services (e.g., authentication, API calls).
- **/functions** — Firebase Cloud Functions (serverless logic)
- **/api** — **Legacy** Firebase Cloud Functions (do not add new functions here)
- **/.env.example** — A master template of all environment variables.
- **/build_for_environment.sh** — Script for building the Flutter app for different environments.

## Installation & Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase CLI tools
- Flutter SDK

### Environment Variables Setup
This project uses `.env` files for managing environment variables for local development. A master template, `.env.example`, is provided in the root directory. For local development, you should create a `.env` file inside each package (`backend/`, `frontend/`, `functions/`) that requires it. **Do not commit `.env` files.**

**Example for the backend:**
1. Navigate to the `backend` directory: `cd backend`
2. Copy the `.env.example` file: `cp ../.env.example .env`
3. Fill in the required secrets in the new `backend/.env` file.

For the Flutter app, environment variables are passed in at compile time by the build script.

### Quick start (local dev)

1.  **Clone repository**:
    ```bash
    git clone https://github.com/YEMURAI-CAROLINE-MLAMBO/SwiitchBank.git
    cd SwiitchBank
    ```

2.  **Backend**
    ```bash
    cd backend
    # Create .env from .env.example and fill in secrets
    cp ../.env.example .env
    npm install
    npm run dev
    ```

3.  **Frontend**
    ```bash
    cd ../frontend
    # Create .env from .env.example and fill in secrets
    cp ../.env.example .env
    npm install
    npm start
    ```

4.  **Firebase functions (emulator)**
    ```bash
    cd ../functions
    # Create .env from .env.example and fill in secrets
    cp ../.env.example .env
    npm install
    firebase emulators:start --only functions,firestore,auth
    ```
5.  **Flutter (Mobile)**
    For local development, you can run the app with a specific API endpoint like this:
    ```bash
    flutter run --dart-define=API_BASE_URL=http://localhost:3000/api
    ```

## Building the Flutter App for an Environment
The `build_for_environment.sh` script is used to build the Flutter web app for a specific environment. This script will automatically select the correct API_BASE_URL.

**Usage:**
```bash
# To build for development (default)
./build_for_environment.sh

# To build for staging
./build_for_environment.sh staging

# To build for production
./build_for_environment.sh production
```

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

## Backend Architecture
This project has a multi-faceted backend, which is a combination of a traditional Node.js/Express server and serverless Firebase Functions.
-   **/backend**: A traditional Node.js/Express server responsible for core business logic.
-   **/functions**: The primary, modern, and organized location for all new Firebase Functions.
-   **/api**: This directory contains legacy Firebase Functions. **Do not add new functions to this directory.**

## Project Status & Documentation
This project is currently in the MVP phase. The documentation is a work in progress.

## Known Limitations & Issues (MVP Phase)
· Jools Onboarding: Business account onboarding via Jools is currently a guided assistant.
· Currency Support: Limited to primary currency (USD) and major cryptocurrencies (BTC, ETH).
· Transaction Limits: Reduced limits during MVP testing phase.

## Contributing
We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License
This project is licensed under the terms contained in the LICENSE file.
