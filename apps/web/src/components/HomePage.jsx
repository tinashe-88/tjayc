import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router';
import pb from '@/lib/pocketbase-client';
import Subscribe from '@/components/Subscribe';
import { openCookiePreferences } from '@/lib/cookie-consent';
import {
    Instagram,
    Facebook,
    Mail,
    MapPin,
    Play,
    Pause,
    Sliders,
    Waves,
    Plane,
    Trophy,
    ArrowUpRight,
    ChevronDown,
    Link2,
    Menu,
    X,
} from 'lucide-react';
import { SiTiktok, SiSpotify, SiApplemusic, SiSoundcloud, SiYoutubemusic } from 'react-icons/si';
import { extractYouTubeId, mapYoutubeRecord, orderYoutubeCards } from '@/lib/youtube-videos';

const IMG = {
    portrait: '/hero-mark.png',
    console: 'https://images.hostinger.com/79afce60-babe-46ea-8637-a106e7292787.png',
    sculpture: 'https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/167acdd46b1ef4b705583b67466853f8.jpg',
    gear: 'https://images.hostinger.com/eaf3ffaa-0af7-4368-a663-814891a604a6.png',
};

const PRIMARY = '#333232';
const SECONDARY = '#fefcfe';
const TERTIARY = '#ec8e36';



const namedTracks = [
    { title: 'Halftime', tag: 'Available Now' },
    { title: 'Squeeze', tag: 'Available Now' },
    { title: 'Touches', tag: 'Available Now' },
    { title: 'ITWYW', tag: 'Available Now' },
    { title: 'Plotting', tag: 'Available Now' },
    { title: 'Pocket', tag: 'Available Now' },
    { title: 'Colours', tag: 'Available Now' },
    { title: 'DULF' },
];

const TOTAL_TAPES = 8;

// Fallback used before the PocketBase tracks load (or if the request fails).
// Audio previews live in PocketBase file storage now, so the fallback ships
// without any preview until the records are fetched.
const fallbackTracks = Array.from({ length: TOTAL_TAPES }, (_, i) => {
    const named = namedTracks[i];
    return {
        id: `fallback-${i}`,
        n: String(i + 1).padStart(2, '0'),
        title: named ? named.title : 'Untitled',
        tag: named?.tag || 'Coming Soon',
        preview: '',
        smartlink: '',
        links: {},
    };
});

// The canonical Tapes section track list — the titles and order shown on the
// site. Uploaded PocketBase tracks are matched onto this list so the display
// always reflects the Tapes section, regardless of how the records were titled.
const canonicalTracks = namedTracks.map((t, i) => ({ n: i + 1, title: t.title, tag: t.tag }));

const normalizeTitle = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// Map a PocketBase track record into the shape the UI expects. The audio
// preview is served from PocketBase file storage via pb.files.getURL().
const mapTrackRecord = (record) => {
    const hasFile = Boolean(record.preview);
    return {
        id: record.id,
        n: String(record.n ?? 0).padStart(2, '0'),
        title: record.title || 'Untitled',
        tag: record.tag || 'Coming Soon',
        preview: hasFile ? pb.files.getURL(record, record.preview) : '',
        smartlink: record.smartlink || '',
        links: record.links || {},
    };
};

const fetchTracks = async () => {
    const records = await pb.collection('tracks').getFullList({
        sort: 'n',
        requestKey: null,
    });
    const mapped = records.map(mapTrackRecord);

    // Index uploaded tracks by normalized title and by order number so each
    // one can be matched onto the canonical Tapes section list.
    const byTitle = {};
    const byN = {};
    mapped.forEach((rec, idx) => {
        byTitle[normalizeTitle(rec.title)] = rec;
        const nKey = rec.n || String(idx + 1).padStart(2, '0');
        byN[nKey] = rec;
    });

    return canonicalTracks.map((c, i) => {
        const canonicalN = String(c.n).padStart(2, '0');
        const numbered = byN[canonicalN] || byN[String(i + 1).padStart(2, '0')];
        // Do not attach another named track's audio or link to this row.
        const belongsToAnotherTrack = numbered && canonicalTracks.some(
            (track) => normalizeTitle(track.title) === normalizeTitle(numbered.title) && normalizeTitle(track.title) !== normalizeTitle(c.title),
        );
        const matched = byTitle[normalizeTitle(c.title)] || (belongsToAnotherTrack ? undefined : numbered);
        return {
            id: matched?.id || `canonical-${c.n}`,
            n: canonicalN,
            title: c.title,
            tag: c.tag || matched?.tag,
            preview: matched?.preview || '',
            smartlink: matched?.smartlink || '',
            links: matched?.links || {},
        };
    });
};

const isLiveLink = (href) => Boolean(href) && href !== '#';

// Keep the first paint visible. A hidden initial state stays invisible
// when in-view animations do not run, which blanked tapes, craft, and EPK.
const fadeUp = {
    hidden: { opacity: 1, y: 0 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: Math.min(Number(i) || 0, 8) * 0.04, ease: [0.22, 1, 0.36, 1] },
    }),
};

function Marquee() {
    const words = ['THE PRESET TAPES', 'SOUND DESIGN', 'MIX / MASTER', 'HARARE', 'JOZI'];
    const strip = [...words, ...words];
    return (
        <div className="relative overflow-hidden border-y border-white/10 py-4" style={{ backgroundColor: PRIMARY }}>
            <div className="animate-marquee flex whitespace-nowrap">
                {strip.map((w, i) => (
                    <span
                        key={i}
                        className="font-display mx-6 text-2xl uppercase tracking-wide text-white/25 md:text-4xl"
                    >
                        {w}
                        <span className="mx-6" style={{ color: TERTIARY }}>&bull;</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

function Header() {
    const [open, setOpen] = useState(false);
    const navLinks = [
        { href: '#tapes', label: 'Tapes' },
        { href: '#craft', label: 'Craft' },
        { href: '#about', label: 'About' },
        { href: '#youtube', label: 'YouTube' },
        { href: '#contact', label: 'Contact' },
    ];
    return (
        <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
            <div className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-5 md:px-10">
                <a href="#top" className="font-display text-xl uppercase tracking-widest" style={{ color: SECONDARY }}>
                    TJayC
                </a>
                <nav className="hidden gap-8 text-xs uppercase tracking-[0.2em] md:flex" style={{ color: SECONDARY }}>
                    {navLinks.map((l) => (
                        <a key={l.href} href={l.href} className="transition-colors" style={{ color: SECONDARY }}>{l.label}</a>
                    ))}
                </nav>
                <div className="hidden md:block">
                    <Subscribe />
                </div>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-10 w-10 items-center justify-center md:hidden"
                    style={{ color: SECONDARY }}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                >
                    {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden md:hidden"
                        style={{ backgroundColor: PRIMARY }}
                    >
                        <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
                            {navLinks.map((l) => (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    className="font-display py-2 text-2xl uppercase"
                                    style={{ color: SECONDARY }}
                                >
                                    {l.label}
                                </a>
                            ))}
                            <div className="mt-4">
                                <Subscribe onDone={() => setOpen(false)} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
    const imgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

    return (
        <section id="top" ref={ref} className="relative min-h-[100dvh] overflow-hidden">
            <motion.div style={{ y: imgY }} className="absolute inset-0">
                <div className="absolute inset-0" style={{ backgroundColor: PRIMARY }} />
                <img
                    src={IMG.portrait}
                    alt="TJayC wordmark"
                    className="absolute inset-0 h-full w-full object-contain object-center opacity-90"
                />
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to bottom, ${PRIMARY}66, ${PRIMARY}33, ${PRIMARY})`
                }} />
            </motion.div>

            <motion.div style={{ y }} className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
                <p
                    className="mb-4 text-xs uppercase tracking-[0.3em]"
                    style={{ color: SECONDARY }}
                >
                    Sound Engineer &bull; Sound Designer &bull; Music Maker
                </p>

                <h1 className="font-display leading-[0.82]" style={{ color: SECONDARY }}>
                    <span className="block text-[16vw] uppercase md:text-[13vw]" style={{ color: SECONDARY }}>
                        TJAYC
                    </span>
                </h1>

                <div
                    className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
                    style={{ color: SECONDARY }}
                >
                    <span className="flex items-center gap-2">
                        <MapPin size={15} style={{ color: TERTIARY }} strokeWidth={2} />
                        Harare, Zimbabwe
                    </span>
                    <span className="hidden h-4 w-px sm:block" style={{ backgroundColor: SECONDARY, opacity: 0.2 }} />
                    <span>Raised in Johannesburg, South Africa</span>
                </div>
            </motion.div>
        </section>
    );
}

function SmartLink({ track }) {
    const href = track.smartlink;
    const live = isLiveLink(href);

    // No link configured yet: a clear, non-interactive placeholder state.
    if (!live) {
        return (
            <span
                title="Full track link coming soon"
                className="inline-flex cursor-not-allowed select-none items-center gap-3 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em]"
                style={{ border: `1px solid ${SECONDARY}`, color: SECONDARY, opacity: 0.45 }}
            >
                <Link2 size={16} style={{ color: SECONDARY }} strokeWidth={2} />
                Full link coming soon
            </span>
        );
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title="Listen to the full track"
            className="group/smartlink inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.03]"
            style={{ border: `1px solid ${SECONDARY}`, color: SECONDARY }}
        >
            <Link2 size={16} style={{ color: TERTIARY }} strokeWidth={2} />
            Full Track
            <ArrowUpRight size={14} className="transition-transform group-hover/smartlink:translate-x-0.5 group-hover/smartlink:-translate-y-0.5" style={{ color: TERTIARY }} />
        </a>
    );
}

// Platform destinations stored in each track record's `links` JSON field.
// Keys match the live data shape; only platforms with a real URL render.
const PLATFORMS = [
    { key: 'spotify', label: 'Spotify', Icon: SiSpotify, color: '#1DB954' },
    { key: 'appleMusic', label: 'Apple Music', Icon: SiApplemusic, color: '#FA57C1' },
    { key: 'youtubeMusic', label: 'YouTube Music', Icon: SiYoutubemusic, color: '#FF0000' },
    { key: 'soundcloud', label: 'SoundCloud', Icon: SiSoundcloud, color: '#FF5500' },
    { key: 'tiktok', label: 'TikTok', Icon: SiTiktok, color: '#fefcfe' },
];

// Renders the full-track access for a track. A track with a distributor
// smart-link keeps its single "Full Track" button. A track without one
// (e.g. Halftime) shows the individual platform links from its `links`
// field instead, so listeners can pick a platform. Tracks with neither
// fall back to the "coming soon" placeholder.
function FullTrackLinks({ track }) {
    const smartLive = isLiveLink(track.smartlink);

    if (smartLive) {
        return <SmartLink track={track} />;
    }

    const rawLinks =
        track.links && typeof track.links === 'object' ? track.links : {};
    const platformLinks = PLATFORMS.map((p) => ({
        ...p,
        url: rawLinks[p.key],
    })).filter((p) => isLiveLink(p.url));

    if (platformLinks.length === 0) {
        return <SmartLink track={track} />;
    }

    return (
        <div className="flex flex-col gap-3">
            <span
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: SECONDARY, opacity: 0.4 }}
            >
                Listen on
            </span>
            <div className="flex flex-wrap gap-3">
                {platformLinks.map((p) => {
                    const Icon = p.Icon;
                    return (
                        <a
                            key={p.key}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Listen to ${track.title} on ${p.label}`}
                            className="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.03]"
                            style={{ border: `1px solid ${SECONDARY}`, color: SECONDARY }}
                        >
                            <Icon size={15} style={{ color: p.color }} />
                            {p.label}
                            <ArrowUpRight
                                size={12}
                                className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                style={{ color: SECONDARY }}
                            />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

function Tapes() {
    const audioRef = useRef(null);
    const [tracks, setTracks] = useState(fallbackTracks);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [justFinished, setJustFinished] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const [playError, setPlayError] = useState('');
    const activeIndexRef = useRef(null);
    const tracksRef = useRef(tracks);

    useEffect(() => { tracksRef.current = tracks; }, [tracks]);

    useEffect(() => {
        let cancelled = false;
        fetchTracks()
            .then((loaded) => {
                if (cancelled) return;
                if (loaded.length > 0) setTracks(loaded);
            })
            .catch(() => { if (!cancelled) setLoadError(true); });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTime = () => {
            if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };
        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            const current = activeIndexRef.current;
            if (current === null) return;
            const track = tracksRef.current[current];
            if (!track) return;
            if (isLiveLink(track.smartlink)) {
                window.open(track.smartlink, '_blank', 'noopener,noreferrer');
            }
            setExpandedIndex(current);
            setJustFinished(current);
        };

        const onError = () => {
            setIsPlaying(false);
            setPlayError('This preview could not be played. Please try again.');
        };
        audio.addEventListener('timeupdate', onTime);
        audio.addEventListener('ended', onEnded);
        audio.addEventListener('error', onError);
        return () => {
            audio.removeEventListener('timeupdate', onTime);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
        };
    }, []);

    const handleTogglePlay = (i) => {
        const audio = audioRef.current;
        const track = tracks[i];
        if (!track.preview) return;

        if (activeIndex === i && isPlaying) {
            audio.pause();
            setIsPlaying(false);
            return;
        }

        setPlayError('');
        if (activeIndex !== i) {
            audio.src = track.preview;
            activeIndexRef.current = i;
            setActiveIndex(i);
            setProgress(0);
            setJustFinished(null);
        }
        audio.play().then(() => setIsPlaying(true)).catch(() => {
            setIsPlaying(false);
            setPlayError('This preview could not be played. Please try again.');
        });
    };

    return (
        <section id="tapes" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <audio ref={audioRef} preload="none" />
            <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                        Now Releasing
                    </span>
                    <h2 className="font-display mt-3 text-[13vw] uppercase leading-[0.85] md:text-[8vw]" style={{ color: SECONDARY }}>
                        The Preset<br />
                        <span className="text-stroke">Tapes</span>
                    </h2>
                </div>
                <p className="max-w-xs text-sm leading-relaxed" style={{ color: SECONDARY }}>
                    Hit play for a preview, then use the full track link to keep listening.
                </p>
            </div>

            {loadError && <p role="status" className="mb-5 text-sm text-white/70">Track details couldn’t be loaded. Please refresh to try again.</p>}
            {playError && <p role="alert" className="mb-5 text-sm text-white/70">{playError}</p>}
            <div style={{ borderTop: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1 }}>
                {tracks.map((t, i) => {
                    const isActive = activeIndex === i;
                    const isExpanded = expandedIndex === i;
                    const hasPreview = Boolean(t.preview);
                    return (
                        <motion.div
                            key={t.n}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-60px' }}
                            custom={i % 8}
                            style={{
                                borderBottom: `1px solid ${SECONDARY}`,
                                borderBottomOpacity: 0.1
                            }}
                        >
                            <div
                                className="group flex cursor-pointer items-center gap-4 py-5 transition-colors md:gap-8 md:py-7"
                                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                            >
                                <span className="font-display w-10 text-lg md:w-16 md:text-2xl" style={{ color: SECONDARY, opacity: isActive ? 0.9 : 0.3 }}>{t.n}</span>
                                <div className="flex flex-1 flex-col gap-2">
                                    <div className="flex items-baseline justify-between gap-4">
                                        <h3
                                            className="font-display text-3xl uppercase transition-transform duration-300 group-hover:translate-x-2 md:text-5xl"
                                            style={{ color: isActive ? TERTIARY : SECONDARY }}
                                        >
                                            {t.title}
                                        </h3>
                                        <span className="hidden text-xs uppercase tracking-[0.2em] sm:block" style={{ color: SECONDARY, opacity: 0.4 }}>
                                            {t.tag}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <div className="h-[3px] w-full overflow-hidden rounded-full" style={{ backgroundColor: SECONDARY, opacity: 0.15 }}>
                                            <div
                                                className="h-full rounded-full transition-[width] duration-150 ease-linear"
                                                style={{ width: `${progress}%`, backgroundColor: TERTIARY }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedIndex(isExpanded ? null : i);
                                    }}
                                    aria-label={`${isExpanded ? 'Hide' : 'Show'} full track link for ${t.title}`}
                                    aria-expanded={isExpanded}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                                    style={{ color: SECONDARY, opacity: 0.4 }}
                                >
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTogglePlay(i);
                                    }}
                                    disabled={!hasPreview}
                                    title={hasPreview ? 'Play preview' : 'Preview coming soon'}
                                    aria-label={hasPreview ? `${isActive && isPlaying ? 'Pause' : 'Play'} ${t.title} preview` : `${t.title} preview coming soon`}
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 md:h-12 md:w-12 ${hasPreview ? 'group-hover:scale-110' : 'cursor-not-allowed opacity-30'}`}
                                    style={{
                                        border: `1px solid ${SECONDARY}`,
                                        borderOpacity: isActive ? 0.5 : 0.15,
                                        backgroundColor: isActive ? TERTIARY : 'transparent',
                                    }}
                                >
                                    {isActive && isPlaying ? (
                                        <Pause size={16} style={{ color: PRIMARY }} fill={PRIMARY} />
                                    ) : (
                                        <Play size={16} className="translate-x-px transition-colors group-hover:text-[#ec8e36]" style={{ color: isActive ? PRIMARY : SECONDARY }} fill={isActive ? PRIMARY : SECONDARY} />
                                    )}
                                </button>
                            </div>

                            {/* Expanded details: plain conditional render with a pure-CSS
                                entrance. No JS-measured height animation — the content is
                                in the DOM and visible whenever isExpanded is true. */}
                            {isExpanded && (
                                <div key={`links-${t.n}`} className="animate-panel-in">
                                    <div className="flex flex-col gap-3 pb-6 pl-14 md:pl-24">
                                        {justFinished === i && (
                                            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: TERTIARY }}>
                                                Preview finished &mdash; full track this way
                                            </span>
                                        )}
                                        <FullTrackLinks track={t} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

const crafts = [
    {
        icon: Sliders,
        title: 'Sound Engineering',
        body: 'I record, mix and master with a unique and palitable ear. Whther it is clean lows, honest highs, I create records that hit on every system.',
        img: IMG.console,
    },
    {
        icon: Waves,
        title: 'Sound Design',
        body: 'I can build textures, patches and sonic worlds from scratch.',
        img: IMG.gear,
    },
];

function Craft() {
    return (
        <section id="craft" style={{ borderTop: `1px solid ${SECONDARY}`, borderBottom: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1, borderBottomOpacity: 0.1, backgroundColor: PRIMARY }}>
            <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
                <h2 className="font-display mb-16 text-[13vw] uppercase leading-[0.85] md:text-[7vw]" style={{ color: SECONDARY }}>
                    Areas of <span style={{ color: TERTIARY }}>Craft</span>
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {crafts.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <motion.article
                                key={c.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-60px' }}
                                custom={i}
                                className="group relative overflow-hidden rounded-2xl"
                                style={{ backgroundColor: '#1a1918', border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}
                            >
                                <div className="relative h-56 overflow-hidden md:h-72">
                                    <img
                                        src={c.img}
                                        alt={c.title}
                                        className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `linear-gradient(to top, #1a1918, transparent)`
                                    }} />
                                    <span
                                        className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full"
                                        style={{ backgroundColor: TERTIARY }}
                                    >
                                        <Icon size={20} style={{ color: PRIMARY }} strokeWidth={2} />
                                    </span>
                                </div>
                                <div className="p-6 md:p-8">
                                    <h3 className="font-display text-3xl uppercase md:text-4xl" style={{ color: SECONDARY }}>{c.title}</h3>
                                    <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: SECONDARY, opacity: 0.5 }}>{c.body}</p>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

const interests = [
    { icon: Trophy, label: 'Sports', href: 'https://www.youtube.com/@tinashesfootballpov' },
    { icon: Plane, label: 'Traveling', href: null },
];

function About() {
    return (
        <section id="about" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <div className="grid gap-14 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                    <motion.div
                        initial={false}
                        className="relative"
                    >
                        <img
                            src="https://horizons-cdn.hostinger.com/4ffce318-6603-4172-a117-1f5d149d18b6/5eed7741e2d23e728bd512c17bcd4d21.jpg"
                            alt="TJayC portrait"
                            className="w-full rounded-2xl"
                            style={{ border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}
                        />
                        <div
                            className="absolute -bottom-5 -right-5 -z-10 h-full w-full rounded-2xl"
                            style={{ backgroundColor: TERTIARY, opacity: 0.9 }}
                        />
                    </motion.div>
                </div>

                <div className="md:col-span-7 md:pl-6">
                    <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                        The Maker
                    </span>
                    <p className="font-display mt-4 text-4xl uppercase leading-[1] md:text-6xl" style={{ color: SECONDARY }}>
                        Let the music<br />do the talking.
                    </p>
                    <p className="mt-6 max-w-lg text-base leading-relaxed" style={{ color: SECONDARY, opacity: 0.5 }}>
                        I move between Harare and Johannesburg, turning
                        rooms and machines into something audible (when it works). I am quiet in person, but loud on the mix bus.
                        <br/><br />Two cities.
                        I come from two ways of hearing the world. Harare gave me the roots — the warmth, the rhythm, the
                        unhurried sense of space and Johannesburg gave the edge — the density, the drive, the
                        hunger to make something that lasts.
                    </p>

                    <div className="mt-12">
                        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: SECONDARY, opacity: 0.4 }}>Off the Clock</span>
                        <div className="mt-5 flex flex-wrap gap-3">
                            {interests.map((it) => {
                                const Icon = it.icon;
                                const badge = (
                                    <span
                                        className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm"
                                        style={{ border: `1px solid ${SECONDARY}`, borderOpacity: 0.15, color: SECONDARY }}
                                    >
                                        <Icon size={16} style={{ color: TERTIARY }} strokeWidth={2} />
                                        {it.label}
                                    </span>
                                );
                                return it.href ? (
                                    <a 
                                        key={it.label} 
                                        href={it.href} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`transition-opacity hover:opacity-70 ${it.label === 'Sports' ? 'animate-pulse-glow' : ''}`}
                                    >
                                        {badge}
                                    </a>
                                ) : (
                                    <span key={it.label}>{badge}</span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const contacts = [
    { icon: Mail, label: 'Email', value: 'hello@tjayc.com', href: 'mailto:hello@tjayc.com' },
    { icon: MapPin, label: 'Based', value: 'Harare, Zimbabwe', href: null },
];

const fetchVideos = async () => {
    const records = await pb.collection('youtube_videos').getFullList({
        sort: 'created',
        requestKey: null,
    });
    return orderYoutubeCards(records.map(mapYoutubeRecord));
};

/** @param {{ initialVideos?: import('@/lib/youtube-videos').YoutubeCard[] }} props */
function YouTube({ initialVideos = [] }) {
    const seeded = initialVideos.length > 0;
    const [videos, setVideos] = useState(initialVideos);
    const [status, setStatus] = useState(seeded ? 'ready' : 'loading');

    useEffect(() => {
        let cancelled = false;
        fetchVideos()
            .then((loaded) => {
                if (cancelled || loaded.length === 0) return;
                setVideos(loaded);
                setStatus('ready');
            })
            .catch(() => { if (!cancelled && !seeded) setStatus('error'); });
        return () => { cancelled = true; };
    }, [seeded]);

    return (
        <section id="youtube" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <h2 className="font-display mb-4 text-5xl uppercase leading-none md:text-7xl lg:text-8xl" style={{ color: SECONDARY }}>
                On <span style={{ color: TERTIARY }}>YouTube</span>
            </h2>
            <p className="mb-12 max-w-xl text-sm uppercase tracking-[0.2em]" style={{ color: SECONDARY, opacity: 0.5 }}>
                Watch the latest from the channel
            </p>
            {status !== 'ready' || videos.length === 0 ? (
                <p role="status" className="text-sm uppercase tracking-[0.2em]" style={{ color: SECONDARY, opacity: 0.6 }}>
                    {status === 'loading' ? 'Loading videos…' : status === 'error' ? 'Videos could not be loaded. Please refresh to try again.' : 'Videos coming soon.'}
                </p>
            ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {videos.map((video) => {
                    // Touches and ITWYW are explicitly activated using the URLs
                    // already stored on their records. Other placeholder cards stay inactive.
                    const PLACEHOLDER_ID = 'dQw4w9WgXcQ';
                    const ytId = extractYouTubeId(video.url);
                    const isLive = isLiveLink(video.url) && (ytId !== PLACEHOLDER_ID || video.title === 'Touches Lyric Video' || video.title === 'I.T.W.Y.W Lyric Video');

                    const card = (
                        <div
                            className={`group relative block overflow-hidden ${isLive ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            style={{ border: `1px solid ${SECONDARY}20` }}
                        >
                            <div className="relative overflow-hidden">
                                {video.thumbnail ? (
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        style={{ aspectRatio: '16/9' }}
                                    />
                                ) : (
                                    <div
                                        className="flex w-full items-center justify-center"
                                        style={{ aspectRatio: '16/9', backgroundColor: '#1a1918' }}
                                    >
                                        <Play size={28} style={{ color: SECONDARY, opacity: 0.3 }} fill={SECONDARY} />
                                    </div>
                                )}
                                {!isLive && (
                                    <div className="pointer-events-none absolute inset-0 bg-gray-500/40" aria-hidden="true" />
                                )}
                                {!isLive && (
                                    <span className="pointer-events-none absolute right-3 top-3 z-10 bg-[#ec8e36] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#333232]">
                                        {video.releaseDate || 'Coming Soon'}
                                    </span>
                                )}
                                {isLive && (
                                    <span className="pointer-events-none absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#ec8e36] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                        <Play size={16} style={{ color: PRIMARY }} fill={PRIMARY} />
                                    </span>
                                )}
                            </div>
                            <div className="p-4" style={{ backgroundColor: `${SECONDARY}08` }}>
                                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: SECONDARY }}>{video.title}</p>
                                {video.description && (
                                    <p className="mt-2 text-xs leading-relaxed normal-case tracking-normal" style={{ color: SECONDARY, opacity: 0.5 }}>
                                        {video.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );

                    return isLive ? (
                        <a
                            key={video.id}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block transition-transform duration-300 hover:-translate-y-1"
                        >
                            {card}
                        </a>
                    ) : (
                        <div key={video.id}>{card}</div>
                    );
                })}
            </div>
            )}
            <div className="mt-10">
                <a
                    href="https://www.youtube.com/@TJayCMusic88VEVO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 border px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors duration-200"
                    style={{ borderColor: TERTIARY, color: TERTIARY }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = TERTIARY; e.currentTarget.style.color = PRIMARY; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = TERTIARY; }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    View all videos
                </a>
            </div>
        </section>
    );
}

function EpkCTA() {
    return (
        <section id="epk-cta" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <div className="flex flex-col items-center gap-8 text-center">
                <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                    Electronic Press Kit
                </span>
                <h2 className="font-display text-[13vw] uppercase leading-[0.85] md:text-[7vw]" style={{ color: SECONDARY }}>
                    Grab the <span className="text-stroke">EPK</span>
                </h2>
                <p className="max-w-md text-sm leading-relaxed" style={{ color: SECONDARY, opacity: 0.5 }}>
                    Bio, release calendar, credits and booking contacts &mdash; everything you need in one place.
                </p>
                <Link
                    to="/epk"
                    className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] transition-all duration-300 hover:scale-[1.03]"
                    style={{ backgroundColor: TERTIARY, color: PRIMARY }}
                >
                    View EPK
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                </Link>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" style={{ borderTop: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1, backgroundColor: PRIMARY }}>
            <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-32">
                <div className="flex flex-col gap-3">
                    <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                        Work With Me
                    </span>
                    <h2 className="font-display text-[15vw] uppercase leading-[0.82] md:text-[11vw]" style={{ color: SECONDARY }}>
                        Let&rsquo;s<br /><span className="text-stroke">make noise</span>
                    </h2>
                </div>

                <div className="mt-16 grid gap-10 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2" style={{ border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}>
                            {contacts.map((c) => {
                                const Icon = c.icon;
                                const inner = (
                                    <div className="flex h-full flex-col gap-3 p-6 transition-colors" style={{ backgroundColor: '#1a1918' }}>
                                        <Icon size={22} style={{ color: TERTIARY }} strokeWidth={1.8} />
                                        <span className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: SECONDARY, opacity: 0.4 }}>{c.label}</span>
                                        <span className="text-sm" style={{ color: SECONDARY }}>{c.value}</span>
                                    </div>
                                );
                                return c.href ? (
                                    <a key={c.label} href={c.href} className="block">{inner}</a>
                                ) : (
                                    <div key={c.label}>{inner}</div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {[
                            { icon: Instagram, label: 'Instagram', handle: 'tjaycmusic', href: 'https://www.instagram.com/tjaycmusic' },
                            { icon: SiTiktok, label: 'TikTok', handle: '@tjaycmusic', href: 'https://www.tiktok.com/@tjaycmusic' },
                            { icon: Facebook, label: 'Facebook', handle: 'TJayC', href: 'https://www.facebook.com/people/TJayC/61591896892586/' },
                        ].map((s) => {
                            const Icon = s.icon;
                            return (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center justify-between rounded-2xl p-6 transition-colors"
                                    style={{ backgroundColor: '#1a1918', border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon size={22} style={{ color: SECONDARY }} strokeWidth={1.8} />
                                        <span>
                                            <span className="block text-sm" style={{ color: SECONDARY }}>{s.label}</span>
                                            <span className="block text-xs" style={{ color: SECONDARY, opacity: 0.4 }}>{s.handle}</span>
                                        </span>
                                    </span>
                                    <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: SECONDARY, opacity: 0.4 }} />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="mx-auto max-w-[90rem] px-5 py-10 md:px-10">
            <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs uppercase tracking-[0.2em] sm:flex-row sm:items-center" style={{ borderTop: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1, color: SECONDARY, opacity: 0.4 }}>
                <span className="font-display text-base tracking-widest" style={{ color: SECONDARY }}>TJayC</span>
                <span>&copy; {new Date().getFullYear()} TJayC</span>
                <div className="flex items-center gap-4">
                    <Link to="/privacy-policy" className="transition-opacity hover:opacity-70">Privacy Policy</Link>
                    <button type="button" onClick={openCookiePreferences} className="transition-opacity hover:opacity-70">Cookie settings</button>
                    <span>Harare &bull; Johannesburg</span>
                </div>
            </div>
        </footer>
    );
}

/** @param {{ initialVideos?: import('@/lib/youtube-videos').YoutubeCard[] }} props */
const HomePage = ({ initialVideos = [] }) => {
    return (
        <div className="relative min-h-screen" style={{ backgroundColor: PRIMARY }}>
            <div className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] grain" />
            <Header />
            <main>
                <Hero />
                <Marquee />
                <Tapes />
                <Craft />
                <About />
                <YouTube initialVideos={initialVideos} />
                <EpkCTA />
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
