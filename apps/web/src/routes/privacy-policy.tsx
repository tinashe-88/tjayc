import type { Route } from './+types/privacy-policy';
import { seo } from '@/lib/seo';
import PrivacyPolicyPage from '@/components/PrivacyPolicyPage';

export function meta({ matches, location }: Route.MetaArgs) {
	return seo({ matches, location }, {
		title: 'TJayC — Privacy Policy',
		description:
			'TJayC privacy policy: how visitor-submitted email addresses are collected, used, and protected on tjayc.com, and the choices you have.',
	});
}

export default function PrivacyPolicy() {
	return <PrivacyPolicyPage />;
}
