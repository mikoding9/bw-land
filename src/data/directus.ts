const directusPanelBaseUrl = 'https://panel.braga.co.id/panel';

export const directusMessagesApiUrl = `${directusPanelBaseUrl}/items/Messages`;
export const directusTeamMembersApiUrl = `${directusPanelBaseUrl}/items/team_member`;
export const directusStaticToken = 'F7WXBm590W2sO3cpb4Cf4I_kcu4alJQ4';

const directusJsonHeaders = {
	Accept: 'application/json',
	Authorization: `Bearer ${directusStaticToken}`,
};

export type DirectusTeamMember = {
	id: number;
	sort: number | null;
	date_updated: string | null;
	role: string | null;
	name: string | null;
	description: string | null;
	linkedin: string | null;
	instagram: string | null;
	photo: string | null;
};

type DirectusItemsResponse<T> = {
	data: T[];
};

export type DirectusPageRecord = {
	id: string | number;
	page_key: string;
	language: string;
	schema_version: number;
	route: string | null;
	navigation_key: string | null;
	seo_title: string | null;
	hero_eyebrow: string | null;
	hero_title: string | null;
	hero_meta: string | null;
	hero_assets: Record<string, unknown> | null;
	sections: Array<Record<string, unknown>>;
};

export function getDirectusAssetUrl(assetId: string) {
	return `${directusPanelBaseUrl}/assets/${assetId}`;
}

export async function fetchDirectusCollection<T>(collection: string, params?: URLSearchParams) {
	const endpoint = new URL(`${directusPanelBaseUrl}/items/${collection}`);

	if (params) {
		endpoint.search = params.toString();
	}

	const response = await fetch(endpoint, {
		headers: directusJsonHeaders,
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch Directus collection "${collection}": ${response.status} ${response.statusText}`);
	}

	const payload = (await response.json()) as DirectusItemsResponse<T>;
	return payload.data;
}

export async function fetchDirectusPage(pageKey: string, language = 'en') {
	const params = new URLSearchParams({
		'filter[page_key][_eq]': pageKey,
		'filter[language][_eq]': language,
		limit: '1',
	});

	const records = await fetchDirectusCollection<DirectusPageRecord>('bw-pages', params);
	return records[0] ?? null;
}
