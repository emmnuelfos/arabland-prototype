// Concept Plus — sub-pages: Buy listings index, Property detail, Off-Plan project detail.
// Each page reuses Header/Footer/PropertyCard/Modals from the main app and mounts via window.__PAGE.

const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP, useRef: useRefP } = React;

// ─── Page chrome wrapper (shared header + footer + state) ──────────────────
function PageChrome({ children, screenLabel }) {
  const [currency, setCurrency] = useStateP('AED');
  const [areaUnit, setAreaUnit] = useStateP('sqft');
  const [lang, setLang] = useStateP('EN');
  const [shortlist, setShortlist] = useStateP(() => new Set());
  const [compare, setCompare]     = useStateP(() => new Set());
  const [shortlistOpen, setShortlistOpen] = useStateP(false);
  const [photoOpen, setPhotoOpen] = useStateP(false);
  const [mortgageOpen, setMortgageOpen] = useStateP(false);
  const [scheduleOpen, setScheduleOpen] = useStateP(false);
  const [paymentOpen, setPaymentOpen] = useStateP(false);
  const [mapOpen, setMapOpen] = useStateP(false);

  useReveal();

  const toggle = (set, setter, max) => (id) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else { if (max && next.size >= max) return; next.add(id); }
    setter(next);
  };
  const onShortlist = toggle(shortlist, setShortlist);
  const onCompare = toggle(compare, setCompare, 4);
  const D = window.CONCEPTPLUS_DATA;
  const shortlistItems = useMemoP(() => D.listings.filter(l => shortlist.has(l.id)), [shortlist]);
  const compareItems   = useMemoP(() => D.listings.filter(l => compare.has(l.id)), [compare]);
  const ctxValue = {
    currency, areaUnit, lang, shortlist, compare,
    onShortlist, onCompare,
    openPhotos: () => setPhotoOpen(true),
    openMortgage: () => setMortgageOpen(true),
    openSchedule: () => setScheduleOpen(true),
    openPayment: () => setPaymentOpen(true),
    openMap: () => setMapOpen(true),
  };

  return (
    <div data-screen-label={screenLabel} className="pt-[76px] lg:pt-[108px]">
      <Header
        solid
        shortlistCount={shortlist.size}
        onShortlist={() => setShortlistOpen(true)}
        onCompare={() => {}}
        currency={currency} setCurrency={setCurrency}
        areaUnit={areaUnit} setAreaUnit={setAreaUnit}
        lang={lang} setLang={setLang}
      />
      {typeof children === 'function' ? children(ctxValue) : children}
      <Footer />
      <PhotoLightbox open={photoOpen} listing={D.listings[0]} onClose={() => setPhotoOpen(false)} />
      <MortgageCalc open={mortgageOpen} listing={D.listings[0]} currency={currency} onClose={() => setMortgageOpen(false)} />
      <ShortlistDrawer open={shortlistOpen} items={shortlistItems} currency={currency} onRemove={onShortlist} onClose={() => setShortlistOpen(false)} />
      <ScheduleViewing open={scheduleOpen} listing={D.listings[0]} agents={D.agents} onClose={() => setScheduleOpen(false)} />
      <PaymentPlanModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
      <MapPreview open={mapOpen} currency={currency} onClose={() => setMapOpen(false)} />
      <CompareTray items={compareItems} currency={currency} agents={D.agents} onRemove={onCompare} onClear={() => setCompare(new Set())} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//   BUY LISTINGS PAGE
// ═══════════════════════════════════════════════════════════════════════════
function BuyPage() {
  const D = window.CONCEPTPLUS_DATA;
  const [tab, setTab] = useStateP('Buy');
  const [community, setCommunity] = useStateP('All');
  const [type, setType] = useStateP('All');
  const [beds, setBeds] = useStateP('Any');
  const [priceMax, setPriceMax] = useStateP(80000000);
  const [sort, setSort] = useStateP('Featured');
  const [view, setView] = useStateP('split'); // grid | split | map
  const [hoverId, setHoverId] = useStateP(null);

  // Build a richer listing pool by duplicating + tweaking the base 8 listings.
  const allListings = useMemoP(() => {
    const out = [];
    D.listings.forEach((l, i) => {
      out.push(l);
      out.push({ ...l, id: l.id + 'b', price: Math.round(l.price * 0.92), beds: Math.max(1, l.beds - 1), photoCount: l.photoCount + 4 });
      out.push({ ...l, id: l.id + 'c', price: Math.round(l.price * 1.18), beds: l.beds + 1, sqft: l.sqft + 600, photoCount: l.photoCount + 8 });
    });
    return out;
  }, []);

  const filtered = useMemoP(() => {
    let r = allListings.filter(l => {
      if (community !== 'All' && l.community !== community) return false;
      if (type !== 'All' && l.type !== type) return false;
      if (beds !== 'Any' && l.beds < parseInt(beds)) return false;
      if (l.price > priceMax) return false;
      return true;
    });
    if (sort === 'Price: low → high') r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === 'Price: high → low') r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === 'Newest') r = [...r].reverse();
    else if (sort === 'Largest') r = [...r].sort((a, b) => b.sqft - a.sqft);
    return r;
  }, [allListings, community, type, beds, priceMax, sort]);

  return (
    <PageChrome screenLabel="Buy · Listings">
      {(ctx) => (
        <main>
          {/* Title strip */}
          <section className="bg-porcelain-100 border-b hairline border-stone-200 pt-10 pb-8">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
              <div className="text-[11px] tracking-[0.22em] uppercase text-graphite/60 flex items-center gap-3">
                <a href="index.html" className="gold-underline">Home</a>
                <span>/</span>
                <span className="text-graphite-900">Properties for sale in Dubai</span>
              </div>
              <h1 className="font-display mt-4 text-graphite-900" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400, letterSpacing: '-0.01em' }}>
                Properties for sale in Dubai
              </h1>
              <p className="text-graphite/80 mt-3 max-w-2xl text-[15px]">
                {filtered.length.toLocaleString()} curated addresses across {new Set(allListings.map(l => l.community)).size} communities — every one walked, photographed and represented by a senior Concept Plus broker.
              </p>
            </div>
          </section>

          {/* Sticky filter bar */}
          <section className="sticky top-[76px] lg:top-[108px] z-30 bg-porcelain border-b hairline border-stone-200 py-4">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center gap-2 flex-wrap">
              {/* Tabs */}
              <div className="flex hairline border border-stone-200 bg-white">
                {['Buy', 'Rent', 'Off-Plan'].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-5 py-2.5 text-[12px] tracking-[0.18em] uppercase cursor-pointer transition ${tab === t ? 'bg-graphite-900 text-porcelain' : 'text-graphite hover:text-graphite-900'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <FilterSelect label="Community" value={community} onChange={setCommunity} options={['All', ...D.communities.map(c => c.name)]} />
              <FilterSelect label="Type" value={type} onChange={setType} options={['All', 'Apartment', 'Villa', 'Penthouse', 'Townhouse']} />
              <FilterSelect label="Beds" value={beds} onChange={setBeds} options={['Any', '1', '2', '3', '4', '5', '6']} />
              <PriceFilter value={priceMax} onChange={setPriceMax} currency={ctx.currency} />
              <button className="ml-auto text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre cursor-pointer hairline border border-stone-200 px-4 py-2.5 bg-white">More filters</button>
              <button onClick={() => { setCommunity('All'); setType('All'); setBeds('Any'); setPriceMax(80000000); }}
                className="text-[11px] tracking-[0.22em] uppercase text-graphite/70 hover:text-ochre cursor-pointer">Reset</button>
            </div>
          </section>

          {/* Result toolbar */}
          <section className="border-b hairline border-stone-200 py-4 bg-porcelain">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center gap-6 flex-wrap">
              <div className="text-[13px] text-graphite">
                <span className="num text-graphite-900 font-medium">{filtered.length.toLocaleString()}</span> addresses match
              </div>
              <div className="ml-auto flex items-center gap-4">
                <div className="text-[12px] tracking-[0.16em] uppercase text-graphite/60">Sort</div>
                <select value={sort} onChange={e => setSort(e.target.value)} className="text-[13px] hairline border border-stone-200 bg-white px-3 py-2 cursor-pointer">
                  {['Featured', 'Newest', 'Price: low → high', 'Price: high → low', 'Largest'].map(s => <option key={s}>{s}</option>)}
                </select>
                <div className="flex hairline border border-stone-200 bg-white">
                  {[['grid', 'Grid'], ['split', 'Split'], ['map', 'Map']].map(([v, l]) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`px-4 py-2 text-[12px] tracking-[0.16em] uppercase cursor-pointer ${view === v ? 'bg-graphite-900 text-porcelain' : 'text-graphite hover:text-graphite-900'}`}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Results body */}
          {view === 'map' ? (
            <section className="h-[calc(100vh-220px)] bg-graphite-800">
              <StylizedMap listings={filtered.slice(0, 24)} hoverId={hoverId} onHover={setHoverId} currency={ctx.currency} />
            </section>
          ) : view === 'split' ? (
            <section className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-0">
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                <div className="p-6 md:p-10 grid sm:grid-cols-2 gap-6">
                  {filtered.map(l => (
                    <div key={l.id} onMouseEnter={() => setHoverId(l.id)} onMouseLeave={() => setHoverId(null)}>
                      <PropertyCard listing={l} agents={D.agents} currency={ctx.currency} areaUnit={ctx.areaUnit}
                        variant="minimal"
                        shortlistOn={ctx.shortlist.has(l.id)} comparedOn={ctx.compare.has(l.id)}
                        onShortlist={() => ctx.onShortlist(l.id)} onCompare={() => ctx.onCompare(l.id)}
                        onOpen={() => { window.location.href = `property.html?id=${l.id}`; }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block sticky top-[200px] bg-graphite-800" style={{ height: 'calc(100vh - 200px)' }}>
                <StylizedMap listings={filtered.slice(0, 24)} hoverId={hoverId} onHover={setHoverId} currency={ctx.currency} />
              </div>
            </section>
          ) : (
            <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(l => (
                <PropertyCard key={l.id} listing={l} agents={D.agents} currency={ctx.currency} areaUnit={ctx.areaUnit}
                  variant="editorial"
                  shortlistOn={ctx.shortlist.has(l.id)} comparedOn={ctx.compare.has(l.id)}
                  onShortlist={() => ctx.onShortlist(l.id)} onCompare={() => ctx.onCompare(l.id)}
                  onOpen={() => { window.location.href = `property.html?id=${l.id}`; }} />
              ))}
            </section>
          )}

          {/* Pagination */}
          <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 flex items-center justify-between border-t hairline border-stone-200">
            <div className="text-[13px] text-graphite">Showing <span className="num text-graphite-900 font-medium">1–{Math.min(filtered.length, 24)}</span> of <span className="num">{filtered.length}</span></div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map(n => (
                <button key={n} className={`w-9 h-9 grid place-items-center text-[13px] cursor-pointer ${n === 1 ? 'bg-graphite-900 text-porcelain' : 'hairline border border-stone-200 hover:border-ochre hover:text-ochre'}`}>{n}</button>
              ))}
              <button className="px-4 h-9 text-[12px] tracking-[0.16em] uppercase hairline border border-stone-200 hover:border-ochre hover:text-ochre cursor-pointer">Next →</button>
            </div>
          </section>

          {/* Below the fold context */}
          <section className="bg-porcelain-100 py-20 border-t hairline border-stone-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-12">
              <div className="md:col-span-1">
                <div className="eyebrow text-ochre">Why Concept Plus</div>
                <h3 className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(28px, 3vw, 38px)', fontWeight: 400 }}>
                  We don't list everything. We represent the right thing.
                </h3>
              </div>
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-x-12 gap-y-8 text-[14px] text-graphite-800">
                {[
                  ['Verified inventory', 'Every address is walked, photographed and re-verified by a senior Concept Plus broker before it appears here.'],
                  ['DLD-registered brokers', 'All Concept Plus brokers hold valid Dubai Land Department registration. License numbers shown on every listing.'],
                  ['No portal noise', 'No duplicates, no expired posts, no inflated photos. If it isn\'t live, it isn\'t here.'],
                  ['Senior representation', 'You speak to a director, not a junior. Median Concept Plus broker tenure: 9 years.'],
                ].map(([t, d]) => (
                  <div key={t}>
                    <div className="text-graphite-900 font-medium">{t}</div>
                    <div className="text-graphite/80 mt-1.5">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </PageChrome>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="text-[13px] hairline border border-stone-200 bg-white pl-4 pr-10 py-2.5 cursor-pointer appearance-none">
        {options.map(o => <option key={o} value={o}>{label}: {o}</option>)}
      </select>
      <svg viewBox="0 0 24 24" className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6" /></svg>
    </div>
  );
}
function PriceFilter({ value, onChange, currency }) {
  return (
    <div className="hairline border border-stone-200 bg-white px-4 py-2 flex items-center gap-3 min-w-[260px]">
      <div className="text-[12px] tracking-[0.16em] uppercase text-graphite/60">Up to</div>
      <input type="range" min={1000000} max={80000000} step={500000} value={value} onChange={e => onChange(parseInt(e.target.value))}
        className="flex-1 accent-[#AC7B43]" />
      <div className="text-[13px] num text-graphite-900 w-[68px] text-right">{fmtPrice(value, currency)}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//   PROPERTY DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════
function PropertyPage() {
  const D = window.CONCEPTPLUS_DATA;
  const params = new URLSearchParams(window.location.search);
  const wantedId = params.get('id');
  // Search base + virtualized variants from BuyPage
  let listing = D.listings.find(l => l.id === wantedId);
  if (!listing && wantedId) {
    const base = D.listings.find(l => wantedId.startsWith(l.id));
    if (base) {
      const suffix = wantedId.slice(base.id.length);
      listing = suffix === 'b' ? { ...base, id: wantedId, price: Math.round(base.price * 0.92), beds: Math.max(1, base.beds - 1), photoCount: base.photoCount + 4 }
              : suffix === 'c' ? { ...base, id: wantedId, price: Math.round(base.price * 1.18), beds: base.beds + 1, sqft: base.sqft + 600, photoCount: base.photoCount + 8 }
              : base;
    }
  }
  if (!listing) listing = D.listings[0];
  const agent = D.agents[listing.agent];

  return (
    <PageChrome screenLabel="Property Detail">
      {(ctx) => (
        <main>
          {/* Breadcrumb */}
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-8 pb-4 text-[11px] tracking-[0.22em] uppercase text-graphite/60 flex items-center gap-3">
            <a href="index.html" className="gold-underline">Home</a><span>/</span>
            <a href="buy.html" className="gold-underline">Buy</a><span>/</span>
            <a href="buy.html" className="gold-underline">{listing.community}</a><span>/</span>
            <span className="text-graphite-900">{listing.id}</span>
          </div>

          {/* Photo grid header */}
          <section className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[68vh] min-h-[480px]">
              <button onClick={ctx.openPhotos} className="col-span-2 row-span-2 overflow-hidden bg-stone-200 cursor-pointer relative group">
                <img src={listing.images[0]} alt="" className="w-full h-full object-cover transition group-hover:scale-[1.02]" />
              </button>
              {[1, 2, 3, 4].map(i => (
                <button key={i} onClick={ctx.openPhotos} className="overflow-hidden bg-stone-200 cursor-pointer relative group">
                  <img src={listing.images[i % listing.images.length]} alt="" className="w-full h-full object-cover transition group-hover:scale-[1.02]" />
                  {i === 4 && (
                    <div className="absolute inset-0 bg-graphite-900/55 grid place-items-center text-porcelain">
                      <div className="text-center"><CameraIcon className="w-6 h-6 mx-auto mb-2" /><div className="eyebrow">View all {listing.photoCount}</div></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Title row */}
          <section className="max-w-[1400px] mx-auto px-6 md:px-10 pt-10 pb-8 grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="eyebrow text-ochre">{listing.community} · {listing.subCommunity}</div>
              <h1 className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.05 }}>
                {listing.title}
              </h1>
              <div className="flex items-center gap-6 mt-5 text-[14px] text-graphite-800">
                <span className="flex items-center gap-2"><BedIcon /> {listing.beds} beds</span>
                <span className="flex items-center gap-2"><BathIcon /> {listing.baths} baths</span>
                <span className="flex items-center gap-2"><AreaIcon /> {listing.sqft.toLocaleString()} {ctx.areaUnit}</span>
                <span className="text-graphite/60">·</span>
                <span>{listing.type}</span>
                <span>·</span>
                <span>{listing.furnishing}</span>
                {listing.dld && <span className="ml-2 text-[11px] tracking-[0.22em] uppercase text-ochre flex items-center gap-2"><CheckIcon className="w-3 h-3" /> DLD verified</span>}
              </div>
            </div>
            <div className="md:text-right">
              <div className="eyebrow text-graphite/60">Asking price</div>
              <div className="font-display text-graphite-900 mt-2" style={{ fontSize: 'clamp(40px, 4.5vw, 56px)', fontWeight: 400 }}>
                {fmtPrice(listing.price, ctx.currency)}
              </div>
              <div className="text-[12px] text-graphite/70 num mt-1">
                {fmtPrice(Math.round(listing.price / listing.sqft), ctx.currency)} / {ctx.areaUnit}
              </div>
            </div>
          </section>

          {/* Body two-col with sticky agent rail */}
          <section className="max-w-[1400px] mx-auto px-6 md:px-10 pb-24 grid lg:grid-cols-[1fr_360px] gap-16">
            <div>
              {/* About */}
              <Block eyebrow="About this address">
                <p className="text-[16px] leading-[1.75] text-graphite-800 max-w-2xl">
                  A garden-fronted residence on one of the most sought-after fronds of Palm Jumeirah, this {listing.beds}-bedroom {listing.type.toLowerCase()} reads as quiet architecture: limestone, oak, deep-set windows, and a sequence of rooms that step gently towards the water. The principal suite occupies the upper floor in full; the ground floor opens through full-width sliding panels onto a private pool and a planted garden facing the lagoon.
                </p>
                <p className="text-[16px] leading-[1.75] text-graphite-800 max-w-2xl mt-5">
                  Represented exclusively by Concept Plus. Title deed in seller's name, mortgage-free, ready to transfer. Viewings by appointment, accompanied by the listing director.
                </p>
              </Block>

              {/* Facts grid */}
              <Block eyebrow="Property facts">
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-12 max-w-2xl border-t hairline border-stone-200 pt-6">
                  {[
                    ['Property type', listing.type],
                    ['Sub-community', listing.subCommunity],
                    ['Built-up area', `${listing.sqft.toLocaleString()} ${ctx.areaUnit}`],
                    ['Plot area', `${(listing.sqft * 1.4).toLocaleString()} ${ctx.areaUnit}`],
                    ['Furnishing', listing.furnishing],
                    ['Year built', '2019'],
                    ['Bedrooms', listing.beds],
                    ['Bathrooms', listing.baths],
                    ['Parking', '4 covered'],
                    ['Service charge', `AED 18 / ${ctx.areaUnit} / yr`],
                    ['Title deed', 'Freehold'],
                    ['Reference', listing.id],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between border-b hairline border-stone-200 pb-3">
                      <span className="text-[12px] tracking-[0.16em] uppercase text-graphite/60">{k}</span>
                      <span className="text-[14px] text-graphite-900 num">{v}</span>
                    </div>
                  ))}
                </div>
              </Block>

              {/* Amenities */}
              <Block eyebrow="Amenities">
                <div className="grid sm:grid-cols-3 gap-x-10 gap-y-3 text-[14px] text-graphite-800 max-w-2xl">
                  {['Private pool','Beach access','Landscaped garden','Smart-home wiring','Service quarters','Maid\'s room','Driver\'s room','Built-in wardrobes','Walk-in closets','Floor-to-ceiling windows','Sea view','Concierge','24-hr security','EV charging','Cinema room','Wine cellar','Gym','Sauna','Steam room','Private elevator','Solar shading'].map(a => (
                      <div key={a} className="gold-tick">{a}</div>
                    ))}
                </div>
              </Block>

              {/* Floor plan teaser */}
              <Block eyebrow="Floor plan">
                <button onClick={ctx.openPhotos} className="block w-full max-w-2xl bg-porcelain-100 hairline border border-stone-200 aspect-[16/10] relative cursor-pointer hover:border-ochre transition group">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <svg viewBox="0 0 200 120" className="w-32 h-20 mx-auto" fill="none" stroke="#4D4B4A" strokeWidth="1">
                        <rect x="10" y="10" width="180" height="100" />
                        <line x1="80" y1="10" x2="80" y2="60" /><line x1="80" y1="60" x2="190" y2="60" />
                        <line x1="10" y1="80" x2="80" y2="80" /><line x1="40" y1="80" x2="40" y2="110" />
                        <line x1="130" y1="60" x2="130" y2="110" />
                        <circle cx="100" cy="35" r="3" /><circle cx="50" cy="95" r="3" /><circle cx="160" cy="85" r="3" />
                      </svg>
                      <div className="eyebrow text-graphite mt-4 group-hover:text-ochre transition">Open full floor plan →</div>
                    </div>
                  </div>
                </button>
              </Block>

              {/* Mortgage CTA strip */}
              <section className="bg-porcelain-100 hairline border border-stone-200 p-8 grid md:grid-cols-[1fr_auto] items-center gap-6 max-w-2xl">
                <div>
                  <div className="eyebrow text-ochre">Mortgage</div>
                  <div className="font-display mt-1 text-graphite-900" style={{ fontSize: '24px', fontWeight: 400 }}>From {fmtPrice(Math.round(listing.price * 0.0045), ctx.currency)} / month</div>
                  <div className="text-[12px] text-graphite/70 mt-1">75% LTV · 25-year term · 4.49% indicative rate</div>
                </div>
                <button onClick={ctx.openMortgage} className="px-6 py-3.5 bg-graphite-900 text-porcelain text-[11px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer">Open calculator</button>
              </section>

              {/* Location */}
              <Block eyebrow="Location">
                <div className="bg-graphite-800 h-[420px] hairline border border-stone-200 max-w-2xl">
                  <StylizedMap listings={[listing]} hoverId={listing.id} onHover={() => {}} currency={ctx.currency} />
                </div>
                <div className="mt-5 grid sm:grid-cols-3 gap-6 max-w-2xl text-[13px]">
                  {[['Beach', '120 m'], ['Atlantis', '2.4 km'], ['DXB Airport', '34 km'], ['Marina', '8.6 km'], ['Downtown', '28 km'], ['School (DESS)', '12 km']].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between border-b hairline border-stone-200 pb-2">
                      <span className="text-graphite/60">{k}</span><span className="text-graphite-900 num">{v}</span>
                    </div>
                  ))}
                </div>
              </Block>
            </div>

            {/* Sticky agent rail */}
            <aside className="lg:sticky lg:top-[128px] self-start space-y-4">
              <div className="bg-white hairline border border-stone-200 p-6">
                <div className="flex items-center gap-4">
                  <img src={agent.img} alt="" className="w-16 h-16 object-cover rounded-full" />
                  <div className="min-w-0">
                    <div className="text-[15px] text-graphite-900 font-medium truncate">{agent.name}</div>
                    <div className="text-[12px] text-graphite/70 truncate">{agent.role}</div>
                  </div>
                </div>
                <div className="text-[11px] tracking-[0.16em] uppercase text-graphite/60 mt-4 flex items-center gap-2">
                  <span>RERA #{agent.rera}</span>
                  <span className="text-graphite/30">·</span>
                  <span>{agent.langs.join(' · ')}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-5">
                  <button onClick={ctx.openSchedule} className="w-full bg-graphite-900 text-porcelain px-4 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer">Schedule a viewing</button>
                  <a href={`tel:${agent.phone.replace(/\s/g, '')}`} className="w-full hairline border border-stone-200 px-4 py-3 text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer flex items-center justify-center gap-2"><PhoneIcon className="w-4 h-4" /> Call {agent.phone}</a>
                  <button className="w-full hairline border border-stone-200 px-4 py-3 text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer flex items-center justify-center gap-2"><WhatsappIcon /> WhatsApp</button>
                  <button className="w-full hairline border border-stone-200 px-4 py-3 text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer flex items-center justify-center gap-2"><EmailIcon /> Email</button>
                </div>
              </div>
              <div className="bg-porcelain-100 hairline border border-stone-200 p-6 text-[12px] text-graphite/80 leading-relaxed">
                <div className="eyebrow text-graphite-900">Senior representation</div>
                <p className="mt-3">You speak to a director, not a junior. Every Concept Plus viewing is led by the listing broker, accompanied if requested by an investment advisor.</p>
              </div>
              <button onClick={() => ctx.onShortlist(listing.id)} className="w-full hairline border border-stone-200 bg-white px-4 py-3 text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer flex items-center justify-center gap-2">
                <HeartIcon /> Save to shortlist
              </button>
              <button onClick={() => ctx.onCompare(listing.id)} className="w-full hairline border border-stone-200 bg-white px-4 py-3 text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer flex items-center justify-center gap-2">
                <CompareIcon /> Add to compare
              </button>
            </aside>
          </section>

          {/* Similar listings */}
          <section className="bg-porcelain-100 py-20 border-t hairline border-stone-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
              <div className="flex items-baseline justify-between mb-10">
                <div>
                  <div className="eyebrow text-ochre">More in {listing.community}</div>
                  <h3 className="font-display mt-2 text-graphite-900" style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 400 }}>Similar addresses</h3>
                </div>
                <a href="buy.html" className="text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre gold-underline">View all →</a>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {D.listings.filter(l => l.id !== listing.id).slice(0, 3).map(l => (
                  <PropertyCard key={l.id} listing={l} agents={D.agents} currency={ctx.currency} areaUnit={ctx.areaUnit}
                    variant="editorial"
                    shortlistOn={ctx.shortlist.has(l.id)} comparedOn={ctx.compare.has(l.id)}
                    onShortlist={() => ctx.onShortlist(l.id)} onCompare={() => ctx.onCompare(l.id)}
                    onOpen={() => { window.location.href = `property.html?id=${l.id}`; }} />
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </PageChrome>
  );
}

function Block({ eyebrow, children }) {
  return (
    <div className="mb-14">
      <div className="eyebrow text-ochre">{eyebrow}</div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//   OFF-PLAN PROJECT DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════
function OffPlanPage() {
  const D = window.CONCEPTPLUS_DATA;
  const params = new URLSearchParams(window.location.search);
  const wantedId = params.get('id');
  const project = D.offPlan.find(p => p.id === wantedId) || D.offPlan[0];

  const milestones = [
    { pct: 10, label: 'On booking', when: 'Reservation' },
    { pct: 20, label: '20% during construction', when: '6 months' },
    { pct: 20, label: '20% on 50% completion', when: 'Q3 2026' },
    { pct: 10, label: '10% on 75% completion', when: 'Q1 2027' },
    { pct: 40, label: '40% on handover', when: project.completion },
  ];

  const [unitFilter, setUnitFilter] = useStateP('All');
  const units = useMemoP(() => {
    const types = ['1BR', '2BR', '3BR', '3BR Duplex', '4BR Penthouse'];
    return types.flatMap((t, i) => Array.from({ length: 3 }, (_, j) => ({
      id: `${project.id}-U${(i + 1) * 100 + j}`,
      type: t,
      tower: ['North', 'South'][j % 2],
      level: 12 + i * 5 + j * 3,
      sqft: [820, 1240, 1860, 2400, 3580][i] + j * 60,
      price: project.from + i * 1100000 + j * 280000,
      view: ['Sea view', 'Skyline', 'Pool deck'][j % 3],
      status: ['Available', 'Available', 'Reserved'][j % 3],
    })));
  }, []);
  const filteredUnits = unitFilter === 'All' ? units : units.filter(u => u.type === unitFilter);

  return (
    <PageChrome screenLabel="Off-Plan · Project">
      {(ctx) => (
        <main>
          {/* Hero */}
          <section className="relative h-[80vh] min-h-[560px] overflow-hidden bg-graphite-900">
            <img src={project.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite-900/95 via-graphite-900/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="max-w-[1400px] mx-auto w-full px-6 md:px-10 pb-16 text-porcelain">
                <div className="text-[11px] tracking-[0.22em] uppercase text-porcelain/70 flex items-center gap-3">
                  <a href="index.html" className="gold-underline">Home</a><span>/</span>
                  <a href="buy.html" className="gold-underline">Off-Plan</a><span>/</span>
                  <span className="text-ochre">{project.developer}</span>
                </div>
                <h1 className="font-display mt-5" style={{ fontSize: 'clamp(48px, 7vw, 96px)', fontWeight: 300, lineHeight: 1.0 }}>
                  {project.name}
                </h1>
                <div className="mt-6 max-w-2xl text-[16px] text-porcelain/80">
                  {project.units} residences across two towers, designed by Foster + Partners. A new chapter of waterfront living, brought to market exclusively through Concept Plus.
                </div>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
                  {[
                    ['From', fmtPrice(project.from, ctx.currency)],
                    ['Handover', project.completion],
                    ['Status', project.status],
                    ['Units', project.units],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[11px] tracking-[0.22em] uppercase text-ochre">{k}</div>
                      <div className="font-display mt-2 num" style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 300 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Sticky in-page nav */}
          <section className="sticky top-[76px] lg:top-[108px] z-30 bg-porcelain border-b hairline border-stone-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center gap-8 overflow-x-auto no-scrollbar">
              {['Overview', 'Payment plan', 'Units', 'Floor plans', 'Location', 'Developer'].map((s, i) => (
                <a key={s} href={`#${s.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`text-[12px] tracking-[0.18em] uppercase py-5 whitespace-nowrap cursor-pointer transition border-b-2 ${i === 0 ? 'border-ochre text-graphite-900' : 'border-transparent text-graphite hover:text-graphite-900'}`}>{s}</a>
              ))}
              <button className="ml-auto bg-graphite-900 text-porcelain px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer">Reserve a unit</button>
            </div>
          </section>

          {/* Overview */}
          <section id="overview" className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 grid lg:grid-cols-[1fr_1fr] gap-16">
            <div>
              <div className="eyebrow text-ochre">The project</div>
              <h2 className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400, letterSpacing: '-0.01em' }}>
                A quiet rewriting of waterfront luxury.
              </h2>
              <p className="text-[16px] leading-[1.8] text-graphite-800 mt-6 max-w-xl">
                Two slender towers, set back from a 380-metre private beach, framed by a planted promenade. The architecture is restrained — limestone, weathered bronze, full-height glazing — and the residences face the open Gulf. Interiors by Yabu Pushelberg; landscape by Vladimir Djurovic.
              </p>
              <p className="text-[16px] leading-[1.8] text-graphite-800 mt-5 max-w-xl">
                Amenities include a residents' beach club, a 50-metre lap pool, a wellness floor with hammam and spa, two private cinema rooms, a residents' library, a 12-cover private dining room, and a staffed concierge.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src={D.communities[0].image} alt="" className="aspect-[3/4] object-cover" />
              <img src={D.communities[5].image} alt="" className="aspect-[3/4] object-cover mt-12" />
              <img src={D.listings[0].images[0]} alt="" className="aspect-[3/4] object-cover" />
              <img src={D.listings[6].images[0]} alt="" className="aspect-[3/4] object-cover mt-12" />
            </div>
          </section>

          {/* Payment plan */}
          <section id="payment-plan" className="bg-graphite-900 text-porcelain py-24">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
              <div className="grid md:grid-cols-[1fr_auto] items-end gap-8 mb-12">
                <div>
                  <div className="eyebrow text-ochre">Payment plan</div>
                  <h2 className="font-display mt-3" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 300 }}>10 / 60 / 30, over four years.</h2>
                </div>
                <button onClick={ctx.openPayment} className="hairline border border-porcelain/40 px-5 py-3 text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:text-ochre transition cursor-pointer">Open full schedule</button>
              </div>

              {/* Timeline */}
              <div className="relative mt-16">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-porcelain/20" />
                <div className="grid grid-cols-5 relative">
                  {milestones.map((m, i) => (
                    <div key={i} className="text-center relative">
                      <div className="text-[11px] tracking-[0.22em] uppercase text-porcelain/60 mb-6 min-h-[28px]">{m.when}</div>
                      <div className="w-3 h-3 bg-ochre mx-auto" />
                      <div className="font-display mt-6 num" style={{ fontSize: '36px', fontWeight: 300 }}>{m.pct}<span className="text-[18px] text-porcelain/60">%</span></div>
                      <div className="text-[12px] text-porcelain/70 mt-2">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 grid md:grid-cols-3 gap-8 text-[13px] text-porcelain/80">
                {[['Booking deposit', fmtPrice(project.from * 0.1, ctx.currency), '10% on reservation, refundable in 14 days.'],
                  ['DLD 4% fee', fmtPrice(project.from * 0.04, ctx.currency), 'Payable to Dubai Land Department on registration.'],
                  ['Service charge', `AED 18 / sqft / yr`, 'Payable from handover; first year billed in arrears.']].map(([k, v, n]) => (
                    <div key={k} className="border-t hairline border-porcelain/20 pt-5">
                      <div className="eyebrow text-ochre">{k}</div>
                      <div className="font-display mt-2 num" style={{ fontSize: '22px', fontWeight: 300 }}>{v}</div>
                      <div className="text-porcelain/60 mt-2">{n}</div>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Units table */}
          <section id="units" className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
            <div className="grid md:grid-cols-[1fr_auto] items-end gap-8 mb-10">
              <div>
                <div className="eyebrow text-ochre">Available units</div>
                <h2 className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 400 }}>{filteredUnits.filter(u => u.status === 'Available').length} residences available</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['All', '1BR', '2BR', '3BR', '3BR Duplex', '4BR Penthouse'].map(t => (
                  <button key={t} onClick={() => setUnitFilter(t)}
                    className={`px-4 py-2.5 text-[11px] tracking-[0.18em] uppercase whitespace-nowrap cursor-pointer transition ${unitFilter === t ? 'bg-graphite-900 text-porcelain' : 'hairline border border-stone-200 text-graphite hover:border-ochre hover:text-ochre'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="hairline border border-stone-200 overflow-hidden">
              <div className="grid grid-cols-[80px_1fr_100px_80px_120px_1fr_100px_140px_120px] gap-0 bg-porcelain-100 border-b hairline border-stone-200 text-[11px] tracking-[0.16em] uppercase text-graphite/60">
                {['Unit', 'Type', 'Tower', 'Level', 'Area', 'View', 'Status', 'Price', ''].map((h, i) => (
                  <div key={i} className="px-4 py-4">{h}</div>
                ))}
              </div>
              {filteredUnits.slice(0, 12).map((u, i) => (
                <div key={u.id} className={`grid grid-cols-[80px_1fr_100px_80px_120px_1fr_100px_140px_120px] items-center text-[14px] border-b hairline border-stone-200 ${i % 2 ? 'bg-porcelain-100' : 'bg-white'} ${u.status === 'Reserved' ? 'opacity-50' : ''} hover:bg-ochre/5 transition`}>
                  <div className="px-4 py-4 num text-graphite/60">{u.id.slice(-4)}</div>
                  <div className="px-4 py-4 text-graphite-900">{u.type}</div>
                  <div className="px-4 py-4 text-graphite">{u.tower}</div>
                  <div className="px-4 py-4 num text-graphite">{u.level}</div>
                  <div className="px-4 py-4 num text-graphite">{u.sqft.toLocaleString()} sqft</div>
                  <div className="px-4 py-4 text-graphite">{u.view}</div>
                  <div className="px-4 py-4">
                    <span className={`text-[11px] tracking-[0.16em] uppercase ${u.status === 'Available' ? 'text-ochre' : 'text-graphite/50'}`}>{u.status}</span>
                  </div>
                  <div className="px-4 py-4 num text-graphite-900">{fmtPrice(u.price, ctx.currency)}</div>
                  <div className="px-4 py-4">
                    {u.status === 'Available' && (
                      <button onClick={ctx.openSchedule} className="text-[11px] tracking-[0.16em] uppercase text-graphite hover:text-ochre cursor-pointer gold-underline">Reserve →</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[12px] text-graphite/60 mt-5">Indicative pricing in AED; full schedule of payment available on request. Floor plans, finishes and views subject to developer approval.</div>
          </section>

          {/* Location */}
          <section id="location" className="bg-porcelain-100 py-24 border-t hairline border-stone-200">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1fr_1fr] gap-12">
              <div>
                <div className="eyebrow text-ochre">Location</div>
                <h2 className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(32px, 4vw, 44px)', fontWeight: 400 }}>On the right edge of the city.</h2>
                <p className="text-[15px] leading-[1.8] text-graphite-800 mt-5 max-w-md">
                  Set on a private cove, eight minutes from Downtown by the new coastal road, twenty-eight minutes from DXB Airport, and three minutes from the Madinat retail and dining district.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 max-w-md text-[13px]">
                  {[['DXB Airport', '28 min'], ['Downtown', '8 min'], ['Madinat', '3 min'], ['Marina', '12 min'], ['Mall of the Emirates', '7 min'], ['Beach access', 'On site']].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between border-b hairline border-stone-200 pb-2">
                      <span className="text-graphite/60">{k}</span><span className="text-graphite-900 num">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-graphite-800 h-[480px] hairline border border-stone-200">
                <StylizedMap listings={D.listings.slice(0, 1)} hoverId={D.listings[0].id} onHover={() => {}} currency={ctx.currency} />
              </div>
            </div>
          </section>

          {/* Developer */}
          <section id="developer" className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 grid md:grid-cols-[2fr_3fr] gap-16 items-start">
            <div>
              <div className="eyebrow text-ochre">Developer</div>
              <div className="font-display mt-3 text-graphite-900" style={{ fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 400, letterSpacing: '-0.01em' }}>{project.developer}</div>
              <div className="mt-4 grid grid-cols-3 gap-6 text-[13px]">
                {[['Founded', '1997'], ['Delivered', '76 projects'], ['Pipeline', '14 active']].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[11px] tracking-[0.16em] uppercase text-graphite/60">{k}</div>
                    <div className="font-display mt-1 num" style={{ fontSize: '22px', fontWeight: 400 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[16px] leading-[1.8] text-graphite-800">
                A reference developer for Dubai's most considered residential addresses, with a 30-year track record of on-time delivery and a portfolio that includes seven of the city's ten highest-priced waterfront communities. Concept Plus represents {project.developer} as an exclusive sales partner for {project.name}.
              </p>
              <button className="mt-8 hairline border border-stone-200 px-5 py-3 text-[11px] tracking-[0.22em] uppercase text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer">View developer profile →</button>
            </div>
          </section>

          {/* CTA strip */}
          <section className="bg-graphite-900 text-porcelain py-20">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="eyebrow text-ochre">Reserve</div>
                <h3 className="font-display mt-3" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', fontWeight: 300 }}>Speak with the {project.name} team.</h3>
                <p className="text-porcelain/70 mt-2 max-w-xl">Private viewings of the show apartment available by appointment. AED 100,000 reservation fee, refundable within 14 days.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={ctx.openSchedule} className="bg-ochre text-graphite-900 px-6 py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 hover:text-porcelain transition cursor-pointer">Book a viewing</button>
                <button onClick={ctx.openPayment} className="hairline border border-porcelain/40 px-6 py-4 text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:text-ochre transition cursor-pointer">Payment plan</button>
              </div>
            </div>
          </section>
        </main>
      )}
    </PageChrome>
  );
}

// ─── Register pages (mount happens in boot.jsx) ────────────────────────────
window.__PAGES = window.__PAGES || {};
Object.assign(window.__PAGES, { buy: BuyPage, property: PropertyPage, 'off-plan': OffPlanPage });
window.PageChrome = PageChrome; // share with pages2.jsx
