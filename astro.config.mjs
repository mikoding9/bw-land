// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://bwgeohydromatics.com',
	prefetch: {
		prefetchAll: false,
	},
});
