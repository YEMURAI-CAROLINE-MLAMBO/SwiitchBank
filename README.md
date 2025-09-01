# SwiitchBank

The next-generation AI-powered, cross-platform banking platform designed for the modern user.
SwiitchBank aims to provide a seamless and intelligent financial experience across various devices, empowering users with innovative features for managing their money, growing their wealth, and connecting with others.
## Features

- Virtual debit cards (Mastercard)
- Multi-currency wallets (fiat and crypto)
- **Automated Savings:** Effortlessly grow your funds with automatic round-ups on transactions and set personalized savings goals.
- AI-driven financial insights
- Viral growth features (referrals, banking circles)
- Student onboarding program tailored for young adults entering the financial world.
- **Gamification & Engagement:** Earn rewards, unlock achievements, and participate in challenges to make managing your money fun and engaging.
- **AI Assistant (Jools):** Your intelligent co-pilot for financial advice, transaction analysis, and platform navigation. Jools is designed to be a proactive and helpful assistant, making it easier than ever to manage your finances. Interact with Jools through a natural language chat interface to:
    *   Get personalized financial insights and advice.
    *   Analyze your spending habits.
    *   Navigate the SwiitchBank platform and discover new features.
    *   Onboard and manage business accounts.
    *   Initiate trades and manage your investment portfolio.

## Business Accounts

- Multi-user access with granular permissions
- Enhanced accounting and expense management tools
- Higher transaction limits and dedicated support
- API access for custom integrations
- Business debit cards with customizable spending controls

### Recent Updates

1️⃣ Innovative Trading Experience via Jools

Introduced a user-friendly mobile trading interface designed for accessibility and ease of use.

Seamless Trading with Fiat/Crypto Bridge: Users can effortlessly trade assets with integrated fiat and crypto capabilities, removing the need for in-depth cryptocurrency knowledge.

Automated Engagement Triggers:

Referral rewards are automatically activated upon trade completion, fostering community growth.

Affiliate tracking and gamification milestones remain active.


Optional features planned:

Cross-chain swaps.

Yield vaults / reward earning post-trade.

Multi-currency support for global users.


---

2️⃣ Business Account Module (Gemini-Inspired)

Jools will now handle business account onboarding with:

Role-based access for team members (owner, accountant, operations).

Dashboard showing both fiat and crypto balances.


## Project Structure

```
swiitchbank-mvp/
├── android/          # Android-specific code (e.g., Google Pay integration)
├── api/              # Main API entrypoint
├── backend/          # Core backend logic
│   ├── controllers/  # Request handlers for API routes
│   ├── services/     # Business logic and external service integrations
│   ├── middleware/   # Express middleware for auth, validation, etc.
│   └── routes/       # API route definitions
├── dataconnect/      # Firebase Data Connect configuration
├── docker/           # Dockerfiles for backend and frontend
├── frontend/         # React-based frontend application
│   ├── components/   # Reusable UI components
│   ├── context/      # React context providers
│   ├── layouts/      # Application layout components
│   └── pages/        # Main pages of the application
├── functions/        # Firebase Functions for serverless operations
│   ├── compliance/   # Automated compliance checks
│   ├── paymentProcessors/ # MoonPay, Stripe, and other payment integrations
│   ├── savings/      # Logic for automated savings features
│   ├── security/     # Security-related functions
│   └── services/     # Shared services for Firebase Functions
├── README.md         # Project overview and documentation
└── ...               # Other configuration and project files
```

## Getting Started
### Prerequisites

- Node.js (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/swiitchbank-mvp.git
   cd swiitchbank-mvp
   ```
