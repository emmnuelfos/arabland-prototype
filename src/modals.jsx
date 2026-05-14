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
            <div className="font-display text-graphite-900 num mt-2" style={{ fontSize: 56, fontWeight: 400, lineHeight: 1 }}>{fmtPrice(monthly, currency)}</div>
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
// FAM-style off-plan project detail — dark centered hero, 5-up gallery, project
// highlights, three "project experts", three-card payment plan, available units,
// register-interest form, sticky right rail with starting price.
function PaymentPlanModal({ open, onClose }) {
  const project = window.CONCEPTPLUS_DATA.offPlan[0];
  const agents  = window.CONCEPTPLUS_DATA.agents;
  const gallery = [
    project.image,
    'assets/properties/09-offplan-tower-lobby.webp',
    'assets/properties/09-offplan-tower-show-apartment.webp',
    'assets/properties/09-offplan-tower-skybridge.webp',
    'assets/properties/09-offplan-tower-exterior.webp',
  ];
  const totalAed = 4_200_000;

  return (
    <Overlay open={open} onClose={onClose} max="max-w-[1320px]">
      <div className="bg-porcelain-100">
        <div className="grid lg:grid-cols-[1fr_360px]">

          {/* ============ LEFT — content ============ */}
          <div className="space-y-5">

            {/* Dark centered hero with project title */}
            <div className="bg-graphite-900 text-porcelain px-7 md:px-10 py-10 md:py-12 text-center">
              <div className="text-[12px] text-stone-200 tracking-wide flex items-center justify-center gap-2">
                <a className="hover:text-ochre cursor-pointer">{project.developer.split(' ')[0]}</a>
                <span className="opacity-50">›</span>
                <span>{project.name}</span>
              </div>
              <h2 className="mt-4 font-display leading-tight" style={{ fontSize: 42, fontWeight: 400 }}>
                {project.name} <span className="text-stone-200 font-display" style={{ fontWeight: 400 }}>by {project.developer}</span>
              </h2>
              <div className="mt-2 text-[14px] text-stone-200">at MBR City, Dubai</div>
            </div>

            {/* 5-up gallery */}
            <div className="px-5 md:px-7">
              <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 h-[460px] md:h-[500px]">
                <div className="col-span-2 row-span-2 overflow-hidden bg-stone-200 cursor-pointer relative">
                  <img src={gallery[0]} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                {gallery.slice(1).map((src, i) => {
                  const isLast = i === gallery.length - 2;
                  return (
                    <div key={i} className="overflow-hidden bg-stone-200 cursor-pointer relative">
                      <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      {isLast && (
                        <div className="absolute inset-0 bg-graphite-900/60 grid place-items-center">
                          <button className="bg-porcelain text-graphite-900 px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre hover:text-porcelain cursor-pointer">
                            Show all 64 photos
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project highlights — header */}
            <div className="px-5 md:px-7">
              <h3 className="font-display text-ochre leading-tight" style={{ fontSize: 28, fontWeight: 400 }}>{project.name} Highlights</h3>
            </div>

            {/* Highlights grid */}
            <div className="px-5 md:px-7">
              <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FactCard icon={<HomeOutlineIcon />}  k="Type"        v="Apartments · Penthouses" />
                  <FactCard icon={<DeveloperIcon />}    k="Developer"   v={project.developer} />
                  <FactCard icon={<HashIcon />}         k="Status"      v={project.status} />
                  <FactCard icon={<TitleIcon />}        k="Title type"  v="Freehold" />
                  <FactCard icon={<LifestyleIcon />}    k="Lifestyle"   v="Premium" />
                  <FactCard icon={<CalendarIcon />}     k="Launch"      v="Q1 2026" />
                  <FactCard icon={<CalendarIcon />}     k="Completion"  v={project.completion} />
                  <FactCard icon={<HomeOutlineIcon />}  k="Total units" v={`${project.units} units`} />
                  <FactCard icon={<ClockIcon />}        k="Starting"    v={`AED ${(project.from/1_000_000).toFixed(2)}M`} />
                </div>
              </div>
            </div>

            {/* Project Experts (3 agents) */}
            <div className="px-5 md:px-7">
              <h3 className="font-display text-graphite-900 leading-tight mb-5" style={{ fontSize: 26, fontWeight: 400 }}>{project.name} Experts</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {agents.slice(0, 3).map((a) => (
                  <div key={a.name} className="relative overflow-hidden hairline border border-stone-200 cursor-pointer group">
                    <img src={a.img} alt={a.name} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-graphite-900/85 to-transparent text-porcelain">
                      <div className="font-display text-[20px] leading-tight">{a.name}</div>
                      <div className="text-[11px] text-porcelain/85 mt-1">Property Advisor</div>
                    </div>
                    <button className="absolute bottom-4 right-4 w-10 h-10 grid place-items-center rounded-full bg-ochre text-porcelain cursor-pointer hover:scale-110 transition">
                      <WhatsappIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Plans — 3 horizontal cards */}
            <div className="px-5 md:px-7">
              <h3 className="font-display text-graphite-900 leading-tight mb-5" style={{ fontSize: 26, fontWeight: 400 }}>Payment plans</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { pct: 10, label: 'First Installment', tone: 'bg-porcelain-100', icon: <PowerIcon /> },
                  { pct: 50, label: 'Under Construction', tone: 'bg-stone/15',     icon: <CogIcon /> },
                  { pct: 40, label: 'On Handover',        tone: 'bg-ochre/15',     icon: <KeyIcon /> },
                ].map((p) => (
                  <div key={p.label} className={`${p.tone} hairline border border-stone-200 p-7 relative min-h-[140px]`}>
                    <div className="text-graphite-900 font-display num leading-none" style={{ fontSize: 56, fontWeight: 400 }}>{p.pct}%</div>
                    <div className="mt-4 text-[13px] text-graphite-900">{p.label}</div>
                    <div className="absolute top-6 right-6 text-graphite">{p.icon}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-[12px] text-graphite italic">
                On a {`AED ${(totalAed/1_000_000).toFixed(2)}M`} unit: AED {(totalAed*0.10/1_000).toFixed(0)}K booking · AED {(totalAed*0.50/1_000_000).toFixed(2)}M during construction · AED {(totalAed*0.40/1_000_000).toFixed(2)}M on handover.
              </div>
            </div>

            {/* Available unit types */}
            <div className="px-5 md:px-7">
              <h3 className="font-display text-graphite-900 leading-tight mb-5" style={{ fontSize: 26, fontWeight: 400 }}>Available unit types</h3>
              <div className="bg-porcelain hairline border border-stone-200 overflow-hidden">
                <div className="grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr_auto] items-center gap-4 px-5 py-3 bg-porcelain-100 hairline border-b border-stone-200 text-[10px] tracking-[0.22em] uppercase text-graphite">
                  <div>Type</div><div>Size</div><div>Price from</div><div>Available</div><div></div>
                </div>
                {[
                  ['Studio',     '480–540 sqft',   '1.80M', '14'],
                  ['1 Bedroom',  '720–890 sqft',   '2.40M', '38'],
                  ['2 Bedroom',  '1,180–1,540 sqft','3.95M', '22'],
                  ['3 Bedroom',  '1,820–2,260 sqft','6.20M', '8'],
                ].map((r) => (
                  <div key={r[0]} className="grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr_auto] items-center gap-4 px-5 py-3.5 hairline border-b border-stone-200 last:border-b-0 hover:bg-porcelain-100 transition">
                    <div className="text-graphite-900 text-[14px]">{r[0]}</div>
                    <div className="text-graphite text-[13px] num">{r[1]}</div>
                    <div className="text-graphite-900 text-[14px] num">AED {r[2]}</div>
                    <div className="text-graphite text-[12px] num">{r[3]} left</div>
                    <button className="text-[10px] tracking-[0.22em] uppercase text-ochre gold-underline cursor-pointer">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Register interest */}
            <div className="px-5 md:px-7">
              <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
                <h3 className="font-display text-graphite-900 leading-tight" style={{ fontSize: 26, fontWeight: 400 }}>Register your interest</h3>
                <p className="mt-2 text-[13px] text-graphite">A senior project specialist will be in touch within 24 hours with the full deck and a private viewing slot.</p>
                <div className="mt-5 grid md:grid-cols-2 gap-3">
                  <input type="text"  placeholder="Full name"   className="hairline border border-stone-200 px-4 py-3 text-[14px] bg-porcelain-100 outline-none focus:border-ochre" />
                  <input type="email" placeholder="Email"       className="hairline border border-stone-200 px-4 py-3 text-[14px] bg-porcelain-100 outline-none focus:border-ochre" />
                  <input type="tel"   placeholder="Phone"       className="hairline border border-stone-200 px-4 py-3 text-[14px] bg-porcelain-100 outline-none focus:border-ochre" />
                  <select className="hairline border border-stone-200 px-4 py-3 text-[14px] bg-porcelain-100 outline-none focus:border-ochre">
                    <option>Preferred unit type</option>
                    <option>Studio</option><option>1 Bedroom</option><option>2 Bedroom</option><option>3 Bedroom</option>
                  </select>
                </div>
                <textarea placeholder="Message (optional)" className="mt-3 w-full hairline border border-stone-200 p-4 text-[14px] bg-porcelain-100 outline-none focus:border-ochre resize-none min-h-[100px]" />
                <button className="mt-5 w-full bg-ochre text-porcelain py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 cursor-pointer">Register interest</button>
              </div>
            </div>

            <div className="h-2" />
          </div>

          {/* ============ RIGHT — sticky rail ============ */}
          <aside className="bg-porcelain hairline lg:border-l border-stone-200 p-6 md:p-7 lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto">
            <button onClick={onClose} className="float-right cursor-pointer text-graphite hover:text-ochre"><CloseIcon /></button>

            {/* Project hero strip */}
            <div className="aspect-[5/3] overflow-hidden bg-stone-200">
              <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
            </div>
            <div className="mt-4">
              <div className="eyebrow text-graphite" style={{ fontSize: 10 }}>{project.developer}</div>
              <div className="font-display text-graphite-900 leading-tight mt-1" style={{ fontSize: 22, fontWeight: 400 }}>{project.name}</div>
              <div className="text-[12px] text-graphite mt-1">{project.completion} · {project.status}</div>
            </div>

            {/* Starting price card */}
            <div className="mt-5 hairline border border-stone-200 p-5">
              <div className="eyebrow text-graphite" style={{ fontSize: 10 }}>Starting price</div>
              <div className="font-display num text-graphite-900 mt-2 leading-none" style={{ fontSize: 36, fontWeight: 400 }}>
                AED {(project.from/1_000_000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-graphite mt-2">From {project.units} curated units</div>
            </div>

            {/* CTAs */}
            <div className="mt-4 space-y-2.5">
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-ochre text-porcelain text-[12px] tracking-[0.22em] uppercase hover:bg-ochre-700 cursor-pointer">
                Discover more <ArrowIcon className="w-3.5 h-3.5" />
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-ochre text-porcelain text-[12px] tracking-[0.18em] uppercase hover:opacity-90 cursor-pointer">
                <WhatsappIcon className="w-4 h-4" /> WhatsApp
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3.5 hairline border border-stone-200 text-graphite-900 text-[12px] tracking-[0.18em] uppercase hover:border-ochre hover:text-ochre cursor-pointer">
                Download brochure
              </button>
            </div>

            {/* Quick links */}
            <div className="hairline border-t border-stone-200 my-6" />
            <div className="eyebrow text-graphite mb-3" style={{ fontSize: 10 }}>Quick links</div>
            <div className="space-y-2 text-[13px]">
              {['Payment plan in full', 'Unit availability', 'Floor plans', 'Master plan & amenities', 'Investment outlook'].map((a) => (
                <a key={a} className="block text-graphite-900 gold-underline cursor-pointer">{a}</a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </Overlay>
  );
}

// Icons specific to the off-plan project detail
function TitleIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v4H4zM4 13h16v6H4z" /><path d="M8 9v4M16 9v4" /></svg>;
}
function LifestyleIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13c2-6 6-9 9-9s7 3 9 9c-2 6-6 9-9 9s-7-3-9-9z" /><circle cx="12" cy="13" r="2.5" /></svg>;
}
function PowerIcon({ className = 'w-5 h-5' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6a8 8 0 1 0 8 0" /><path d="M12 3v9" /></svg>;
}
function CogIcon({ className = 'w-5 h-5' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>;
}
function KeyIcon({ className = 'w-5 h-5' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="15" r="4" /><path d="m21 2-9.6 9.6M15.5 7.5l3 3M19 5l2 2" /></svg>;
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

// Real interactive Dubai map via Leaflet + Carto Positron tiles (no API key).
// Custom ochre pulse-pins, synced with the side panel (hover/click).
function StylizedMap({ listings, hoverId, onHover, currency }) {
  const { useRef, useEffect } = React;
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());

  // Mount once: create the map, tile layer, and one marker per listing.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (typeof L === 'undefined') return; // Leaflet not loaded yet — bail silently.

    const map = L.map(containerRef.current, {
      center: [25.12, 55.20],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap · CartoDB',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    listings.forEach((l) => {
      const icon = L.divIcon({
        className: 'cp-pin-wrap',
        html: `<div class="cp-pin" data-id="${l.id}"><div class="cp-pin-ring"></div><div class="cp-pin-dot"></div></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      const m = L.marker([l.lat, l.lng], { icon }).addTo(map);
      m.bindTooltip(fmtPrice(l.price, currency), { className: 'cp-tooltip', direction: 'top', offset: [0, -14], permanent: false });
      m.on('mouseover', () => onHover(l.id));
      m.on('click',     () => { onHover(l.id); map.flyTo([l.lat, l.lng], Math.max(map.getZoom(), 13), { duration: 0.6 }); });
      markersRef.current.set(l.id, m);
    });

    // Compute bounds once
    const bounds = listings.length > 0 ? L.latLngBounds(listings.map((l) => [l.lat, l.lng])) : null;

    // Fit after the overlay's open animation finishes, so the container has its final size.
    // Re-fit twice — once at 60ms (modal mounted) and once at 320ms (animation fully settled).
    const refit = () => {
      map.invalidateSize();
      if (bounds) map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12, animate: false });
    };
    setTimeout(refit, 60);
    setTimeout(refit, 320);

    return () => { map.remove(); mapRef.current = null; markersRef.current.clear(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight the active pin when hoverId changes.
  useEffect(() => {
    markersRef.current.forEach((m, id) => {
      const el = m.getElement();
      if (!el) return;
      const pin = el.querySelector('.cp-pin');
      if (pin) pin.classList.toggle('cp-active', id === hoverId);
    });
    // Smoothly pan to the active pin when hover comes from the side panel.
    const active = markersRef.current.get(hoverId);
    if (active && mapRef.current && !mapRef.current._gestureActive) {
      mapRef.current.panTo(active.getLatLng(), { animate: true, duration: 0.45 });
    }
  }, [hoverId]);

  // w-full h-full keeps the map sized to its parent without needing the parent to be position:relative.
  // (Previously absolute inset-0 escaped to the viewport when a parent forgot 'relative'.)
  return <div ref={containerRef} className="w-full h-full" />;
}

// ─── Property Detail (light, compact — opened from card click) ────────────
// FAM-style property detail — 5-up gallery, title card, price card, 9-cell facts grid,
// About section, inline mortgage calculator, amenities, and a sticky agent rail.
function PropertyDetail({ open, onClose, listing, currency, onPhotos, onMortgage, onSchedule }) {
  if (!listing) return null;
  const agent = window.CONCEPTPLUS_DATA.agents[listing.agent];
  const sqftDisplay = `${listing.sqft.toLocaleString()} sqft`;
  const pricePerSqft = Math.round(listing.price / listing.sqft);

  return (
    <Overlay open={open} onClose={onClose} max="max-w-[1320px]">
      <div className="bg-porcelain-100">
        <div className="grid lg:grid-cols-[1fr_360px]">
          {/* ============ LEFT — Main content ============ */}
          <div className="p-5 md:p-7 space-y-5">

            {/* Breadcrumbs */}
            <div className="text-[12px] text-graphite tracking-wide flex items-center gap-2">
              <a className="hover:text-ochre cursor-pointer">{listing.community}</a>
              <span className="text-stone">›</span>
              <a className="hover:text-ochre cursor-pointer">{listing.subCommunity}</a>
              <span className="text-stone">›</span>
              <span className="text-graphite-900">Ref {listing.id}</span>
            </div>

            {/* Title card */}
            <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
              <h2 className="font-display text-graphite-900 leading-tight" style={{ fontSize: 36, fontWeight: 400 }}>{listing.title}</h2>
              <p className="mt-2 text-[14px] text-graphite">
                {listing.beds} Beds {listing.type} for Sale in <a className="text-ochre hover:underline cursor-pointer">{listing.subCommunity}</a>, <a className="text-ochre hover:underline cursor-pointer">{listing.community}</a>, Dubai
              </p>
            </div>

            {/* 5-up gallery: 1 large left + 2x2 right */}
            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 h-[480px] md:h-[520px]">
              <div className="col-span-2 row-span-2 overflow-hidden bg-stone-200 cursor-pointer relative" onClick={onPhotos}>
                <img src={listing.images[0]} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              {[1, 2, 3, 4].map((i) => {
                const src = listing.images[i] || listing.images[0];
                const isLast = i === 4;
                return (
                  <div key={i} className="overflow-hidden bg-stone-200 cursor-pointer relative" onClick={onPhotos}>
                    <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    {isLast && (
                      <div className="absolute inset-0 bg-graphite-900/60 grid place-items-center text-porcelain">
                        <button className="bg-porcelain text-graphite-900 px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre hover:text-porcelain cursor-pointer">
                          Show all {listing.photoCount} photos
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price card */}
            <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="font-display num text-ochre leading-none" style={{ fontSize: 44, fontWeight: 400 }}>
                  {fmtPrice(listing.price, currency)}
                </div>
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 hairline border border-stone-200 text-[12px] text-graphite-900 cursor-pointer hover:border-ochre">
                  <PinIcon className="w-3.5 h-3.5 text-ochre" />
                  AED {pricePerSqft.toLocaleString()} <span className="opacity-70">/sqft</span>
                </div>
              </div>
              {listing.dld && (
                <div className="px-3 py-2 bg-ochre/10 hairline border border-ochre text-[11px] tracking-[0.18em] uppercase text-ochre">
                  DLD verified
                </div>
              )}
            </div>

            {/* 9-cell facts grid */}
            <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FactCard icon={<HomeOutlineIcon />} k="Type"        v={listing.type} />
                <FactCard icon={<AreaIcon />}        k="Size"        v={sqftDisplay} />
                <FactCard icon={<BedIcon />}         k="Bedroom"     v={listing.beds} />
                <FactCard icon={<BathIcon />}        k="Bath"        v={listing.baths} />
                <FactCard icon={<DeveloperIcon />}   k="Developer"   v="Emaar" />
                <FactCard icon={<EyeIcon />}         k="View"        v="Community" />
                <FactCard icon={<HashIcon />}        k="Ref No."     v={listing.id} />
                <FactCard icon={<CalendarIcon />}    k="Completion"  v="Ready" />
                <FactCard icon={<ClockIcon />}       k="Listed"      v="Today" />
              </div>
            </div>

            {/* About this property */}
            <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
              <h3 className="font-display text-graphite-900 leading-tight mb-3" style={{ fontSize: 26, fontWeight: 400 }}>About this property</h3>
              <p className="text-[14px] text-graphite leading-relaxed">
                Concept Plus presents a poised {listing.beds}-bedroom {listing.type.toLowerCase()} in {listing.subCommunity}, finished to a discerning standard with full sea-line orientation.
              </p>
              <p className="mt-3 text-[14px] text-graphite leading-relaxed">
                Property highlights include:
                <br/>· Premium finishes with custom-designed interiors
                <br/>· Floor-to-ceiling windows with panoramic views
                <br/>· Smart home automation throughout
                <br/>· Private terrace with sunset orientation
              </p>
              <a className="mt-4 inline-flex items-center gap-2 text-[12px] text-ochre tracking-[0.18em] uppercase gold-underline cursor-pointer">
                Show more
              </a>
            </div>

            {/* Ask a question */}
            <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
              <h3 className="font-display text-graphite-900 leading-tight mb-4" style={{ fontSize: 26, fontWeight: 400 }}>Ask a question</h3>
              <textarea
                placeholder="Message"
                className="w-full hairline border border-stone-200 p-4 text-[14px] bg-porcelain-100 outline-none focus:border-ochre min-h-[120px] resize-none"
              />
              <div className="mt-4 flex justify-end">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-ochre text-porcelain text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 cursor-pointer">
                  Ask a question <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Inline mortgage calculator */}
            <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
              <h3 className="font-display text-graphite-900 leading-tight mb-5" style={{ fontSize: 26, fontWeight: 400 }}>Mortgage calculator</h3>
              <InlineMortgageCalc price={listing.price} />
              <div className="mt-5 flex justify-end">
                <button onClick={onMortgage} className="text-[12px] text-graphite tracking-[0.18em] uppercase gold-underline cursor-pointer">
                  Open full calculator
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-porcelain hairline border border-stone-200 p-6 md:p-7">
              <h3 className="font-display text-graphite-900 leading-tight mb-5" style={{ fontSize: 26, fontWeight: 400 }}>Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6 text-[14px] text-graphite-900">
                {['Private pool','Smart-home suite',"Maid's quarters",'Built-in wardrobes','Sea-line view','Burj Khalifa view','Built-up gym','Driver quarters','Cinema room','Concierge service','Valet parking','Children\'s play area'].map((a) => (
                  <div key={a} className="gold-tick">{a}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ============ RIGHT — Sticky agent rail ============ */}
          <aside className="bg-porcelain hairline lg:border-l border-stone-200 p-6 md:p-7 lg:sticky lg:top-0 lg:self-start lg:max-h-screen lg:overflow-y-auto">
            <button onClick={onClose} className="float-right cursor-pointer text-graphite hover:text-ochre"><CloseIcon /></button>

            {/* Agent card */}
            <div className="text-center pb-6 border-b hairline border-stone-200">
              <img src={agent.img} alt={agent.name} className="w-20 h-20 rounded-full object-cover mx-auto" />
              <div className="eyebrow text-graphite mt-4" style={{ fontSize: 10 }}>Contact</div>
              <div className="font-display text-graphite-900 text-[22px] leading-tight mt-1">{agent.name}</div>
              <div className="text-[11px] tracking-[0.18em] uppercase text-graphite num mt-1">RERA · {agent.rera}</div>
              <div className="text-[11px] text-graphite mt-2">Speaks {agent.langs.join(' · ')}</div>
            </div>

            {/* Primary CTAs — WhatsApp + Message (FAM style) */}
            <div className="mt-5 space-y-2.5">
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-ochre text-porcelain text-[12px] tracking-[0.18em] uppercase hover:opacity-90 cursor-pointer">
                <WhatsappIcon className="w-4 h-4" /> WhatsApp
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-graphite-900 text-porcelain text-[12px] tracking-[0.18em] uppercase hover:bg-ochre cursor-pointer">
                <EmailIcon className="w-4 h-4" /> Message
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3.5 hairline border border-stone-200 text-graphite-900 text-[12px] tracking-[0.18em] uppercase hover:border-ochre hover:text-ochre cursor-pointer">
                <PhoneIcon className="w-4 h-4" /> Call
              </button>
            </div>

            {/* Schedule a viewing */}
            <button onClick={onSchedule} className="mt-5 w-full bg-ochre text-porcelain py-4 text-[11px] tracking-[0.22em] uppercase hover:bg-ochre-700 cursor-pointer">
              Schedule a viewing
            </button>

            {/* Quick actions */}
            <div className="hairline border-t border-stone-200 my-6" />
            <div className="eyebrow text-graphite mb-3" style={{ fontSize: 10 }}>Quick actions</div>
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

function FactCard({ icon, k, v }) {
  return (
    <div className="hairline border border-stone-200 p-3.5 flex items-center gap-3 bg-porcelain-100/50">
      <div className="w-9 h-9 grid place-items-center bg-porcelain hairline border border-stone-200 text-ochre flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="eyebrow text-graphite" style={{ fontSize: 10 }}>{k}</div>
        <div className="mt-0.5 num text-[14px] text-graphite-900 truncate">{v}</div>
      </div>
    </div>
  );
}

// Inline mortgage calculator — minimalist version sized to fit inside the detail panel
function InlineMortgageCalc({ price }) {
  const { useState: useStateMc } = React;
  const [down, setDown] = useStateMc(25);
  const [years, setYears] = useStateMc(20);
  const [rate, setRate] = useStateMc(4.0);

  const loanAmount = price * (1 - down / 100);
  const monthlyRate = rate / 100 / 12;
  const totalPayments = years * 12;
  const monthly = monthlyRate > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / (Math.pow(1 + monthlyRate, totalPayments) - 1)
    : loanAmount / totalPayments;

  return (
    <div className="grid md:grid-cols-[1fr_220px] gap-6 items-center">
      <div className="space-y-4">
        <MCField label="Down payment" value={`${down}%`}>
          <input type="range" min="5" max="50" step="5" value={down} onChange={(e) => setDown(+e.target.value)} className="w-full accent-ochre" />
        </MCField>
        <MCField label="Loan period" value={`${years} years`}>
          <input type="range" min="5" max="30" step="1" value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-ochre" />
        </MCField>
        <MCField label="Interest rate" value={`${rate.toFixed(2)}%`}>
          <input type="range" min="2" max="8" step="0.25" value={rate} onChange={(e) => setRate(+e.target.value)} className="w-full accent-ochre" />
        </MCField>
      </div>
      <div className="w-44 h-44 mx-auto rounded-full border-[3px] border-ochre/30 grid place-items-center text-center">
        <div>
          <div className="eyebrow text-graphite" style={{ fontSize: 9 }}>Estimated</div>
          <div className="font-display num text-graphite-900 mt-1" style={{ fontSize: 22, fontWeight: 400 }}>
            AED {Math.round(monthly).toLocaleString()}
          </div>
          <div className="text-[10px] text-graphite mt-1">per month</div>
        </div>
      </div>
    </div>
  );
}
function MCField({ label, value, children }) {
  return (
    <div>
      <div className="flex justify-between items-baseline text-[12px]">
        <span className="eyebrow text-graphite" style={{ fontSize: 10 }}>{label}</span>
        <span className="text-graphite-900 num">{value}</span>
      </div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

// ── Tiny inline icons specific to the property facts grid ──────────────────
function HomeOutlineIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12 12 4l9 8" /><path d="M5 11v9h14v-9" /></svg>;
}
function DeveloperIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V8l4-3v16M13 21V11l5-3v13" /><path d="M8 11h0M16 13h0M16 17h0" /></svg>;
}
function EyeIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function HashIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></svg>;
}
function CalendarIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
}
function ClockIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
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
