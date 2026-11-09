import { useCookieBanner } from '@/hooks/use-cookie-banner';

const categories = [
  { key: 'analytics', label: 'Analytics', description: 'Helps measure visits to this site.' },
  { key: 'marketing', label: 'Marketing', description: 'Helps measure and personalise advertising.' },
  { key: 'platformAnalytics', label: 'Platform analytics', description: 'Hostinger uses Amplitude to understand and improve its platform without directly identifying you.' },
] as const;

export function CookieBanner() {
  const banner = useCookieBanner();
  if (!banner.isOpen) return null;

  return (
    <section role="dialog" aria-label="Cookie preferences" className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/20 bg-[#1a1918] p-5 text-[#fefcfe] shadow-xl md:p-6">
      <h2 className="font-display text-2xl uppercase">Your cookie choices</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/75">Essential cookies keep the site working. With your permission, optional cookies help measure visits and advertising.</p>
      {banner.isCustomizing && (
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Optional cookies</legend>
          {categories.map(category => (
            <label key={category.key} className="flex cursor-pointer items-start gap-3 text-sm">
              <input type="checkbox" className="mt-1 accent-[#ec8e36]" checked={banner.choices[category.key]} onChange={event => banner.setChoice(category.key, event.target.checked)} />
              <span><strong>{category.label}</strong><span className="block text-xs leading-relaxed text-white/65">{category.description}</span></span>
            </label>
          ))}
        </fieldset>
      )}
      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-wider">
        <button type="button" onClick={banner.rejectOptional} className="min-h-11 rounded-full border border-white/50 px-5 transition-colors hover:bg-white/10">Reject optional</button>
        <button type="button" onClick={banner.acceptAll} className="min-h-11 rounded-full border border-[#ec8e36] bg-[#ec8e36] px-5 text-[#333232] transition-opacity hover:opacity-85">Accept all</button>
        <button type="button" onClick={banner.isCustomizing ? banner.saveChoices : banner.customize} className="min-h-11 rounded-full border border-white/30 px-5 transition-colors hover:bg-white/10">{banner.isCustomizing ? 'Save choices' : 'Customize'}</button>
      </div>
    </section>
  );
}
