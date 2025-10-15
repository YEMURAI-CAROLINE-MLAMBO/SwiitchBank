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
- **Financial Calculators**: Tools for intelligent debt repayment planning.

<br>

### 📈 Should-Have Features (Post-MVP)
- Yield vaults/reward earning post-trade
- Cross-chain swap capabilities
- Advanced gamification milestones
- Multi-currency support for global users

### 💸 Financial Calculators

As part of our commitment to financial intelligence, SwitchBank includes a suite of powerful backend calculators. The first available tool is the **Debt Repayment Optimizer**.

#### Debt Repayment Optimizer

This tool, located in the `OptimizationEngine`, provides two industry-standard strategies for paying off multiple debts:

-   **Debt Snowball**: This method focuses on paying off the smallest debts first to build psychological momentum.
-   **Debt Avalanche**: This method focuses on paying off the debts with the highest interest rates first to minimize the total interest paid over the life of the loans.

These calculators can be used to provide users with a clear, actionable plan to become debt-free.

### 🚀 Advanced Financial Modeling Engine

To transform SwitchBank from a simple tracking app into a sophisticated financial planning platform, we've integrated a powerful new financial modeling engine. This engine provides the mathematical foundation for truly intelligent financial advice, turning our Sophia AI into a quantitative expert.

**Core Models:**
-   **FinancialModel**: Handles personal financial statement modeling (Income, Balance Sheet, Cash Flow), DCF valuation, and sensitivity analysis.
-   **MonteCarloEngine**: Powers probability-based simulations for retirement planning, real estate investment, and business valuation.
-   **RiskModel**: Assesses portfolio risk (VaR, Expected Shortfall), credit risk, and liquidity risk.
-   **BehavioralModel**: Models user spending and investment behavior to identify patterns and biases.
-   **ScenarioEngine**: Conducts comprehensive "what-if" analysis for various financial scenarios (e.g., market crashes, recessions).
-   **SophiaModeling**: Integrates all models to create personalized, dynamic financial plans for users.
-   **LiveModeling**: Allows for real-time model updates with new data and generates predictive alerts.

#### Financial Modeling Applications

**For Users:**
-   ✅ **Personal DCF**: Understand your lifetime financial value.
-   ✅ **Retirement Readiness Scoring**: Probability-based retirement planning.
-   ✅ **Goal Achievement Probability**: See the mathematical likelihood of reaching your goals.
-   ✅ **Optimal Financial Strategy**: Make data-driven financial decisions.
-   ✅ **Risk Quantification**: Understand and quantify your financial risks.

**For Sophia AI:**
-   ✅ **Quantitative Reasoning**: Provides a mathematical basis for recommendations.
-   ✅ **Scenario Comparison**: Compares financial strategies with hard numbers.
-   ✅ **Predictive Capability**: Forecasts future financial states.
-   ✅ **Optimization Algorithms**: Finds mathematically optimal paths to financial goals.
-   ✅ **Confidence Intervals**: Delivers probabilistic advice, not just deterministic predictions.

**Technical Excellence:**
-   ✅ **Stochastic Modeling**: Properly handles uncertainty in financial forecasts.
-   ✅ **Numerical Methods**: Implemented with robust mathematical techniques.
-   ✅ **Real-time Updating**: Models learn and adapt based on new user data.
-   ✅ **Comprehensive Scenario Analysis**: Provides powerful "what-if" modeling capabilities.

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
