import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
import { processReferral } from "./referrals"; // Import the referral processing function

const db = admin.firestore();

// Implement Firebase Authentication for user registration
export const registerUser = functions.https.onCall(async (data, context) => {
  const { email, password, firstName, lastName } = data;

  if (!email || !password || !firstName || !lastName) { // Add check for optional referralCode later if needed
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing required fields."
    );
  }

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    const userId = userRecord.uid;

    // Store additional user data in Firestore
    await db.collection("users").doc(userId).set({
      firstName: firstName,
      lastName: lastName,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create a default personal wallet subcollection
    await db
      .collection("users")
      .doc(userId)
      .collection("personalWallet")
      .doc("default") // Using a fixed doc ID for the personal wallet
      .set({
        balance: 0.0,
        currency: "USD",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Process referral if a referralCode is provided
    const { referralCode } = data;
    if (referralCode) {
      await processReferral({ referralCode, newUserId: userId }, context); // Call the imported processReferral function
    }

    // Return success message and user ID
    return {
      message: "User registered successfully",
      userId: userId,
    };
  } catch (error: any) {
    // Handle specific Firebase Auth errors
    if (error.code === "auth/email-already-in-use") {
      throw new functions.https.HttpsError(
        "already-exists",
        "The email address is already in use by another account."
      );
    } else if (error.code === "auth/invalid-email") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The email address is not valid."
      );
    } else if (error.code === "auth/weak-password") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The password is too weak."
      );
    }

    console.error("Error registering user:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred during registration."
    );
  }
});

// Implement Firebase Authentication for user login
export const loginUser = functions.https.onCall(async (data, context) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Missing email or password."
    );
  }

  try {
    // Note: Direct password-based authentication should be handled on the client-side
    // using the Firebase SDK for security reasons. This Cloud Function is primarily
    // for demonstration or if you have a specific server-side login flow requirement
    // and are aware of the security implications (less secure than client-side SDK).
    //
    // For a more secure approach, the client should use the Firebase SDK to sign in
    // and then potentially call a Cloud Function to get additional user data.

    // **Recommended Secure Approach (Client-Side Login):**
    // Client-side code would use:
    // firebase.auth().signInWithEmailAndPassword(email, password)
    // .then((userCredential) => {
    //   // User signed in
    //   // Get ID token: userCredential.user.getIdToken()
    //   // Call a Cloud Function to fetch profile data if needed
    // })
    // .catch((error) => {
    //   // Handle errors
    // });
    //
    // This Cloud Function below demonstrates a server-side check, but it's not
    // the standard or most secure way to handle email/password login in Firebase.
    //
    // Consider if you truly need a server-side login function or if client-side
    // login followed by fetching data in a separate authorized function is better.

    // Example: Fetching user by email (server-side check, not a login mechanism)
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;

    // You would typically verify the password on the client side.
    // If you absolutely need a server-side check, you would need to
    // securely compare a hashed password (if stored, which Firebase Auth handles)
    // which is complex and less secure than the client SDK.

    // Let's assume the client has already authenticated and passed the token (via context.auth)
    // and this function is used to return profile data after client-side login.
    if (!context.auth) {
         throw new functions.https.HttpsError(
           "unauthenticated",
           "Authentication required."
         );
    }

    const authenticatedUserId = context.auth.uid;

    // Fetch user profile from Firestore
    const userDoc = await db.collection("users").doc(authenticatedUserId).get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User profile not found.");
    }

    const userData = userDoc.data();

    return {
      message: "Login successful",
      user: {
        userId: authenticatedUserId,
        email: userData?.email,
        firstName: userData?.firstName,
        lastName: userData?.lastName,
      },
    };

  } catch (error: any) {
    // Handle specific Firebase Auth errors (if using server-side checks, less common)
     if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
       throw new functions.https.HttpsError(
         "unauthenticated",
         "Invalid credentials."
       );
     }

    console.error("Error logging in user:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred during login."
    );
  }
});