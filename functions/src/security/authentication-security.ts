import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Admin SDK if not already done
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * A callable function that checks if the calling user has MFA enabled.
 * Throws a 'failed-precondition' error if MFA is not set up.
 */
export const enforceMFA = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }
  const userId = context.auth.uid;

  try {
    const userRecord = await admin.auth().getUser(userId);
    const isMfaEnabled = userRecord.multiFactor?.enrolledFactors.length > 0;

    if (!isMfaEnabled) {
      functions.logger.warn(`MFA is not enabled for user ${userId}. Access denied for sensitive operation.`);
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Multi-factor authentication is required for this action. Please set up MFA in your security settings.'
      );
    }

    functions.logger.info(`MFA verified for user ${userId}.`);
    return { status: 'success', mfaVerified: true };
  } catch (error) {
    functions.logger.error(`Error during MFA check for user ${userId}:`, error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred during MFA verification.');
  }
});

/**
 * Logs authentication attempts and detects potential brute-force attacks.
 * This function should be called from the backend after a login attempt.
 */
export async function monitorAuthAttempt(email: string, ipAddress: string, success: boolean) {
  const now = admin.firestore.Timestamp.now();
  const attemptRef = db.collection('authAttempts').doc();

  await attemptRef.set({
    email,
    ipAddress,
    success,
    timestamp: now,
  });

  // Brute-force detection logic
  const recentFailedAttempts = await db.collection('authAttempts')
    .where('email', '==', email)
    .where('success', '==', false)
    .where('timestamp', '>', new admin.firestore.Timestamp(now.seconds - 3600, 0)) // Last hour
    .get();

  const FAILED_ATTEMPTS_THRESHOLD = 10;
  if (recentFailedAttempts.size > FAILED_ATTEMPTS_THRESHOLD) {
    functions.logger.warn(`Potential brute-force attack detected for email: ${email} from IP: ${ipAddress}.`);
    // Lock the account temporarily
    const user = await admin.auth().getUserByEmail(email).catch(() => null);
    if (user && !user.disabled) {
      await admin.auth().updateUser(user.uid, { disabled: true });
      functions.logger.error(`Account for ${email} has been temporarily disabled due to suspicious activity.`);
      // In a real app, you would also trigger a notification to the user and admin.
    }
  }
}

/**
 * Creates a session cookie for the authenticated user.
 * This is typically called after a successful login on the client-side.
 */
export const createSessionCookie = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated with an ID token.');
  }
  const idToken = context.auth.token;

  // Set session expiration to 2 weeks.
  const expiresIn = 60 * 60 * 24 * 14 * 1000;
  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    functions.logger.info(`Session cookie created for user ${context.auth.uid}.`);
    return { status: 'success', cookie: sessionCookie };
  } catch (error) {
    functions.logger.error(`Error creating session cookie for user ${context.auth.uid}:`, error);
    throw new functions.https.HttpsError('internal', 'Failed to create session.');
  }
});

/**
 * Revokes all refresh tokens for a given user, effectively logging them out everywhere.
 */
export const revokeAllUserSessions = functions.https.onCall(async (data, context) => {
  if (!context.auth?.uid) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }
  const userId = context.auth.uid;

  try {
    await admin.auth().revokeRefreshTokens(userId);
    const userRecord = await admin.auth().getUser(userId);
    // Update a metadata field to track the revocation
    const revocationTimestamp = Math.floor(new Date().getTime() / 1000);
    await admin.auth().setCustomUserClaims(userId, { ...userRecord.customClaims, iat: revocationTimestamp });

    functions.logger.info(`All sessions revoked for user ${userId}.`);
    return { status: 'success', message: 'All active sessions have been terminated.' };
  } catch (error) {
    functions.logger.error(`Error revoking sessions for user ${userId}:`, error);
    throw new functions.https.HttpsError('internal', 'Failed to revoke sessions.');
  }
});