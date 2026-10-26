import type { Locale } from './i18n';
export const sections = ['services', 'cases', 'news'] as const;
export type Section = (typeof sections)[number];
export type EntryData = {
  translationKey: string; locale: Locale; routeSlug: string; title: string; summary: string;
  category: string; order: number; draft: boolean; previewOnly: boolean;
  publishedAt: Date; updatedAt?: Date; seoTitle?: string; seoDescription?: string;
  cover?: string; coverAlt?: string;
};
export function visible(data: Pick<EntryData, 'draft' | 'previewOnly'>, production: boolean) {
  return !data.draft && (!production || !data.previewOnly);
}
