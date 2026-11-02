import { NextRequest, NextResponse } from 'next/server';
import { TrendRecommendationCandidate } from '@/types/private-procurement.types';
import { dispatchMultiBotNotification } from '@/features/notifications/botRouter';

export interface DualBlogSyndicationDraft {
  productId: string;
  productTitle: string;
  targetKeywords: string[];
  directAdsenseBlogArticle: {
    platformTarget: string;
    headline: string;
    bodyMarkdown: string;
  };
  subtleTrojanHorseArticle: {
    platformTarget: string;
    headline: string;
    bodyMarkdown: string;
  };
}

const VIRAL_IMPULSE_POOL: TrendRecommendationCandidate[] = [
  {
    id: 'rec-viral-pulse-01',
    title: '45kHz Ultrasonic Jewelry, Eyeglass & Watch Deep Cleaner Pod',
    suggestedDivision: 'VAULT',
    trendSourceName: 'DeoDap + Hothaat Viral Impulse #1',
    sourceReferenceUrl: 'https://www.hothaat.com',
    fulfillmentSupplierName: 'DeoDap Wholesale',
    fulfillmentSupplierUrl: 'https://deodap.in/search?q=ultrasonic+cleaner',
    estimatedSupplierCostInr: 135,
    suggestedRetailPriceInr: 499,
    image:
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
    specs: [
      '45,000Hz High-Frequency Cavitation Wash',
      'Cleans Spectacles, Rings, Watch Straps & Razor Heads in 3 Mins',
      'One-Touch Low-Noise USB-C / AAA Operation',
    ],
    demandScore: 97,
    status: 'PENDING_REVIEW',
    detectedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'rec-viral-pulse-02',
    title: 'Motion-Sensor Magnetic Rechargeable LED Closet & Study Light Bar',
    suggestedDivision: 'DESK',
    trendSourceName: 'Meesho + Baapstore Impulse Bestseller',
    sourceReferenceUrl: 'https://www.baapstore.com',
    fulfillmentSupplierName: 'Meesho Supplier Network',
    fulfillmentSupplierUrl: 'https://www.meesho.com/search?q=motion%20sensor%20magnetic%20light',
    estimatedSupplierCostInr: 115,
    suggestedRetailPriceInr: 449,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    specs: [
      '120° PIR Human Motion Auto-Wake Sensor (3m Range)',
      'Zero-Drilling 3M Magnetic Strip Mount for Wardrobes, Kitchens & Desks',
      'USB-C Rechargeable Battery (Up to 45 Days in Auto Mode)',
    ],
    demandScore: 95,
    status: 'PENDING_REVIEW',
    detectedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'rec-viral-pulse-03',
    title: 'Inkless Bluetooth Pocket Thermal Label & Study Diagram Printer',
    suggestedDivision: 'DESK',
    trendSourceName: 'Instagram Reels + Search Trend Breakout',
    sourceReferenceUrl: 'https://deodap.in',
    fulfillmentSupplierName: 'DeoDap Wholesale',
    fulfillmentSupplierUrl: 'https://deodap.in/search?q=mini+thermal+printer',
    estimatedSupplierCostInr: 310,
    suggestedRetailPriceInr: 849,
    image:
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=80',
    specs: [
      'Zero-Ink Thermal Printing for NEET/JEE Diagrams, Labels & To-Do Lists',
      'iOS & Android Bluetooth App with OCR Text Scanner',
      'Includes 1 Starter Roll + USB-C Fast Charging',
    ],
    demandScore: 96,
    status: 'PENDING_REVIEW',
    detectedAt: new Date().toISOString().slice(0, 10),
  },
  {
    id: 'rec-viral-pulse-04',
    title: 'High-Pressure Brass Nozzle Foam Cannon & Car/Balcony Jet Washer',
    suggestedDivision: 'DRIVE',
    trendSourceName: 'Hothaat + IndiaMART Seasonal Winner',
    sourceReferenceUrl: 'https://www.hothaat.com',
    fulfillmentSupplierName: 'DeoDap Wholesale',
    fulfillmentSupplierUrl: 'https://deodap.in/search?q=water+spray+gun',
    estimatedSupplierCostInr: 155,
    suggestedRetailPriceInr: 549,
    image:
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=900&q=80',
    specs: [
      '360° Rotating Brass Nozzle (Jet Stream to Wide Fan Mist)',
      'Detachable Soap Dispenser Bottle for Car & Bike Foam Wash',
      'Universal Hose Connector for Indian Household Taps',
    ],
    demandScore: 92,
    status: 'PENDING_REVIEW',
    detectedAt: new Date().toISOString().slice(0, 10),
  },
];

export function buildDualBlogArticlesForCandidate(
  candidate: TrendRecommendationCandidate
): DualBlogSyndicationDraft {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://opt-collective.vercel.app';
  const netProfit =
    candidate.suggestedRetailPriceInr - candidate.estimatedSupplierCostInr;

  return {
    productId: candidate.id,
    productTitle: candidate.title,
    targetKeywords: [
      `${candidate.title.toLowerCase()} review india`,
      `best viral everyday gadgets under ${candidate.suggestedRetailPriceInr} rupees`,
      `problem solving home and desk tools india 2026`,
    ],
    directAdsenseBlogArticle: {
      platformTarget: 'Google Blogger (AdSense / Adsterra Monetised) & On-Site /guides',
      headline: `Hands-On Review: Why the ${candidate.title} Is Going Viral Across India Under ₹${candidate.suggestedRetailPriceInr}`,
      bodyMarkdown: [
        `### The Everyday Problem It Solves`,
        `Most shoppers in India overpay ₹1,200+ for basic utility tools due to middleman retail markups. We tested the **${candidate.title}**, and here is why it scored **${candidate.demandScore}/100** in our daily utility index.`,
        ``,
        `### Key Engineering Specifications`,
        ...candidate.specs.map((s: string) => `- **Verified Spec:** ${s}`),
        ``,
        `### Where to Get Verified Direct-Hub Dispatch (Save 45%)`,
        `Instead of paying showroom markups, you can inspect the full specification sheet and order via verified QR checkout at **[The O.P.T. Collective Official Store](${siteUrl})** for just **₹${candidate.suggestedRetailPriceInr}** (includes the 7-Day Unboxing Replacement Shield).`,
        `*( Merchant Note: Est. Net Profit +₹${netProfit}/order + Display Ad RPM )*`,
      ].join('\n'),
    },
    subtleTrojanHorseArticle: {
      platformTarget:
        'Strict Non-Promotional Platforms (Medium, Quora Spaces, Reddit r/IndianGaming, LinkedIn)',
      headline: `I Tested 4 Budget Utility Upgrades for My Daily Routine in India — Here Are the Actual Specs & Cost Breakdown`,
      bodyMarkdown: [
        `Over the past month, I wanted to fix a few annoying daily friction points without spending thousands on overhyped brand names. Here are the objective notes from my testing bench:`,
        ``,
        `1. **Build & Utility Check (${candidate.title}):**`,
        `   - ${candidate.specs.join(' | ')}`,
        `   - **What surprised me:** When sourced via direct partner-hub studios rather than conventional retail chains, the unit cost drops to around ₹${candidate.suggestedRetailPriceInr}.`,
        ``,
        `2. **Reference & Specification Benchmarks:**`,
        `   - General category standards can be cross-checked on [Bureau of Indian Standards (BIS)](https://www.bis.gov.in), hardware teardown forums, and independent Indian curation benchmarks like [The O.P.T. Collective Hardware Telemetry Index](${siteUrl}/guides) which logs batch stress-test specs and PIN-code transit times.`,
      ].join('\n'),
    },
  };
}

export async function GET() {
  const blogDrafts = VIRAL_IMPULSE_POOL.map(
    (c: TrendRecommendationCandidate) => buildDualBlogArticlesForCandidate(c)
  );

  return NextResponse.json({
    ok: true,
    scoutedCount: VIRAL_IMPULSE_POOL.length,
    candidates: VIRAL_IMPULSE_POOL,
    blogSyndicationDrafts: blogDrafts,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const notifyTelegram = body?.notifyTelegram !== false;

    if (notifyTelegram) {
      await dispatchMultiBotNotification({
        channel: 'VIRAL_TREND_SCOUT',
        title: `Scouted ${VIRAL_IMPULSE_POOL.length} High-Velocity Viral Impulse Winners`,
        lines: VIRAL_IMPULSE_POOL.map(
          (c: TrendRecommendationCandidate) =>
            `${c.title} | Cost: ₹${c.estimatedSupplierCostInr} → Retail: ₹${c.suggestedRetailPriceInr} (Demand: ${c.demandScore}/100)`
        ),
      });

      await dispatchMultiBotNotification({
        channel: 'BLOG_SEO_SYNDICATION',
        title: `Generated ${VIRAL_IMPULSE_POOL.length * 2} Dual-Mode SEO & AdSense Blog Drafts`,
        lines: [
          `Mode A: Direct AdSense/Blogger Monetised Reviews Ready`,
          `Mode B: Subtle Non-Promotional 'Trojan Horse' Articles Ready`,
        ],
      });
    }

    return NextResponse.json({
      ok: true,
      candidates: VIRAL_IMPULSE_POOL,
      blogSyndicationDrafts: VIRAL_IMPULSE_POOL.map(
        (c: TrendRecommendationCandidate) => buildDualBlogArticlesForCandidate(c)
      ),
    });
  } catch {
    return NextResponse.json(
      { error: 'Viral Trend Scout failed.' },
      { status: 500 }
    );
  }
}