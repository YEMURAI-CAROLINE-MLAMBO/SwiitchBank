export const handleWebhookController = async (req, res) => {
  // Marqeta webhooks are secured by mutual TLS (mTLS), so no signature verification is needed here.
  // See https://www.marqeta.com/docs/developer-guides/about-webhooks for more information.

  // Process the webhook event
  const event = JSON.parse(req.body.toString());
  console.log('Received Marqeta webhook:', event);

  res.status(200).send('Webhook received');
};
