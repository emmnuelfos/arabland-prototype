// Concept Plus — modals & overlays: PhotoLightbox, MortgageCalc, CompareTray,
// ShortlistDrawer, Schedule-a-Viewing, Payment Plan, Stylized Map, PropertyDetail.

const { useState: useStateM, useEffect: useEffectM, useMemo: useMemoM, useRef: useRefM } = React;

function Overlay({ open, onClose, children, max = 'max-w-6xl', side }) {
  useEffectM(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  if (side) {
    return (
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-graphite-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className={`absolute top-0 ${side === 'right' ? 'right-0' : 'left-0'} bottom-0 w-full sm:w-[480px] bg-porcelain shadow-2xl overflow-auto`}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 md:p-8">
      <div className="absolute inset-0 bg-graphite-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-porcelain w-full ${max} max-h-[92vh] overflow-auto`}>{children}</div>
    </div>
  );
}

// ─── Photo Lightbox ───────────────────────────────────────────────────────
function PhotoLightbox({ open, onClose, listing }) {
  const [idx, setIdx] = useStateM(0);
  const [tab, setTab] = useStateM('Photos');
  useEffectM(() => { setIdx(0); setTab('Photos'); }, [listing?.id]);
  if (!listing) return null;
  const photos = [...listing.images, ...listing.images, ...listing.images].slice(0, Math.max(8, listing.photoCount));
  const current = photos[idx % photos.length];
  return (
    <Overlay open={open} onClose={onClose} max="max-w-[1400px]">
      <div className="bg-graphite-900 text-porcelain min-h-[60vh]">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 hairline border-b border-stone/20">
          <div className="flex items-center gap-8">
            {['Photos','Floor Plan','Video Tour','3D Tour'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`text-[11px] tracking-[0.22em] uppercase pb-1 cursor-pointer ${tab === t ? 'text-ochre border-b border-ochre' : 'text-porcelain/70 hover:text-porcelain'}`}>{t}</button>
            ))}
          </div>
          <button onClick={onClose} className="cursor-pointer text-porcelain/85 hover:text-ochre"><CloseIcon /></button>
        </div>
        {tab === 'Photos' && (
          <div className="grid lg:grid-cols-[1fr_220px]">
            <div className="relative aspect-[16/10] bg-graphite-900 flex items-center justify-center overflow-hidden">
              <img src={current} alt="" className="w-full h-full object-cover" />
              <button onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center bg-graphite-900/70 text-porcelain hover:bg-ochre transition cursor-pointer"><ArrowIcon dir="left" /></button>
              <button onClick={() => setIdx((i) => (i + 1) % photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 grid place-items-center bg-graphite-900/70 text-porcelain hover:bg-ochre transition cursor-pointer"><ArrowIcon /></button>
              <div className="absolute bottom-4 left-4 text-[11px] tracking-[0.22em] uppercase text-porcelain/85 num">{(idx % photos.length) + 1} / {photos.length}</div>
            </div>
            <div className="hidden lg:block bg-graphite-900 max-h-[60vh] overflow-auto p-3 space-y-3">
              {photos.map((p, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`block w-full aspect-[4/3] overflow-hidden cursor-pointer ${i === idx % photos.length ? 'ring-2 ring-ochre' : 'opacity-70 hover:opacity-100'}`}>
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
        {tab !== 'Photos' && (
          <div className="aspect-[16/10] grid place-items-center text-stone-200 ph-stripe opacity-40">
            <div className="text-center font-mono text-[12px]">[ {tab} placeholder ]</div>
          </div>
        )}
      </div>
    </Overlay>
  );
}

// ─── Mortgage Calculator ──────────────────────────────────────────────────
function MortgageCalc({ open, onClose, listing, currency }) {
  const initialPrice = listing?.price || 5000000;
  const [price, setPrice] = useStateM(initialPrice);
  const [down, setDown] = useStateM(25);
  const [years, setYears] = useStateM(25);
  const [rate, setRate] = useStateM(4.25);
  useEffectM(() => { if (listing) setPrice(listing.price); }, [listing?.id]);

  const loan = price * (1 - down / 100);
  const r = rate / 100 / 12;
  const n = years * 12;
  const monthly = loan && r ? (loan * r) / (1 - Math.pow(1 + r, -n)) : 0;
  const total = monthly * n;
  const interest = total - loan;

  return (
    <Overlay open={open} onClose={onClose} max="max-w-3xl">
      <div className="p-8 md:p-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="eyebrow text-ochre">Mortgage calculator</div>
            <h3 className="font-display text-graphite-900 mt-3" style={{ fontSize: 40, fontWeight: 400 }}>Plan the monthly.</h3>
          </div>
          <button onClick={onClose} className="cursor-pointer text-graphite hover:text-ochre"><CloseIcon /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-10 mt-10">
          <div className="space-y-7">
            <Slider label="Property price" value={price} min={500000} max={120000000} step={50000} format={(v) => fmtPrice(v, currency)} onChange={setPrice} />
            <Slider label="Down payment" value={down} min={20} max={60} step={1} format={(v) => `${v}%`} onChange={setDown} />
            <Slider label="Loan term" value={years} min={5} max={30} step={1} format={(v) => `${v} years`} onChange={setYears} />
            <Slider label="Interest rate" value={rate} min={2.5} max={7} step={0.05} format={(v) => `${v.toFixed(2)}%`} onChange={setRate} />
          </div>
          <div className="bg-porcelain-100 p-7 hairline border border-stone-200">
            <div className="eyebrow text-graphite">Monthly payment</div>
            <div className="font-display text-graphite-900 num mt-2" style={{ fontSize: 56, fontWeight: 300, lineHeight: 1 }}>{fmtPrice(monthly, currency)}</div>
            <div className="hairline border-t my-6" />
            <Row k="Loan amount"     v={fmtPrice(loan, currency)} />
            <Row k="Down payment"    v={fmtPrice(price - loan, currency)} />
            <Row k="Total interest"  v={fmtPrice(interest, currency)} />
            <Row k="Total payable"   v={fmtPrice(total, currency)} />
            <button data-gtm-event="mortgage_preapproval" className="mt-7 w-full bg-ochre text-porcelain py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 transition cursor-pointer">Get pre-approved</button>
            <div className="text-[11px] tracking-[0.18em] uppercase text-stone mt-4 text-center">Live rates from 6 banks</div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}
function Row({ k, v }) {
  return <div className="flex items-baseline justify-between py-2 text-[14px]"><span className="text-graphite">{k}</span><span className="text-graphite-900 num">{v}</span></div>;
}
function Slider({ label, value, min, max, step, format, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="eyebrow text-graphite">{label}</div>
        <div className="font-display text-graphite-900 num text-[22px]">{format(value)}</div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full mt-3 accent-ochre" />
    </div>
  );
}

// ─── Compare Tray ─────────────────────────────────────────────────────────
function CompareTray({ items, onRemove, onClear, agents, currency }) {
  if (!items?.length) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="max-w-[1400px] mx-auto m-4 bg-graphite-900 text-porcelain hairline border border-graphite-800 shadow-2xl">
        <div className="flex items-stretch">
          <div className="px-5 py-4 hairline border-r border-graphite-800 flex items-center gap-4">
            <CompareIcon className="w-5 h-5 text-ochre" />
            <div>
              <div className="eyebrow" style={{ fontSize: 10 }}>Compare</div>
              <div className="font-display text-[20px] num leading-none mt-1">{items.length} of 4</div>
            </div>
          </div>
          <div className="flex-1 flex overflow-x-auto no-scrollbar">
            {items.map((l) => (
              <div key={l.id} className="shrink-0 flex items-center gap-3 px-4 py-3 hairline border-r border-graphite-800 min-w-[260px]">
                <img src={l.images[0]} alt="" className="w-14 h-14 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] truncate">{l.title}</div>
                  <div className="text-[11px] text-stone-200 num">{fmtPrice(l.price, currency)}</div>
                </div>
                <button onClick={() => onRemove(l.id)} className="text-stone hover:text-ochre cursor-pointer"><CloseIcon className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pr-4">
            <button onClick={onClear} className="px-4 py-2 text-[11px] tracking-[0.22em] uppercase text-stone-200 hover:text-porcelain cursor-pointer">Clear</button>
            <button className="px-6 py-3 bg-ochre text-porcelain text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 cursor-pointer">Compare</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shortlist Drawer ─────────────────────────────────────────────────────
function ShortlistDrawer({ open, onClose, items, onRemove, currency }) {
  return (
    <Overlay open={open} onClose={onClose} side="right">
      <div className="p-7 hairline border-b border-stone-200 flex items-center justify-between">
        <div>
          <div className="eyebrow text-ochre">Shortlist</div>
          <h3 className="font-display text-graphite-900 mt-2" style={{ fontSize: 30, fontWeight: 400 }}>Saved addresses</h3>
        </div>
        <button onClick={onClose} className="cursor-pointer text-graphite hover:text-ochre"><CloseIcon /></button>
      </div>
      {items.length === 0 ? (
        <div className="p-10 text-center text-graphite text-[14px]">No saved properties yet. Tap the heart icon on any listing.</div>
      ) : (
        <div>
          {items.map((l) => (
            <div key={l.id} className="flex gap-4 p-5 hairline border-b border-stone-200">
              <img src={l.images[0]} alt="" className="w-28 h-24 object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-display num text-graphite-900 text-[20px]">{fmtPrice(l.price, currency)}</div>
                <div className="text-[13px] text-graphite-900 truncate">{l.title}</div>
                <div className="text-[12px] text-graphite truncate">{l.subCommunity}, {l.community}</div>
                <button onClick={() => onRemove(l.id)} className="mt-2 text-[11px] tracking-[0.18em] uppercase text-graphite hover:text-ochre cursor-pointer">Remove</button>
              </div>
            </div>
          ))}
          <div className="p-7">
            <button className="w-full bg-graphite-900 text-porcelain py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer">Sign in to sync · price-drop alerts</button>
            <div className="mt-3 text-[11px] tracking-[0.18em] uppercase text-stone text-center">Saved locally to this device</div>
          </div>
        </div>
      )}
    </Overlay>
  );
}

// ─── Schedule a Viewing ───────────────────────────────────────────────────
function ScheduleViewing({ open, onClose, listing, agents }) {
  const agent = agents?.[listing?.agent || 0] || (window.CONCEPTPLUS_DATA.agents[0]);
  const [day, setDay] = useStateM(0);
  const [slot, setSlot] = useStateM(null);
  const days = useMemoM(() => {
    const out = [];
    const base = new Date(2026, 4, 12);
    const names = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base); d.setDate(base.getDate() + i);
      out.push({ name: names[(d.getDay() + 6) % 7], num: d.getDate(), month: d.toLocaleString('en', { month: 'short' }) });
    }
    return out;
  }, []);
  const slots = ['09:30','10:30','11:30','13:00','14:00','15:30','17:00','18:30'];

  return (
    <Overlay open={open} onClose={onClose} max="max-w-4xl">
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="bg-graphite-900 text-porcelain p-7">
          <img src={agent.img} alt={agent.name} className="w-20 h-20 object-cover rounded-full" />
          <div className="eyebrow text-ochre mt-5" style={{ fontSize: 10 }}>Your broker</div>
          <div className="font-display text-[24px] mt-2 leading-tight">{agent.name}</div>
          <div className="text-[13px] text-stone-200 mt-1">{agent.role}</div>
          <div className="hairline border-t border-stone/30 my-6" />
          <div className="space-y-2 text-[12px] text-stone-200">
            <div className="flex items-center gap-2"><PinIcon className="w-3.5 h-3.5 text-ochre" /> {listing?.title || 'Selected property'}</div>
            <div className="flex items-center gap-2"><PhoneIcon className="w-3.5 h-3.5 text-ochre" /> 30 min · in person or virtual</div>
            <div className="flex items-center gap-2"><CheckIcon className="w-3.5 h-3.5 text-ochre" /> Free, no obligation</div>
          </div>
        </div>
        <div className="p-7 md:p-9">
          <div className="flex items-start justify-between">
            <div>
              <div className="eyebrow text-ochre">Schedule a viewing</div>
              <h3 className="font-display text-graphite-900 mt-3" style={{ fontSize: 32, fontWeight: 400 }}>Pick a time.</h3>
            </div>
            <button onClick={onClose} className="cursor-pointer text-graphite hover:text-ochre"><CloseIcon /></button>
          </div>
          <div className="mt-7 grid grid-cols-7 gap-2">
            {days.map((d, i) => (
              <button key={i} onClick={() => { setDay(i); setSlot(null); }}
                className={`py-3 text-center cursor-pointer transition ${day === i ? 'bg-graphite-900 text-porcelain' : 'hairline border border-stone-200 text-graphite hover:border-ochre'}`}>
                <div className="text-[10px] tracking-[0.22em] uppercase">{d.name}</div>
                <div className="font-display text-[20px] num leading-none mt-1">{d.num}</div>
                <div className="text-[10px] tracking-[0.18em] uppercase mt-1 opacity-75">{d.month}</div>
              </button>
            ))}
          </div>
          <div className="eyebrow text-graphite mt-7 mb-3">Available slots</div>
          <div className="grid grid-cols-4 gap-2">
            {slots.map((s, i) => (
              <button key={s} onClick={() => setSlot(s)} disabled={i === 3}
                className={`py-3 text-[14px] num cursor-pointer transition
                  ${slot === s ? 'bg-ochre text-porcelain' : 'hairline border border-stone-200 text-graphite-900 hover:border-ochre'}
                  ${i === 3 ? 'opacity-30 line-through cursor-not-allowed' : ''}`}>{s}</button>
            ))}
          </div>
          <div className="mt-7 flex gap-3">
            <button disabled={!slot} className="flex-1 bg-graphite-900 disabled:bg-stone-200 disabled:text-stone text-porcelain py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer disabled:cursor-not-allowed">Confirm viewing</button>
            <button className="px-6 py-4 hairline border border-stone-200 text-[11px] tracking-[0.22em] uppercase text-graphite hover:border-ochre hover:text-ochre cursor-pointer">Virtual instead</button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

// ─── Payment Plan Visualizer ──────────────────────────────────────────────
function PaymentPlanModal({ open, onClose }) {
  const project = window.CONCEPTPLUS_DATA.offPlan[0];
  const milestones = [
    { pct: 10, when: 'On booking',     date: 'Jun 2026' },
    { pct: 15, when: 'Within 90 days', date: 'Sep 2026' },
    { pct: 25, when: 'Construction 25%', date: 'Mar 2027' },
    { pct: 25, when: 'Construction 75%', date: 'Sep 2027' },
    { pct: 25, when: 'On handover',    date: 'Q4 2027' },
  ];
  const total = 4_200_000;
  return (
    <Overlay open={open} onClose={onClose} max="max-w-5xl">
      <div className="grid md:grid-cols-[1fr_1.4fr]">
        <div className="relative">
          <img src={project.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-graphite-900/85 to-graphite-900/30" />
          <div className="relative p-8 md:p-10 text-porcelain min-h-[480px] flex flex-col justify-end">
            <div className="eyebrow text-ochre">{project.developer}</div>
            <div className="font-display text-[36px] mt-3 leading-tight">{project.name}</div>
            <div className="text-[13px] text-stone-200 mt-2">{project.completion} · {project.units} units</div>
            <div className="hairline border-t border-stone/30 mt-6 pt-5">
              <div className="eyebrow text-stone-200" style={{ fontSize: 10 }}>Selected unit</div>
              <div className="font-display text-[26px] num mt-1">AED 4.20M</div>
              <div className="text-[12px] text-stone-200">2 BR · 1,420 sqft · floor 14</div>
            </div>
          </div>
        </div>
        <div className="p-8 md:p-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="eyebrow text-ochre">Payment plan · 60/40</div>
              <h3 className="font-display text-graphite-900 mt-3" style={{ fontSize: 32, fontWeight: 400 }}>How you'll pay.</h3>
            </div>
            <button onClick={onClose} className="cursor-pointer text-graphite hover:text-ochre"><CloseIcon /></button>
          </div>
          {/* Timeline */}
          <div className="mt-8">
            <div className="relative h-[120px]">
              <div className="absolute left-0 right-0 top-[68px] h-px bg-stone-200" />
              <div className="absolute left-0 top-[68px] h-px bg-ochre" style={{ width: '5%' }} />
              <div className="flex justify-between">
                {milestones.map((m, i) => (
                  <div key={i} className="text-center" style={{ width: `${100 / milestones.length}%` }}>
                    <div className="font-display text-graphite-900 num text-[26px] leading-none">{m.pct}%</div>
                    <div className="text-[11px] text-graphite mt-1">{(total * m.pct / 100 / 1_000_000).toFixed(2)}M</div>
                    <div className="relative mt-3 mb-3">
                      <div className={`mx-auto w-3 h-3 ${i === 0 ? 'bg-ochre' : 'bg-porcelain hairline border border-stone-200'} rotate-45`} />
                    </div>
                    <div className="eyebrow text-graphite-900" style={{ fontSize: 9 }}>{m.when}</div>
                    <div className="text-[10px] text-stone tracking-[0.18em] uppercase num mt-0.5">{m.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Unit table */}
          <div className="mt-8 hairline border-t pt-6">
            <div className="eyebrow text-graphite mb-4">Available unit types</div>
            <div className="space-y-1 text-[13px]">
              {[
                ['Studio',     '480–540 sqft',   '1.80M', '14'],
                ['1 Bedroom',  '720–890 sqft',   '2.40M', '38'],
                ['2 Bedroom',  '1,180–1,540 sqft','3.95M', '22'],
                ['3 Bedroom',  '1,820–2,260 sqft','6.20M', '8'],
              ].map((r, i) => (
                <div key={i} className={`grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr_auto] items-center gap-4 py-3 hairline border-b border-stone-200 ${i === 2 ? 'bg-porcelain-100 -mx-4 px-4' : ''}`}>
                  <div className="text-graphite-900">{r[0]}</div>
                  <div className="text-graphite num">{r[1]}</div>
                  <div className="text-graphite-900 num">AED {r[2]}</div>
                  <div className="text-graphite num">{r[3]} left</div>
                  <button className="text-[11px] tracking-[0.22em] uppercase text-ochre gold-underline cursor-pointer">View</button>
                </div>
              ))}
            </div>
          </div>
          <button className="mt-8 w-full bg-ochre text-porcelain py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 cursor-pointer">Register your interest</button>
        </div>
      </div>
    </Overlay>
  );
}

// ─── Stylized SVG Map (Buy listings preview) ──────────────────────────────
function MapPreview({ open, onClose, currency }) {
  const D = window.CONCEPTPLUS_DATA;
  const [hoverId, setHoverId] = useStateM(D.listings[0].id);
  return (
    <Overlay open={open} onClose={onClose} max="max-w-[1400px]">
      <div className="grid md:grid-cols-[1.4fr_420px] min-h-[80vh]">
        <div className="relative bg-porcelain-100 overflow-hidden">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 grid place-items-center bg-porcelain hairline border border-stone-200 text-graphite hover:text-ochre cursor-pointer"><CloseIcon /></button>
          <StylizedMap listings={D.listings} hoverId={hoverId} onHover={setHoverId} currency={currency} />
          <div className="absolute top-4 left-4 bg-porcelain/95 backdrop-blur hairline border border-stone-200 px-4 py-3">
            <div className="eyebrow text-ochre">Map view</div>
            <div className="font-display text-graphite-900 mt-1 num text-[20px]">{D.listings.length} addresses</div>
          </div>
          <div className="absolute bottom-4 left-4 bg-porcelain/95 backdrop-blur hairline border border-stone-200 px-4 py-2 text-[11px] tracking-[0.18em] uppercase text-graphite flex gap-4">
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-ochre" /> For sale</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 bg-graphite-900" /> Hovered</span>
          </div>
        </div>
        <div className="bg-porcelain hairline border-l border-stone-200 p-6 max-h-[80vh] overflow-auto">
          <div className="eyebrow text-ochre mb-4">Hover to sync</div>
          <div className="space-y-3">
            {D.listings.map((l) => (
              <div key={l.id} onMouseEnter={() => setHoverId(l.id)}
                className={`flex gap-3 p-2 hairline border cursor-pointer transition ${hoverId === l.id ? 'border-ochre bg-porcelain-100' : 'border-stone-200'}`}>
                <img src={l.images[0]} alt="" className="w-20 h-16 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-display num text-[18px] leading-none">{fmtPrice(l.price, currency)}</div>
                  <div className="text-[12px] text-graphite-900 truncate mt-1">{l.title}</div>
                  <div className="text-[11px] text-graphite truncate">{l.community}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  );
}

function StylizedMap({ listings, hoverId, onHover, currency }) {
  // Custom SVG map of Dubai coastline & key communities — abstract, on-brand.
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="hatch" width="2" height="2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="2" stroke="#D8D9D7" strokeWidth="0.4" />
        </pattern>
      </defs>
      {/* Land base */}
      <rect width="100" height="80" fill="#EAE8E3" />
      {/* Sea */}
      <path d="M0 0 L100 0 L100 18 Q70 28 50 22 Q30 16 0 26 Z" fill="#B2B4B2" opacity="0.35" />
      <path d="M0 0 L100 0 L100 14 Q70 22 50 18 Q30 14 0 22 Z" fill="url(#hatch)" />
      {/* Palm Jumeirah (abstract) */}
      <g transform="translate(40, 22)">
        <circle r="6" fill="#EAE8E3" stroke="#B2B4B2" strokeWidth="0.3" />
        {[...Array(10)].map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <line key={i} x1={Math.cos(a) * 6} y1={Math.sin(a) * 6} x2={Math.cos(a) * 9} y2={Math.sin(a) * 9} stroke="#B2B4B2" strokeWidth="0.25" />;
        })}
        <circle r="3" fill="none" stroke="#AC7B43" strokeWidth="0.2" />
        <text textAnchor="middle" y="-12" fill="#4D4B4A" fontSize="2" fontFamily="JetBrains Mono">PALM JUMEIRAH</text>
      </g>
      {/* Roads — sheikh zayed road as a long diagonal */}
      <path d="M2 78 Q40 50 98 28" stroke="#B2B4B2" strokeWidth="0.4" fill="none" />
      <path d="M2 78 Q40 50 98 28" stroke="#EAE8E3" strokeWidth="0.15" strokeDasharray="0.6 0.6" fill="none" />
      <path d="M10 70 L90 40" stroke="#B2B4B2" strokeWidth="0.3" fill="none" />
      <path d="M30 78 Q35 60 65 30" stroke="#B2B4B2" strokeWidth="0.3" fill="none" />
      {/* Community labels */}
      <text x="56" y="48" fill="#4D4B4A" fontSize="1.6" fontFamily="JetBrains Mono" textAnchor="middle">DOWNTOWN</text>
      <text x="80" y="36" fill="#4D4B4A" fontSize="1.6" fontFamily="JetBrains Mono" textAnchor="middle">BUSINESS BAY</text>
      <text x="35" y="68" fill="#4D4B4A" fontSize="1.6" fontFamily="JetBrains Mono" textAnchor="middle">JVC</text>
      <text x="58" y="72" fill="#4D4B4A" fontSize="1.6" fontFamily="JetBrains Mono" textAnchor="middle">MBR CITY</text>
      <text x="22" y="38" fill="#4D4B4A" fontSize="1.6" fontFamily="JetBrains Mono" textAnchor="middle">MARINA</text>
      {/* Pins */}
      {listings.map((l) => {
        const isHover = hoverId === l.id;
        return (
          <g key={l.id} transform={`translate(${l.lat}, ${l.lng})`} onMouseEnter={() => onHover(l.id)} style={{ cursor: 'pointer' }}>
            <circle r={isHover ? 2.2 : 1.4} fill={isHover ? '#1A1A1A' : '#AC7B43'} />
            <circle r={isHover ? 4 : 2.4} fill="none" stroke={isHover ? '#1A1A1A' : '#AC7B43'} strokeWidth="0.2" opacity="0.4" />
            {isHover && (
              <g transform="translate(0, -5)">
                <rect x="-12" y="-4.5" width="24" height="6" fill="#1A1A1A" />
                <text textAnchor="middle" y="-0.2" fill="#EAE8E3" fontSize="1.8" fontFamily="JetBrains Mono">{fmtPrice(l.price, currency)}</text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Property Detail (light, compact — opened from card click) ────────────
function PropertyDetail({ open, onClose, listing, currency, onPhotos, onMortgage, onSchedule }) {
  if (!listing) return null;
  const agent = window.CONCEPTPLUS_DATA.agents[listing.agent];
  return (
    <Overlay open={open} onClose={onClose} max="max-w-[1200px]">
      <div className="bg-porcelain">
        <div className="grid lg:grid-cols-[1fr_380px]">
          <div>
            <div className="relative grid grid-cols-3 gap-1 p-1 bg-porcelain">
              <div className="col-span-3 md:col-span-2 aspect-[16/10] overflow-hidden bg-stone-200 cursor-pointer relative" onClick={onPhotos}>
                <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                <button className="absolute bottom-3 left-3 bg-porcelain/95 backdrop-blur px-3 py-2 text-[11px] tracking-[0.22em] uppercase">View all {listing.photoCount} photos</button>
              </div>
              <div className="hidden md:flex flex-col gap-1">
                <div className="aspect-[16/10] overflow-hidden bg-stone-200">
                  <img src={listing.images[1] || listing.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[16/10] overflow-hidden bg-stone-200 relative">
                  <img src={listing.images[2] || listing.images[0]} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="px-7 md:px-9 py-7">
              <div className="eyebrow text-ochre">{listing.community} · For sale</div>
              <h2 className="font-display text-graphite-900 mt-3 leading-tight" style={{ fontSize: 40, fontWeight: 400 }}>{listing.title}</h2>
              <div className="font-display text-graphite-900 num mt-3" style={{ fontSize: 44, fontWeight: 300 }}>{fmtPrice(listing.price, currency)}</div>
              <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-3 hairline border-y border-stone-200 py-6">
                <Fact k="Beds" v={listing.beds} />
                <Fact k="Baths" v={listing.baths} />
                <Fact k="Built-up" v={`${listing.sqft.toLocaleString()} sqft`} />
                <Fact k="Type" v={listing.type} />
                <Fact k="Furnishing" v={listing.furnishing} />
                <Fact k="Reference" v={listing.id} />
                <Fact k="Permit no." v="71240-22184" />
                <Fact k="DLD verified" v={listing.dld ? 'Yes' : '—'} accent={listing.dld} />
              </div>
              <p className="mt-7 text-graphite leading-relaxed text-[15px]">A poised {listing.beds}-bedroom {listing.type.toLowerCase()} in {listing.subCommunity}, finished to a discerning standard with full sea-line orientation. The plan moves through three reception rooms, a chef-grade kitchen, and a primary suite that opens onto a private garden. Currently held by the original owner.</p>
              <div className="mt-7">
                <div className="eyebrow text-ochre mb-3">Amenities</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 text-[14px] text-graphite-900">
                  {['Private pool','Smart-home suite','Maid\'s quarters','Built-in wardrobes','Sea-line view','Burj Khalifa view','Built-up gym','Driver quarters','Cinema room'].map((a) => (
                    <div key={a} className="gold-tick">{a}</div>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button onClick={onMortgage} className="bg-graphite-900 text-porcelain px-5 py-3 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre cursor-pointer">Mortgage calc</button>
                <button onClick={onPhotos} className="hairline border border-stone-200 px-5 py-3 text-[11px] tracking-[0.22em] uppercase text-graphite-900 hover:border-ochre hover:text-ochre cursor-pointer">View gallery</button>
              </div>
            </div>
          </div>
          {/* Sticky right rail */}
          <aside className="bg-porcelain-100 hairline border-l border-stone-200 p-7">
            <button onClick={onClose} className="float-right cursor-pointer text-graphite hover:text-ochre"><CloseIcon /></button>
            <div className="flex items-center gap-4">
              <img src={agent.img} alt={agent.name} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <div className="eyebrow text-ochre" style={{ fontSize: 10 }}>Listing broker</div>
                <div className="font-display text-graphite-900 text-[22px] leading-tight mt-1">{agent.name}</div>
                <div className="text-[11px] tracking-[0.18em] uppercase text-graphite num">RERA · {agent.rera}</div>
              </div>
            </div>
            <div className="mt-5 text-[12px] text-graphite">Speaks {agent.langs.join(' · ')}</div>
            <div className="mt-6 grid grid-cols-3 gap-2">
              <RailBtn icon={<PhoneIcon />} label="Call" />
              <RailBtn icon={<WhatsappIcon />} label="WhatsApp" />
              <RailBtn icon={<EmailIcon />} label="Email" />
            </div>
            <button onClick={onSchedule} className="mt-3 w-full bg-ochre text-porcelain py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 cursor-pointer">Schedule a viewing</button>
            <div className="hairline border-t border-stone-200 my-7" />
            <div className="eyebrow text-graphite mb-3">Quick actions</div>
            <div className="space-y-2 text-[13px]">
              {['Add to shortlist','Add to compare','Share via WhatsApp','Generate PDF brochure','Request floor plan'].map((a) => (
                <a key={a} className="block text-graphite-900 gold-underline cursor-pointer">{a}</a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </Overlay>
  );
}

function Fact({ k, v, accent }) {
  return (
    <div>
      <div className="eyebrow text-stone" style={{ fontSize: 10 }}>{k}</div>
      <div className={`mt-1.5 num text-[14px] ${accent ? 'text-ochre' : 'text-graphite-900'}`}>{v}</div>
    </div>
  );
}
function RailBtn({ icon, label }) {
  return (
    <button className="hairline border border-stone-200 py-3 cursor-pointer text-graphite hover:text-ochre hover:border-ochre transition flex flex-col items-center gap-1">
      {icon}
      <span className="text-[10px] tracking-[0.18em] uppercase">{label}</span>
    </button>
  );
}

Object.assign(window, { Overlay, PhotoLightbox, MortgageCalc, CompareTray, ShortlistDrawer, ScheduleViewing, PaymentPlanModal, MapPreview, PropertyDetail });
