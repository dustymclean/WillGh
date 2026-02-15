
import { LicenseTier, PricingTier, Discipline, BrandColor, LogoConcept, PortfolioItem, ClientGallery } from './types';

export const BRAND_COLORS: BrandColor[] = [
  { name: 'Obsidian Matte', hex: '#1A1A1B', description: 'Used for the deep backgrounds, concert stages, and the "Night" mode of the suite.' },
  { name: 'Raw Copper', hex: '#B87333', description: 'Used for the logo, signature, and foil-stamp effects. Represents premium hardware and the "Golden Hour".' },
  { name: 'Cloud Dancer', hex: '#F0EDE9', description: 'An off-white, linen-textured color used for the gallery surface and "Light" mode backgrounds.' },
  { name: 'Inked Charcoal', hex: '#333333', description: 'Used for sub-headers and body text to provide a softer, more expensive look than pure black.' }
];

export const DISCIPLINES: Discipline[] = [
  {
    id: 'concert',
    title: 'Concert Performance',
    description: "Capturing the raw, kinetic energy of Oxford's legendary music scene.",
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'boudoir',
    title: 'Fine Art Boudoir',
    description: "Intimate narratives of the human form, explored with grace and intention.",
    image: 'https://images.unsplash.com/photo-1520127875765-16501c6c0f99?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'street',
    title: 'Documentary Street',
    description: "The silent geometry of the street and the candid life of Mississippi.",
    image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'commercial',
    title: 'High-End Commercial',
    description: "Strategic visual storytelling for brands that value excellence.",
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop'
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { id: '1', discipline: 'concert', url: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=800', title: 'Oxford Neon' },
  { id: '2', discipline: 'concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800', title: 'The Crowd Kinetic' },
  { id: '3', discipline: 'street', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800', title: 'Delta Shadows' },
  { id: '4', discipline: 'boudoir', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800', title: 'Soft Narrative I' },
  { id: '5', discipline: 'commercial', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800', title: 'Brand Essence' },
  { id: '6', discipline: 'street', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800', title: 'Mid-Morning Square' },
];

export const CLIENT_GALLERIES: ClientGallery[] = [
  {
    id: 'g1',
    clientName: 'The Lyric Oxford',
    date: 'Feb 2026',
    coverImage: 'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=800',
    accessCode: 'OXFORD26',
    images: [
      'https://images.unsplash.com/photo-1514525253361-bee8718a300a?q=80&w=800',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800'
    ]
  },
  {
    id: 'g2',
    clientName: 'Modern State Branding',
    date: 'Jan 2026',
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800',
    accessCode: 'BRANDVLT',
    images: [
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800'
    ]
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    tier: LicenseTier.PERSONAL,
    price: '$250',
    description: 'For individuals, social media, and home display.',
    duration: 'Perpetual',
    territory: 'Personal Use Only',
    rights: ['Social media sharing with credit', 'Archival prints', 'No commercial resale']
  },
  {
    tier: LicenseTier.EDITORIAL,
    price: '$750',
    description: 'For news, blogs, and educational publications.',
    duration: '3 Years',
    territory: 'Worldwide Digital/Regional Print',
    rights: ['Single publication right', 'News/Blog feature', 'Credit mandatory']
  },
  {
    tier: LicenseTier.COMMERCIAL_SMALL,
    price: '$2,500',
    description: 'Small business marketing and local brand campaigns.',
    duration: '5 Years',
    territory: 'Regional (Statewide)',
    rights: ['Website & Digital Ads', 'Social Media Marketing', 'In-store signage']
  },
  {
    tier: LicenseTier.COMMERCIAL_LARGE,
    price: '$8,500',
    description: 'National campaigns and multi-channel marketing.',
    duration: '5 Years',
    territory: 'National',
    rights: ['Television / OOH Billboards', 'Unlimited Multi-channel', 'High-res master files']
  },
  {
    tier: LicenseTier.EXCLUSIVE,
    price: '$25,000+',
    description: 'Total control and competitive exclusivity.',
    duration: 'Perpetual',
    territory: 'Global',
    rights: ['Total exclusivity', 'Category lockout', 'Copyright buyout optional']
  }
];

export const LICENSE_AGREEMENT_TEXT = `
LICENSE AGREEMENT: WILL’S PLACE
EFFECTIVE DATE: February 14, 2026
CREATOR: Dusty McLean (“Licensor”)
LICENSEE: William Ghrigsby (“Licensee”) | will@willgh.com
PRIMARY DOMAIN: willgh.com

1. OWNERSHIP & SOVEREIGNTY
William Ghrigsby is the sole owner of all photography assets, client data, and brand-specific media. The "Will’s Place" infrastructure is a perpetual gift from Dusty McLean.

2. ASSET VALUATION
All digital assets hosted on willgh.com are protected by a tiered licensing framework. Any unauthorized use or reproduction constitutes a breach of copyright.

3. TERRITORY & USAGE
Licenses are issued on a per-asset basis and are tracked via the sovereign database on willgh.com.
`;
