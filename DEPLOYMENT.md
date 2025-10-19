# SwiitchBank Deployment Guide

This guide provides step-by-step instructions for configuring and deploying the SwiitchBank application.

## Prerequisites

Before you begin, ensure you have the following accounts and tools set up:

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [MongoDB](https://www.mongodb.com/try/download/community) or a MongoDB Atlas account
-   [Stripe Account](https://dashboard.stripe.com/register)
-   [Marqeta Account](https://www.marqeta.com/contact)
-   [MoonPay Account](https://www.moonpay.com/)
-   [Firebase Account](https://firebase.google.com/)
-   [Flutter SDK](https://flutter.dev/docs/get-started/install) for mobile app deployment

## Backend Configuration

1.  **Navigate to the backend directory:**
    ```bash
    cd swiitchbank-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Open the `.env` file and fill in the required values.

    ```
    # Application Configuration
    NODE_ENV=development
    PORT=5001

    # API Keys
    STRIPE_SECRET_KEY="YOUR_STRIPE_SECRET_KEY"
    MARQETA_API_KEY="YOUR_MARQETA_API_KEY"
    MARQETA_API_URL="https://sandbox-api.marqeta.com/v3"
    MOONPAY_API_KEY="YOUR_MOONPAY_API_KEY"

    # MongoDB Configuration
    MONGODB_URI=mongodb://localhost:2017/swiitchbank

    # JSON Web Token (JWT)
    JWT_SECRET="YOUR_JWT_SECRET"

    # CORS Origin
    CORS_ORIGIN=http://localhost:3000

    # Firebase Configuration
    FIREBASE_API_KEY=your_firebase_api_key
    FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    FIREBASE_PROJECT_ID=your_project_id
    FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    FIREBASE_APP_ID=your_app_id
    FIREBASE_MEASUREMENT_ID=your_measurement_id

    # QR Code Security
    QR_CODE_HMAC_SECRET="YOUR_QR_CODE_HMAC_SECRET"
    WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```

## Frontend Configuration

1.  **Navigate to the frontend directory:**
    ```bash
    cd swiitchbank-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Open the `.env` file and fill in the values. The `REACT_APP_API_URL` should point to your backend server.

    ```
    # The URL of the backend API
    REACT_APP_API_URL=http://localhost:5001

    # Firebase Configuration (for client-side usage)
    REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Start the frontend development server:**
    ```bash
    npm start
    ```

## Webhook Configuration

### Stripe

To receive real-time notifications from Stripe, you need to configure a webhook endpoint.

1.  **Go to the Stripe Dashboard:** [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2.  **Add a new endpoint:**
    -   **Endpoint URL:** `https://your-backend-url.com/api/stripe/webhook`
    -   **Events to send:** Select the events you need (e.g., `payment_intent.succeeded`, `charge.failed`).
3.  **Get the webhook signing secret** and add it to your `swiitchbank-api/.env` file as `WEBHOOK_SECRET`.

### Marqeta

Marqeta uses webhooks to notify you of events related to your card program.

1.  **Contact Marqeta Support:** You will need to work with Marqeta support to configure your webhook endpoints.
2.  **Provide your endpoint URL:** `https://your-backend-url.com/api/marqeta/webhook`
3.  **Secure your endpoint:** Ensure your webhook endpoint is secured and can handle the event types you configure.

## Mobile App Deployment

1.  **Navigate to the Flutter app directory:**
    ```bash
    cd swiitchbank/frontend
    ```

2.  **Install dependencies:**
    ```bash
    flutter pub get
    ```

3.  **Configure API endpoint:**
    In your Flutter code, make sure the API endpoint is pointing to your backend server. This is typically done in a configuration file (e.g., `lib/config.dart`).

4.  **Build for Android:**
    ```bash
    flutter build apk --release
    ```

5.  **Build for iOS:**
    ```bash
    flutter build ios --release
    ```
