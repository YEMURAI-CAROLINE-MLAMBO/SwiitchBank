// functions/src/virtualCards.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const marqetaService = require('../../backend/src/services/marqetaService.js');

admin.initializeApp();

// Create virtual card
exports.createVirtualCard = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  try {
    const userId = context.auth.uid;
    
    // Create user in Marqeta
    // Note: Depending on your Marqeta integration, you might create the user earlier (e.g., during Firebase user creation)
    // Ensure you have a way to link Firebase user ID to Marqeta user token
    const marqetaUser = await marqetaService.createUser({
      // Use Firebase UID as external_id for Marqeta user
      external_id: userId, 
      email: context.auth.token.email,
      // Add other necessary user details like first_name, last_name, address, etc.
      first_name: data.firstName, 
      last_name: data.lastName,
      address1: data.address1,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      phone: data.phone,
      date_of_birth: data.dateOfBirth // YYYY-MM-DD format
    });

    // Create virtual card in Marqeta
    const marqetaCard = await marqetaService.createVirtualCard({
      userToken: marqetaUser.token, // Use the token of the newly created or existing Marqeta user
      card_product_token: data.cardProductToken // Expecting cardProductToken in the data payload
    });

    // Save to Firestore
    const cardRef = admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('virtualCards')
      .doc(marqetaCard.token); // Use Marqeta card token as the Firestore document ID

    await cardRef.set({
      userId: userId,
      marqetaCardToken: marqetaCard.token,
      marqetaUserToken: marqetaUser.token, // Store Marqeta user token as well for future reference
      lastFour: marqetaCard.last_four,
      expirationDate: marqetaCard.expiration_time, // Use expiration_time for full timestamp
      expirationMonth: marqetaCard.expiration_time.substring(5, 7), // Extract MM
      expirationYear: marqetaCard.expiration_time.substring(0, 4), // Extract YYYY
      // CVV is usually not stored due to PCI compliance, fetched on demand if needed and allowed
      status: marqetaCard.state,
      balance: 0, // Initial balance is usually 0, updated by webhooks
      currency: marqetaCard.currency_code || 'USD', // Default to USD if not provided by Marqeta
      // Spending limits can be set on the Marqeta card product or managed in Firestore
      spendingLimits: data.spendingLimits || { // Allow limits to be passed in
        daily: 1000,
        weekly: 5000,
        monthly: 20000
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
         cardProductToken: data.cardProductToken,
         // Add other relevant metadata from Marqeta response if needed
         fulfillmentStatus: marqetaCard.fulfillment_status
      }
    });

    // Optionally, send the card details back to the client, but be mindful of sensitive data
    return { success: true, cardId: marqetaCard.token, lastFour: marqetaCard.last_four, expirationDate: marqetaCard.expiration_time };

  } catch (error) {
    console.error('Error creating virtual card:', error);
    // Provide a more user-friendly error message for the client
    throw new functions.https.HttpsError('internal', 'Failed to create virtual card. Please try again.');
  }
});

// Handle Marqeta webhooks
exports.handleMarqetaWebhook = functions.https.onRequest(async (req, res) => {
  // Implement webhook signature verification for security
  const webhookSecret = functions.config().marqeta.webhook_secret;
  const signature = req.headers['authorization']; // Or wherever the signature is
  // Verify the signature before processing

  try {
    const event = req.body;

    // Log the incoming webhook event for debugging
    console.log('Received Marqeta webhook:', JSON.stringify(event));

    switch (event.type) {
      case 'transaction.transition':
        await handleTransactionEvent(event.data);
        break;
      case 'card.transition':
        await handleCardEvent(event.data);
        break;
      // Add cases for other relevant webhook types (e.g., user.transition, directdeposit.transition)
      default:
        console.log('Unhandled webhook type:', event.type);
    }

    res.status(200).send('Webhook processed');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook'); // Send 500 for internal errors
  }
});

async function handleTransactionEvent(transactionData) {
  try {
    // Find the user based on the Marqeta user token
    // This assumes you stored marqetaUserToken with the virtual card or have another mapping
    const userId = transactionData.user_token; // This is Marqeta user token, not Firebase UID directly

    // You need a way to map Marqeta user token to your Firebase user ID.
    // One way is to query your 'users' collection where you might have stored the marqetaUserToken.
    const userQuerySnapshot = await admin.firestore().collection('users').where('marqetaUserToken', '==', userId).limit(1).get();

    if (userQuerySnapshot.empty) {
      console.error('User not found for Marqeta user token:', userId);
      return; // Or handle this error appropriately
    }

    const firebaseUserId = userQuerySnapshot.docs[0].id;

    // Create or update the transaction document in Firestore
    // Using the Marqeta transaction token as the document ID is a good practice
    const transactionRef = admin.firestore().collection('users').doc(firebaseUserId).collection('transactions').doc(transactionData.token);

    await transactionRef.set({
      userId: firebaseUserId,
      virtualCardToken: transactionData.card_token, // Link to the virtual card
      type: transactionData.type.split('.')[0].toUpperCase(), // e.g., 'TRANSACTION'
      subtype: transactionData.type.split('.')[1], // e.g., 'transition'
      amount: transactionData.amount,
      currency: transactionData.currency_code,
      description: transactionData.descriptor || transactionData.auth_memo, // Use relevant description field
      merchant: {
        name: transactionData.merchant.card_acceptor.name,
        category: transactionData.merchant.card_acceptor.mcc, // Merchant Category Code
        location: `${transactionData.merchant.card_acceptor.city}, ${transactionData.merchant.card_acceptor.state}, ${transactionData.merchant.card_acceptor.zip}`
      },
      status: transactionData.state, // e.g., 'PENDING', 'COMPLETION'
      fees: {
        // Marqeta provides detailed fee information in certain webhook types
        // You might need to fetch full transaction details or process different webhook types for this
        interchange: 0, // Placeholder
        switch: 0, // Placeholder
        total: 0 // Placeholder
      },
      netAmount: transactionData.amount, // This might need adjustment based on fees and FX
      foreignExchange: transactionData.foreign_exchange, // Contains rate and fees if applicable
      marqetaTransactionToken: transactionData.token,
      marqetaUserToken: transactionData.user_token,
      marqetaCardToken: transactionData.card_token,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      settledAt: transactionData.settlement_date ? new Date(transactionData.settlement_date) : null, // Convert to Date object
      metadata: transactionData.user_transaction_time // Add transaction timestamp from Marqeta
    }, { merge: true }); // Use merge to update existing documents

     // Update the balance of the virtual card (requires fetching the card document)
    const cardRef = admin.firestore()
      .collection('users')
      .doc(firebaseUserId)
      .collection('virtualCards')
      .doc(transactionData.card_token);

    // This is a simplified balance update. For a robust solution,
    // consider using Firestore transactions to ensure atomicity.
    const cardDoc = await cardRef.get();
    if (cardDoc.exists) {
      const currentBalance = cardDoc.data().balance || 0;
      let newBalance = currentBalance;

      // Adjust balance based on transaction type and state
      if (transactionData.state === 'COMPLETION') {
         if (transactionData.amount < 0) { // Debit transaction
             newBalance += transactionData.amount; // amount is negative for debits
         } else if (transactionData.amount > 0) { // Credit transaction (e.g., refund)
             newBalance += transactionData.amount;
         }
      }
      // Add logic for other states like 'DECLINED', 'REVERSAL', etc.

      await cardRef.update({
        balance: newBalance,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }


  } catch (error) {
    console.error('Error handling transaction event:', error);
    // Re-throw the error or handle it based on your webhook processing strategy
  }
}

async function handleCardEvent(cardData) {
  try {
     // Find the user based on the Marqeta user token
    const userId = cardData.user_token; // This is Marqeta user token

     const userQuerySnapshot = await admin.firestore().collection('users').where('marqetaUserToken', '==', userId).limit(1).get();

    if (userQuerySnapshot.empty) {
      console.error('User not found for Marqeta user token:', userId);
      return;
    }

    const firebaseUserId = userQuerySnapshot.docs[0].id;

    // Update the virtual card document in Firestore
    const cardRef = admin.firestore()
      .collection('users')
      .doc(firebaseUserId)
      .collection('virtualCards')
      .doc(cardData.token); // Use Marqeta card token as the document ID

    await cardRef.update({
      status: cardData.state, // Update card status (e.g., ACTIVE, SUSPENDED, TERMINATED)
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
          fulfillmentStatus: cardData.fulfillment_status, // Update fulfillment status
          // Add other relevant metadata from Marqeta response if needed
      }
    });

  } catch (error) {
    console.error('Error handling card event:', error);
    // Re-throw the error or handle it
  }
}