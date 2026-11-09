import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('sitemap.xml', 'routes/sitemap.xml.ts'),
	route('robots.txt', 'routes/robots.txt.ts'),
	route('epk', 'routes/epk.tsx'),
	route('privacy-policy', 'routes/privacy-policy.tsx'),
	route('hcgi/platform/*', 'routes/hcgi.platform.$.ts'),
	route('api/health', 'routes/api.health.ts'),
	route('api/*', 'routes/api.$.ts'),
] satisfies RouteConfig;
