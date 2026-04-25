export type ServiceTone = 'light-blue' | 'mist' | 'white';

export type ServiceItem = {
	slug: 'metocean-design-criteria' | 'metocean-dss' | 'extended-services';
	title: string;
	description: string;
	icon: string;
	image: string;
	tone: ServiceTone;
};

const iconDroplet = '/figma/icon-droplet.svg';
const iconEarth = '/figma/icon-earth.svg';
const iconPeople = '/figma/icon-people.svg';

const serviceOrbitImage = '/figma/service-metocean-card.png';
const serviceMapImage = '/figma/service-dss-card.png';
const serviceWaveImage = '/figma/service-extended-card.png';

export const services: ServiceItem[] = [
	{
		slug: 'metocean-design-criteria',
		title: 'MetOcean Design Criteria',
		description: 'Extreme Value Analysis. Numerical Simulation. Ocean, Climate and Weather Analysis',
		icon: iconEarth,
		image: serviceOrbitImage,
		tone: 'light-blue',
	},
	{
		slug: 'metocean-dss',
		title: 'MetOcean DSS',
		description: 'Marine Sea State Prediction. Weather Forecast. Tow Route Forecast. Weather Window.',
		icon: iconDroplet,
		image: serviceMapImage,
		tone: 'mist',
	},
	{
		slug: 'extended-services',
		title: 'Extended Services',
		description: 'Our team can provide customized services tailored for your specific needs in maritime industry.',
		icon: iconPeople,
		image: serviceWaveImage,
		tone: 'white',
	},
];
