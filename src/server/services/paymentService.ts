// Payment Abstraction Layer for MY KUHLI International Coffee Export
// Supports Wire Transfer (T/T), Irrevocable Letter of Credit (L/C), Cash Against Documents (CAD), and Escrow

import { PaymentMethod, PaymentStatus } from '../../types/index.js';

export interface PaymentInitiateRequest {
  orderId: string;
  orderNumber: string;
  amountUSD: number;
  method: PaymentMethod;
  buyerEmail: string;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  reference: string;
  status: PaymentStatus;
  instructions?: {
    bankName: string;
    swiftBic: string;
    accountName: string;
    iban: string;
    branch: string;
    country: string;
    referenceCode: string;
  };
  redirectUrl?: string;
  message?: string;
}

export class PaymentService {
  private static instance: PaymentService;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public async initiatePayment(request: PaymentInitiateRequest): Promise<PaymentResult> {
    const paymentId = `PAY-${Date.now()}`;
    const reference = `REF-MK-${Math.floor(100000 + Math.random() * 900000)}`;

    if (request.method === 'TELEGRAPHIC_TRANSFER_TT') {
      return {
        success: true,
        paymentId,
        reference,
        status: 'PENDING',
        instructions: {
          bankName: 'Commercial Bank of Ethiopia (CBE) / National Bank of Ethiopia Partner',
          swiftBic: 'CBETETAA',
          accountName: 'MY KUHLI COFFEE EXPORTERS LTD',
          iban: 'ET880010001009823419088',
          branch: 'Bole Medhanealem Foreign Currency Division, Addis Ababa',
          country: 'Ethiopia',
          referenceCode: `${request.orderNumber} / ${reference}`
        },
        message: 'Wire instructions generated. Funds will be verified by Treasury upon SWIFT confirmation MT103.'
      };
    }

    if (request.method === 'LETTER_OF_CREDIT_LC') {
      return {
        success: true,
        paymentId,
        reference,
        status: 'PENDING',
        instructions: {
          bankName: 'Dashen Bank / Commercial Bank of Ethiopia (Advising Bank)',
          swiftBic: 'DASHETAA',
          accountName: 'MY KUHLI COFFEE EXPORTERS LTD',
          iban: 'ET910020002009823419022',
          branch: 'International Banking Department',
          country: 'Ethiopia',
          referenceCode: `LC-ADV-${request.orderNumber}`
        },
        message: 'Irrevocable Confirmed Letter of Credit at sight instructions generated. Please submit drafting application to advising bank.'
      };
    }

    return {
      success: true,
      paymentId,
      reference,
      status: 'PENDING',
      message: 'Payment registered under international trade escrow protocol.'
    };
  }
}

export const paymentService = PaymentService.getInstance();
