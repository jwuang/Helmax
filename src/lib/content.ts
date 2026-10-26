import { getCollection, type CollectionEntry } from 'astro:content';
import { sections, visible, type Section } from './content-model';
import { pathFor, type Locale } from './i18n';
export type Entry = CollectionEntry<Section>;
export const production = import.meta.env.PUBLIC_SITE_MODE === 'production';
export async function entries(section: Section, locale?: Locale): Promise<Entry[]> {
  const result = await getCollection(section, ({ data }) => visible(data, production) && (!locale || data.locale === locale));
  return result.sort((a, b) => a.data.order - b.data.order || b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
export async function availableSections(locale: Locale) {
  const results = await Promise.all(sections.map(async (section) => ({ section, count: (await entries(section, locale)).length })));
  return results.filter(({ count }) => count > 0).map(({ section }) => section);
}
export function entryPath(entry: Entry) { return pathFor(entry.data.locale, entry.collection, entry.data.routeSlug); }
