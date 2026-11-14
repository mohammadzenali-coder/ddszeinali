import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('thoughts')).sort((a, b) => +b.data.date - +a.data.date);
  return rss({
    title: `یادداشت‌های ${SITE.name}`,
    description: SITE.description,
    site: context.site!,
    customData: '<language>fa-IR</language>',
    items: posts.map((p) => ({ title: p.data.title, description: p.data.description, pubDate: p.data.date, link: `/thoughts/${p.id}/` })),
  });
}
