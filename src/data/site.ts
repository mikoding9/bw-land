export const siteUrl = 'https://bwgeohydromatics.com';
export const siteName = 'Bhumi Warih';
export const organizationName = 'PT. Bhumi Warih Geohydromatics';
export const defaultOgImage = '/figma/blog-hero-image.png';

export function toAbsoluteUrl(path = '/') {
	return new URL(path, siteUrl).toString();
}

export function toMetaDescription(...candidates: Array<string | null | undefined>) {
	for (const candidate of candidates) {
		const normalized = normalizeText(candidate);
		if (normalized) {
			return truncateText(normalized, 160);
		}
	}

	return `${siteName} provides metocean analysis, offshore forecasting, and marine decision support services for coastal and offshore projects.`;
}

export function normalizeText(value: string | null | undefined) {
	if (!value) return '';
	return value.replace(/\s+/g, ' ').trim();
}

export function truncateText(value: string, maxLength: number) {
	if (value.length <= maxLength) {
		return value;
	}

	const truncated = value.slice(0, maxLength - 1);
	const boundary = truncated.lastIndexOf(' ');
	return `${(boundary > 80 ? truncated.slice(0, boundary) : truncated).trim()}…`;
}
