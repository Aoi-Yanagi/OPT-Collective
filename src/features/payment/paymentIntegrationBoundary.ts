import {
  OrderRecord,
  PaymentSession,
  PaymentVerificationResult,
} from '@/types/order-lifecycle.types';
import { mapPaymentStatusToUiState } from '@/features/orders/orderStateMachine';

export interface VerificationRequestPayload {
  orderReference: string;
  paymentSessionId: string;
  customerSubmittedRef?: string;
  receiptForensicsSummary?: {
    passedClientPrecheck: boolean;
    riskScore: number;
    verdictLabel: string;
  };
}

/**
 * Replaceable Server-Side Payment Verification Adapter Contract.
 * Connect your confidential verification implementation here without touching any UI component.
 */
export interface PaymentVerificationAdapter {
  readonly adapterId: string;
  readonly isConfigured: boolean;
  createPaymentSession(order: OrderRecord): Promise<PaymentSession>;
  requestPaymentVerification(
    payload: VerificationRequestPayload,
    order: OrderRecord
  ): Promise<PaymentVerificationResult>;
  getPaymentStatus(order: OrderRecord): Promise<PaymentVerificationResult>;
}

/**
 * Default Safe Adapter (Active until owner connects proprietary verification credentials).
 * Never fabricates a successful payment result; places submitted attempts into
 * authoritative verification / merchant review queue.
 */
export class ConfidentialSlotPlaceholderAdapter implements PaymentVerificationAdapter {
  readonly adapterId = 'opt-confidential-slot-v1';
  readonly isConfigured = Boolean(process.env.OPT_PROPRIETARY_PAYMENT_VERIFIER_SECRET);

  async createPaymentSession(order: OrderRecord): Promise<PaymentSession> {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const sessionId = `PS-${order.orderReference}-${Date.now().toString().slice(-4)}`;

    return {
      paymentSessionId: sessionId,
      orderReference: order.orderReference,
      payableAmountInr: order.payableAmountInr,
      currency: 'INR',
      qrAssetSvgOrUrl: process.env.NEXT_PUBLIC_MERCHANT_QR_IMAGE_URL || '/assets/opt-qr-slot.svg',
      merchantDisplayName: 'THE O.P.T. COLLECTIVE',
      merchantVpaMasked: process.env.NEXT_PUBLIC_MERCHANT_VPA_MASKED || 'optcollective@***',
      expiresAtIso: expiresAt,
      integrationConfigured: this.isConfigured,
    };
  }

  async requestPaymentVerification(
    payload: VerificationRequestPayload,
    order: OrderRecord
  ): Promise<PaymentVerificationResult> {
    // 1. If client precheck flagged an edited/AI-generated screenshot, reject into review
    if (
      payload.receiptForensicsSummary &&
      !payload.receiptForensicsSummary.passedClientPrecheck
    ) {
      return {
        orderReference: order.orderReference,
        paymentSessionId: payload.paymentSessionId,
        verdict: 'REJECTED',
        paymentStatus: 'PAYMENT_REJECTED',
        uiState: 'PAYMENT_NOT_CONFIRMED',
        message:
          'Uploaded payment proof failed image integrity validation. Please upload an original unedited UPI receipt or wait for bank reconciliation.',
      };
    }

    // 2. Honest server authority: Never auto-mark PAID from a client click unless
    // the proprietary verifier secret confirms bank settlement or Merchant Admin approves.
    if (!this.isConfigured) {
      return {
        orderReference: order.orderReference,
        paymentSessionId: payload.paymentSessionId,
        verdict: 'REVIEW_REQUIRED',
        paymentStatus: 'UNDER_REVIEW',
        uiState: 'MANUAL_REVIEW_REQUIRED',
        message:
          'Your payment submission has been logged in the O.P.T. Verification Queue. Confidential bank-reconciliation slot is awaiting confirmation—your order snapshot is safely preserved.',
      };
    }

    return {
      orderReference: order.orderReference,
      paymentSessionId: payload.paymentSessionId,
      verdict: 'PENDING',
      paymentStatus: 'VERIFICATION_PENDING',
      uiState: 'VERIFICATION_IN_PROGRESS',
      message: 'Authoritative payment verification is in progress with the settlement ledger.',
    };
  }

  async getPaymentStatus(order: OrderRecord): Promise<PaymentVerificationResult> {
    return {
      orderReference: order.orderReference,
      paymentSessionId: order.paymentSession?.paymentSessionId || 'PS-NONE',
      verdict:
        order.paymentStatus === 'CONFIRMED'
          ? 'CONFIRMED'
          : order.paymentStatus === 'PAYMENT_REJECTED'
          ? 'REJECTED'
          : 'PENDING',
      paymentStatus: order.paymentStatus,
      uiState: mapPaymentStatusToUiState(order.paymentStatus),
      message: `Current authoritative payment state: ${order.paymentStatus}`,
      confirmedPaymentReference: order.confirmedPaymentReference,
      verifiedAtIso: order.paymentConfirmedAtIso,
    };
  }
}

export const paymentService: PaymentVerificationAdapter =
  new ConfidentialSlotPlaceholderAdapter();