export type YoutubeCard = {
	id: string;
	title: string;
	url: string;
	description: string;
	thumbnail: string;
	releaseDate: string;
};

type YoutubeRecord = {
	id?: string;
	title?: string;
	url?: string;
	description?: string;
	thumbnail?: string;
	thumbnail_url?: string;
	release_date?: string;
	collectionId?: string;
};

export const extractYouTubeId = (url: string | undefined | null) => {
	if (!url) return null;
	try {
		const parsed = new URL(url);
		const host = parsed.hostname.replace(/^www\./, '');
		if (host === 'youtu.be') return parsed.pathname.slice(1) || null;
		if (host.endsWith('youtube.com')) {
			const watchId = parsed.searchParams.get('v');
			if (watchId) return watchId;
			const parts = parsed.pathname.split('/').filter(Boolean);
			const marker = parts.findIndex((part) => ['embed', 'shorts', 'v'].includes(part));
			if (marker !== -1 && parts[marker + 1]) return parts[marker + 1];
		}
	} catch {
		return null;
	}
	return null;
};

const normalizeTitle = (value: string | undefined) => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export const mapYoutubeRecord = (record: YoutubeRecord): YoutubeCard => {
	const ytId = extractYouTubeId(record.url);
	const fallbackThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
	const fileThumb = record.thumbnail && record.collectionId && record.id
		? `/hcgi/platform/api/files/${record.collectionId}/${record.id}/${record.thumbnail}`
		: '';
	return {
		id: record.id || record.title || 'video',
		title: record.title || 'Untitled',
		url: record.url || '#',
		description: record.description || '',
		thumbnail: record.thumbnail_url || fileThumb || fallbackThumb,
		releaseDate: record.release_date || '',
	};
};

const isNamedLyricVideo = (video: YoutubeCard, name: string) => {
	const title = normalizeTitle(video.title);
	return title.includes(name) && title.includes('lyricvideo');
};

/** Halftime first, then DULF, matching the channel section order. */
export const orderYoutubeCards = (videos: YoutubeCard[]) => {
	const ordered = [...videos];
	const halftimeIndex = ordered.findIndex((video) => isNamedLyricVideo(video, 'halftime'));
	const dulfIndex = ordered.findIndex((video) => isNamedLyricVideo(video, 'dulf'));
	if (halftimeIndex !== -1 && dulfIndex !== -1 && dulfIndex !== halftimeIndex + 1) {
		const [dulf] = ordered.splice(dulfIndex, 1);
		const updatedHalftimeIndex = ordered.findIndex((video) => isNamedLyricVideo(video, 'halftime'));
		ordered.splice(updatedHalftimeIndex + 1, 0, dulf);
	}
	return ordered;
};
