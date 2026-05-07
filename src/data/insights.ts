import insightsSeed from './insights.seed.json';
import {
	fetchDirectusCollection,
	resolveDirectusImageUrl,
	type DirectusFileReference,
	type DirectusInsightRecord,
} from './directus';

export const insightCategories = ['Products', 'Projects', 'Company News', 'Science and Technology'] as const;

export type InsightSeedRecord = typeof insightsSeed.items[number];
export type InsightRecord = DirectusInsightRecord | InsightSeedRecord;

export type InsightCard = {
	tag: string;
	title: string;
	excerpt: string;
	image: string;
	variant: string;
	href: string;
};

export type InsightSection = {
	title: string;
	feature: InsightCard | null;
	list: InsightCard[];
};

const fallbackHeroImage = '/figma/blog-hero-image.png';

export function parseHighlightSlots(value: DirectusInsightRecord['highlight_slots'] | InsightSeedRecord['highlight_slots']) {
	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === 'string') {
		try {
			const parsed = JSON.parse(value);
			return Array.isArray(parsed) ? parsed : [value];
		} catch {
			return [value];
		}
	}

	return [];
}

export function toInsightHref(slug: string) {
	return `/insight/${slug}`;
}

export function resolveInsightImageUrl(asset: DirectusFileReference | string | null | undefined) {
	return resolveDirectusImageUrl(asset as DirectusFileReference, fallbackHeroImage);
}

export function toInsightCard(record: InsightRecord, useFeaturedImage = false): InsightCard {
	return {
		tag: record.category ?? 'Insight',
		title: record.title ?? 'Untitled insight',
		excerpt: record.excerpt ?? '',
		image: resolveInsightImageUrl((useFeaturedImage ? record.featured_image : record.thumbnail) ?? record.thumbnail),
		variant: record.listing_variant ?? 'metocean',
		href: toInsightHref(record.slug),
	};
}

export function sortInsights(records: InsightRecord[]) {
	return [...records].sort((left, right) => {
		const leftOrder = left.highlight_order ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.highlight_order ?? Number.MAX_SAFE_INTEGER;
		if (leftOrder !== rightOrder) {
			return leftOrder - rightOrder;
		}

		const leftDate = left.published_at ? Date.parse(left.published_at) : 0;
		const rightDate = right.published_at ? Date.parse(right.published_at) : 0;
		return rightDate - leftDate;
	});
}

export function getRecordsForSlot(records: InsightRecord[], slot: string) {
	return sortInsights(records.filter((record) => parseHighlightSlots(record.highlight_slots).includes(slot)));
}

export function buildInsightView(records: InsightRecord[]) {
	const publishedRecords = records.filter((record) => (record.status ?? 'published') === 'published');
	const latestPosts = getRecordsForSlot(publishedRecords, 'latest').slice(0, 4).map((record) => toInsightCard(record));
	const sections = insightCategories.map((category) => {
		const categoryKey = category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
		const featureRecord =
			getRecordsForSlot(publishedRecords, `${categoryKey}_feature`)[0] ??
			publishedRecords.find((record) => record.category === category) ??
			null;
		const listSlotRecords = getRecordsForSlot(publishedRecords, `${categoryKey}_list`).slice(0, 3);
		const listRecords =
			listSlotRecords.length > 0
				? listSlotRecords
				: publishedRecords.filter((record) => record.category === category && record.slug !== featureRecord?.slug).slice(0, 3);

		return {
			title: category,
			feature: featureRecord ? toInsightCard(featureRecord, true) : null,
			list: listRecords.map((record) => toInsightCard(record)),
		};
	});

	return { latestPosts, sections };
}

export function buildReadMoreCards(records: InsightRecord[], currentSlug?: string, limit = 4) {
	return sortInsights(records)
		.filter((record) => (record.status ?? 'published') === 'published' && record.slug !== currentSlug)
		.slice(0, limit)
		.map((record) => toInsightCard(record));
}

export function resolveInsightTeaserHref(
	teaser: { href?: string | null; slug?: string | null; title?: string | null },
	records: InsightRecord[]
) {
	const publishedRecords = records.filter((record) => (record.status ?? 'published') === 'published');
	const slugs = new Set(publishedRecords.map((record) => record.slug));

	if (teaser.slug && slugs.has(teaser.slug)) {
		return toInsightHref(teaser.slug);
	}

	if (teaser.href) {
		const slugFromHref = teaser.href.replace(/^\/insight\//, '').replace(/\/$/, '');
		if (slugs.has(slugFromHref)) {
			return teaser.href;
		}
	}

	if (teaser.title) {
		const matchingRecord = publishedRecords.find((record) => record.title === teaser.title);
		if (matchingRecord) {
			return toInsightHref(matchingRecord.slug);
		}
	}

	const heroRecord = getRecordsForSlot(publishedRecords, 'hero')[0];
	return heroRecord ? toInsightHref(heroRecord.slug) : '/insight';
}

export function getInsightSeedRecords() {
	return insightsSeed.items as InsightSeedRecord[];
}

export function getInsightSeedBySlug(slug: string) {
	return getInsightSeedRecords().find((record) => record.slug === slug) ?? null;
}

export async function fetchDirectusInsights(language = 'en') {
	const params = new URLSearchParams({
		'filter[language][_eq]': language,
		'filter[status][_eq]': 'published',
		sort: '-published_at',
		limit: '100',
	});

	return fetchDirectusCollection<DirectusInsightRecord>('bw-insights', params);
}

export async function fetchDirectusInsightBySlug(slug: string, language = 'en') {
	const params = new URLSearchParams({
		'filter[slug][_eq]': slug,
		'filter[language][_eq]': language,
		limit: '1',
	});

	const records = await fetchDirectusCollection<DirectusInsightRecord>('bw-insights', params);
	return records[0] ?? null;
}
