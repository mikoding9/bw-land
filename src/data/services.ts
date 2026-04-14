export type ServiceTone = 'light-blue' | 'mist' | 'white';

export type ServiceItem = {
	slug: 'metocean' | 'dss' | 'extended';
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
		slug: 'metocean',
		title: 'Metocean Design Criteria',
		description: 'Extreme Value Analysis. Numerical Simulation. Ocean, Climate and Weather Analysis',
		icon: iconEarth,
		image: serviceOrbitImage,
		tone: 'light-blue',
	},
	{
		slug: 'dss',
		title: 'Marine Operation Decision Support System (MO-DSS)',
		description: 'Marine Sea State Prediction. Weather Forecast. Tow Route Forecast. Weather Window.',
		icon: iconDroplet,
		image: serviceMapImage,
		tone: 'mist',
	},
	{
		slug: 'extended',
		title: 'Extended Services',
		description: 'Our team can provide customized services tailored for your specific needs in maritime industry.',
		icon: iconPeople,
		image: serviceWaveImage,
		tone: 'white',
	},
];
