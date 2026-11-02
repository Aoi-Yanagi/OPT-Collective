import type { PublicProductItem } from '@/types/public-catalog.types';

type ProductSeed = Omit<
  PublicProductItem,
  'description' | 'tags' | 'gallery' | 'variants' | 'stockStatus' | 'publicationStatus'
> &
  Partial<
    Pick<
      PublicProductItem,
      'description' | 'tags' | 'gallery' | 'variants' | 'stockStatus' | 'publicationStatus'
    >
  >;

/**
 * Builds the public storefront representation of a product.
 * Supplier costs, supplier URLs and internal procurement notes belong in
 * private procurement records, never in this client-importable catalog.
 */
function createCatalogProduct(seed: ProductSeed): PublicProductItem {
  const stockStatus = seed.stockStatus ?? (seed.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK');

  return {
    ...seed,
    description: seed.description ?? seed.subtitle,
    tags: seed.tags ?? [seed.division.toLowerCase()],
    gallery: seed.gallery ?? [seed.image],
    variants: seed.variants ?? [],
    stockStatus,
    publicationStatus: seed.publicationStatus ?? 'PUBLISHED',
  };
}

export const OPT_PRODUCTS: PublicProductItem[] = [
  createCatalogProduct({
    id: 'prod-desk-01',
    sku: 'OPT-DESK-001',
    slug: 'aerolift-6-axis-aluminum-riser',
    title: 'AeroLift 6-Axis Aluminum Laptop Riser',
    subtitle: 'CNC-anodized foldable frame with open-mesh passive cooling',
    division: 'DESK',
    tags: ['desk', 'laptop', 'ergonomic', 'workspace'],
    price: 599,
    compareAtPrice: 599,
    rating: 0,
    reviewsCount: 0,
    badge: 'Bestseller // WFH',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
    specs: ['6061 Aircraft Aluminum', 'Holds 17" Laptops (20kg)', 'Anti-Skid Silicone Pads'],
    inStock: true,
  }),
  createCatalogProduct({
    id: 'prod-desk-02',
    sku: 'OPT-DESK-002',
    slug: 'orthocore-55d-coccyx-cushion',
    title: 'OrthoCore 55D Memory Foam Coccyx Cushion',
    subtitle: 'Ergonomic U-cutout tailbone relief for 10-hour study & driving sessions',
    division: 'DESK',
    tags: ['desk', 'car', 'ergonomic', 'cushion'],
    price: 799,
    compareAtPrice: 799,
    rating: 0,
    reviewsCount: 0,
    badge: 'Desk + Car Crossover',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    specs: ['55D Slow-Rebound Memory Foam', 'Washable Breathable 3D Mesh', 'Fits Office & Car Seats'],
    inStock: true,
  }),
  createCatalogProduct({
    id: 'prod-desk-03',
    sku: 'OPT-DESK-003',
    slug: '7-in-1-mechanical-switch-detailing-kit',
    title: '7-in-1 Mechanical Switch & Earbud Detailing Kit',
    subtitle: 'Retractable high-density brush, keycap puller, and microfiber flocking tip',
    division: 'DESK',
    tags: ['desk', 'keyboard', 'cleaning', 'accessories'],
    price: 449,
    compareAtPrice: 449,
    rating: 0,
    reviewsCount: 0,
    badge: 'Viral Essential',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    specs: ['Keycap Puller + Metal Nib', 'Flocking Sponge for AirPods', 'Compact ABS Slide Case'],
    inStock: true,
  }),
  createCatalogProduct({
    id: 'prod-drive-01',
    sku: 'OPT-DRIVE-001',
    slug: 'stealthfit-leather-car-gap-organizer-pair',
    title: 'StealthFit Faux-Leather Car Seat Gap Organizer (Pair)',
    subtitle: 'Zero-rattle console pocket filler with dedicated phone, card & cable slots',
    division: 'DRIVE',
    tags: ['drive', 'car', 'organizer', 'interior'],
    price: 649,
    compareAtPrice: 649,
    rating: 0,
    reviewsCount: 0,
    badge: 'Driver + Co-Driver Pair',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
    specs: ['Stitched PU Grain Leather', 'Fits Compact SUVs & Sedans', 'Seatbelt Pass-Through Slot'],
    inStock: true,
  }),
  createCatalogProduct({
    id: 'prod-drive-02',
    sku: 'OPT-DRIVE-002',
    slug: 'telescopic-microfiber-car-duster-brush',
    title: 'AeroSweep Telescopic Microfiber Car Exterior & Dash Duster',
    subtitle: 'Scratch-free wax-treated nanofibers lift heavy Indian road dust in 1 swipe',
    division: 'DRIVE',
    tags: ['drive', 'car', 'cleaning', 'microfiber'],
    price: 549,
    compareAtPrice: 549,
    rating: 0,
    reviewsCount: 0,
    badge: 'Daily Car Care',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=900&q=80',
    specs: ['Extendable Stainless Rod', 'Washable High-Pile Microfiber', 'Includes Dashboard Mini Brush'],
    inStock: true,
  }),
  createCatalogProduct({
    id: 'prod-vault-01',
    sku: 'OPT-VAULT-001',
    slug: 'diwali-safai-executive-desk-makeover-bundle',
    title: 'Diwali Safai & Executive Desk Makeover Combo (Stand + 7-in-1 Kit)',
    subtitle: 'Festive limited edition bundle for deep-cleaning & upgrading your study/WFH station',
    division: 'VAULT',
    tags: ['vault', 'bundle', 'desk', 'gift'],
    price: 899,
    compareAtPrice: 899,
    rating: 0,
    reviewsCount: 0,
    badge: 'Festive Vault // Save ₹150',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=900&q=80',
    specs: ['AeroLift Stand + 7-in-1 Kit', 'Priority Prepaid Dispatch', 'Gift-Ready Neutral Box'],
    inStock: true,
  }),
];

export function getProductsByDivision(division: string): PublicProductItem[] {
  const upper = division.toUpperCase();
  if (upper === 'ALL') return OPT_PRODUCTS;
  return OPT_PRODUCTS.filter((product) => product.division === upper);
}

export function getProductBySlugOrSku(identifier: string): PublicProductItem | undefined {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  return OPT_PRODUCTS.find(
    (product) =>
      product.slug.toLowerCase() === normalizedIdentifier ||
      product.sku.toLowerCase() === normalizedIdentifier
  );
}
