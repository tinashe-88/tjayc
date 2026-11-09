import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowUpRight, Check, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbase-client';

const PRIMARY = '#333232';
const SECONDARY = '#fefcfe';
const TERTIARY = '#ec8e36';

// Email-only sign-up. Submissions are stored in the PocketBase `subscribers`
// collection (anonymous create, nobody can read them back through the API).
// Renders a compact inline form for the site headers.
export default function Subscribe({ onDone }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | done | exists | error
    const [error, setError] = useState('');

    const validate = (value) => {
        if (!value.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
            return 'Enter a valid email address.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v = validate(email);
        if (v) {
            setError(v);
            setStatus('error');
            return;
        }
        setStatus('loading');
        setError('');
        try {
            await pb.collection('subscribers').create({ email: email.trim() });
            setStatus('done');
            setEmail('');
            if (onDone) onDone();
        } catch (err) {
            const data = err?.response?.data || {};
            if (data.email) {
                setError('You’re already subscribed — thanks for being here.');
                setStatus('exists');
                setEmail('');
            } else if (err?.status === 400) {
                setError('Please double-check your email and try again.');
                setStatus('error');
            } else {
                setError('Unable to subscribe right now. Please try again shortly.');
                setStatus('error');
            }
        }
    };

    if (status === 'done') {
        return (
            <span
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] md:text-xs"
                style={{ color: TERTIARY }}
            >
                <Check size={14} strokeWidth={2.5} />
                Subscribed
            </span>
        );
    }

    if (status === 'exists') {
        return (
            <span
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] md:text-xs"
                style={{ color: SECONDARY, opacity: 0.85 }}
            >
                <Check size={14} strokeWidth={2.5} style={{ color: TERTIARY }} />
                {error || 'You’re already subscribed'}
            </span>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex items-center gap-2">
            <div className="relative">
                <Mail
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: SECONDARY, opacity: 0.4 }}
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Your email"
                    aria-label="Email address"
                    className="w-40 rounded-full py-2 pl-8 pr-3 text-xs outline-none transition-colors focus:border-[#ec8e36] md:w-52 md:text-sm"
                    style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${SECONDARY}`,
                        borderOpacity: 0.4,
                        color: SECONDARY,
                    }}
                />
            </div>
            <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-200 hover:scale-[1.03] disabled:opacity-60 md:text-xs"
                style={{ backgroundColor: TERTIARY, color: PRIMARY }}
            >
                {status === 'loading' ? (
                    <Loader2 size={13} className="animate-spin" />
                ) : (
                    <>
                        Subscribe
                        <ArrowUpRight size={13} strokeWidth={2} />
                    </>
                )}
            </button>
            <AnimatePresence>
                {status === 'error' && error && (
                    <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute right-0 top-full mt-2 rounded-md px-3 py-1.5 text-[10px]"
                        style={{
                            backgroundColor: '#1a1918',
                            border: `1px solid rgba(220,80,70,0.4)`,
                            color: '#ff9b94',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </form>
    );
}
