import type { Route } from './+types/epk';
import { seo } from '@/lib/seo';
import EpkPage from '@/components/EpkPage';

export function meta({ matches, location }: Route.MetaArgs) {
	return seo({ matches, location }, {
		title: 'TJayC — Electronic Press Kit',
		description:
			'TJayC Electronic Press Kit: artist bio, 2026 release calendar, lead single Pocket, listen/watch links, interview and booking contact, and release credits.',
	});
}

export default function Epk() {
	return <EpkPage />;
}
