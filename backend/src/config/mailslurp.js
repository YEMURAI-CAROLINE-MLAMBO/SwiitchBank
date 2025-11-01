import { MailSlurp } from 'mailslurp-client';

const apiKey = process.env.MAILSLURP_API_KEY;

if (!apiKey && process.env.NODE_ENV !== 'test') {
  throw new Error('Missing MailSlurp API Key. Please set MAILSLURP_API_KEY in your environment variables.');
}

const mailslurp = apiKey ? new MailSlurp({ apiKey }) : {};

export default mailslurp;
