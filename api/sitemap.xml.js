const SB_URL = 'https://lfusargqdlkggwqbdpnz.supabase.co';
const SB_KEY = 'sb_publishable_DdyJnamslWtE7B0bwR_J1A_k1m7ZDlw';

export default async function handler(req, res) {
  // Fetch published blog posts from Supabase
  const response = await fetch(
    `${SB_URL}/rest/v1/blog_posts?select=slug,updated_at&published=eq.true&order=created_at.desc`,
    {
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
      },
    }
  );

  const posts = await response.json();

  const today = new Date().toISOString().split('T')[0];

  // Static pages
  const staticPages = [
    { url: 'https://youtubenichefinderai.com/', priority: '1.0', changefreq: 'daily' },
    { url: 'https://youtubenichefinderai.com/#blog', priority: '0.9', changefreq: 'weekly' },
    { url: 'https://youtubenichefinderai.com/#contact', priority: '0.6', changefreq: 'monthly' },
    { url: 'https://youtubenichefinderai.com/#privacy', priority: '0.4', changefreq: 'monthly' },
    { url: 'https://youtubenichefinderai.com/#terms', priority: '0.4', changefreq: 'monthly' },
  ];

  const staticXml = staticPages.map(p => `
  <url>
    <loc>${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  // Blog post pages
  const blogXml = Array.isArray(posts) ? posts.map(p => `
  <url>
    <loc>https://youtubenichefinderai.com/#blog/${encodeURIComponent(p.slug)}</loc>
    <lastmod>${p.updated_at ? p.updated_at.split('T')[0] : today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') : '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${blogXml}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}
