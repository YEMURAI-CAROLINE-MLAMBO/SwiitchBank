# SwiitchBank - Anywhere Anytime

![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Node.js%20|%20React%20|%20Flutter-brightgreen.svg)
![Status](https://img.shields.io/badge/Status-Live-green.svg)

## Overview

SwiitchBank is a next-generation, AI-powered financial platform designed for a global user base. Our mission is to provide a seamless and intelligent financial experience that is accessible **Anywhere, Anytime**. We bridge traditional finance with digital assets, empowering users with innovative tools to manage their money, grow their wealth, and connect to the global economy.

**Key Value Proposition**: Global financial control in your pocket, powered by intelligent, cross-border financial technology and the sophisticated Richmont brand identity.

## Core Features

-   **Richmont Brand Identity**: A sophisticated and professional user experience with a clean, modern design.
-   **Sophia-2 AI Assistant**: An advanced AI for deep transaction analysis, personalized financial insights, and real-time advice.
-   **Multi-Currency Accounts**: Hold, manage, and convert funds in multiple fiat currencies with real-time exchange rates.
-   **Bidirectional Crypto-Fiat Exchange**: Seamlessly convert between fiat currencies and top-tier cryptocurrencies, enabling both on-ramp and off-ramp functionality.
-   **Stripe Integration**: Securely process payments using Stripe.
-   **MoonPay Integration**: Easily purchase cryptocurrency with MoonPay.
-   **Comprehensive Security**: A multi-layered security system featuring AI-driven risk analysis, MFA enforcement, and end-to-end encryption.
-   **Advanced Financial Modeling**: A powerful backend engine for Monte Carlo simulations, risk analysis, and quantitative financial planning.
-   **Autonomous Communication System**: An intelligent notification system for user alerts and system-level monitoring.
-   **Cross-Platform Accessibility**: A unified experience across a web application (React), a mobile app (Flutter), and a command-line interface (CLI).

## Technology Stack

| Layer                | Technology                                        |
| -------------------- | ------------------------------------------------- |
| **Backend**          | Node.js, Express.js, Mongoose                     |
| **Serverless**       | Firebase Functions (TypeScript)                   |
| **Database**         | MongoDB                                           |
| **AI Service**       | Google Gemini API                                 |
| **Authentication**   | Firebase Auth (with JWTs for backend sessions)    |
| **Frontend (Web)**   | React, Context API, Axios                         |
| **Frontend (Mobile)**| Flutter, Provider                                 |
| **CLI**              | Node.js, Commander.js                             |
| **Real-time**        | WebSockets                                        |

## Repository Layout

-   **/backend**: The core Node.js/Express API, services, models, and business logic.
-   **/frontend**: The React web application.
-   **/swiitchbank-mobile**: The Flutter mobile application.
-   **/functions**: Serverless Firebase Functions written in TypeScript.
-   **/cli**: The command-line interface for power users.
-   **/.env.example**: A master template of all required environment variables.

## Local Development Setup

### Prerequisites

-   Node.js (v18+)
-   npm
-   Firebase CLI
-   Flutter SDK (for mobile development)
-   MongoDB instance (local or cloud)

### Environment Variables

This project uses `.env` files for local development. A master template, `.env.example`, is in the root. For each package (`backend/`, `frontend/`, `functions/`, `cli/`), create a `.env` file from the template and fill in the required secrets.

**Example for the backend:**
```bash
cd backend
cp ../.env.example .env
# Open backend/.env and add your development secrets (e.g., MONGODB_URI, GEMINI_API_KEY, STRIPE_SECRET_KEY, MOONPAY_API_KEY)
```

### Quick Start

1.  **Clone Repository**:
    ```bash
    git clone https://github.com/YEMURAI-CAROLINE-MLAMBO/SwiitchBank.git
    cd SwiitchBank
    ```

2.  **Install All Dependencies**:
    ```bash
    ./setup.sh
    ```

3.  **Run All Services**:
    ```bash
    ./start.sh
    ```

4.  **Stop All Services**:
    ```bash
    ./stop.sh
    ```

5.  **Run All Tests**:
    ```bash
    ./test.sh
    ```

## Command-Line Interface (CLI)

SwiitchBank includes a powerful CLI for managing your account from the terminal. To use it, you can either install it globally or run it with `npx`.

**Global Installation:**
```bash
npm install -g ./cli
swiitchbank login
```

**Using npx:**
```bash
npx ./cli <command>
```

### Usage

First, log in to create a session:
```bash
# Interactive login
swiitchbank login

# Login with options
swiitchbank login -e myemail@example.com -p mypassword
```

Then, use the available commands:
```bash
# Check your login status
swiitchbank status

# List all your accounts
swiitchbank accounts list

# Get the balance for a specific account
swiitchbank balance <accountId>

# View recent transactions
swiitchbank transactions

# Log out and clear your session token
swiitchbank logout
```

## License

This project is licensed under the terms contained in the LICENSE file.
