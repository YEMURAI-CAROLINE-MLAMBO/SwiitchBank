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
| **Payment Processing** | Marqeta API (marqetaService.js) |
| **Authentication** | Firebase Auth with multi-factor support |
| **Frontend** | React Native (cross-platform) |

## Installation & Local Development

### Prerequisites
- Node.js (v18 or higher)
- Firebase CLI tools
- Marqeta developer account (for card processing)
- Gemini API credentials (for AI services)

### Setup Instructions

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-username/switchbank-mvp.git
   cd switchbank-mvp
```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your API credentials
   ```
4. Initialize Firebase:
   ```bash
   ./setup-firebase.sh
   ```
5. Run development server:
   ```bash
   npm run dev
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

## Known Limitations & Issues (MVP Phase)

· Jools Onboarding: Business account onboarding via Jools is currently a guided assistant rather than fully autonomous implementation
· Currency Support: Limited to primary currency (USD) and major cryptocurrencies (BTC, ETH)
· Transaction Limits: Reduced limits during MVP testing phase
· Browser Support: Optimized for Chrome and Safari browsers

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the terms contained in the LICENSE file.
