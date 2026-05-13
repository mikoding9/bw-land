import { fetchDirectusInsights, getInsightSeedRecords } from '../data/insights';
import { siteUrl } from '../data/site';

export async function GET() {
	const staticRoutes = [
		'/',
		'/about',
		'/industry',
		'/insight',
		'/glossary',
		'/legal-and-privacy',
		'/service/metocean-design-criteria',
		'/service/metocean-dss',
		'/service/extended-services',
	];

	const records = await fetchDirectusInsights().catch(() => getInsightSeedRecords());
	const insightRoutes = records
		.filter((record) => (record.status ?? 'published') === 'published')
		.map((record) => `/insight/${record.slug}`);

	const uniqueRoutes = [...new Set([...staticRoutes, ...insightRoutes])];
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes
	.map((route) => `  <url><loc>${new URL(route, siteUrl).toString()}</loc></url>`)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
