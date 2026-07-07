import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '@src/consts';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('docs');
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/docs/${post.id}/`,
    })),
  });
}
