export type PlanType = 'free' | 'essencial' | 'plus';

export interface PlanFeatures {
  maxCategories: number;
  maxGoals: number;
  hasReports: boolean;
  hasWhatsAppAlerts: boolean;
  hasPrioritySupport: boolean;
  hasMultipleAccounts: boolean;
  hasUnlimitedGoals: boolean;
  hasAutomations: boolean;
  hasCloudBackup: boolean;
  hasCustomThemes: boolean;
  hasVipSupport: boolean;
  hasFamilyBudget: boolean;
  dashboard: boolean;
  newLaunch: boolean;
  history: boolean;
  hasGoals: boolean;
  hasWishlist: boolean;
  hasPiggyBank: boolean;
  hasDebts: boolean;
  hasCreditCards: boolean;
  hasCalendar: boolean;
  hasLimits: boolean;
  hasFixedExpenses: boolean;
  hasInvestments: boolean;
  hasIncomeSources: boolean;
  hasImport: boolean;
  hasCategories: boolean;
  hasSettings: boolean;
}

export interface Plan {
  id: PlanType;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: PlanFeatures;
  popular?: boolean;
}

export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 'Grátis',
    description: 'Ideal para começar',
    features: {
      maxCategories: 5,
      maxGoals: 1,
      hasReports: false,
      hasWhatsAppAlerts: false,
      hasPrioritySupport: false,
      hasMultipleAccounts: false,
      hasUnlimitedGoals: false,
      hasAutomations: false,
      hasCloudBackup: false,
      hasCustomThemes: false,
      hasVipSupport: false,
      hasFamilyBudget: false,
      dashboard: true,
      newLaunch: true,
      history: true,
      hasGoals: true,
      hasWishlist: false,
      hasPiggyBank: false,
      hasDebts: false,
      hasCreditCards: false,
      hasCalendar: true,
      hasLimits: false,
      hasFixedExpenses: false,
      hasInvestments: false,
      hasIncomeSources: false,
      hasImport: false,
      hasCategories: true,
      hasSettings: true,
    },
  },
  essencial: {
    id: 'essencial',
    name: 'Essencial',
    price: 'R$ 19,90',
    period: '/mês',
    description: 'Para uso pessoal',
    popular: true,
    features: {
      maxCategories: -1, // unlimited
      maxGoals: 5,
      hasReports: true,
      hasWhatsAppAlerts: true,
      hasPrioritySupport: true,
      hasMultipleAccounts: false,
      hasUnlimitedGoals: false,
      hasAutomations: false,
      hasCloudBackup: false,
      hasCustomThemes: false,
      hasVipSupport: false,
      hasFamilyBudget: false,
      dashboard: true,
      newLaunch: true,
      history: true,
      hasGoals: true,
      hasWishlist: true,
      hasPiggyBank: true,
      hasDebts: true,
      hasCreditCards: true,
      hasCalendar: true,
      hasLimits: true,
      hasFixedExpenses: true,
      hasInvestments: true,
      hasIncomeSources: true,
      hasImport: true,
      hasCategories: true,
      hasSettings: true,
    },
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    price: 'R$ 49,90',
    period: '/mês',
    description: 'Para quem quer controle total',
    features: {
      maxCategories: -1, // unlimited
      maxGoals: -1, // unlimited
      hasReports: true,
      hasWhatsAppAlerts: true,
      hasPrioritySupport: true,
      hasMultipleAccounts: true,
      hasUnlimitedGoals: true,
      hasAutomations: true,
      hasCloudBackup: true,
      hasCustomThemes: true,
      hasVipSupport: true,
      hasFamilyBudget: true,
      dashboard: true,
      newLaunch: true,
      history: true,
      hasGoals: true,
      hasWishlist: true,
      hasPiggyBank: true,
      hasDebts: true,
      hasCreditCards: true,
      hasCalendar: true,
      hasLimits: true,
      hasFixedExpenses: true,
      hasInvestments: true,
      hasIncomeSources: true,
      hasImport: true,
      hasCategories: true,
      hasSettings: true,
    },
  },
};


