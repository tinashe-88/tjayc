import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Subscribe from '@/components/Subscribe';
import { openCookiePreferences } from '@/lib/cookie-consent';

const PRIMARY = '#333232';
const SECONDARY = '#fefcfe';
const TERTIARY = '#ec8e36';

const fadeUp = {
    hidden: { opacity: 1, y: 0 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: Math.min(Number(i) || 0, 8) * 0.04, ease: [0.22, 1, 0.36, 1] },
    }),
};

const sections = [
    {
        id: 'intro',
        title: 'Introduction',
        body: [
            'TJayC (“I”, “me”, “us”) operates tjayc.com. This Privacy Policy explains what information this website collects, how it is used, and the choices you have.',
            'This policy applies only to tjayc.com and the email sign-up form on it. It does not cover any third-party platforms linked from this site (such as streaming services, social media, or video platforms), which have their own privacy policies.',
        ],
    },
    {
        id: 'what-we-collect',
        title: 'Information I Collect',
        body: [
            'The only personal information this website collects directly from you is the email address you choose to submit through the Subscribe form.',
            'When you submit your email, it is stored securely in the website’s backend so I can send you updates, news, and announcements about TJayC’s music and releases.',
            'This website does not ask for your name, phone number, physical address, payment details, or any other personal information.',
        ],
    },
    {
        id: 'how-we-use',
        title: 'How Your Email Is Used',
        body: [
            'Your email address is used only to send you updates and communications related to TJayC, such as new releases, news, and announcements.',
            'I will not sell, rent, or trade your email address to third parties.',
            'Your email may be processed through the email-marketing tools I use to send these updates, which may handle your data according to their own terms and privacy practices.',
        ],
    },
    {
        id: 'legal-basis',
        title: 'Legal Basis',
        body: [
            'Where applicable, I process your email address on the basis of your consent, which you give by submitting your address through the Subscribe form.',
            'You may withdraw your consent at any time by requesting to unsubscribe using the contact details below.',
        ],
    },
    {
        id: 'retention',
        title: 'Data Retention',
        body: [
            'Your email address is kept for as long as you remain subscribed to receive updates from TJayC.',
            'When you ask to be removed from the mailing list, your email address will be deleted from the active subscriber list in line with the tools I use.',
        ],
    },
    {
        id: 'cookies',
        title: 'Cookies & Analytics',
        body: [
            'This website may use cookies or similar technologies for basic functionality and, where applicable, to measure traffic and understand how the site is used.',
            'Where non-essential cookies are used, they are only loaded after you have given your consent through the cookie banner on this site.',
            'You can manage or withdraw your cookie preferences at any time using the “Cookie settings” link in the footer.',
        ],
    },
    {
        id: 'third-party',
        title: 'Third-Party Links',
        body: [
            'This website contains links to external platforms, including streaming services, social media, and video sites. These third parties have their own privacy policies, and I am not responsible for how they handle your information once you leave tjayc.com.',
        ],
    },
    {
        id: 'your-rights',
        title: 'Your Rights',
        body: [
            'Depending on where you live, you may have the right to access, correct, or delete the personal information I hold about you, and to withdraw your consent at any time.',
            'To exercise any of these rights, or to unsubscribe, contact me using the details below and I will respond as soon as I can.',
        ],
    },
    {
        id: 'security',
        title: 'Security',
        body: [
            'I take reasonable steps to protect the email addresses submitted through this site. However, no method of transmission over the internet or electronic storage is completely secure, so I cannot guarantee absolute security.',
        ],
    },
    {
        id: 'changes',
        title: 'Changes to This Policy',
        body: [
            'I may update this Privacy Policy from time to time. Any changes will be posted on this page, and the updated policy takes effect once it is published here.',
        ],
    },
    {
        id: 'contact',
        title: 'Contact',
        body: [
            'If you have any questions about this Privacy Policy or how your information is handled, or if you would like to unsubscribe or request deletion of your email, contact me at hello@tjayc.com.',
        ],
    },
];

function PrivacyHeader() {
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

function PrivacyHero() {
    return (
        <section id="top" className="relative min-h-[70dvh] overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundColor: PRIMARY }} />
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 20% 20%, #ec8e36 0%, transparent 40%), radial-gradient(circle at 80% 70%, #ec8e36 0%, transparent 45%)',
                }}
            />
            <div className="relative z-10 mx-auto flex min-h-[70dvh] max-w-[90rem] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
                <p className="mb-4 text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                    Last updated &bull; October 2026
                </p>

                <h1 className="font-display leading-[0.82]" style={{ color: SECONDARY }}>
                    <span className="block text-[14vw] uppercase md:text-[10vw]" style={{ color: SECONDARY }}>
                        Privacy
                    </span>
                    <span className="block text-[14vw] uppercase md:text-[10vw] text-stroke">
                        Policy
                    </span>
                </h1>

                <p className="mt-6 max-w-xl text-sm leading-relaxed" style={{ color: SECONDARY, opacity: 0.6 }}>
                    How TJayC collects, uses, and protects the information you share on this website.
                </p>
            </div>
        </section>
    );
}

function PrivacyBody() {
    return (
        <section className="mx-auto max-w-[90rem] px-5 py-24 md:px-10 md:py-36">
            <div className="grid gap-12 md:grid-cols-12 md:gap-10">
                <aside className="md:col-span-4">
                    <div className="md:sticky md:top-28">
                        <span className="text-xs uppercase tracking-[0.3em]" style={{ color: TERTIARY }}>
                            Contents
                        </span>
                        <nav className="mt-5 flex flex-col gap-2">
                            {sections.map((s) => (
                                <a
                                    key={s.id}
                                    href={`#${s.id}`}
                                    className="text-sm uppercase tracking-[0.15em] transition-colors hover:opacity-70"
                                    style={{ color: SECONDARY, opacity: 0.5 }}
                                >
                                    {s.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                <div className="md:col-span-8">
                    {sections.map((s, i) => (
                        <motion.div
                            key={s.id}
                            id={s.id}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-60px' }}
                            custom={i}
                            className="scroll-mt-28 border-b py-10 first:pt-0"
                            style={{ borderColor: `${SECONDARY}1a` }}
                        >
                            <h2 className="font-display text-3xl uppercase leading-[0.9] md:text-4xl" style={{ color: SECONDARY }}>
                                {s.title}
                            </h2>
                            <div className="mt-5 flex flex-col gap-4">
                                {s.body.map((p, j) => (
                                    <p key={j} className="max-w-2xl text-base leading-relaxed" style={{ color: SECONDARY, opacity: 0.7 }}>
                                        {p}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    ))}

                    <div className="mt-12">
                        <Link
                            to="/#contact"
                            className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] transition-all duration-300 hover:scale-[1.03]"
                            style={{ backgroundColor: TERTIARY, color: PRIMARY }}
                        >
                            Get in touch
                            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PrivacyFooter() {
    return (
        <footer className="mx-auto max-w-[90rem] px-5 py-10 md:px-10">
            <div
                className="flex flex-col items-start justify-between gap-4 pt-8 text-xs uppercase tracking-[0.2em] sm:flex-row sm:items-center"
                style={{ borderTop: `1px solid ${SECONDARY}`, borderTopOpacity: 0.1, color: SECONDARY, opacity: 0.4 }}
            >
                <span className="font-display text-base tracking-widest" style={{ color: SECONDARY }}>TJayC</span>
                <span>Privacy Policy &bull; October 2026</span>
                <button type="button" onClick={openCookiePreferences} className="transition-opacity hover:opacity-70">Cookie settings</button>
                <span>Harare &bull; Johannesburg</span>
            </div>
        </footer>
    );
}

const PrivacyPolicyPage = () => {
    return (
        <div className="relative min-h-screen" style={{ backgroundColor: PRIMARY }}>
            <div className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] grain" />
            <PrivacyHeader />
            <main>
                <PrivacyHero />
                <PrivacyBody />
            </main>
            <PrivacyFooter />
        </div>
    );
};

export default PrivacyPolicyPage;
