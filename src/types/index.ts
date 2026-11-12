export type PhaseStatus = 'completed' | 'in_progress' | 'pending';

export interface BamiPhase {
  id: number;
  title: string;
  status: PhaseStatus;
  valuation: number; // in USD e.g. 100000
  sharePrice: number; // in USD e.g. 0.010
  targetDate: string; // e.g. "تکمیل شده (بهار ۱۴۰۵)"
  targetCompletionDate?: string; // ISO date format YYYY-MM-DD e.g. "2027-02-28"
  description: string;
  keyMilestones: string[];
  sharesOffered: number;
}

export interface BamiShareholder {
  id: string;
  name: string;
  roleOrType: string;
  sharesCount: number;
  purchaseSharePrice: number; // USD per share when purchased
  purchaseDate: string;
  entryPhase: string;
  certificateId: string;
  verified: boolean;
}

export interface BamiFaq {
  q: string;
  a: string;
}

export interface BamiPillar {
  title: string;
  desc: string;
  tag: string;
}

export interface BamiSettings {
  projectName: string;
  brandTagline: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  neuralStatusTitle: string;
  neuralStatusSubtitle: string;
  progressTitle: string;
  progressDescription: string;
  progressButtonText: string;

  // Calculator texts
  calculatorBadge: string;
  calculatorTitle: string;
  calculatorDescription: string;
  calculatorCtaText: string;

  // Roadmap texts
  roadmapBadge: string;
  roadmapTitle: string;
  roadmapDescription: string;

  // Shareholders section texts
  shareholdersBadge: string;
  shareholdersTitle: string;
  shareholdersDescription: string;

  // About & Tech texts
  aboutBadge: string;
  aboutTitle: string;
  aboutBamiSummary: string;
  neuralArchitectureTitle: string;
  interfaceTitle: string;
  interfaceDescription: string;
  businessModelTitle: string;
  businessModelDescription: string;
  faqTitle: string;

  // Footer & Trust texts
  footerBio: string;
  footerTrustTitle: string;
  footerTrustDesc: string;
  footerText: string;

  // Numerical & Financial variables
  totalValuation: number;
  totalShares: number;
  soldShares: number;
  currentSharePrice: number;
  currency: string; // Strictly 'USD'
  minInvestmentShares: number;
  targetDomain: string;
  contactTelegram: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactPhone: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  companyVision: string;

  // Dynamic editable lists
  faqs?: BamiFaq[];
  pillars?: BamiPillar[];
}

export interface PhaseROIComparison {
  phaseId: number;
  title: string;
  sharePrice: number;
  portfolioValue: number;
  roiPercentage: number;
  multiplier: number;
}
