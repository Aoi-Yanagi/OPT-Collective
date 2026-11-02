export interface SocialPlatformLink {
  id: 'instagram' | 'facebook' | 'youtube' | 'whatsapp';
  label: string;
  handle: string;
  url: string;
  enabled: boolean;
}

/**
 * Centralized SocialLinksConfig.
 * Managed in one place and editable from the Merchant Settings interface.
 * Set URLs via NEXT_PUBLIC_* environment variables or update directly.
 */
export const DEFAULT_SOCIAL_LINKS: SocialPlatformLink[] = [
  {
    id: 'instagram',
    label: 'Instagram Studio',
    handle: '@theoptcollective',
    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },
  {
    id: 'youtube',
    label: 'YouTube Shorts & Tests',
    handle: '@OPTCollective',
    url: process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_YOUTUBE_URL),
  },
  {
    id: 'facebook',
    label: 'Facebook Catalog Page',
    handle: 'The O.P.T. Collective',
    url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Support & Catalog Desk',
    handle: 'Verified Support Desk',
    url: process.env.NEXT_PUBLIC_WHATSAPP_URL || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_URL),
  },
];