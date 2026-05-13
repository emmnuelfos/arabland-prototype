// Concept Plus — Mortgage standalone page.

const { useState: useStateR, useEffect: useEffectR, useMemo: useMemoR } = React;
const __PC3 = () => window.PageChrome;

// ═══════════════════════════════════════════════════════════════════════════
//   MORTGAGE PAGE — full advisory page with hero, big calculator, lenders,
//   amortization preview, scenarios, and a senior-broker contact form.
// ═══════════════════════════════════════════════════════════════════════════
function MortgagePage() {
  const PC = __PC3();
  return (
    <PC screenLabel="Mortgage">
      {(ctx) => (
        <main>
          {/* Hero ─ dark editorial */}
          <section className="relative bg-graphite-900 text-porcelain" data-screen-label="Mortgage · Hero">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2400&q=85"
                alt="Dubai skyline"
                className="w-full h-full object-cover opacity-35"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-graphite-900 via-graphite-900/85 to-graphite-900/60" />
            </div>
            <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-20 md:pb-28">
              <div className="text-[11px] tracking-[0.22em] uppercase text-porcelain/60 flex items-center gap-3">
                <a href="home.html" className="hover:text-ochre cursor-pointer">Home</a>
                <span className="opacity-50">›</span>
                <a href="services.html" className="hover:text-ochre cursor-pointer">Services</a>
                <span className="opacity-50">›</span>
                <span className="text-porcelain">Mortgage</span>
              </div>
              <div className="eyebrow text-ochre mt-8">Mortgage advisory</div>
              <h1 className="font-display mt-4 max-w-4xl" style={{ fontSize: 'clamp(48px, 7vw, 104px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 0.98 }}>
                The financing, <span className="text-ochre">handled.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-porcelain/80 text-[17px] leading-relaxed">
                Independent mortgage brokerage across every UAE and offshore lender. Pre-approval inside 72 hours, terms benchmarked, paperwork run end-to-end by a senior advisor.
              </p>
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                <a href="#calc" className="bg-ochre text-porcelain px-7 py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-porcelain hover:text-graphite-900 transition cursor-pointer inline-flex items-center gap-3">Run the numbers</a>
                <a href="#contact" className="text-porcelain/85 eyebrow gold-underline cursor-pointer">Or speak to an advisor</a>
              </div>
              <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-4 max-w-3xl">
                {[['72hr', 'Pre-approval'], ['28', 'UAE + offshore lenders'], ['AED 4.1B', 'Mortgages placed'], ['100%', 'Owner-side advisory']].map(([n, l]) => (
                  <div key={l}>
                    <div className="font-display num text-porcelain" style={{ fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em' }}>{n}</div>
                    <div className="eyebrow text-porcelain/55 mt-2" style={{ fontSize: 10 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Big calculator — reuses the homepage MortgageSection */}
          <div id="calc" />
          <MortgageSection />

          {/* Lenders strip */}
          <section className="bg-porcelain py-20 border-t hairline border-stone-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
              <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-end mb-10">
                <div className="reveal">
                  <div className="eyebrow text-ochre mb-5">Lender network</div>
                  <h2 className="font-display text-graphite-900 leading-[1.02]" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em' }}>
                    Twenty-eight banks, one introduction.
                  </h2>
                </div>
                <p className="reveal text-graphite text-[15px] leading-relaxed max-w-2xl lg:justify-self-end">
                  We negotiate across the full UAE lender book — including non-resident facilities through select offshore branches. You get the sharpest rate, not the one your bank happens to offer.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-stone-200 hairline border border-stone-200">
                {['Emirates NBD', 'HSBC', 'Mashreq', 'ADCB', 'FAB', 'Standard Chartered', 'CBD', 'Dubai Islamic Bank', 'RAKBANK', 'Citibank', 'United Arab Bank', 'Ajman Bank', 'Lloyds (offshore)', 'Barclays (offshore)'].map((b) => (
                  <div key={b} className="bg-porcelain h-20 grid place-items-center px-3 text-center">
                    <div className="text-[12px] text-graphite-900 font-medium tracking-tight">{b}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Three scenarios */}
          <section className="bg-porcelain-100 py-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
              <div className="reveal mb-12 max-w-3xl">
                <div className="eyebrow text-ochre mb-5">Scenarios</div>
                <h2 className="font-display text-graphite-900 leading-[1.02]" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em' }}>
                  Three buyer profiles, three rate paths.
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-px bg-stone-200 hairline border border-stone-200">
                {[
                  { eb: 'Resident · first home', headline: 'AED 3.5M apartment, 25% down', monthly: 'AED 13,840', term: '25 years · 4.10% p.a. · variable', notes: 'LTV up to 80% on first home up to AED 5M for UAE residents. Property Finder valuation accepted by most lenders.' },
                  { eb: 'Resident · second home', headline: 'AED 12M villa, 35% down', monthly: 'AED 41,260', term: '25 years · 4.35% p.a. · fixed 3yr then variable', notes: 'LTV reduced to 65% for second property. Concept Plus negotiates fixed-period structures where the rate cycle warrants.' },
                  { eb: 'Non-resident · investment', headline: 'AED 5M apartment, 40% down', monthly: 'AED 18,520', term: '25 years · 5.10% p.a. · variable', notes: 'LTV 60% for non-residents. Income proof via offshore statements; placement typically via Standard Chartered or HSBC International.' },
                ].map((s, i) => (
                  <div key={i} className="bg-porcelain p-8 md:p-10 flex flex-col reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                    <div className="eyebrow text-ochre" style={{ fontSize: 10 }}>{s.eb}</div>
                    <div className="font-display text-graphite-900 mt-3 leading-tight" style={{ fontSize: 22, fontWeight: 400 }}>{s.headline}</div>
                    <div className="mt-6 font-display num text-graphite-900 leading-none" style={{ fontSize: 36, fontWeight: 400, letterSpacing: '-0.02em' }}>{s.monthly}</div>
                    <div className="text-[11px] tracking-[0.18em] uppercase text-graphite/60 mt-3">{s.term}</div>
                    <p className="mt-6 text-[13px] text-graphite leading-relaxed flex-1">{s.notes}</p>
                    <a href="#contact" className="mt-8 eyebrow text-graphite-900 gold-underline cursor-pointer inline-flex items-center gap-2 self-start">Model this scenario →</a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process — six steps */}
          <section className="bg-porcelain py-20 md:py-28">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
              <div className="reveal mb-12 max-w-3xl">
                <div className="eyebrow text-ochre mb-5">Process</div>
                <h2 className="font-display text-graphite-900 leading-[1.02]" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-0.02em' }}>
                  Six steps, two weeks, no surprises.
                </h2>
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-px bg-stone-200 hairline border border-stone-200">
                {[
                  ['01', 'Profile', 'Twenty-minute call. Residency, income, intent. We map your eligible LTV.'],
                  ['02', 'Pre-approval', 'Soft applications to 5–8 lenders. Comparable offers in 72 hours.'],
                  ['03', 'Offer', 'You choose the lender. We negotiate rate, fees, and fixed-period structure.'],
                  ['04', 'Valuation', 'Independent property valuation through the bank\'s panel.'],
                  ['05', 'Final offer', 'Binding mortgage letter. Conveyance and DLD timing aligned.'],
                  ['06', 'Drawdown', 'Funds released to seller via DLD. Concept Plus runs the room.'],
                ].map(([n, t, d], i) => (
                  <div key={n} className="bg-porcelain p-6 reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="font-display num text-ochre leading-none" style={{ fontSize: 30, fontWeight: 400 }}>{n}</div>
                    <div className="font-display text-graphite-900 mt-3" style={{ fontSize: 19, fontWeight: 500 }}>{t}</div>
                    <p className="mt-3 text-[13px] text-graphite leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact / pre-approval form */}
          <section id="contact" className="bg-graphite-900 text-porcelain py-24 md:py-32" data-screen-label="Mortgage · Contact">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1fr_1.1fr] gap-16">
              <div className="reveal">
                <div className="eyebrow text-ochre mb-5">Pre-approval</div>
                <h2 className="font-display text-porcelain leading-[1.02]" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400, letterSpacing: '-0.025em' }}>
                  Start with a quiet conversation.
                </h2>
                <p className="mt-6 text-porcelain/75 text-[15px] leading-relaxed max-w-md">
                  Share where you are in your search and what you'd like to finance. A senior advisor will be back within the working day, with three indicative offers.
                </p>
                <div className="mt-10 space-y-4 text-[13px] text-porcelain/85">
                  <div className="flex items-center gap-3"><span className="w-6 h-px bg-ochre" /> No fees from you — we are paid by the lender</div>
                  <div className="flex items-center gap-3"><span className="w-6 h-px bg-ochre" /> Confidential — no portal sharing, no SMS chains</div>
                  <div className="flex items-center gap-3"><span className="w-6 h-px bg-ochre" /> Pre-approval valid 60 days, fully portable</div>
                </div>
              </div>
              <form className="reveal grid gap-5 hairline border border-porcelain/15 p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Full name" placeholder="Your name" />
                  <Field label="Phone"     placeholder="+971 ..." />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Email"     placeholder="email@address.com" />
                  <Field label="Residency" placeholder="UAE resident / non-resident" />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Property price (AED)" placeholder="3,500,000" />
                  <Field label="Down payment (AED)"   placeholder="875,000" />
                </div>
                <Field label="Anything we should know?" placeholder="Off-plan / resale / refinance / second home …" textarea />
                <button type="button" className="bg-ochre text-porcelain px-7 py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-porcelain hover:text-graphite-900 transition cursor-pointer mt-2 inline-flex items-center justify-center gap-3">Request pre-approval <ArrowIcon className="w-3.5 h-3.5" /></button>
                <p className="text-[11px] tracking-[0.18em] uppercase text-porcelain/45">A senior advisor responds within the working day.</p>
              </form>
            </div>
          </section>
        </main>
      )}
    </PC>
  );
}

function Field({ label, placeholder, textarea }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className="block">
      <div className="eyebrow text-porcelain/65 mb-2" style={{ fontSize: 10 }}>{label}</div>
      <Tag
        rows={textarea ? 3 : undefined}
        placeholder={placeholder}
        className="w-full bg-transparent border-b hairline border-porcelain/30 py-3 text-[15px] text-porcelain placeholder:text-porcelain/35 focus:outline-none focus:border-ochre transition"
      />
    </label>
  );
}

// ─── Register ──────────────────────────────────────────────────────────────
window.__PAGES = window.__PAGES || {};
window.__PAGES.mortgage = MortgagePage;
