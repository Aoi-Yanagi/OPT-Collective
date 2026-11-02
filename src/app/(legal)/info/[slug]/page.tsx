import React from 'react';
import Link from 'next/link';

const LEGAL_DOCS: Record<string, { badge: string; title: string; points: string[] }> = {
  'shipping-policy': {
    badge: 'LOGISTICS // BLIND DROPSHIPPING',
    title: 'Neutral Packaging & Pan-India Dispatch Policy',
    points: [
      'Every order is dispatched within 24–48 hours via verified courier partners (Delhivery, Xpressbees, Ecom Express).',
      'Shipped in plain, unbranded outer parcels with zero supplier price tags inside.',
      'Digital Order ID (#OPT-2026-XXXX) and PDF tax-style receipt are emailed immediately upon UPI verification.',
    ],
  },
  'replacement-guarantee': {
    badge: 'BUYER PROTECTION // 7-DAY GUARANTEE',
    title: '7-Day Defective & Transit-Damage Replacement Policy',
    points: [
      'Record a quick 30-second unboxing video when opening the sealed courier packet.',
      'If any item arrives physically damaged or defective, send the clip on our official WhatsApp Business desk.',
      'We dispatch a 100% free replacement or issue a full UPI refund within 24 hours—zero return shipping cost to you.',
    ],
  },
  'security-architecture': {
    badge: 'CYBERSECURITY // ZERO-FRAUD CHECKOUT',
    title: 'UPI Intent Routing & Client-Side AI Receipt Forensics',
    points: [
      'Mobile shoppers use native upi://pay intent links that open Google Pay, PhonePe, or Paytm directly on the same phone.',
      'Desktop shoppers scan a dynamic UPI QR with a deterministic .XX paisa lock for instant email reconciliation.',
      'Uploaded payment screenshots pass through our binary EXIF/XMP & AI forensics filter to block edited or synthetic receipts.',
    ],
  },
};

export default async function LegalInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug] || LEGAL_DOCS['shipping-policy'];

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="opt-glass p-8">
        <span className="font-mono text-xs font-semibold text-theme-accent">
          {doc.badge}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-theme-text">{doc.title}</h1>
        <ul className="mt-6 space-y-3 border-t border-theme-border pt-6 text-xs sm:text-sm text-theme-muted">
          {doc.points.map((pt, i) => (
            <li key={i} className="leading-relaxed">
              • {pt}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block rounded-opt-btn bg-theme-accent px-4 py-2 text-xs font-bold text-theme-accent-fg"
          >
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </main>
  );
}