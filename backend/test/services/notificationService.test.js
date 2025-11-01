import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/config/mailslurp.js', () => ({
  default: {
    sendEmail: jest.fn().mockResolvedValue(),
  },
}));

describe('HighCapacitySophiaService', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.MAILSLURP_API_KEY;
    delete process.env.MAILSLURP_INBOX_ID;
    delete process.env.NOTIFICATION_RECIPIENT_EMAIL;
  });

  it('should send an email notification when MAILSLURP_API_KEY and MAILSLURP_INBOX_ID are set', async () => {
    process.env.MAILSLURP_API_KEY = 'test-key';
    process.env.MAILSLURP_INBOX_ID = 'test-inbox-id';
    process.env.NOTIFICATION_RECIPIENT_EMAIL = 'test@example.com';

    const { default: mailslurp } = await import('../../src/config/mailslurp.js');
    const { default: HighCapacitySophiaService } = await import('../../src/services/HighCapacitySophiaService.js');

    const recipient = process.env.NOTIFICATION_RECIPIENT_EMAIL;
    const subject = 'Test Subject';
    const message = 'Test notification';
    await HighCapacitySophiaService.sendNotification(recipient, subject, message);

    expect(mailslurp.sendEmail).toHaveBeenCalledWith('test-inbox-id', {
      to: [recipient],
      subject: subject,
      body: message,
    });
  });

  it('should not send an email notification when MAILSLURP_API_KEY or MAILSLURP_INBOX_ID is not set', async () => {
    const { default: mailslurp } = await import('../../src/config/mailslurp.js');
    const { default: HighCapacitySophiaService } = await import('../../src/services/HighCapacitySophiaService.js');

    const recipient = 'test@example.com';
    const subject = 'Test Subject';
    const message = 'Test notification';
    await HighCapacitySophiaService.sendNotification(recipient, subject, message);

    expect(mailslurp.sendEmail).not.toHaveBeenCalled();
  });
});
