// Email Service Abstraction for MY KUHLI
// Pluggable for Resend, SendGrid, Amazon SES, or local SMTP

export interface EmailOptions {
  to: string;
  subject: string;
  template:
    | 'ACCOUNT_WELCOME'
    | 'RFQ_RECEIVED'
    | 'QUOTATION_ISSUED'
    | 'QUOTATION_ACCEPTED'
    | 'ORDER_CONFIRMED'
    | 'SHIPMENT_DISPATCHED'
    | 'DOCUMENTS_READY';
  data: Record<string, any>;
}

export class EmailService {
  private static instance: EmailService;
  private isConfigured: boolean;

  private constructor() {
    this.isConfigured = Boolean(process.env.EMAIL_API_KEY && process.env.EMAIL_API_KEY !== 're_sample_api_key_or_sendgrid');
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`[Email Service] Sending ${options.template} to ${options.to} | Subject: ${options.subject}`);
    
    // In dev / sandbox without external API keys, simulate successful delivery with structured logging
    if (!this.isConfigured) {
      return {
        success: true,
        messageId: `sim-mail-${Date.now()}-${Math.random().toString(36).substring(7)}`
      };
    }

    try {
      // Plug into Resend / SendGrid / SES here when user configures EMAIL_API_KEY
      return {
        success: true,
        messageId: `msg-${Date.now()}`
      };
    } catch (err: any) {
      console.error('[Email Service Error]', err);
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const emailService = EmailService.getInstance();
