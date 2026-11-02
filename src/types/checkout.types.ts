import { CartItem } from './store.types';

export type VerificationVerdict =
  | 'AUTHENTIC_UPI_SCREENSHOT'
  | 'EDITED_SOFTWARE_DETECTED'
  | 'AI_GENERATED_DETECTED'
  | 'INVALID_FORMAT_OR_RATIO';

export interface ForensicsScanResult {
  passed: boolean;
  riskScore: number; // 0 (Clean) to 100 (Critical Tamper)
  verdict: VerificationVerdict;
  headline: string;
  warningMessage?: string;
  technicalFlags: string[];
  extractedUtr?: string;
}

export interface OrderSubmissionPayload {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  items: CartItem[];
  baseSubtotal: number;
  exactPaisaAmount: string;
  verificationMethod: 'METHOD_A_SCREENSHOT_OCR' | 'METHOD_B_PAISA_LOCK';
  utrNumber: string;
  forensicsPassed: boolean;
}

export interface ConfirmedOrderReceipt {
  orderId: string;
  timestamp: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  exactAmountPaid: string;
  utrNumber: string;
  verificationBadge: string;
  whatsappConfirmUrl: string;
}