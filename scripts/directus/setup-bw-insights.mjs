import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const RESET = process.argv.includes('--reset');

if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
	console.error('Missing DIRECTUS_URL or DIRECTUS_TOKEN environment variables.');
	process.exit(1);
}

const baseUrl = DIRECTUS_URL.replace(/\/$/, '');
const seedFilePath = path.resolve('src/data/insights.seed.json');
const collectionName = 'bw-insights';
const collectionCache = new Set();
const fieldCache = new Map();

const insightFields = [
	{
		field: 'slug',
		type: 'string',
		meta: {
			note: 'Stable article slug used in frontend routes',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'language',
		type: 'string',
		meta: {
			note: 'Locale code, for example en or id',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'status',
		type: 'string',
		meta: {
			note: 'Editorial status, for example draft or published',
			width: 'half',
			interface: 'select-dropdown',
			options: {
				choices: [
					{ text: 'Draft', value: 'draft' },
					{ text: 'Published', value: 'published' }
				]
			}
		},
	},
	{
		field: 'category',
		type: 'string',
		meta: {
			note: 'Listing category used on the insight page',
			width: 'half',
			interface: 'select-dropdown',
			options: {
				choices: [
					{ text: 'Products', value: 'Products' },
					{ text: 'Projects', value: 'Projects' },
					{ text: 'Company News', value: 'Company News' },
					{ text: 'Science and Technology', value: 'Science and Technology' }
				]
			}
		},
	},
	{
		field: 'title',
		type: 'string',
		meta: {
			note: 'Article title',
			width: 'full',
			interface: 'input',
		},
	},
	{
		field: 'excerpt',
		type: 'text',
		meta: {
			note: 'Short summary used in cards and previews',
			width: 'full',
			interface: 'input-multiline',
		},
	},
	{
		field: 'thumbnail',
		type: 'string',
		meta: {
			note: 'Card image path or asset identifier',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'featured_image',
		type: 'string',
		meta: {
			note: 'Hero image path or asset identifier',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'listing_variant',
		type: 'string',
		meta: {
			note: 'Visual treatment key for cards',
			width: 'half',
			interface: 'select-dropdown',
			options: {
				choices: [
					{ text: 'Metocean', value: 'metocean' },
					{ text: 'Land', value: 'land' },
					{ text: 'Warning', value: 'warning' },
					{ text: 'Solar', value: 'solar' }
				]
			}
		},
	},
	{
		field: 'highlight_slots',
		type: 'json',
		meta: {
			note: 'Placement keys for the insight listing page',
			width: 'full',
			interface: 'input-code',
			options: {
				language: 'json'
			}
		},
	},
	{
		field: 'highlight_order',
		type: 'integer',
		meta: {
			note: 'Sort priority inside a highlight slot',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'published_at',
		type: 'dateTime',
		meta: {
			note: 'Primary publication timestamp',
			width: 'half',
			interface: 'datetime',
		},
	},
	{
		field: 'date_label',
		type: 'string',
		meta: {
			note: 'Formatted byline label for the article template',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'body_markdown',
		type: 'text',
		meta: {
			note: 'Long-form article body in Markdown',
			width: 'full',
			interface: 'input-multiline',
		},
	},
	{
		field: 'seo_title',
		type: 'string',
		meta: {
			note: 'Optional SEO title override',
			width: 'full',
			interface: 'input',
		},
	},
	{
		field: 'seo_description',
		type: 'text',
		meta: {
			note: 'Optional SEO description override',
			width: 'full',
			interface: 'input-multiline',
		},
	},
];

function toCollectionMeta() {
	return {
		collection: collectionName,
		meta: {
			icon: 'newspaper',
			note: 'Localized insight articles for the BW website',
			hidden: false,
			singleton: false,
			accountability: 'all',
		},
		schema: {
			name: collectionName,
		},
	};
}

function toSeedPayload(item) {
	return {
		slug: item.slug,
		language: item.language ?? 'en',
		status: item.status ?? 'draft',
		category: item.category ?? null,
		title: item.title ?? null,
		excerpt: item.excerpt ?? null,
		thumbnail: item.thumbnail ?? null,
		featured_image: item.featured_image ?? null,
		listing_variant: item.listing_variant ?? null,
		highlight_slots: item.highlight_slots ?? [],
		highlight_order: item.highlight_order ?? null,
		published_at: item.published_at ?? null,
		date_label: item.date_label ?? null,
		body_markdown: item.body_markdown ?? null,
		seo_title: item.seo_title ?? null,
		seo_description: item.seo_description ?? null,
	};
}

async function directusFetch(endpoint, options = {}) {
	const response = await fetch(`${baseUrl}${endpoint}`, {
		...options,
		headers: {
			Authorization: `Bearer ${DIRECTUS_TOKEN}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
	});

	if (response.status === 204) {
		return null;
	}

	const text = await response.text();
	const payload = text ? JSON.parse(text) : null;

	if (!response.ok) {
		const error = new Error(`Directus request failed: ${response.status} ${response.statusText}`);
		error.payload = payload;
		throw error;
	}

	return payload;
}

async function refreshCollections() {
	collectionCache.clear();
	const payload = await directusFetch('/collections');
	for (const item of payload?.data ?? []) {
		if (item.collection) {
			collectionCache.add(item.collection);
		}
	}
	return collectionCache;
}

async function collectionExists(name) {
	if (collectionCache.size === 0) {
		await refreshCollections();
	}
	return collectionCache.has(name);
}

async function loadFields(name) {
	if (fieldCache.has(name)) {
		return fieldCache.get(name);
	}

	const payload = await directusFetch(`/fields/${name}`);
	const fields = new Set((payload?.data ?? []).map((item) => item.field).filter(Boolean));
	fieldCache.set(name, fields);
	return fields;
}

async function fieldExists(name, field) {
	const fields = await loadFields(name);
	return fields.has(field);
}

async function deleteCollection(name) {
	if (!(await collectionExists(name))) {
		return;
	}

	if (DRY_RUN) {
		console.log(`[dry-run] delete collection ${name}`);
		return;
	}

	await directusFetch(`/collections/${encodeURIComponent(name)}`, {
		method: 'DELETE',
	});
	collectionCache.delete(name);
	fieldCache.delete(name);
	console.log(`Deleted collection: ${name}`);
}

async function ensureCollection() {
	const payload = toCollectionMeta();

	if (await collectionExists(collectionName)) {
		console.log(`Collection exists: ${collectionName}`);
		return;
	}

	if (DRY_RUN) {
		console.log(`[dry-run] create collection ${collectionName}`);
		return;
	}

	await directusFetch('/collections', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
	collectionCache.add(collectionName);
	console.log(`Created collection: ${collectionName}`);
}

async function ensureFields() {
	for (const field of insightFields) {
		if (await fieldExists(collectionName, field.field)) {
			console.log(`Field exists: ${collectionName}.${field.field}`);
			continue;
		}

		if (DRY_RUN) {
			console.log(`[dry-run] create field ${collectionName}.${field.field}`);
			continue;
		}

		await directusFetch(`/fields/${collectionName}`, {
			method: 'POST',
			body: JSON.stringify(field),
		});

		const fields = fieldCache.get(collectionName) ?? new Set();
		fields.add(field.field);
		fieldCache.set(collectionName, fields);
		console.log(`Created field: ${collectionName}.${field.field}`);
	}
}

async function getExistingInsightItem(slug, language) {
	const params = new URLSearchParams({
		'filter[slug][_eq]': slug,
		'filter[language][_eq]': language,
		limit: '1',
	});

	const payload = await directusFetch(`/items/${collectionName}?${params.toString()}`);
	return payload?.data?.[0] ?? null;
}

async function upsertInsightItem(item) {
	const seed = toSeedPayload(item);

	if (DRY_RUN) {
		console.log(`[dry-run] upsert item ${seed.slug}:${seed.language}`);
		return;
	}

	const existing = await getExistingInsightItem(seed.slug, seed.language);

	if (existing?.id) {
		await directusFetch(`/items/${collectionName}/${existing.id}`, {
			method: 'PATCH',
			body: JSON.stringify(seed),
		});
		console.log(`Updated item: ${seed.slug}:${seed.language}`);
		return;
	}

	await directusFetch(`/items/${collectionName}`, {
		method: 'POST',
		body: JSON.stringify(seed),
	});
	console.log(`Created item: ${seed.slug}:${seed.language}`);
}

async function loadSeedContent() {
	const raw = await readFile(seedFilePath, 'utf8');
	return JSON.parse(raw);
}

async function main() {
	const seedData = await loadSeedContent();

	if (RESET) {
		console.log(`==> reset ${collectionName}`);
		await deleteCollection(collectionName);
	}

	console.log(`\n==> ${collectionName}`);
	await ensureCollection();
	await ensureFields();

	for (const item of seedData.items ?? []) {
		await upsertInsightItem(item);
	}

	console.log(`\nCompleted ${DRY_RUN ? 'dry run' : 'Directus setup'}.`);
}

main().catch((error) => {
	console.error(error);
	if (error.payload) {
		console.error(JSON.stringify(error.payload, null, 2));
	}
	process.exit(1);
});
