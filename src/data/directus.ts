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
