export type BlogPostSummary = {
	slug: string;
	tag: string;
	title: string;
	excerpt: string;
	image: string;
	variant?: string;
	dateLabel: string;
};

export type BlogPostArticle = BlogPostSummary & {
	heroTitle?: string;
	bodyParagraphs: string[];
	reportImage: string;
	reportImageAlt: string;
	callout: {
		beforeLink: string;
		reportHref: string;
		middleText: string;
		serviceHref: string;
	};
	closingParagraph: string;
};

const reportImage = '/figma/blog/article-forecast-samples.png';

export const blogPosts: BlogPostArticle[] = [
	{
		slug: 'metocean-study-extreme-weather-risk',
		tag: 'Products',
		title: 'Get To Know the Metocean Study, Assess Extreme Weather Risk for Your Project',
		heroTitle: 'Get To Know the Metocean Study, Assess Extreme Weather Risk for Your Project',
		excerpt:
			'Metocean is concerned with understanding meteorological and oceanographic conditions at an engineering or renewable energy project site.',
		image: '/figma/blog-card-a.png',
		variant: 'metocean',
		dateLabel: '(AR | 22/11/2022)',
		bodyParagraphs: [
			'Our global marine economy is diverse and expansive. It includes maritime industry sectors such as energy, transportation, fisheries/aquaculture, search and recovery, environmental management, and research purposes. In maritime industry, reliable metocean parameters information is considered a crucial matter because some operational planning is critically dependent on accurate metocean parameters information. Whether it is rig transport, subsea engineering, heavy lift, or other marine operation, a well informed metocean parameter and weather overview will determine the success of the marine operation.',
			'The marine sea state prediction forecast service by BW Geohydromatics gives information on upcoming atmospheric events and changing sea conditions a few days in advance. This enables those who work at sea or near coasts to plan operations, routes, travel schedules, and activities, improve worker safety, mitigate the risk of damage and loss, and increase production efficiency.',
			'The metocean parameters provided in our forecast service are detailed information of wind, wave, tide, and swell conditions for the next few days including cyclone warning and tropical advisory. There are also graphs depicting the magnitude and direction of waves, currents, and wind pressure in the site-specific area or a route area.',
			'Lately, the weather forecast is one of the projects that is on the rise and growing in our company, and the demand has increased and become more varied from previous years. This is due to the increase of maritime activities that require support from accurate weather forecast service. The weather forecast requests are coming from various clients and locations to support their needs in offshore and nearshore marine operations such as the Java Sea, Makassar Strait, Malacca Strait, Madura Strait, and many others. The demand came from various industries to support maintenance operations, subsea operations and deployments, construction activities, marine survey, marine transportation, and more.',
			'Here are examples of the marine sea state prediction services by BW Geohydromatics.',
		],
		reportImage,
		reportImageAlt: 'Sample marine sea state prediction reports',
		callout: {
			beforeLink: 'A sample report of the marine sea state prediction service can be seen ',
			reportHref:
				'https://bwgeohydromatics.com/wp-content/uploads/2022/11/Forecast_Sample_Noname2.pdf',
			middleText:
				', and you can find more information about our other marine operation decision support system services ',
			serviceHref: 'https://bwgeohydromatics.com/modss/',
		},
		closingParagraph:
			'As we commit to always being ready to serve your needs with the best and most reliable service possible, we want to hear about your experience in the industry, what you struggle with, and what you hope to achieve and overcome.',
	},
	{
		slug: 'smarter-land-decisions-start-here',
		tag: 'Projects',
		title: 'Smarter Land Decisions Start Here: Discover the Power of Land Forecasting',
		excerpt:
			'In dynamic and weather-sensitive sectors such as maritime operations, energy production, and resource exploration, atmospheric conditions are far more than a backdrop.',
		image: '/figma/blog-card-b.png',
		variant: 'land',
		dateLabel: '(BW | 17/01/2024)',
		bodyParagraphs: [
			'Land forecasting brings multiple data sources into a single operational view. By combining weather, terrain, infrastructure, and environmental context, project teams gain a clearer basis for planning site activity and reducing uncertainty.',
			'For field-intensive work, the value is not only in seeing tomorrow’s forecast but in understanding how conditions affect access, equipment deployment, and sequencing. A land forecast becomes a decision tool rather than a passive report.',
			'At BW Geohydromatics, this template article demonstrates how a structured long-form page can present context, explain a workflow, and connect the story back to real services. The content is dummy content, but the page layout matches the Figma composition requested for implementation.',
			'The same page template can support project updates, product explainers, and technical notes without needing a separate design for each category. That keeps the editorial system simple while preserving a consistent reading experience.',
			'Below is a representative sample visual used as a placeholder inside this dummy article template.',
		],
		reportImage,
		reportImageAlt: 'Placeholder report visual for land forecasting article',
		callout: {
			beforeLink:
				'A sample report of the marine sea state prediction service can be seen ',
			reportHref:
				'https://bwgeohydromatics.com/wp-content/uploads/2022/11/Forecast_Sample_Noname2.pdf',
			middleText:
				', and you can find more information about our other marine operation decision support system services ',
			serviceHref: 'https://bwgeohydromatics.com/modss/',
		},
		closingParagraph:
			'This route is intentionally backed by dummy content so the team can validate structure, spacing, and responsive behavior before wiring the page into a CMS or API.',
	},
	{
		slug: 'disaster-resilience-early-warning-systems',
		tag: 'Projects',
		title: 'Navigating Disaster Resilience: Flood and Tsunami Early Warning Systems with Machine Learning',
		excerpt:
			'PT Bhumi Warih Geohydromatics supported the development of an Early Warning System platform for floods and tsunamis in the Palu region.',
		image: '/figma/blog-card-c.png',
		variant: 'warning',
		dateLabel: '(BW | 09/05/2024)',
		bodyParagraphs: [
			'Early warning systems depend on speed, clarity, and trust in the underlying data. A blog template for this kind of story needs room for the operational context as well as the technical explanation behind the solution.',
			'This dummy article uses the same Figma-derived layout as the metocean example, making it possible to test how longer headings, dense body text, and supporting media behave within the design.',
			'Machine learning only adds value when it is grounded in domain knowledge and supported by monitoring workflows that users can actually act on. The same principle applies to design implementation: the template should be visually faithful, but also practical to maintain.',
			'Because the page is generated from structured local data, the route can scale to additional slugs without duplicating layout code. That is the main implementation goal of this task.',
			'The media block below remains a shared placeholder until final project-specific assets are provided.',
		],
		reportImage,
		reportImageAlt: 'Placeholder report visual for early warning systems article',
		callout: {
			beforeLink:
				'A sample report of the marine sea state prediction service can be seen ',
			reportHref:
				'https://bwgeohydromatics.com/wp-content/uploads/2022/11/Forecast_Sample_Noname2.pdf',
			middleText:
				', and you can find more information about our other marine operation decision support system services ',
			serviceHref: 'https://bwgeohydromatics.com/modss/',
		},
		closingParagraph:
			'With the route and template in place, swapping dummy article blocks for real editorial content becomes a data task rather than another page build.',
	},
	{
		slug: 'unlocking-indonesia-solar-potential',
		tag: 'Science and Technology',
		title: 'The Future is Bright: Unlocking Indonesia’s Solar Potential',
		excerpt:
			'Recent studies highlight the enormous renewable energy potential that Indonesia can harness through geospatial analysis and financial modelling.',
		image: '/figma/blog-card-a.png',
		variant: 'solar',
		dateLabel: '(BW | 11/07/2024)',
		bodyParagraphs: [
			'Renewable energy articles often need a balance between accessible storytelling and technical framing. This template gives enough vertical rhythm for that mix without introducing a separate visual system.',
			'Geospatial analysis, financial modelling, and climate datasets can all contribute to a stronger view of project viability. When presented clearly, the page can carry both strategic positioning and operational insight.',
			'For this implementation, the article body is placeholder content. The important part is that typography, spacing, and section ordering follow the Figma source so the route can serve as a reliable template for future posts.',
			'Using a shared route also reduces the amount of duplicated Astro markup across the repository. New posts can be added by extending the data file with a slug, summary information, and body content.',
			'The report image below remains a neutral placeholder until a dedicated solar-related asset is available.',
		],
		reportImage,
		reportImageAlt: 'Placeholder report visual for solar potential article',
		callout: {
			beforeLink:
				'A sample report of the marine sea state prediction service can be seen ',
			reportHref:
				'https://bwgeohydromatics.com/wp-content/uploads/2022/11/Forecast_Sample_Noname2.pdf',
			middleText:
				', and you can find more information about our other marine operation decision support system services ',
			serviceHref: 'https://bwgeohydromatics.com/modss/',
		},
		closingParagraph:
			'This makes the `/insight/{slug}` route useful immediately while leaving clear room for real article content to replace the dummy copy later.',
	},
];

export const blogPostSummaries: BlogPostSummary[] = blogPosts.map(
	({ slug, tag, title, excerpt, image, variant, dateLabel }) => ({
		slug,
		tag,
		title,
		excerpt,
		image,
		variant,
		dateLabel,
	})
);

export function getBlogPostBySlug(slug: string) {
	return blogPosts.find((post) => post.slug === slug);
}
