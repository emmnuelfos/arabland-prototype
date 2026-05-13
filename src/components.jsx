// Concept Plus — shared components: Header, Footer, SearchBar, PropertyCard, etc.
// Exports to window for cross-script sharing (Babel scripts don't share scope).

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─── Utilities ─────────────────────────────────────────────────────────────
const FX = { AED: 1, USD: 0.272, EUR: 0.252 };
const FX_SYMBOL = { AED: 'AED', USD: 'US$', EUR: '€' };

function fmtPrice(aed, currency = 'AED') {
  const v = aed * (FX[currency] || 1);
  if (v >= 1_000_000) return `${FX_SYMBOL[currency]} ${(v / 1_000_000).toFixed(v >= 10_000_000 ? 1 : 2)}M`;
  if (v >= 1_000)     return `${FX_SYMBOL[currency]} ${(v / 1_000).toFixed(0)}K`;
  return `${FX_SYMBOL[currency]} ${v.toFixed(0)}`;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.in)');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ─── ARE full lockup from the supplied SVG ────────────────────────────────
// Two color variants: dark (graphite type on porcelain bg) / light (porcelain type on dark bg).
function Wordmark({ className = '', tone = 'dark', height = 44 }) {
  const src = tone === 'light' ? 'assets/conceptplus-logo-light.svg' : 'assets/conceptplus-logo-dark.svg';
  return (
    <img src={src} alt="Concept Plus Real Estate" className={className} style={{ height, width: 'auto', display: 'block' }} />
  );
}
// Monogram-only — crops the supplied SVG via CSS to show just the ARE mark on top.
function Monogram({ size = 56, tone = 'dark', className = '' }) {
  const src = tone === 'light' ? 'assets/conceptplus-logo-light.svg' : 'assets/conceptplus-logo-dark.svg';
  // Original viewBox 1183x663; the ARE monogram occupies roughly the top 60% (y 0–400).
  return (
    <div className={className} style={{ width: size * (1.78), height: size, overflow: 'hidden' }}>
      <img src={src} alt="ARE" style={{ height: size * (663/400), width: 'auto', display: 'block', objectFit: 'cover' }} />
    </div>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────
function Header({ shortlistCount, onShortlist, onCompare, currency, setCurrency, areaUnit, setAreaUnit, lang, setLang, solid = false }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [solid]);
  const nav = [
    ['Buy', 'buy.html'], ['Rent', 'buy.html'], ['Sell', 'sell.html'], ['Off-Plan', 'off-plan.html'],
    ['Developers', 'developers.html'], ['Agents', 'agents.html'], ['Services', 'services.html'], ['Careers', 'careers.html'],
  ];
  const onPorcelain = solid || scrolled;
  const fg = onPorcelain ? 'text-graphite-900' : 'text-porcelain';
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${onPorcelain ? 'bg-porcelain/95 backdrop-blur border-b hairline border-stone' : 'bg-transparent'}`}>
      {/* Top utility strip (AED·USD·EUR | sqft·sqm | EN·AR | Sign in/up) removed per client request. */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        <a href="home.html" className="cursor-pointer">
          <Wordmark tone={onPorcelain ? 'dark' : 'light'} height={44} />
        </a>
        <nav className="hidden lg:flex items-center gap-8">
          {nav.map(([n, href]) => (
            <a key={n} href={href} className={`gold-underline cursor-pointer text-[13px] tracking-wide ${fg}`}>{n}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <IconBtn dim={!onPorcelain} onClick={onCompare} title="Compare">
            <CompareIcon />
          </IconBtn>
          <IconBtn dim={!onPorcelain} onClick={onShortlist} title="Shortlist" badge={shortlistCount}>
            <HeartIcon />
          </IconBtn>
          <a className={`hidden md:inline-flex items-center gap-2 ml-2 px-4 py-2 ${onPorcelain ? 'bg-graphite-900 text-porcelain hover:bg-ochre' : 'border hairline border-porcelain/50 text-porcelain hover:bg-porcelain hover:text-graphite-900'} text-[12px] tracking-[0.18em] uppercase cursor-pointer transition`}>
            <PhoneIcon className="w-3.5 h-3.5" /> +971 4 882 4400
          </a>
        </div>
      </div>
    </header>
  );
}

function Toggle({ items, value, onChange, dim }) {
  return (
    <div className="flex items-center gap-2">
      {items.map((it, i) => (
        <React.Fragment key={it}>
          <button
            onClick={() => onChange(it)}
            className={`cursor-pointer ${value === it ? 'text-ochre' : (dim ? 'text-porcelain/70 hover:text-porcelain' : 'hover:text-graphite-900')}`}
          >{it}</button>
          {i < items.length - 1 && <span className="opacity-40">·</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function IconBtn({ children, onClick, title, badge, dim }) {
  return (
    <button onClick={onClick} title={title} aria-label={title}
      className={`relative w-10 h-10 grid place-items-center cursor-pointer transition ${dim ? 'text-porcelain hover:text-ochre' : 'text-graphite-900 hover:text-ochre'}`}>
      {children}
      {!!badge && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center text-[10px] font-medium bg-ochre text-porcelain num rounded-full">{badge}</span>
      )}
    </button>
  );
}

// ─── Icons (line, monoline, 1.25 stroke) ───────────────────────────────────
const Sx = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round', strokeLinejoin: 'round' };
function HeartIcon({ filled, className = 'w-[18px] h-[18px]' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx} fill={filled ? '#AC7B43' : 'none'} stroke={filled ? '#AC7B43' : 'currentColor'}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
  </svg>;
}
function CompareIcon({ className = 'w-[18px] h-[18px]' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M3 6h7M14 6h7M3 12h18M3 18h7M14 18h7" /></svg>;
}
function PhoneIcon({ className }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>;
}
function WhatsappIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M4 20l1.5-4A8 8 0 1 1 8 18z" /><path d="M9 10c0 4 3 6 6 6l1-2-2-1-1 1c-1-.4-1.6-1-2-2l1-1-1-2-2 1z" /></svg>;
}
function EmailIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><rect x="3" y="5" width="18" height="14" /><path d="M3 7l9 6 9-6" /></svg>;
}
function ShareIcon({ className = 'w-[18px] h-[18px]' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8 11l8-4M8 13l8 4" /></svg>;
}
function CameraIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M3 7h4l2-2h6l2 2h4v12H3z" /><circle cx="12" cy="13" r="4" /></svg>;
}
function BedIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6M3 14h18M3 18h18M7 9V6h6v3" /></svg>;
}
function BathIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M6 12V6a2 2 0 0 1 4 0M5 19l-1 2M19 19l1 2" /></svg>;
}
function AreaIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><rect x="4" y="4" width="16" height="16" /><path d="M9 4v3M15 4v3M9 17v3M15 17v3M4 9h3M4 15h3M17 9h3M17 15h3" /></svg>;
}
function CheckIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M5 12l5 5L20 7" /></svg>;
}
function ArrowIcon({ className = 'w-4 h-4', dir = 'right' }) {
  const d = dir === 'right' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6';
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d={d} /></svg>;
}
function CloseIcon({ className = 'w-5 h-5' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M6 6l12 12M18 6L6 18" /></svg>;
}
function SearchIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}
function PillBtn({ children, title, onClick }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}
      title={title}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] tracking-[0.18em] uppercase text-graphite hover:text-porcelain bg-porcelain hover:bg-ochre hairline border border-stone-200 hover:border-ochre transition cursor-pointer"
    >
      {children}
    </button>
  );
}
function PinIcon({ className = 'w-4 h-4' }) {
  return <svg viewBox="0 0 24 24" className={className} {...Sx}><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

// ─── Tabbed search bar (Buy / Rent / Off-Plan) ─────────────────────────────
// FAM-style simplified hero search: pill tabs + single search field + button.
// Heavy filtering (type / beds / price / status) lives on the listings page top bar.
function SearchBar({ variant = 'overlay' }) {
  const [tab, setTab] = useState('Buy');
  const [query, setQuery] = useState('');
  const isDark = variant === 'overlay';

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
      {/* Pill tabs */}
      <div className={`inline-flex rounded-full p-1 ${isDark ? 'bg-graphite-900/55 backdrop-blur border hairline border-porcelain/20' : 'bg-porcelain border hairline border-stone-200'}`}>
        {['Rent', 'Buy', 'Off-Plan'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-7 py-2.5 rounded-full text-[12px] tracking-[0.22em] uppercase font-medium transition cursor-pointer ${
              tab === t
                ? 'bg-ochre text-porcelain'
                : (isDark ? 'text-porcelain/85 hover:text-porcelain' : 'text-graphite hover:text-graphite-900')
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Single search field + button */}
      <div className="w-full flex items-stretch rounded-full overflow-hidden bg-porcelain hairline border border-stone-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,.35)]">
        <div className="flex-1 flex items-center gap-3 px-6 min-w-0">
          <SearchIcon className="text-graphite w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by area, community, or project name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 py-4 text-[15px] text-graphite-900 placeholder-stone bg-transparent outline-none min-w-0"
          />
        </div>
        <a
          href={tab === 'Off-Plan' ? 'off-plan.html' : 'buy.html'}
          className="bg-ochre hover:bg-ochre-700 text-porcelain px-8 md:px-12 flex items-center justify-center gap-3 text-[12px] tracking-[0.22em] uppercase font-medium cursor-pointer transition"
        >
          Search
        </a>
      </div>
    </div>
  );
}

// ─── PropertyCard with 4 variants (FAM is the default) ────────────────────
function PropertyCard({ listing, agents, currency, areaUnit, variant = 'fam', shortlistOn, onShortlist, onCompare, comparedOn, onOpen }) {
  const agent = agents[listing.agent];
  const hero = listing.images[0];
  const price = fmtPrice(listing.price, currency);
  const sqftDisplay = areaUnit === 'sqm' ? `${Math.round(listing.sqft * 0.0929)} sqm` : `${listing.sqft.toLocaleString()} sqft`;
  const pricePerSqft = Math.round(listing.price / listing.sqft);

  // FAM-style horizontal listing card — photo left, details right with bottom agent strip.
  if (variant === 'fam') {
    return (
      <article
        onClick={onOpen}
        className="group cursor-pointer bg-porcelain hairline border border-stone-200 overflow-hidden hover:border-ochre transition-colors flex flex-col md:flex-row"
      >
        {/* Photo */}
        <div className="relative md:w-[42%] md:flex-shrink-0 aspect-[4/3] md:aspect-auto md:min-h-[300px] overflow-hidden bg-stone-200">
          <img src={hero} alt={listing.title} className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" loading="lazy" />
          {listing.dld && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-ochre text-porcelain text-[10px] tracking-[0.22em] uppercase">DLD verified</span>
          )}
          <span className="absolute bottom-3 left-3 px-2 py-1 bg-graphite-900/75 text-porcelain text-[10px] tracking-[0.2em] uppercase flex items-center gap-1.5 backdrop-blur">
            <CameraIcon className="w-3 h-3" /> {listing.photoCount}
          </span>
          <div className="absolute bottom-3 right-3 w-9 h-9 grid place-items-center bg-graphite-900/85 backdrop-blur">
            <img src="assets/conceptplus-mono.svg" className="w-5 h-auto" alt="" />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col p-5 md:p-6 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-baseline gap-2 flex-wrap min-w-0">
              <div className="font-display text-[26px] leading-none num text-graphite-900">{price}</div>
              <span className="text-[11px] text-graphite num bg-porcelain-100 px-2.5 py-1 hairline border border-stone-200">
                AED {pricePerSqft.toLocaleString()} <span className="opacity-70">/sqft</span>
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ActionDot title="Save" onClick={(e) => { e.stopPropagation(); onShortlist && onShortlist(); }}>
                <HeartIcon className="w-4 h-4" filled={shortlistOn} />
              </ActionDot>
              <ActionDot title="Share"><ShareIcon className="w-4 h-4" /></ActionDot>
            </div>
          </div>

          <div className="mt-2 text-[15px] text-graphite-900 leading-snug">{listing.title}</div>

          <div className="mt-3 flex items-center flex-wrap gap-x-5 gap-y-1 text-[12px] text-graphite num">
            <span className="flex items-center gap-1.5"><AreaIcon /> {sqftDisplay}</span>
            <span className="flex items-center gap-1.5"><BedIcon /> {listing.beds} Bed{listing.beds !== 1 ? 's' : ''}</span>
            <span className="flex items-center gap-1.5"><BathIcon /> {listing.baths} Bath{listing.baths !== 1 ? 's' : ''}</span>
          </div>

          <div className="mt-3 text-[12px] text-graphite italic font-display">{listing.type} for Sale in {listing.subCommunity}</div>
          <div className="text-[13px] text-graphite-900 mt-1 flex items-center gap-1.5">
            <PinIcon className="w-3.5 h-3.5 text-ochre" /> {listing.subCommunity}, {listing.community}
          </div>

          {/* Agent strip — bottom, ochre-tinted */}
          <div className="mt-auto pt-4 -mx-5 md:-mx-6 -mb-5 md:-mb-6 px-5 md:px-6 pb-5 md:pb-6 bg-ochre/[0.08] border-t hairline border-stone-200 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <img src={agent.img} alt={agent.name} className="w-9 h-9 object-cover rounded-full hairline border border-stone-200" />
              <div className="min-w-0">
                <div className="text-[13px] text-graphite-900 truncate">{agent.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <PillBtn title="Call"><PhoneIcon className="w-3 h-3" /><span className="hidden sm:inline">Call</span></PillBtn>
              <PillBtn title="WhatsApp"><WhatsappIcon className="w-3 h-3" /><span className="hidden sm:inline">WhatsApp</span></PillBtn>
              <PillBtn title="Email"><EmailIcon className="w-3 h-3" /><span className="hidden sm:inline">Email</span></PillBtn>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'minimal') {
    return (
      <article className="group cursor-pointer" onClick={onOpen}>
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
          <img src={hero} alt={listing.title} className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" loading="lazy" />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <CardChip onClick={(e) => { e.stopPropagation(); onShortlist(); }} active={shortlistOn}><HeartIcon filled={shortlistOn} /></CardChip>
            <CardChip onClick={(e) => { e.stopPropagation(); onCompare(); }} active={comparedOn}><CompareIcon /></CardChip>
            <CardChip><ShareIcon /></CardChip>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-porcelain text-[11px] tracking-[0.2em] uppercase">
            <span className="px-2 py-1 bg-graphite-900/75 backdrop-blur"><CameraIcon className="inline w-3 h-3 mr-1.5 -mt-0.5" />{listing.photoCount}</span>
            {listing.dld && <span className="px-2 py-1 bg-ochre/95 text-porcelain">DLD verified</span>}
          </div>
        </div>
        <div className="pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <div className="font-display text-[24px] leading-none num text-graphite-900">{price}</div>
            <span className="eyebrow text-graphite">{listing.type}</span>
          </div>
          <div className="mt-2 text-[14px] text-graphite-900">{listing.title}</div>
          <div className="text-[13px] text-graphite mt-0.5">{listing.subCommunity}, {listing.community}</div>
          <div className="mt-4 flex items-center gap-4 text-[12px] text-graphite num">
            <span className="flex items-center gap-1.5"><BedIcon /> {listing.beds}</span>
            <span className="flex items-center gap-1.5"><BathIcon /> {listing.baths}</span>
            <span className="flex items-center gap-1.5"><AreaIcon /> {sqftDisplay}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'agent-forward') {
    return (
      <article className="group cursor-pointer bg-porcelain-100 hairline border border-stone-200" onClick={onOpen}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={hero} alt={listing.title} className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" loading="lazy" />
          <div className="absolute top-3 right-3 flex gap-2">
            <CardChip onClick={(e) => { e.stopPropagation(); onShortlist(); }} active={shortlistOn} solid><HeartIcon filled={shortlistOn} /></CardChip>
            <CardChip onClick={(e) => { e.stopPropagation(); onCompare(); }} active={comparedOn} solid><CompareIcon /></CardChip>
            <CardChip solid><ShareIcon /></CardChip>
          </div>
          <div className="absolute top-3 left-3 flex items-center gap-2 text-porcelain text-[10px] tracking-[0.22em] uppercase">
            {listing.dld && <span className="px-2 py-1 bg-ochre">DLD verified</span>}
            <span className="px-2 py-1 bg-graphite-900/85"><CameraIcon className="inline w-3 h-3 mr-1.5 -mt-0.5" />{listing.photoCount}</span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="font-display text-[26px] leading-none num text-graphite-900">{price}</div>
              <div className="mt-2 text-[14px] text-graphite-900">{listing.title}</div>
              <div className="text-[12px] text-graphite mt-0.5 flex items-center gap-1.5"><PinIcon className="w-3 h-3" /> {listing.subCommunity}, {listing.community}</div>
            </div>
            <span className="eyebrow text-ochre" style={{ fontSize: 10 }}>{listing.type}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[12px] text-graphite num">
            <Spec icon={<BedIcon />} label="Beds" value={listing.beds} />
            <Spec icon={<BathIcon />} label="Baths" value={listing.baths} />
            <Spec icon={<AreaIcon />} label="Area" value={sqftDisplay} small />
          </div>
          <div className="mt-5 pt-4 hairline border-t flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img src={agent.img} alt={agent.name} className="w-9 h-9 object-cover rounded-full" />
              <div className="min-w-0">
                <div className="text-[12px] text-graphite-900 truncate">{agent.name}</div>
                <div className="text-[10px] text-graphite tracking-[0.18em] uppercase">RERA · {agent.rera}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ActionDot title="Call"><PhoneIcon className="w-3.5 h-3.5" /></ActionDot>
              <ActionDot title="WhatsApp"><WhatsappIcon className="w-3.5 h-3.5" /></ActionDot>
              <ActionDot title="Email"><EmailIcon className="w-3.5 h-3.5" /></ActionDot>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // editorial — default
  return (
    <article className="group cursor-pointer" onClick={onOpen}>
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <img src={hero} alt={listing.title} className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite-900/55 to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 flex gap-2">
          <CardChip onClick={(e) => { e.stopPropagation(); onShortlist(); }} active={shortlistOn} solid><HeartIcon filled={shortlistOn} /></CardChip>
          <CardChip onClick={(e) => { e.stopPropagation(); onCompare(); }} active={comparedOn} solid><CompareIcon /></CardChip>
          <CardChip solid><ShareIcon /></CardChip>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-2 text-porcelain text-[10px] tracking-[0.22em] uppercase">
          {listing.dld && <span className="px-2 py-1 bg-ochre">DLD verified</span>}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-porcelain">
          <div>
            <div className="eyebrow opacity-80" style={{ fontSize: 10 }}>{listing.type} · For sale</div>
            <div className="font-display text-[28px] leading-none num mt-1.5">{price}</div>
          </div>
          <span className="text-[10px] tracking-[0.22em] uppercase bg-graphite-900/60 backdrop-blur px-2 py-1"><CameraIcon className="inline w-3 h-3 mr-1.5 -mt-0.5" />{listing.photoCount}</span>
        </div>
      </div>
      <div className="pt-4 px-1">
        <div className="text-[15px] text-graphite-900">{listing.title}</div>
        <div className="text-[13px] text-graphite mt-0.5 flex items-center gap-1.5"><PinIcon className="w-3 h-3" /> {listing.subCommunity}, {listing.community}</div>
        <div className="mt-4 pt-4 hairline border-t flex items-center justify-between">
          <div className="flex items-center gap-4 text-[12px] text-graphite num">
            <span className="flex items-center gap-1.5"><BedIcon /> {listing.beds}</span>
            <span className="flex items-center gap-1.5"><BathIcon /> {listing.baths}</span>
            <span className="flex items-center gap-1.5"><AreaIcon /> {sqftDisplay}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <img src={agent.img} alt={agent.name} className="w-7 h-7 object-cover rounded-full" />
            <span className="text-[11px] text-graphite truncate">{agent.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label, value, small }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-graphite">{icon}</span>
      <div className="min-w-0">
        <div className="eyebrow text-stone" style={{ fontSize: 9 }}>{label}</div>
        <div className={`text-graphite-900 ${small ? 'text-[12px]' : 'text-[13px]'} truncate`}>{value}</div>
      </div>
    </div>
  );
}
function CardChip({ children, onClick, active, solid }) {
  return (
    <button onClick={onClick}
      className={`w-9 h-9 grid place-items-center cursor-pointer transition backdrop-blur-md
        ${solid ? 'bg-graphite-900/70 hover:bg-graphite-900 text-porcelain' : 'bg-porcelain/90 hover:bg-porcelain text-graphite-900'}
        ${active ? 'ring-1 ring-ochre' : ''}`}>
      {children}
    </button>
  );
}
function ActionDot({ children, title }) {
  return (
    <button title={title} className="w-8 h-8 grid place-items-center text-graphite hover:text-ochre hover:bg-porcelain transition cursor-pointer">
      {children}
    </button>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
// ─── Footer ─── FAM-density SEO mega-footer + classic footer + bottom strip.
// Communities × types × bedrooms × developers, all linked. Styled minimal
// hairlines on graphite-900 so it reads premium, not spammy.
function Footer() {
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const D = window.CONCEPTPLUS_DATA || { communities: [], developers: [] };
  const communities = (D.communities && D.communities.length ? D.communities : [
    { name: 'Palm Jumeirah' }, { name: 'Downtown Dubai' }, { name: 'Dubai Marina' },
    { name: 'Emirates Hills' }, { name: 'Business Bay' }, { name: 'Jumeirah Bay' },
    { name: 'MBR City' }, { name: 'Jumeirah Village' },
  ]).map(c => c.name);
  const developers = ['Emaar', 'Sobha Realty', 'DAMAC', 'Aldar', 'Meraas', 'Nakheel', 'Omniyat', 'Select Group', 'Binghatti', 'Azizi', 'Dubai Properties', 'Ellington'];
  const types = ['Villa', 'Apartment', 'Penthouse', 'Townhouse', 'Duplex', 'Compound'];
  const bedroomsBuy = ['Studio', '1 bedroom', '2 bedrooms', '3 bedrooms', '4 bedrooms', '5 bedrooms', '6 bedrooms', '7+ bedrooms'];
  const bedroomsRent = bedroomsBuy;
  const offplanStatus = ['Launched', 'Under construction', 'Handover 2025', 'Handover 2026', 'Handover 2027', 'Handover 2028'];

  const seoBlocks = [
    { h: 'Properties for sale by community',  items: communities.map(c => [c, `buy.html?community=${slug(c)}`]) },
    { h: 'Properties for rent by community',  items: communities.map(c => [c, `buy.html#rent?community=${slug(c)}`]) },
    { h: 'Off-plan projects by community',    items: communities.map(c => [c, `off-plan.html?community=${slug(c)}`]) },
    { h: 'Properties for sale by type',       items: types.map(t => [`${t}s for sale in Dubai`, `buy.html?type=${slug(t)}`]) },
    { h: 'Properties for rent by type',       items: types.map(t => [`${t}s for rent in Dubai`, `buy.html#rent?type=${slug(t)}`]) },
    { h: 'Properties for sale by bedrooms',   items: bedroomsBuy.map(b => [b, `buy.html?beds=${slug(b)}`]) },
    { h: 'Properties for rent by bedrooms',   items: bedroomsRent.map(b => [b, `buy.html#rent?beds=${slug(b)}`]) },
    { h: 'Off-plan by status',                items: offplanStatus.map(s => [s, `off-plan.html?status=${slug(s)}`]) },
    { h: 'Top developers in Dubai',           items: developers.map(d => [d, `developers.html?slug=${slug(d)}`]) },
  ];

  return (
    <footer className="bg-graphite-900 text-porcelain mt-16">
      {/* ─── SEO mega-grid ─── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {seoBlocks.map((blk) => (
            <div key={blk.h}>
              <div className="eyebrow text-ochre pb-3 border-b hairline border-porcelain/15">{blk.h}</div>
              <ul className="mt-4 space-y-2">
                {blk.items.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-[13px] text-porcelain/75 hover:text-ochre transition-colors cursor-pointer leading-snug block">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Hairline divider ─── */}
      <div className="border-t hairline border-porcelain/12" />

      {/* ─── Brand block + classic columns ─── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr] gap-12">
          <div>
            <Wordmark tone="light" height={64} />
            <p className="mt-6 text-[14px] text-stone-200 leading-relaxed max-w-sm">Curated by people who live here. A senior brokerage for Dubai's most considered addresses.</p>
            <div className="mt-6 text-[12px] tracking-[0.18em] uppercase text-stone num">
              <div>RERA · 28471</div>
              <div>ORN · 31094</div>
            </div>
            <div className="mt-6 text-[12px] text-stone-200 leading-relaxed">
              <div>Office 1208, Boulevard Plaza Tower 1</div>
              <div>Sheikh Mohammed Bin Rashid Boulevard</div>
              <div>Downtown Dubai, UAE</div>
            </div>
            <div className="mt-5 text-[13px] text-porcelain">
              <div className="num"><span className="text-stone-200">T&nbsp;</span>+971 4 882 4400</div>
              <div className="mt-1"><span className="text-stone-200">E&nbsp;</span>concierge@conceptplus.ae</div>
            </div>
          </div>
          {[
            { h: 'Property', items: [['Buy','buy.html'],['Rent','buy.html#rent'],['Sell','sell.html'],['Off-Plan','off-plan.html'],['Mortgage','mortgage.html'],['Communities','community.html?slug=palm-jumeirah']] },
            { h: 'Company',  items: [['About','#'],['Agents','agents.html'],['Developers','developers.html'],['Careers','careers.html'],['Press','#'],['Blog','#']] },
            { h: 'Services', items: [['Property Mgmt','services.html'],['Mortgage','mortgage.html'],['Conveyancing','services.html'],['Interiors','services.html'],['Investment','services.html'],['Valuation','sell.html']] },
          ].map((col) => (
            <div key={col.h}>
              <div className="eyebrow text-ochre">{col.h}</div>
              <ul className="mt-5 space-y-3 text-[14px] text-porcelain">
                {col.items.map(([label, href]) => <li key={label}><a href={href} className="gold-underline cursor-pointer">{label}</a></li>)}
              </ul>
            </div>
          ))}
          <div>
            <div className="eyebrow text-ochre">Newsletter</div>
            <p className="mt-5 text-[13px] text-stone-200">Quiet emails: market notes, off-plan launches, the occasional address worth knowing.</p>
            <form className="mt-5 flex border-b hairline border-stone">
              <input type="email" placeholder="email@address.com" className="flex-1 bg-transparent py-2 text-[14px] focus:outline-none placeholder:text-stone" />
              <button className="text-ochre hover:text-porcelain px-3 cursor-pointer"><ArrowIcon /></button>
            </form>
            <div className="mt-8 flex gap-4 text-stone-200">
              {['IG','LI','X','YT','FB','TT'].map((s) => <span key={s} className="w-9 h-9 grid place-items-center hairline border border-stone/40 text-[11px] tracking-[0.18em] cursor-pointer hover:border-ochre hover:text-ochre">{s}</span>)}
            </div>
            <div className="mt-8 flex items-center gap-3 hairline border border-stone/30 px-4 py-3">
              <div className="w-9 h-9 grid place-items-center rounded-full bg-ochre text-porcelain text-[14px] font-medium num">4.9</div>
              <div className="flex-1">
                <div className="text-[12px] text-porcelain leading-tight">14,000+ Google reviews</div>
                <div className="text-[10px] tracking-[0.18em] uppercase text-stone-200 mt-1">Verified by Google</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom strip ─── */}
      <div className="border-t hairline border-porcelain/12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-[11px] tracking-[0.18em] uppercase text-stone">
          <div>© 2026 Concept Plus Real Estate Brokerage LLC</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-ochre cursor-pointer">Terms</a>
            <a href="#" className="hover:text-ochre cursor-pointer">Privacy</a>
            <a href="#" className="hover:text-ochre cursor-pointer">Cookies</a>
            <a href="#" className="hover:text-ochre cursor-pointer">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  fmtPrice, FX, FX_SYMBOL, useReveal,
  Monogram, Wordmark, Header, SearchBar, PropertyCard, Footer,
  HeartIcon, CompareIcon, PhoneIcon, WhatsappIcon, EmailIcon, ShareIcon, CameraIcon,
  BedIcon, BathIcon, AreaIcon, CheckIcon, ArrowIcon, CloseIcon, PinIcon,
});
