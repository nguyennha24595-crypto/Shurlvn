// Tier/role config: feature limits per plan (guest/free/plus/pro/super/admin).

export const TIER_CONFIG = {
  guest: {
    dailyLinks: 5, linkExpiryDays: null,
    hasAdvancedManagement: false, hasDetailedAnalytics: false, hasAdvancedAnalytics: false,
    hasCustomAlias: false, hasBulkShorten: false, maxBulkBatch: 0,
    hasCustomQr: false, hasBulkQr: false, maxBulkQrBatch: 0, maxDynamicQrPerMonth: 0, hasApi: false, monthlyApiLimit: 0,
    hasDataExport: false, hasCustomDomain: false,
    hasPixel: false, maxPixelPerLink: 0, maxPixelLinks: 0,
    hasABTest: false, maxABUrls: 0, maxABLinks: 0, hasCustomABPercent: false,
    hasDeepLink: false, hasSmartFallback: false,
    hasPasswordLink: false, hasPasswordBruteForce: false,
    maxBioPages: 0
  },
  free: {
    dailyLinks: 10, linkExpiryDays: null,
    hasAdvancedManagement: false, hasDetailedAnalytics: false, hasAdvancedAnalytics: false,
    hasCustomAlias: true, hasBulkShorten: false, maxBulkBatch: 0,
    hasCustomQr: false, hasBulkQr: false, maxBulkQrBatch: 0, maxDynamicQrPerMonth: 0, hasApi: false, monthlyApiLimit: 0,
    hasDataExport: false, hasCustomDomain: false,
    hasPixel: false, maxPixelPerLink: 0, maxPixelLinks: 0,
    hasABTest: false, maxABUrls: 0, maxABLinks: 0, hasCustomABPercent: false,
    hasDeepLink: false, hasSmartFallback: false,
    hasPasswordLink: false, hasPasswordBruteForce: false,
    maxBioPages: 0
  },
  plus: {
  dailyLinks: 150, linkExpiryDays: 7,
  hasAdvancedManagement: false, hasDetailedAnalytics: false, hasAdvancedAnalytics: false,
  hasCustomAlias: true, hasBulkShorten: true, maxBulkBatch: 150,
  hasCustomQr: false, hasBulkQr: false, maxBulkQrBatch: 0, maxDynamicQrPerMonth: 20, hasApi: false, monthlyApiLimit: 0,
  hasDataExport: false, hasCustomDomain: false,
  hasPixel: false, maxPixelPerLink: 0, maxPixelLinks: 0,
  hasABTest: false, maxABUrls: 0, maxABLinks: 0, hasCustomABPercent: false,
  hasDeepLink: false, hasSmartFallback: false,
  hasPasswordLink: false, hasPasswordBruteForce: false,
  hasCampaignHistory: true,
  maxBioPages: 1
  },
  pro: {
    dailyLinks: 200, linkExpiryDays: null,
    hasAdvancedManagement: true, hasDetailedAnalytics: true, hasAdvancedAnalytics: false,
    hasCustomAlias: true, hasBulkShorten: true, maxBulkBatch: 300,
    hasCustomQr: true, hasBulkQr: true, maxBulkQrBatch: 50, maxDynamicQrPerMonth: 100, hasApi: true, monthlyApiLimit: 5000,
    hasDataExport: true, hasCustomDomain: false,
    hasPixel: true, maxPixelPerLink: 1, maxPixelLinks: 50,
    hasABTest: true, maxABUrls: 2, maxABLinks: 20, hasCustomABPercent: false,
    hasDeepLink: true, hasSmartFallback: false,
    hasPasswordLink: true, hasPasswordBruteForce: false,
    hasCampaignHistory: true,
    maxBioPages: 3
  },
  super: {
    dailyLinks: 600, linkExpiryDays: null,
    hasAdvancedManagement: true, hasDetailedAnalytics: true, hasAdvancedAnalytics: true,
    hasCustomAlias: true, hasBulkShorten: true, maxBulkBatch: 600,
    hasCustomQr: true, hasBulkQr: true, maxBulkQrBatch: 200, maxDynamicQrPerMonth: 500, hasApi: true, monthlyApiLimit: 10000,
    hasDataExport: true, hasCustomDomain: true,
    hasPixel: true, maxPixelPerLink: 2, maxPixelLinks: 999999,
    hasABTest: true, maxABUrls: 3, maxABLinks: 999999, hasCustomABPercent: true,
    hasDeepLink: true, hasSmartFallback: true,
    hasPasswordLink: true, hasPasswordBruteForce: true,
    hasTeam: true, maxTeamMembers: 10,
    hasCampaignHistory: true,
    maxBioPages: 10
  },
  admin: {
    dailyLinks: 999999, linkExpiryDays: null,
    hasAdvancedManagement: true, hasDetailedAnalytics: true, hasAdvancedAnalytics: true,
    hasCustomAlias: true, hasBulkShorten: true, maxBulkBatch: 5000,
    hasTeam: true, maxTeamMembers: 999999,
    hasCustomQr: true, hasBulkQr: true, maxBulkQrBatch: 999999, maxDynamicQrPerMonth: 999999, hasApi: true, monthlyApiLimit: 999999,
    hasDataExport: true, hasCustomDomain: true,
    hasPixel: true, maxPixelPerLink: 3, maxPixelLinks: 999999,
    hasABTest: true, maxABUrls: 5, maxABLinks: 999999, hasCustomABPercent: true,
    hasDeepLink: true, hasSmartFallback: true,
    hasPasswordLink: true, hasPasswordBruteForce: true,
    hasCampaignHistory: true,
    maxBioPages: 999999
  }
};

export function isProOrAboveRole(role) {
  return role === "pro" || role === "super" || role === "admin";
}

export const TIER_RANK = { guest: 0, free: 1, plus: 2, pro: 3, super: 4, admin: 99 };
