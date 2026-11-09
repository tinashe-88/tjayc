import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import {
    Mail,
    MapPin,
    Play,
    ArrowUpRight,
    Calendar,
    Music,
    Youtube,
    Menu,
    X,
} from 'lucide-react';
import Subscribe from '@/components/Subscribe';
import { openCookiePreferences } from '@/lib/cookie-consent';

const PRIMARY = '#333232';
const SECONDARY = '#fefcfe';
const TERTIARY = '#ec8e36';

// Content must be visible in the first paint. Entrance motion used to
// start at opacity 0, which left the whole page blank whenever the
// client animation never ran (refresh, reduced motion, embedded preview).
const fadeUp = {
    hidden: { opacity: 1, y: 0 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: Math.min(Number(i) || 0, 8) * 0.04, ease: [0.22, 1, 0.36, 1] },
    }),
};

const releases = [
    { date: '29 OCT', title: 'Halftime' },
    { date: '30 OCT', title: 'Squeeze' },
    { date: '02 NOV', title: 'Touches' },
    { date: '03 NOV', title: 'Plotting' },
    { date: '04 NOV', title: 'ITWYW' },
    { date: '05 NOV', title: 'Pocket', lead: true },
    { date: '06 NOV', title: 'Colours' },
    { date: '06 NOV', title: 'DULF' },
];

const credits = [
    { role: 'Songwriting, Production, Performance, Mixing & Mastering', name: 'Tinashe James Chiweshe' },
    { role: 'Artwork', name: 'JMPDee' },
    { role: 'Photography', name: 'Assante Chiweshe' },
];

function EpkHeader() {
    const [open, setOpen] = useState(false);
    const navLinks = [
        { to: '/#tapes', label: 'Tapes' },
        { to: '/#craft', label: 'Craft' },
        { to: '/#about', label: 'About' },
        { to: '/#contact', label: 'Contact' },
    ];
    return (
        <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
            <div className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-5 md:px-10">
                <Link to="/" className="font-display text-xl uppercase tracking-widest" style={{ color: SECONDARY }}>
                    TJayC
                </Link>
                <nav className="hidden gap-8 text-xs uppercase tracking-[0.2em] md:flex" style={{ color: SECONDARY }}>
                    {navLinks.map((l) => (
                        <Link key={l.to} to={l.to} style={{ color: SECONDARY }}>{l.label}</Link>
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
                                <Link
                                    key={l.to}
                                    to={l.to}
                                    onClick={() => setOpen(false)}
                                    className="font-display py-2 text-2xl uppercase"
                                    style={{ color: SECONDARY }}
                                >
                                    {l.label}
                                </Link>
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

function EpkHero() {
    return (
        <section id="top" className="relative min-h-[100dvh] overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundColor: PRIMARY }} />
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 20% 20%, #ec8e36 0%, transparent 40%), radial-gradient(circle at 80% 70%, #ec8e36 0%, transparent 45%)',
                }}
            />
            <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
                <p
                    className="mb-4 text-xs uppercase tracking-[0.3em]"
                    style={{ color: TERTIARY }}
                >
                    Electronic Press Kit &bull; 2026
                </p>

                <h1 className="font-display leading-[0.82]" style={{ color: SECONDARY }}>
                    <span className="block text-[16vw] uppercase md:text-[13vw]" style={{ color: SECONDARY }}>
                        TJayC
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
            </div>
        </section>
    );
}

function About() {
    return (
        <section id="about" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                    About
                </span>
                <h2 className="font-display mt-3 text-[10vw] uppercase leading-[0.9] md:text-[5vw]" style={{ color: SECONDARY }}>
                    The Artist
                </h2>
                <div className="mt-8 grid gap-8 md:grid-cols-12">
                    <p className="text-base leading-relaxed md:col-span-7 md:text-lg" style={{ color: SECONDARY, opacity: 0.7 }}>
                        Born in Harare, and raised in Joburg, TJayC creates atmospheric music shaped by
                        alternative R&amp;B, hip-hop and electronic sounds.
                        <br /><br />
                        Layered textures, deep bass, rhythmic percussion and evolving melodies define his
                        approach, with experimental, indie and synth-pop influences expanding the palette.
                    </p>
                    <div className="md:col-span-5 md:pl-6">
                        <div
                            className="rounded-2xl p-6"
                            style={{ backgroundColor: '#1a1918', border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}
                        >
                            <span className="text-xs uppercase tracking-[0.3em]" style={{ color: SECONDARY, opacity: 0.4 }}>
                                Quick Facts
                            </span>
                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt style={{ color: SECONDARY, opacity: 0.5 }}>Origin</dt>
                                    <dd style={{ color: SECONDARY }}>Harare / Johannesburg</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt style={{ color: SECONDARY, opacity: 0.5 }}>Genres</dt>
                                    <dd style={{ color: SECONDARY }}>Alt R&amp;B, Hip-Hop, Electronic</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt style={{ color: SECONDARY, opacity: 0.5 }}>Lead Single</dt>
                                    <dd style={{ color: TERTIARY }}>Pocket</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt style={{ color: SECONDARY, opacity: 0.5 }}>Cycle</dt>
                                    <dd style={{ color: SECONDARY }}>October &ndash; November 2026</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

function ReleaseCalendar() {
    return (
        <section
            id="calendar"
            style={{
                borderTop: `1px solid ${SECONDARY}`,
                borderBottom: `1px solid ${SECONDARY}`,
                borderTopOpacity: 0.1,
                borderBottomOpacity: 0.1,
                backgroundColor: PRIMARY,
            }}
        >
            <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                    <span className="flex items-center gap-2 text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                        <Calendar size={14} strokeWidth={2} />
                        Release Calendar 2026
                    </span>
                    <h2 className="font-display mt-3 text-[10vw] uppercase leading-[0.85] md:text-[6vw]" style={{ color: SECONDARY }}>
                        The Drop<br />
                        <span className="text-stroke">Schedule</span>
                    </h2>
                </motion.div>

                <div className="mt-14" style={{ borderTop: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1 }}>
                    {releases.map((r, i) => (
                        <motion.div
                            key={r.title}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-60px' }}
                            custom={i % 8}
                            className="group flex items-center gap-4 py-5 transition-colors md:gap-8 md:py-6"
                            style={{ borderBottom: `1px solid ${SECONDARY}`, borderBottomOpacity: 0.1 }}
                        >
                            <span
                                className="font-display w-20 shrink-0 text-lg uppercase md:w-28 md:text-2xl"
                                style={{ color: r.lead ? TERTIARY : SECONDARY, opacity: r.lead ? 1 : 0.5 }}
                            >
                                {r.date}
                            </span>
                            <h3
                                className="font-display flex-1 text-3xl uppercase transition-transform duration-300 group-hover:translate-x-2 md:text-5xl"
                                style={{ color: r.lead ? TERTIARY : SECONDARY }}
                            >
                                {r.title}
                            </h3>
                            {r.lead && (
                                <span
                                    className="rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                                    style={{ backgroundColor: TERTIARY, color: PRIMARY }}
                                >
                                    Lead Single
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LeadSingle() {
    return (
        <section id="pocket" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <div className="grid gap-12 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                    <motion.div
                        initial={false}
                        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
                        style={{ backgroundColor: '#1a1918', border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}
                    >
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 30% 30%, #ec8e36 0%, transparent 60%)',
                            }}
                        />
                        <div className="relative text-center">
                            <span
                                className="flex h-20 w-20 items-center justify-center rounded-full md:h-24 md:w-24"
                                style={{ backgroundColor: TERTIARY }}
                            >
                                <Play size={28} style={{ color: PRIMARY }} fill={PRIMARY} className="translate-x-0.5" />
                            </span>
                            <p className="font-display mt-6 text-5xl uppercase md:text-6xl" style={{ color: SECONDARY }}>
                                Pocket
                            </p>
                            <p className="mt-2 text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                                Lead Single
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="md:col-span-7 md:pl-6">
                    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                            Lead Single
                        </span>
                        <h2 className="font-display mt-3 text-[12vw] uppercase leading-[0.85] md:text-[7vw]" style={{ color: SECONDARY }}>
                            Pocket
                        </h2>
                        <p className="mt-8 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: SECONDARY, opacity: 0.7 }}>
                            &lsquo;Pocket&rsquo; is an alternative R&amp;B track driven by a punchy bassline. It follows an
                            ex-lover leaving an abusive relationship, told from the perspective of someone who wants to
                            offer her care. The song pairs a relationship-centred narrative with TJayC&rsquo;s atmospheric
                            musical identity.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ListenWatch() {
    const links = [
        { icon: Music, label: 'Pocket — Music Link', href: 'https://ditto.fm/pocket-tjayc' },
        { icon: Youtube, label: 'YouTube — @TJayCMusic88VEVO', href: 'https://www.youtube.com/@TJayCMusic88VEVO' },
    ];
    return (
        <section
            id="listen"
            style={{
                borderTop: `1px solid ${SECONDARY}`,
                borderTopOpacity: 0.1,
                backgroundColor: PRIMARY,
            }}
        >
            <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                    <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                        Listen / Watch
                    </span>
                    <h2 className="font-display mt-3 text-[10vw] uppercase leading-[0.85] md:text-[6vw]" style={{ color: SECONDARY }}>
                        Press <span style={{ color: TERTIARY }}>Play</span>
                    </h2>
                </motion.div>

                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                    {links.map((l, i) => {
                        const Icon = l.icon;
                        return (
                            <motion.a
                                key={l.label}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: '-60px' }}
                                custom={i}
                                className="group flex items-center justify-between rounded-2xl p-6 transition-colors"
                                style={{ backgroundColor: '#1a1918', border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}
                            >
                                <span className="flex items-center gap-4">
                                    <span
                                        className="flex h-12 w-12 items-center justify-center rounded-full"
                                        style={{ backgroundColor: TERTIARY }}
                                    >
                                        <Icon size={20} style={{ color: PRIMARY }} strokeWidth={2} />
                                    </span>
                                    <span className="text-sm uppercase tracking-[0.15em]" style={{ color: SECONDARY }}>
                                        {l.label}
                                    </span>
                                </span>
                                <ArrowUpRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                    style={{ color: SECONDARY, opacity: 0.4 }}
                                />
                            </motion.a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                    Interviews + Bookings
                </span>
                <h2 className="font-display mt-3 text-[12vw] uppercase leading-[0.82] md:text-[8vw]" style={{ color: SECONDARY }}>
                    Get in<br /><span className="text-stroke">touch</span>
                </h2>
            </motion.div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2" style={{ border: `1px solid ${SECONDARY}`, borderOpacity: 0.1 }}>
                <a
                    href="mailto:hello@tjayc.com"
                    className="group flex flex-col gap-3 p-6 transition-colors md:p-8"
                    style={{ backgroundColor: '#1a1918' }}
                >
                    <Mail size={22} style={{ color: TERTIARY }} strokeWidth={1.8} />
                    <span className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: SECONDARY, opacity: 0.4 }}>Email</span>
                    <span className="text-sm" style={{ color: SECONDARY }}>hello@tjayc.com</span>
                </a>
                <a
                    href="https://tjayc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-3 p-6 transition-colors md:p-8"
                    style={{ backgroundColor: '#1a1918' }}
                >
                    <ArrowUpRight size={22} style={{ color: TERTIARY }} strokeWidth={1.8} />
                    <span className="mt-2 text-xs uppercase tracking-[0.2em]" style={{ color: SECONDARY, opacity: 0.4 }}>Website</span>
                    <span className="text-sm" style={{ color: SECONDARY }}>tjayc.com</span>
                </a>
            </div>
        </section>
    );
}

function ReleaseCredits() {
    return (
        <section
            id="credits"
            style={{
                borderTop: `1px solid ${SECONDARY}`,
                borderTopOpacity: 0.1,
                backgroundColor: PRIMARY,
            }}
        >
            <div className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                    <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                        Release Credits
                    </span>
                    <h2 className="font-display mt-3 text-[10vw] uppercase leading-[0.85] md:text-[6vw]" style={{ color: SECONDARY }}>
                        The <span className="text-stroke">Credits</span>
                    </h2>
                </motion.div>

                <div className="mt-12" style={{ borderTop: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1 }}>
                    {credits.map((c, i) => (
                        <motion.div
                            key={c.name}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-60px' }}
                            custom={i}
                            className="flex flex-col gap-1 py-5 md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-6"
                            style={{ borderBottom: `1px solid ${SECONDARY}`, borderBottomOpacity: 0.1 }}
                        >
                            <span className="max-w-md text-xs uppercase tracking-[0.2em] md:text-sm" style={{ color: SECONDARY, opacity: 0.5 }}>
                                {c.role}
                            </span>
                            <span className="font-display text-2xl uppercase md:text-3xl" style={{ color: SECONDARY }}>
                                {c.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function EpkFooter() {
    return (
        <footer className="mx-auto max-w-[90rem] px-5 py-10 md:px-10">
            <div
                className="flex flex-col items-start justify-between gap-4 pt-8 text-xs uppercase tracking-[0.2em] sm:flex-row sm:items-center"
                style={{ borderTop: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1, color: SECONDARY, opacity: 0.4 }}
            >
                <span className="font-display text-base tracking-widest" style={{ color: SECONDARY }}>TJayC</span>
                <span>Electronic Press Kit &bull; October 2026</span>
                <div className="flex items-center gap-4">
                    <Link to="/privacy-policy" className="transition-opacity hover:opacity-70">Privacy Policy</Link>
                    <button type="button" onClick={openCookiePreferences} className="transition-opacity hover:opacity-70">Cookie settings</button>
                    <span>Harare &bull; Johannesburg</span>
                </div>
            </div>
        </footer>
    );
}

const EpkPage = () => {
    return (
        <div className="relative min-h-screen" style={{ backgroundColor: PRIMARY }}>
            <div className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] grain" />
            <EpkHeader />
            <main>
                <EpkHero />
                <About />
                <ReleaseCalendar />
                <LeadSingle />
                <ListenWatch />
                <Contact />
                <ReleaseCredits />
            </main>
            <EpkFooter />
        </div>
    );
};

export default EpkPage;
