import { readdir, readFile } from 'node:fs/promises';
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
const pageContentDir = path.resolve('src/data/page-content');
const collectionName = 'bw-pages';
const collectionCache = new Set();
const fieldCache = new Map();

const pageFields = [
	{
		field: 'page_key',
		type: 'string',
		meta: {
			note: 'Stable page identifier, for example home or about',
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
		field: 'schema_version',
		type: 'integer',
		meta: {
			note: 'Content schema version',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'route',
		type: 'string',
		meta: {
			note: 'Frontend route for this page record',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'navigation_key',
		type: 'string',
		meta: {
			note: 'Navigation key used by the site shell',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'seo_title',
		type: 'string',
		meta: {
			note: 'Primary SEO title',
			width: 'full',
			interface: 'input',
		},
	},
	{
		field: 'hero_eyebrow',
		type: 'string',
		meta: {
			note: 'Hero eyebrow label',
			width: 'half',
			interface: 'input',
		},
	},
	{
		field: 'hero_title',
		type: 'string',
		meta: {
			note: 'Hero title',
			width: 'full',
			interface: 'input',
		},
	},
	{
		field: 'hero_meta',
		type: 'text',
		meta: {
			note: 'Hero supporting copy or meta text',
			width: 'full',
			interface: 'input-multiline',
		},
	},
	{
		field: 'hero_assets',
		type: 'json',
		meta: {
			note: 'Hero asset references and related media metadata',
			width: 'full',
			interface: 'input-code',
			options: {
				language: 'json'
			}
		},
	},
	{
		field: 'sections',
		type: 'json',
		meta: {
			note: 'Structured page sections payload',
			width: 'full',
			interface: 'input-code',
			options: {
				language: 'json'
			}
		},
	},
];

function isTargetPage(parsed) {
	return (
		parsed.page === 'home' ||
		parsed.page === 'industry' ||
		parsed.page === 'insight' ||
		parsed.page === 'about' ||
		parsed.page === 'glossary' ||
		parsed.page === 'legal-and-privacy' ||
		parsed.page.startsWith('service-')
	);
}

function toCollectionMeta() {
	return {
		collection: collectionName,
		meta: {
			icon: 'article',
			note: 'Localized page content records for the BW website',
			hidden: false,
			singleton: false,
			accountability: 'all',
		},
		schema: {
			name: collectionName,
		},
	};
}

function toSeedPayload(pageData) {
	return {
		page_key: pageData.page,
		language: 'en',
		schema_version: pageData.schema_version ?? 1,
		route: pageData.route ?? null,
		navigation_key: pageData.navigation_key ?? null,
		seo_title: pageData.seo?.title ?? null,
		hero_eyebrow: pageData.hero?.eyebrow ?? null,
		hero_title: pageData.hero?.title ?? null,
		hero_meta: pageData.hero?.meta ?? null,
		hero_assets: pageData.hero?.assets ?? null,
		sections: pageData.sections ?? [],
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

async function loadTargetCollections() {
	if (collectionCache.size === 0) {
		await refreshCollections();
	}

	return [...collectionCache].filter((name) => name.startsWith('bw-'));
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

async function resetCollections() {
	const targets = await loadTargetCollections();

	for (const name of targets) {
		await deleteCollection(name);
	}
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
	for (const field of pageFields) {
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

async function getExistingPageItem(pageKey, language) {
	const params = new URLSearchParams({
		'filter[page_key][_eq]': pageKey,
		'filter[language][_eq]': language,
		limit: '1',
	});

	const payload = await directusFetch(`/items/${collectionName}?${params.toString()}`);
	return payload?.data?.[0] ?? null;
}

async function upsertPageItem(pageData) {
	const seed = toSeedPayload(pageData);

	if (DRY_RUN) {
		console.log(`[dry-run] upsert item ${seed.page_key}:${seed.language}`);
		return;
	}

	const existing = await getExistingPageItem(seed.page_key, seed.language);

	if (existing?.id) {
		await directusFetch(`/items/${collectionName}/${existing.id}`, {
			method: 'PATCH',
			body: JSON.stringify(seed),
		});
		console.log(`Updated item: ${seed.page_key}:${seed.language}`);
		return;
	}

	await directusFetch(`/items/${collectionName}`, {
		method: 'POST',
		body: JSON.stringify(seed),
	});
	console.log(`Created item: ${seed.page_key}:${seed.language}`);
}

async function loadPageContent() {
	const files = await readdir(pageContentDir);
	const jsonFiles = files.filter((file) => file.endsWith('.json')).sort();
	const pages = [];

	for (const file of jsonFiles) {
		const fullPath = path.join(pageContentDir, file);
		const raw = await readFile(fullPath, 'utf8');
		const parsed = JSON.parse(raw);

		if (isTargetPage(parsed)) {
			pages.push(parsed);
		}
	}

	return pages;
}

async function main() {
	const pages = await loadPageContent();

	if (RESET) {
		console.log('==> reset existing bw-* collections');
		await resetCollections();
	}

	console.log(`\n==> ${collectionName}`);
	await ensureCollection();
	await ensureFields();

	for (const pageData of pages) {
		await upsertPageItem(pageData);
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
