export type Locale = 'es' | 'en';

export type LocalizedString = Record<Locale, string>;
export type LocalizedStringArray = Record<Locale, string[]>;

export type SellerLevel = 'new' | 'level1' | 'level2' | 'top';

export type PackageTier = 'basic' | 'standard' | 'premium';

export interface FreelanceSubcategory {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
}

export interface FreelanceCategory {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  icon: string;
  subcategories: FreelanceSubcategory[];
}

export interface SellerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  level: SellerLevel;
  country: string;
  city?: string;
  languages: Locale[];
  rating: number;
  reviewsCount: number;
  memberSince: string;
  tagline: LocalizedString;
}

export interface GigPackage {
  tier: PackageTier;
  title: LocalizedString;
  description: LocalizedString;
  priceUSD: number;
  deliveryDays: number;
  revisions: number | 'unlimited';
  features: LocalizedStringArray;
}

export interface Gig {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  categoryId: string;
  subcategoryId: string;
  images: string[];
  thumbnail: string;
  seller: SellerProfile;
  packages: Record<PackageTier, GigPackage>;
  rating: number;
  reviewsCount: number;
  tags: string[];
  ordersInQueue?: number;
  createdAt: string;
}

export interface FreelanceFilterState {
  categories: string[];
  subcategories: string[];
  sellerLevels: SellerLevel[];
  languages: Locale[];
  deliveryMaxDays: number | null;
  budgetUSD: [number, number];
  minRating: number;
}

export const DEFAULT_FREELANCE_FILTERS: FreelanceFilterState = {
  categories: [],
  subcategories: [],
  sellerLevels: [],
  languages: [],
  deliveryMaxDays: null,
  budgetUSD: [0, 5000],
  minRating: 0,
};

export const SELLER_LEVELS: SellerLevel[] = ['new', 'level1', 'level2', 'top'];

export const PACKAGE_TIERS: PackageTier[] = ['basic', 'standard', 'premium'];
