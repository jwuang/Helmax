export const locales = ['zh-cn', 'zh-hk', 'en'] as const;
export type Locale = (typeof locales)[number];
export const htmlLanguages: Record<Locale, string> = { 'zh-cn': 'zh-CN', 'zh-hk': 'zh-HK', en: 'en' };
