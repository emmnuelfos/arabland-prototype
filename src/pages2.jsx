// Concept Plus — secondary pages: Sell, Developers, Agents, Services, Careers.
// Mounts via boot.jsx through window.__PAGES registry.

const { useState: useStateQ, useMemo: useMemoQ, useEffect: useEffectQ } = React;
const __PC = () => window.PageChrome;

// ─── Extra data ────────────────────────────────────────────────────────────
window.CONCEPT PLUS_EXTRA = {
  services: [
    { id: 'sales',     title: 'Residential Sales',         eb: 'Buy & sell',     blurb: 'Senior brokers representing Dubai\'s most considered freehold addresses, end-to-end.', stats: ['1,247', 'Active mandates'] },
    { id: 'leasing',   title: 'Leasing & Rentals',          eb: 'Lease',          blurb: 'Furnished and unfurnished leasing, short and long lease structures, RERA-compliant Ejari.', stats: ['380', 'Tenancies live'] },
    { id: 'offplan',   title: 'Off-Plan Advisory',          eb: 'New launches',   blurb: 'Direct-from-developer access to launches, with independent advice on pricing, payment plans and exit.', stats: ['28', 'Active projects'] },
    { id: 'mgmt',      title: 'Property Management',        eb: 'Operate',        blurb: 'Owner-side property management — leasing, maintenance, accounting, snagging, handover.', stats: ['610', 'Units under mgmt'] },
    { id: 'invest',    title: 'Investment Advisory',        eb: 'Strategy',       blurb: 'Portfolio construction, yield modelling, exit timing for high-net-worth and family offices.', stats: ['AED 4.1B', 'Advised AUM'] },
    { id: 'mortgage',  title: 'Mortgage & Finance',         eb: 'Finance',        blurb: 'Independent mortgage brokerage across UAE and offshore lenders. Pre-approval in 72 hours.', stats: ['72hr', 'Pre-approval'] },
    { id: 'conveyance',title: 'Conveyancing & Legal',       eb: 'Transact',       blurb: 'In-house conveyancing for DLD transfers, gifting, succession and corporate-held property.', stats: ['100%', 'On-time transfers'] },
    { id: 'interiors', title: 'Interiors & Snagging',       eb: 'Move in',        blurb: 'Trusted partners for snagging, defects rectification, fit-out and turnkey furnishing.', stats: ['18', 'Vetted partners'] },
  ],
  developers: [
    { name: 'Emaar Properties',  founded: 1997, delivered: 76, pipeline: 14, notable: 'Burj Khalifa · Downtown Dubai · Dubai Hills', img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&h=600&q=80' },
    { name: 'Sobha Realty',      founded: 1976, delivered: 41, pipeline: 9,  notable: 'Sobha Hartland · Cassia Residences', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&h=600&q=80' },
    { name: 'DAMAC Properties',  founded: 2002, delivered: 52, pipeline: 12, notable: 'AYKON City · DAMAC Hills · Akoya', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&h=600&q=80' },
    { name: 'Aldar Properties',  founded: 2004, delivered: 38, pipeline: 7,  notable: 'Saadiyat Island · Yas Island · Al Reem', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&h=600&q=80' },
    { name: 'Meraas',            founded: 2007, delivered: 22, pipeline: 6,  notable: 'Bluewaters · City Walk · La Mer', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&h=600&q=80' },
    { name: 'Nakheel',           founded: 2000, delivered: 31, pipeline: 8,  notable: 'Palm Jumeirah · The World · Deira Islands', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=900&h=600&q=80' },
    { name: 'Omniyat',           founded: 2005, delivered: 18, pipeline: 5,  notable: 'One at Palm · The Opus · Anwa', img: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?auto=format&fit=crop&w=900&h=600&q=80' },
    { name: 'Select Group',      founded: 2002, delivered: 14, pipeline: 4,  notable: 'Marina Gate · Six Senses Residences', img: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&h=600&q=80' },
  ],
  careers: [
    { id: 'C-01', title: 'Senior Property Consultant — Palm & Jumeirah Bay', team: 'Brokerage', type: 'Full-time', loc: 'Dubai', exp: '5+ yrs' },
    { id: 'C-02', title: 'Director, Off-Plan Sales',                          team: 'Off-Plan',  type: 'Full-time', loc: 'Dubai', exp: '8+ yrs' },
    { id: 'C-03', title: 'Investment Advisor — UHNW & Family Offices',        team: 'Advisory',  type: 'Full-time', loc: 'Dubai', exp: '7+ yrs' },
    { id: 'C-04', title: 'Property Manager — Marina & JBR',                   team: 'Property Management', type: 'Full-time', loc: 'Dubai', exp: '4+ yrs' },
    { id: 'C-05', title: 'Mortgage Consultant',                               team: 'Finance',   type: 'Full-time', loc: 'Dubai', exp: '3+ yrs' },
    { id: 'C-06', title: 'Listings Photographer & Videographer',              team: 'Marketing', type: 'Full-time', loc: 'Dubai', exp: '3+ yrs' },
    { id: 'C-07', title: 'Brand & Editorial Lead',                            team: 'Marketing', type: 'Full-time', loc: 'Dubai', exp: '6+ yrs' },
    { id: 'C-08', title: 'Senior Conveyancer',                                team: 'Legal',     type: 'Full-time', loc: 'Dubai', exp: '5+ yrs' },
    { id: 'C-09', title: 'Receptionist — HQ',                                 team: 'Operations',type: 'Full-time', loc: 'Dubai', exp: '2+ yrs' },
    { id: 'C-10', title: 'IT & CRM Administrator',                            team: 'Operations',type: 'Full-time', loc: 'Dubai', exp: '4+ yrs' },
  ],
};

// Shared title strip + breadcrumb
function PageHead({ crumbs, eyebrow, title, sub }) {
  return (
    <section className="bg-porcelain-100 border-b hairline border-stone-200 pt-10 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-[11px] tracking-[0.22em] uppercase text-graphite/60 flex items-center gap-3 flex-wrap">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {c.href ? <a href={c.href} className="gold-underline">{c.label}</a> : <span className="text-graphite-900">{c.label}</span>}
              {i < crumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </div>
        {eyebrow && <div className="eyebrow text-ochre mt-6">{eyebrow}</div>}
        <h1 className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400, letterSpacing: '-0.01em' }}>{title}</h1>
        {sub && <p className="text-graphite/80 mt-3 max-w-2xl text-[16px] leading-[1.7]">{sub}</p>}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//   SELL / VALUATION PAGE
// ═══════════════════════════════════════════════════════════════════════════
function SellPage() {
  const PC = __PC();
  const D = window.CONCEPTPLUS_DATA;
  const [community, setCommunity] = useStateQ('Palm Jumeirah');
  const [type, setType] = useStateQ('Villa');
  const [beds, setBeds] = useStateQ(4);
  const [sqft, setSqft] = useStateQ(5200);
  const [submitted, setSubmitted] = useStateQ(false);

  // Quick "valuation" — derived from a per-sqft heuristic per community.
  const psf = { 'Palm Jumeirah': 5200, 'Downtown Dubai': 3400, 'Dubai Marina': 2400, 'Emirates Hills': 4400, 'Business Bay': 2100, 'Jumeirah Bay': 6800, 'MBR City': 1900, 'Jumeirah Village': 1100 };
  const base = (psf[community] || 2000) * sqft * (type === 'Villa' ? 1.05 : type === 'Penthouse' ? 1.15 : 1) * (1 + (beds - 3) * 0.02);
  const low = Math.round(base * 0.94 / 50000) * 50000;
  const mid = Math.round(base / 50000) * 50000;
  const high = Math.round(base * 1.07 / 50000) * 50000;

  return (
    <PC screenLabel="Sell · Valuation">
      {(ctx) => (
        <main>
          <PageHead crumbs={[{label:'Home', href:'index.html'}, {label:'Sell your property'}]}
            eyebrow="Instant valuation" title="What is your home worth, today?"
            sub="A live estimate, refined by a senior Concept Plus broker within 24 hours. Confidential, no obligation, no portal-style mass-emails." />

          {/* Calculator + result */}
          <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid lg:grid-cols-[480px_1fr] gap-16">
            <div className="hairline border border-stone-200 bg-white p-8">
              <div className="eyebrow text-ochre">Your property</div>
              <div className="space-y-6 mt-6">
                <Field2 label="Community"><select value={community} onChange={e => setCommunity(e.target.value)} className="w-full hairline border-b border-stone-200 bg-transparent py-3 text-[16px] cursor-pointer">{D.communities.map(c => <option key={c.name}>{c.name}</option>)}</select></Field2>
                <Field2 label="Property type"><select value={type} onChange={e => setType(e.target.value)} className="w-full hairline border-b border-stone-200 bg-transparent py-3 text-[16px] cursor-pointer">{['Apartment','Villa','Penthouse','Townhouse'].map(t => <option key={t}>{t}</option>)}</select></Field2>
                <Field2 label="Bedrooms"><div className="flex gap-2 mt-2">{[1,2,3,4,5,6,'7+'].map(b => <button key={b} onClick={() => setBeds(b === '7+' ? 7 : b)} className={`w-10 h-10 hairline border text-[14px] cursor-pointer transition ${beds === (b === '7+' ? 7 : b) ? 'border-ochre bg-ochre text-porcelain' : 'border-stone-200 hover:border-ochre'}`}>{b}</button>)}</div></Field2>
                <Field2 label={`Built-up area · ${sqft.toLocaleString()} sqft`}><input type="range" min={500} max={20000} step={100} value={sqft} onChange={e => setSqft(parseInt(e.target.value))} className="w-full accent-[#AC7B43]" /></Field2>
              </div>
              <button onClick={() => setSubmitted(true)} className="mt-8 w-full bg-graphite-900 text-porcelain px-6 py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer">Request a senior broker review</button>
              <div className="text-[11px] text-graphite/60 mt-4 leading-relaxed">No public listing. No portal syndication. We will only contact the broker best suited to represent your address.</div>
            </div>

            <div className="hairline border border-stone-200 bg-graphite-900 text-porcelain p-10 lg:p-14 flex flex-col justify-between min-h-[520px]">
              <div>
                <div className="eyebrow text-ochre">Indicative range</div>
                <div className="font-display mt-6 num" style={{ fontSize: 'clamp(48px, 7vw, 84px)', fontWeight: 300, lineHeight: 1.0 }}>{fmtPrice(mid, ctx.currency)}</div>
                <div className="text-porcelain/70 mt-3 text-[14px] num">{fmtPrice(low, ctx.currency)} — {fmtPrice(high, ctx.currency)} · ±7% confidence band</div>
                <div className="mt-12 grid grid-cols-3 gap-6 text-[13px] border-t border-porcelain/15 pt-8">
                  {[['Per sqft', fmtPrice(Math.round(mid/sqft), ctx.currency)], ['Comparable sales', '14 in last 12mo'], ['Avg. days on market', '38 days']].map(([k,v]) => (
                    <div key={k}><div className="text-[11px] tracking-[0.22em] uppercase text-ochre">{k}</div><div className="font-display mt-2 num" style={{ fontSize: '22px', fontWeight: 300 }}>{v}</div></div>
                  ))}
                </div>
              </div>
              <div className="border-t border-porcelain/15 pt-8 mt-12 text-[12px] text-porcelain/60 leading-relaxed">
                Estimate based on Concept Plus's transactions database, DLD-registered sales over the last 24 months and current live inventory. A senior broker will refine this within 24 hours, after a private inspection.
              </div>
            </div>
          </section>

          {/* Process */}
          <section className="bg-porcelain-100 py-24 border-t hairline border-stone-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
              <div className="eyebrow text-ochre">How we sell</div>
              <h2 className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400 }}>Five steps. One broker. No noise.</h2>
              <div className="grid md:grid-cols-5 gap-6 mt-14">
                {[
                  ['01', 'Private valuation', 'Senior broker visits the property, walks every room, reviews title and service charges.'],
                  ['02', 'Mandate & marketing', 'Exclusive mandate, professional photography and a quietly-circulated brochure to a vetted buyer pool.'],
                  ['03', 'Discreet exposure', 'No portal blasts. Buyers approached directly through our brokerage network.'],
                  ['04', 'Negotiation', 'Director-led negotiation. You see every offer, in writing, with full broker analysis.'],
                  ['05', 'Transfer & handover', 'In-house conveyancing manages DLD transfer, NOC, mortgage release, key handover.'],
                ].map(([n, t, d]) => (
                  <div key={n} className="border-t hairline border-stone-200 pt-6">
                    <div className="font-display text-ochre num" style={{ fontSize: '40px', fontWeight: 300 }}>{n}</div>
                    <div className="text-[15px] text-graphite-900 font-medium mt-3">{t}</div>
                    <div className="text-[13px] text-graphite/80 mt-2 leading-relaxed">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </PC>
  );
}
function Field2({ label, children }) { return <div><div className="text-[11px] tracking-[0.22em] uppercase text-graphite/60 mb-1">{label}</div>{children}</div>; }

// ═══════════════════════════════════════════════════════════════════════════
//   DEVELOPERS PAGE  (index + selected profile inline)
// ═══════════════════════════════════════════════════════════════════════════
function DevelopersPage() {
  const PC = __PC();
  const E = window.CONCEPT PLUS_EXTRA;
  const [openId, setOpenId] = useStateQ(null);

  return (
    <PC screenLabel="Developers">
      {(ctx) => (
        <main>
          <PageHead crumbs={[{label:'Home', href:'index.html'}, {label:'Developers'}]}
            eyebrow="Our partners" title="The developers we represent."
            sub="Eight reference developers behind Dubai's most considered residential addresses. We hold direct allocation on launches and unit-level data on every active project." />

          <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {E.developers.map(d => (
              <button key={d.name} onClick={() => setOpenId(d.name)} className="text-left bg-white hairline border border-stone-200 hover:border-ochre transition cursor-pointer overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img src={d.img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
                <div className="p-6">
                  <div className="font-display text-graphite-900" style={{ fontSize: '24px', fontWeight: 400 }}>{d.name}</div>
                  <div className="text-[12px] text-graphite/70 mt-1.5 line-clamp-1">{d.notable}</div>
                  <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t hairline border-stone-200">
                    <Stat n={d.delivered} k="Delivered" />
                    <Stat n={d.pipeline} k="Pipeline" />
                    <Stat n={`'${String(d.founded).slice(2)}`} k="Founded" />
                  </div>
                </div>
              </button>
            ))}
          </section>

          {/* Selected profile */}
          {openId && (() => {
            const d = E.developers.find(x => x.name === openId);
            return (
              <section className="bg-graphite-900 text-porcelain py-24 border-t border-graphite-800" data-screen-label="Developer · Profile">
                <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1fr_1.4fr] gap-16">
                  <div>
                    <div className="eyebrow text-ochre">Developer profile</div>
                    <div className="font-display mt-3" style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.0 }}>{d.name}</div>
                    <div className="mt-8 grid grid-cols-3 gap-6">
                      <Stat tone="dark" n={d.delivered} k="Delivered" />
                      <Stat tone="dark" n={d.pipeline} k="Pipeline" />
                      <Stat tone="dark" n={d.founded} k="Founded" />
                    </div>
                    <div className="mt-10 flex gap-3">
                      <a href="off-plan.html" className="bg-ochre text-graphite-900 px-5 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-porcelain transition cursor-pointer">Active projects</a>
                      <button onClick={() => setOpenId(null)} className="hairline border border-porcelain/40 px-5 py-3 text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:text-ochre transition cursor-pointer">Close profile</button>
                    </div>
                  </div>
                  <div>
                    <p className="text-[16px] leading-[1.8] text-porcelain/85">
                      A reference developer for some of Dubai's most considered residential addresses, with a multi-decade track record of on-time delivery. Notable communities and towers include {d.notable}.
                    </p>
                    <p className="text-[15px] leading-[1.8] text-porcelain/65 mt-5">
                      Concept Plus holds direct allocation on {d.name}'s active launches and represents the developer as a senior sales partner across {d.pipeline} live projects. Unit-level inventory, payment plans and floor plans available on request — typically within the same business day.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mt-8">
                      {[1,2,3,4].map(i => <div key={i} className="aspect-[16/10] bg-graphite-800 hairline border border-graphite-800 overflow-hidden"><img src={d.img} alt="" className="w-full h-full object-cover opacity-90" /></div>)}
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}
        </main>
      )}
    </PC>
  );
}
function Stat({ n, k, tone }) {
  const isDark = tone === 'dark';
  return (
    <div>
      <div className={`font-display num ${isDark ? '' : 'text-graphite-900'}`} style={{ fontSize: '28px', fontWeight: 300 }}>{n}</div>
      <div className={`text-[10px] tracking-[0.18em] uppercase mt-1 ${isDark ? 'text-porcelain/60' : 'text-graphite/60'}`}>{k}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//   AGENTS PAGE  (grid + drawer-style profile)
// ═══════════════════════════════════════════════════════════════════════════
function AgentsPage() {
  const PC = __PC();
  const D = window.CONCEPTPLUS_DATA;
  // pad agents to 12 by repeating
  const all = [...D.agents, ...D.agents.map((a, i) => ({ ...a, name: a.name.split(' ').reverse().join(' ') }))];
  const [openIdx, setOpenIdx] = useStateQ(null);
  const [team, setTeam] = useStateQ('All');
  const teams = ['All', 'Sales', 'Off-Plan', 'Leasing', 'Investment'];

  return (
    <PC screenLabel="Agents">
      {(ctx) => (
        <main>
          <PageHead crumbs={[{label:'Home', href:'index.html'}, {label:'Agents'}]}
            eyebrow="The team" title="Senior brokers, plainly named."
            sub="No call centre, no junior pool. Median Concept Plus broker tenure: 9 years. Every agent below is RERA-licensed and represents a defined community." />

          {/* Filters */}
          <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 pb-2 flex items-center gap-2 flex-wrap">
            {teams.map(t => (
              <button key={t} onClick={() => setTeam(t)} className={`px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase cursor-pointer transition ${team === t ? 'bg-graphite-900 text-porcelain' : 'hairline border border-stone-200 text-graphite hover:border-ochre hover:text-ochre'}`}>{t}</button>
            ))}
            <div className="ml-auto text-[12px] text-graphite/60">{all.length} brokers · {all.reduce((s,a) => s + (a.langs?.length || 0), 0)} languages combined</div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {all.map((a, i) => (
              <button key={i} onClick={() => setOpenIdx(i)} className="text-left group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-stone-200 hairline border border-stone-200 group-hover:border-ochre transition relative">
                  <img src={a.img} alt={a.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-graphite-900/90 to-transparent text-porcelain">
                    <div className="text-[15px] font-medium">{a.name}</div>
                    <div className="text-[11px] tracking-[0.16em] uppercase text-porcelain/80">RERA #{a.rera}</div>
                  </div>
                </div>
                <div className="text-[13px] text-graphite/80 mt-3 line-clamp-2">{a.role}</div>
                <div className="text-[11px] tracking-[0.16em] uppercase text-graphite/60 mt-1.5">{a.langs.join(' · ')}</div>
              </button>
            ))}
          </section>

          {/* Profile drawer */}
          {openIdx !== null && (() => {
            const a = all[openIdx];
            return (
              <div className="fixed inset-0 z-50 bg-graphite-900/60 grid place-items-end" onClick={() => setOpenIdx(null)} data-screen-label="Agent · Profile">
                <div onClick={e => e.stopPropagation()} className="bg-porcelain w-full max-w-3xl h-full overflow-y-auto p-10">
                  <button onClick={() => setOpenIdx(null)} className="text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre cursor-pointer">← Back to team</button>
                  <div className="mt-8 grid sm:grid-cols-[200px_1fr] gap-8">
                    <img src={a.img} alt="" className="w-full aspect-[3/4] object-cover" />
                    <div>
                      <div className="eyebrow text-ochre">Senior broker</div>
                      <div className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-0.01em' }}>{a.name}</div>
                      <div className="text-[14px] text-graphite/80 mt-2">{a.role}</div>
                      <div className="text-[11px] tracking-[0.16em] uppercase text-graphite/60 mt-3">RERA #{a.rera} · {a.langs.join(' · ')}</div>
                      <div className="grid grid-cols-2 gap-2 mt-6">
                        <a href={`tel:${a.phone.replace(/\s/g,'')}`} className="hairline border border-stone-200 px-4 py-3 text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:text-ochre transition cursor-pointer flex items-center justify-center gap-2"><PhoneIcon className="w-4 h-4" /> Call</a>
                        <button className="hairline border border-stone-200 px-4 py-3 text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:text-ochre transition cursor-pointer flex items-center justify-center gap-2"><WhatsappIcon /> WhatsApp</button>
                        <button className="hairline border border-stone-200 px-4 py-3 text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:text-ochre transition cursor-pointer flex items-center justify-center gap-2"><EmailIcon /> Email</button>
                        <button className="bg-graphite-900 text-porcelain px-4 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer">Book a meeting</button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 grid sm:grid-cols-3 gap-6">
                    {[['AED 4.2B', 'Lifetime sales'], ['184', 'Closed transactions'], ['9.4 yrs', 'With Concept Plus']].map(([n, k]) => (
                      <div key={k} className="border-t hairline border-stone-200 pt-4">
                        <div className="font-display text-graphite-900 num" style={{ fontSize: '28px', fontWeight: 400 }}>{n}</div>
                        <div className="text-[11px] tracking-[0.18em] uppercase text-graphite/60 mt-1">{k}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10">
                    <div className="eyebrow text-ochre">Active mandates</div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      {D.listings.slice(0, 4).map(l => (
                        <a key={l.id} href={`property.html?id=${l.id}`} className="flex gap-4 hairline border border-stone-200 bg-white p-3 hover:border-ochre transition cursor-pointer">
                          <img src={l.images[0]} alt="" className="w-20 h-20 object-cover" />
                          <div className="min-w-0 flex-1">
                            <div className="text-[13px] text-graphite-900 line-clamp-1">{l.title}</div>
                            <div className="text-[11px] text-graphite/60 mt-1">{l.community}</div>
                            <div className="text-[13px] num text-ochre mt-1">{fmtPrice(l.price, ctx.currency)}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      )}
    </PC>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//   SERVICES PAGE
// ═══════════════════════════════════════════════════════════════════════════
function ServicesPage() {
  const PC = __PC();
  const E = window.CONCEPT PLUS_EXTRA;
  return (
    <PC screenLabel="Services">
      {(ctx) => (
        <main>
          <PageHead crumbs={[{label:'Home', href:'index.html'}, {label:'Services'}]}
            eyebrow="Full-service brokerage" title="Eight services, one address book."
            sub="Most boutique brokerages pick a niche. We chose to keep the full chain in-house — sales, leasing, off-plan, management, finance, conveyancing — so a single director can carry you end-to-end." />

          <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-x-12 gap-y-16">
            {E.services.map((s, i) => (
              <div key={s.id} className="grid grid-cols-[60px_1fr] gap-6 items-start">
                <div className="font-display text-ochre num pt-1" style={{ fontSize: '32px', fontWeight: 300 }}>0{i+1}</div>
                <div>
                  <div className="eyebrow text-graphite/60">{s.eb}</div>
                  <div className="font-display mt-2 text-graphite-900" style={{ fontSize: 'clamp(26px, 2.6vw, 32px)', fontWeight: 400 }}>{s.title}</div>
                  <p className="text-[15px] text-graphite/85 mt-3 leading-[1.7] max-w-md">{s.blurb}</p>
                  <div className="mt-5 flex items-baseline gap-3 border-t hairline border-stone-200 pt-4 max-w-md">
                    <div className="font-display text-graphite-900 num" style={{ fontSize: '22px', fontWeight: 400 }}>{s.stats[0]}</div>
                    <div className="text-[11px] tracking-[0.18em] uppercase text-graphite/60">{s.stats[1]}</div>
                    <a href="#" className="ml-auto text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre gold-underline">Learn more →</a>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Promise strip */}
          <section className="bg-graphite-900 text-porcelain py-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-[1fr_1fr] gap-12 items-center">
              <div>
                <div className="eyebrow text-ochre">Our promise</div>
                <h3 className="font-display mt-3" style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', fontWeight: 300 }}>One director, the whole chain.</h3>
              </div>
              <p className="text-[15px] text-porcelain/80 leading-[1.8]">
                Concept Plus is a senior-only brokerage. The director who lists your home is the same person who answers when a buyer calls, sits across the table at negotiation, and signs you in at the DLD trustee office. No hand-offs, no juniors, no surprises.
              </p>
            </div>
          </section>
        </main>
      )}
    </PC>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//   CAREERS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function CareersPage() {
  const PC = __PC();
  const E = window.CONCEPT PLUS_EXTRA;
  const teams = ['All', ...Array.from(new Set(E.careers.map(c => c.team)))];
  const [team, setTeam] = useStateQ('All');
  const [openId, setOpenId] = useStateQ(null);
  const list = team === 'All' ? E.careers : E.careers.filter(c => c.team === team);
  const open = openId && E.careers.find(c => c.id === openId);

  return (
    <PC screenLabel="Careers">
      {(ctx) => (
        <main>
          <PageHead crumbs={[{label:'Home', href:'index.html'}, {label:'Careers'}]}
            eyebrow="Join Concept Plus" title="Senior people, on senior terms."
            sub="We hire experienced consultants who already command a following — and back them with the inventory, marketing and technology to compound it. Below: 10 open positions across the firm." />

          <section className="bg-porcelain-100 py-16 border-b hairline border-stone-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                ['Median tenure', '9.4 years'],
                ['RERA-licensed', '100%'],
                ['Languages spoken', '14 in office'],
                ['Director-level', '38%'],
              ].map(([k, v]) => (
                <div key={k} className="border-t hairline border-stone-200 pt-5">
                  <div className="font-display text-graphite-900 num" style={{ fontSize: 'clamp(32px, 3.6vw, 44px)', fontWeight: 300 }}>{v}</div>
                  <div className="text-[11px] tracking-[0.22em] uppercase text-graphite/60 mt-2">{k}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
            <div className="flex items-center gap-2 flex-wrap mb-8">
              {teams.map(t => (
                <button key={t} onClick={() => { setTeam(t); setOpenId(null); }} className={`px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase cursor-pointer transition ${team === t ? 'bg-graphite-900 text-porcelain' : 'hairline border border-stone-200 text-graphite hover:border-ochre hover:text-ochre'}`}>{t}</button>
              ))}
              <div className="ml-auto text-[12px] text-graphite/60">{list.length} open positions</div>
            </div>
            <div className="hairline border border-stone-200 bg-white">
              {list.map((c, i) => (
                <div key={c.id} className={i ? 'border-t hairline border-stone-200' : ''}>
                  <button onClick={() => setOpenId(openId === c.id ? null : c.id)} className="w-full grid grid-cols-[80px_1fr_180px_140px_120px_40px] items-center text-left px-6 py-5 hover:bg-porcelain-100 transition cursor-pointer">
                    <div className="text-[12px] num text-graphite/60">{c.id}</div>
                    <div className="text-[15px] text-graphite-900">{c.title}</div>
                    <div className="text-[12px] tracking-[0.16em] uppercase text-graphite/70">{c.team}</div>
                    <div className="text-[12px] tracking-[0.16em] uppercase text-graphite/70">{c.type}</div>
                    <div className="text-[12px] tracking-[0.16em] uppercase text-ochre">{c.exp}</div>
                    <div className={`text-graphite/60 transition ${openId === c.id ? 'rotate-180' : ''}`}>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.25"><path d="M6 9l6 6 6-6" /></svg>
                    </div>
                  </button>
                  {openId === c.id && (
                    <div className="px-6 pb-8 pt-2 grid lg:grid-cols-[1fr_320px] gap-10 bg-porcelain-100" data-screen-label="Career · Position">
                      <div>
                        <div className="eyebrow text-ochre">The role</div>
                        <p className="text-[15px] text-graphite/85 mt-3 leading-[1.7] max-w-2xl">
                          {c.title.split(' — ')[0]} at Concept Plus is a senior, mandate-carrying position. You will lead {c.team.toLowerCase()} engagements end-to-end: discovery, valuation or sourcing, mandate, marketing, negotiation, transfer. You report directly to a Managing Director.
                        </p>
                        <div className="eyebrow text-ochre mt-8">What we expect</div>
                        <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-graphite-800 max-w-2xl">
                          {[`${c.exp} of relevant Dubai experience`, 'RERA license held or readily transferable', 'A track record measurable in mandates closed, not leads worked', 'Discretion and senior-room presence', 'Native or near-native English; Arabic preferred', 'Comfort with our CRM and listings stack'].map(x => <li key={x} className="gold-tick">{x}</li>)}
                        </ul>
                        <div className="eyebrow text-ochre mt-8">What we offer</div>
                        <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[14px] text-graphite-800 max-w-2xl">
                          {['Senior commission structure', 'Inventory access from day one', 'In-house marketing, photography, conveyancing', 'No junior workload — you carry your own deals', 'Health insurance and visa', 'A senior peer group of 38 directors'].map(x => <li key={x} className="gold-tick">{x}</li>)}
                        </ul>
                      </div>
                      <aside className="bg-graphite-900 text-porcelain p-7">
                        <div className="eyebrow text-ochre">Apply</div>
                        <div className="text-[14px] text-porcelain/80 mt-3">Send a CV and a one-page note on the mandates you most want to carry.</div>
                        <div className="space-y-3 mt-6">
                          <input placeholder="Full name" className="w-full bg-transparent border-b border-porcelain/30 py-2 text-[14px] focus:outline-none focus:border-ochre" />
                          <input placeholder="Email address" className="w-full bg-transparent border-b border-porcelain/30 py-2 text-[14px] focus:outline-none focus:border-ochre" />
                          <input placeholder="Phone (UAE preferred)" className="w-full bg-transparent border-b border-porcelain/30 py-2 text-[14px] focus:outline-none focus:border-ochre" />
                          <button className="w-full bg-ochre text-graphite-900 px-5 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-porcelain transition cursor-pointer mt-3">Attach CV & apply</button>
                        </div>
                        <div className="text-[11px] text-porcelain/55 mt-5 leading-relaxed">
                          Applications reviewed within 5 working days. All applications confidential.
                        </div>
                      </aside>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </PC>
  );
}

// ─── Register ──────────────────────────────────────────────────────────────
window.__PAGES = window.__PAGES || {};
Object.assign(window.__PAGES, {
  sell: SellPage,
  developers: DevelopersPage,
  agents: AgentsPage,
  services: ServicesPage,
  careers: CareersPage,
});
