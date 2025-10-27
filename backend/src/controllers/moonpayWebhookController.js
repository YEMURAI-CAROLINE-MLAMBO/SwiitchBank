import crypto from 'crypto';

export const handleWebhookController = async (req, res) => {
  const signature = req.get('moonpay-signature-v2');
  if (!signature) {
    return res.status(401).send('Invalid signature');
  }
  const [timestamp, signatureHash] = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});

  const webhookSecret = process.env.MOONPAY_WEBHOOK_SECRET;
  const signedPayload = `${timestamp}.${req.body.toString()}`;
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const expectedSignature = hmac.update(signedPayload).digest('hex');

  if (signatureHash !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  // Process the webhook event
  const event = JSON.parse(req.body.toString());
  console.log('Received MoonPay webhook:', event);

  res.status(200).send('Webhook received');
};
