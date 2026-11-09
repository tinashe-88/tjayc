import type { Route } from './+types/home';
import { seo, siteOriginFrom } from '@/lib/seo';
import HomePage from '@/components/HomePage';
import { mapYoutubeRecord, orderYoutubeCards, type YoutubeCard } from '@/lib/youtube-videos';

const pocketbaseOrigin = () => process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';

async function loadYoutubeCards(): Promise<YoutubeCard[]> {
	try {
		const response = await fetch(
			`${pocketbaseOrigin()}/api/collections/youtube_videos/records?perPage=50&sort=created`,
			{ signal: AbortSignal.timeout(4000) },
		);
		if (!response.ok) return [];
		const body = await response.json() as { items?: Parameters<typeof mapYoutubeRecord>[0][] };
		return orderYoutubeCards((body.items ?? []).map(mapYoutubeRecord));
	} catch {
		return [];
	}
}

export async function loader() {
	return { videos: await loadYoutubeCards() };
}

export function meta({ matches, location }: Route.MetaArgs) {
	const origin = siteOriginFrom(matches);
	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'TJayC',
			url: `${origin}/`,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'MusicGroup',
			name: 'TJayC',
			genre: ['Alternative R&B', 'Hip-Hop', 'Electronic'],
			url: `${origin}/`,
		},
	];

	return seo({ matches, location }, {
		title: 'TJayC — Sound Engineer, Sound Designer & Music Maker',
		description:
			'TJayC is a sound engineer, sound designer and music maker moving between Harare and Johannesburg. Listen to The Preset Tapes and watch the latest releases.',
		image: '/og-image.png',
		jsonLd,
	});
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <HomePage initialVideos={loaderData.videos} />;
}
