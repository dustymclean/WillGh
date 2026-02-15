
export enum LicenseTier {
  PERSONAL = 'Personal Use',
  EDITORIAL = 'Editorial Use',
  COMMERCIAL_SMALL = 'Commercial (Small Scale)',
  COMMERCIAL_LARGE = 'Commercial (Large Scale)',
  EXCLUSIVE = 'Exclusive Rights / Buyout'
}

export interface PricingTier {
  tier: LicenseTier;
  price: string;
  rights: string[];
  duration: string;
  territory: string;
  description: string;
}

export interface Discipline {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface PortfolioItem {
  id: string;
  discipline: string;
  url: string;
  title: string;
}

export interface ClientGallery {
  id: string;
  clientName: string;
  date: string;
  coverImage: string;
  accessCode: string;
  images: string[];
}

export interface BrandColor {
  name: string;
  hex: string;
  description: string;
}

export interface LogoConcept {
  name: string;
  description: string;
  visualDescription: string;
}
