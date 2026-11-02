import { ProductDivision } from '@/types/public-catalog.types';

export interface EditorialGuideArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  division: ProductDivision;
  categoryTag: string;
  readTimeMinutes: number;
  publishedAtIso: string;
  heroImage: string;
  targetKeywords: string[];
  featuredProductSku: string;
  featuredProductSlug: string;
  featuredProductTitle: string;
  featuredProductPriceInr: number;
  sections: {
    heading: string;
    body: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  /**
   * Mode A: Direct AdSense / Google Blogger Syndication Draft
   */
  directBloggerDraft: string;
  /**
   * Mode B: Subtle Non-Promotional "Trojan Horse" Draft (For Medium, Quora, Reddit, HubPages)
   */
  subtleEducationalDraft: string;
}

export const OPT_EDITORIAL_GUIDES: EditorialGuideArticle[] = [
  {
    id: 'guide-01',
    slug: '6061-aluminum-laptop-stand-ergonomic-thermal-guide-india',
    title:
      'Why 6061 Aircraft Aluminum Risers Eliminate Neck Strain & Laptop Thermal Throttling',
    subtitle:
      'An engineering breakdown of cervical viewing angles, passive airflow geometry, and why hollow ABS stands fail under 16-inch laptops.',
    division: 'DESK',
    categoryTag: 'Workspace Ergonomics & Thermals',
    readTimeMinutes: 4,
    publishedAtIso: '2026-11-02',
    heroImage:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80',
    targetKeywords: [
      'best aluminum laptop stand india',
      'laptop thermal throttling fix',
      'ergonomic laptop riser for neck pain',
      '6061 aluminum vs plastic laptop stand',
    ],
    featuredProductSku: 'OPT-DESK-001',
    featuredProductSlug: 'aerolift-6-axis-aluminum-riser',
    featuredProductTitle: 'AeroLift 6-Axis Aluminum Laptop Riser',
    featuredProductPriceInr: 599,
    sections: [
      {
        heading: '1. The 15-Degree Cervical Spine Rule for Coding & Study Sessions',
        body: 'When a laptop sits flat on a desk, your cervical spine bends forward by 30 to 45 degrees—placing up to 18 kg of effective torque on your upper vertebrae. Elevating the top bezel of your screen to eye level restores neutral posture within seconds.',
      },
      {
        heading: '2. Passive Thermal Dissipation in 35°C+ Indian Ambient Rooms',
        body: 'Modern ultrabooks and gaming laptops intake cool air through bottom chassis vents. Flat desk surfaces trap a stagnant thermal boundary layer. An open-mesh 6061 anodized aluminum deck acts as a passive heat sink while allowing unrestricted underside airflow, dropping sustained CPU/GPU temperatures by 4°C to 7°C.',
      },
      {
        heading: '3. Structural Load Testing: 4mm 6061 Alloy vs. Injection-Molded Plastic',
        body: 'Cheap plastic risers flex and wobble when typing rapidly. A 6-axis ratcheted 6061 aluminum frame supports up to 20 kg of static load with high-friction silicone pads that lock your chassis in place.',
      },
    ],
    faq: [
      {
        question: 'Will a 6-axis aluminum riser hold a heavy 16-inch or 17.3-inch gaming laptop?',
        answer:
          'Yes. The 4mm 6061 aluminum alloy frame is stress-tested up to 20 kg, easily supporting heavy 17.3-inch workstations without hinge drop.',
      },
      {
        question: 'Does elevating a laptop require an external keyboard?',
        answer:
          'For short 1-hour tasks you can type on the angled deck, and for 6+ hour marathons pairing the riser with an external mechanical keyboard gives full orthopedic wrist relief.',
      },
    ],
    directBloggerDraft: `TITLE: Best Aluminum Laptop Stand in India Under ₹600 (Thermal & Ergonomic Test)\n\nIf you spend 6+ hours coding, studying, or working from home, hunching over a flat laptop screen causes chronic neck strain and overheats your laptop's bottom intake vents.\n\nWe tested the AeroLift 6-Axis 6061 Aluminum Laptop Riser (₹599 via The O.P.T. Collective Direct Partner Hub Dispatch). Unlike ₹1,299 showroom stands, it uses 4mm aircraft-grade aluminum, supports 20kg load, and folds into a portable sleeve.\n\nCheck live batch stock & specifications here: /product/aerolift-6-axis-aluminum-riser`,
    subtleEducationalDraft: `TITLE: How Bottom-Intake Airflow & Screen Elevation Impact Laptop Thermal Throttling\n\nDuring long workloads in warm Indian ambient temperatures (32°C–38°C), a laptop resting flat on a wooden desk recycles its own exhaust heat. Raising the chassis by 4–6 inches on an open-frame 6061 aluminum geometry improves convective airflow and reduces cervical neck flexion.\n\nReference specification benchmark used in this test: O.P.T. Collective Hardware Telemetry Archive (/product/aerolift-6-axis-aluminum-riser).`,
  },
  {
    id: 'guide-02',
    slug: '55d-memory-foam-coccyx-cushion-long-driving-wfh-india',
    title:
      '55D High-Density Memory Foam vs. Standard Seat Cushions: Solving Tailbone Compression',
    subtitle:
      'How U-cutout orthopedic geometry suspends the coccyx across 10-hour desk marathons and highway drives.',
    division: 'DESK',
    categoryTag: 'Orthopedic Seating & Highway Comfort',
    readTimeMinutes: 4,
    publishedAtIso: '2026-11-02',
    heroImage:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    targetKeywords: [
      'coccyx cushion for tailbone pain india',
      '55d memory foam seat cushion',
      'car seat cushion for long drives india',
      'orthopedic chair pad for study',
    ],
    featuredProductSku: 'OPT-DESK-002',
    featuredProductSlug: 'orthocore-55d-coccyx-cushion',
    featuredProductTitle: 'OrthoCore 55D Memory Foam Coccyx Cushion',
    featuredProductPriceInr: 799,
    sections: [
      {
        heading: '1. Why Low-Density (25D–30D) Cushions Flatten Within 20 Minutes',
        body: 'Most generic foam cushions sold online use 25D sponge foam that bottoms out under adult body weight, pressing your tailbone directly against the hard chair base. True 55D slow-rebound memory foam maintains structural buoyancy for years.',
      },
      {
        heading: '2. The U-Shaped Coccyx Suspension Cutout',
        body: 'By carving a precision rear U-channel into the mold, the tailbone hovers in zero-contact space while weight is distributed evenly across the sit bones and thighs.',
      },
      {
        heading: '3. Dual-Environment Versatility: Office Chair to Car Bucket Seat',
        body: 'Engineered with a non-slip rubberized underside and zippered 3D breathable mesh cover, the cushion transitions directly from your study chair to your car driver seat for pothole-heavy highway commutes.',
      },
    ],
    faq: [
      {
        question: 'Can the outer mesh cover be removed and washed?',
        answer:
          'Yes, the 3D breathable mesh cover features a concealed zipper so you can machine-wash it while keeping the 55D memory foam core dry.',
      },
    ],
    directBloggerDraft: `TITLE: Why 55D Memory Foam Is Essential for Tailbone Relief (Desk + Car Review)\n\nStandard chair cushions flatten out in 15 minutes. The OrthoCore 55D Coccyx Cushion (₹799 at The O.P.T. Collective) uses high-density orthopedic rebound foam with a U-cutout that suspends your tailbone completely.\n\nInspect full specifications & PIN-code delivery: /product/orthocore-55d-coccyx-cushion`,
    subtleEducationalDraft: `TITLE: Understanding Foam Density Ratings (25D vs 55D) for Sciatica & Coccyx Ergonomics\n\nWhen selecting an orthopedic seat pad for extended sitting or highway driving, foam density (measured in kg/m³) determines whether the coccyx remains suspended. A 55D slow-rebound formulation prevents bottoming-out under sustained pelvic load.\n\nTechnical reference dimensions: O.P.T. Collective OrthoCore Specification Sheet (/product/orthocore-55d-coccyx-cushion).`,
  },
  {
    id: 'guide-03',
    slug: 'car-seat-gap-organizer-console-clutter-solution-india',
    title:
      'Eliminating the Car Console "Drop Zone": How Faux-Leather Gap Fillers Upgrade Cabin Ergonomics',
    subtitle:
      'Prevent dangerous distracted driving caused by phones, keys, and toll cards slipping between your seat and center console.',
    division: 'DRIVE',
    categoryTag: 'Car Cabin Organization & Safety',
    readTimeMinutes: 3,
    publishedAtIso: '2026-11-02',
    heroImage:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
    targetKeywords: [
      'car seat gap filler organizer india',
      'car interior accessories under 700',
      'leather car console pocket pair',
      'best viral car gadgets india',
    ],
    featuredProductSku: 'OPT-DRIVE-001',
    featuredProductSlug: 'stealthfit-leather-car-gap-organizer-pair',
    featuredProductTitle: 'StealthFit Faux-Leather Car Seat Gap Organizer (Pair)',
    featuredProductPriceInr: 649,
    sections: [
      {
        heading: '1. The #1 Cause of Distracted Cabin Fumbling on Indian Roads',
        body: 'Reaching under a car seat while driving to retrieve a fallen smartphone or parking ticket takes your eyes off traffic. Bridging the 3cm–5cm console gap seals that drop zone permanently.',
      },
      {
        heading: '2. Zero-Rattle PU Leatherette vs. Hard Plastic Boxes',
        body: 'Hard ABS console boxes squeak against seat rails over speed breakers. Stitched PU grain leatherette with flexible compression padding conforms snugly to hatchbacks, sedans, and SUVs with zero cabin rattle.',
      },
    ],
    faq: [
      {
        question: 'Does this block the seat belt buckle or fore-aft seat adjustment?',
        answer:
          'No. A dedicated slot wraps cleanly around the seat belt stalk so the organizer moves smoothly with your seat.',
      },
    ],
    directBloggerDraft: `TITLE: Top Car Interior Upgrade Under ₹650: StealthFit Seat Gap Organizer Pair\n\nStop losing your phone and keys between your car seat and center console. The StealthFit Faux-Leather Car Seat Gap Organizer Pair (₹649 for both Driver + Co-Driver sides at The O.P.T. Collective) adds stitched storage and cable pass-through routing in 10 seconds.\n\nOrder via Verified QR Checkout: /product/stealthfit-leather-car-gap-organizer-pair`,
    subtleEducationalDraft: `TITLE: Cabin Ergonomics: Designing Zero-Rattle Storage in Compact Sedans & SUVs\n\nInterior NVH (Noise, Vibration, and Harshness) increases when rigid plastic organizers rub against faux-leather seat bolsters. Compliant PU-wrapped gap pockets absorb vibration while sealing the console drop gap.\n\nReference design dimensions: O.P.T. // DRIVE Telemetry Archive (/product/stealthfit-leather-car-gap-organizer-pair).`,
  },
];

export function getGuideBySlug(slug: string): EditorialGuideArticle | undefined {
  const clean = slug.trim().toLowerCase();
  return OPT_EDITORIAL_GUIDES.find((g: EditorialGuideArticle) => g.slug === clean);
}

/**
 * Generates instant Mode A (Direct AdSense/Blogger) and Mode B (Subtle Non-Promotional)
 * drafts for any newly imported viral product.
 */
export function generateDualModeArticlesForProduct(params: {
  title: string;
  sku: string;
  slug: string;
  division: ProductDivision;
  priceInr: number;
  compareAtPriceInr: number;
  specs: string[];
}): { directBloggerDraft: string; subtleEducationalDraft: string } {
  const specBullets = params.specs.map((s: string) => `• ${s}`).join('\n');

  const directBloggerDraft = [
    `TITLE: ${params.title} Review — Best ${params.division} Upgrade in India Under ₹${params.priceInr}`,
    ``,
    `Looking for a practical ${params.division} upgrade without paying ₹${params.compareAtPriceInr} showroom markups? We tested the ${params.title} [${params.sku}], dispatched directly from The O.P.T. Collective's partner hub at ₹${params.priceInr}.`,
    ``,
    `KEY HARDWARE SPECIFICATIONS:`,
    specBullets,
    ``,
    `WHY IT STANDS OUT:`,
    `Ships in neutral unbranded outer packaging with a 7-Day Unboxing Replacement Shield and zero-fee Verified QR Checkout.`,
    ``,
    `Check live batch availability & PIN-code delivery here: https://opt-collective.vercel.app/product/${params.slug}`,
  ].join('\n');

  const subtleEducationalDraft = [
    `TITLE: Buyer's Technical Checklist: What to Look for in a ${params.title}`,
    ``,
    `When evaluating everyday ${params.division.toLowerCase()} hardware for durability in Indian conditions, build material and tolerance specs matter far more than brand packaging.`,
    ``,
    `ENGINEERING BENCHMARKS TO VERIFY:`,
    specBullets,
    ``,
    `Sourcing directly from partner dispatch hubs rather than multi-tier retail distributors typically reduces unit cost by 40%–50% (around ₹${params.priceInr} vs ₹${params.compareAtPriceInr}).`,
    ``,
    `Technical reference sheet & specification archive: https://opt-collective.vercel.app/product/${params.slug}`,
  ].join('\n');

  return { directBloggerDraft, subtleEducationalDraft };
}