// Concept Plus — homepage sections.

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

// ─── Hero (5 variants via tweak) ───────────────────────────────────────────
function Hero({ variant = 'slider' }) {
  if (variant === 'editorial-split') return <HeroEditorial />;
  if (variant === 'monogram-stack')  return <HeroMonogram />;
  if (variant === 'cinematic')       return <HeroCinematic />;
  if (variant === 'video')           return <HeroVideo />;
  return <HeroSlider />;
}

// FAM-style featured-property slider — high-res luxury imagery, cross-fade,
// auto-rotate, dot indicators. Each slide shows a Concept Plus property + CTA.
function HeroSlider() {
  // Hand-picked Unsplash images at 2880px / quality 95 — luxury Dubai real estate.
  // The slide content also gets surfaced as a small property card at the bottom-left.
  // All photo IDs verified visually for Dubai luxury real estate appropriateness.
  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2880&q=95',
      name: 'Frond M, Palm Jumeirah',
      tagline: 'Signature Villas — beachfront living, redefined.',
      eyebrow: 'For sale · Villa',
      price: 'AED 42.5M',
      cta: 'property.html'
    },
    {
      img: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=2880&q=95',
      name: 'Burj-view Penthouse, Downtown',
      tagline: 'The Burj framed in floor-to-ceiling glass.',
      eyebrow: 'For sale · Penthouse',
      price: 'AED 18.9M',
      cta: 'property.html'
    },
    {
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2880&q=95',
      name: 'Lakeside Mansion, Emirates Hills',
      tagline: 'A private estate at Sector E, eight bedrooms.',
      eyebrow: 'For sale · Mansion',
      price: 'AED 78M',
      cta: 'property.html'
    },
    {
      img: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2880&q=95',
      name: 'Cassia Residences, MBR City',
      tagline: 'By Sobha · Handover Q4 2027 · 60/40 payment plan.',
      eyebrow: 'Off-plan · Launched',
      price: 'From AED 1.80M',
      cta: 'off-plan.html'
    },
    {
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2880&q=95',
      name: 'Sea-line apartment, Bluewaters',
      tagline: 'Bluewaters Residences — sea-line orientation.',
      eyebrow: 'For sale · Apartment',
      price: 'AED 6.85M',
      cta: 'property.html'
    },
  ];

  const [idx, setIdx] = useStateS(0);
  const [paused, setPaused] = useStateS(false);
  const drag = useRefS({ startX: null, startY: null, moved: false });

  const next = () => setIdx((i) => (i + 1) % slides.length);
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);

  useEffectS(() => {
    if (paused) return;
    const t = setInterval(next, 5800);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, slides.length]);

  // Drag-to-advance — works on empty space; ignores clicks on interactive controls.
  const onPointerDown = (e) => {
    if (e.target.closest('a, button, input, textarea, select')) return;
    const p = e.touches ? e.touches[0] : e;
    drag.current = { startX: p.clientX, startY: p.clientY, moved: false };
  };
  const onPointerUp = (e) => {
    if (drag.current.startX == null) return;
    const p = e.changedTouches ? e.changedTouches[0] : e;
    const dx = p.clientX - drag.current.startX;
    const dy = p.clientY - drag.current.startY;
    drag.current.startX = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
  };

  return (
    <section
      className="relative min-h-[100vh] w-full overflow-hidden bg-graphite-900 select-none"
      data-screen-label="Hero · Slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseDown={onPointerDown}
      onMouseUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchEnd={onPointerUp}
    >
      {/* Slides — each absolute, cross-fading */}
      {slides.map((s, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-[1400ms]" style={{ opacity: i === idx ? 1 : 0 }}>
          <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
        </div>
      ))}

      {/* Subtle dark overlay so the white UI reads on bright slides */}
      <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

      {/* Left arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 grid place-items-center bg-graphite-900/40 backdrop-blur hairline border border-porcelain/30 text-porcelain hover:border-ochre hover:bg-ochre hover:text-porcelain transition cursor-pointer"
      >
        <ArrowIcon dir="left" className="w-4 h-4" />
      </button>
      {/* Right arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 grid place-items-center bg-graphite-900/40 backdrop-blur hairline border border-porcelain/30 text-porcelain hover:border-ochre hover:bg-ochre hover:text-porcelain transition cursor-pointer"
      >
        <ArrowIcon dir="right" className="w-4 h-4" />
      </button>

      {/* Content — search bar centered vertically + horizontally, property card pinned to the bottom */}
      <div className="relative h-full min-h-[100vh] flex flex-col">
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Centered search bar */}
        <div className="px-6 md:px-10 flex justify-center">
          <div className="reveal w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        {/* Bottom spacer holds the property card + dots flush to the bottom */}
        <div className="flex-1 flex flex-col justify-end pb-12 md:pb-16">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              {/* Rotating property card — bottom-left */}
              <div className="relative min-h-[120px] min-w-[280px]">
                {slides.map((s, i) => (
                  <div key={i}
                    className="transition-opacity duration-700"
                    style={{
                      opacity: i === idx ? 1 : 0,
                      position: i === idx ? 'relative' : 'absolute',
                      pointerEvents: i === idx ? 'auto' : 'none',
                      inset: i === idx ? undefined : 0
                    }}>
                    <div className="text-porcelain/70 text-[10px] tracking-[0.28em] uppercase">{s.eyebrow}</div>
                    <div className="text-porcelain font-display leading-tight mt-2" style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', fontWeight: 400 }}>{s.name}</div>
                    <div className="text-porcelain/85 text-[14px] mt-1 max-w-md">{s.tagline}</div>
                    <div className="mt-4 flex items-center gap-5 flex-wrap">
                      <div>
                        <div className="text-porcelain/65 text-[10px] tracking-[0.22em] uppercase">{s.eyebrow.startsWith('Off-plan') ? 'Starting from' : 'Asking'}</div>
                        <div className="text-porcelain font-display num text-[26px] leading-none mt-1">{s.price}</div>
                      </div>
                      <a href={s.cta} className="inline-flex items-center gap-3 px-6 py-3 hairline border border-porcelain/40 text-porcelain text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:bg-ochre hover:text-porcelain transition cursor-pointer">
                        Discover more <ArrowIcon className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dot indicators — bottom-right */}
              <div className="flex items-center gap-3">
                <span className="text-porcelain/65 text-[11px] num tracking-wider mr-3">{String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-[2px] transition-all cursor-pointer ${i === idx ? 'w-12 bg-ochre' : 'w-6 bg-porcelain/30 hover:bg-porcelain/70'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Social proof strip — sits right after the hero. Four trust badges on a dark
// background that continues the slider's mood into the page.
function TrustStrip() {
  const items = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 3 4 6v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-3z" /><path d="m9 12 2 2 4-4" />
        </svg>
      ),
      big: 'DLD',
      label: 'Registered Broker',
      sub: 'Dubai Land Department',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="4" y="3" width="16" height="14" rx="1" /><path d="M8 8h8M8 12h5" /><path d="m9 20 3-3 3 3v-5" />
        </svg>
      ),
      big: 'RERA',
      label: 'Certified · ORN 31094',
      sub: 'Real Estate Regulatory Agency',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 1-3 3" /><path d="M12 13v4M9 21h6" />
        </svg>
      ),
      big: 'Top 50',
      label: 'Brokers Dubai · 2025',
      sub: 'Bayut Top Producers Award',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M3 17 9 11l4 4 8-9" /><path d="M14 6h7v7" />
        </svg>
      ),
      big: 'AED 2.4B',
      label: 'Properties sold',
      sub: 'Year-to-date · 2026',
    },
  ];
  return (
    <section className="bg-graphite-900 text-porcelain">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-14 md:py-16">
        <div className="text-center mb-10 md:mb-12">
          <div className="eyebrow text-ochre mb-3">The trust</div>
          <h2 className="font-display text-porcelain mx-auto max-w-2xl" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', fontWeight: 300, lineHeight: 1.15 }}>
            Held to the city's most senior standards.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-porcelain/10 hairline border border-porcelain/10">
          {items.map((it, i) => (
            <div key={i} className="bg-graphite-900 px-6 py-8 md:py-10 flex flex-col items-center text-center reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="w-12 h-12 grid place-items-center rounded-full hairline border border-ochre/40 text-ochre mb-5">
                {it.icon}
              </div>
              <div className="font-display num text-ochre" style={{ fontSize: 30, fontWeight: 400 }}>{it.big}</div>
              <div className="text-[13px] text-porcelain mt-2 leading-tight">{it.label}</div>
              <div className="text-[10px] text-porcelain/55 tracking-[0.18em] uppercase mt-2">{it.sub}</div>
            </div>
          ))}
        </div>
        {/* Featured-in strip */}
        <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[11px] tracking-[0.28em] uppercase text-porcelain/45">
          <span className="text-porcelain/65">As featured in</span>
          <span>Forbes Middle East</span>
          <span className="opacity-30">·</span>
          <span>Arabian Business</span>
          <span className="opacity-30">·</span>
          <span>The National</span>
          <span className="opacity-30">·</span>
          <span>Property Finder</span>
        </div>
      </div>
    </section>
  );
}

function HeroVideo() {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden bg-graphite-900" data-screen-label="Hero · Video">
      <video
        src="https://cdn.poses4u.com/Scenes/12989671_1920_1080_60fps.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=85"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Bottom 80% gradient overlay: black 60% at the bottom → transparent at the 80% mark */}
      <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      <div className="relative h-full min-h-[100vh] flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-40 pb-10">
            <div className="reveal">
              <div className="eyebrow text-ochre mb-6">Est. 2014 · Dubai</div>
              <h1 className="font-display text-porcelain leading-[0.95] tracking-[-0.01em]" style={{ fontSize: 'clamp(56px, 9vw, 144px)', fontWeight: 400 }}>
                Dubai's<br/><em className="not-italic text-ochre font-display" style={{ fontStyle: 'italic', fontWeight: 300 }}>address book.</em>
              </h1>
              <p className="mt-8 max-w-xl text-porcelain/85 text-[17px] leading-relaxed">
                A senior brokerage for the city's most considered addresses — hand-picked off the public market, walked by the people who'll sell them.
              </p>
            </div>
          </div>
        </div>
        <div className="pb-16 md:pb-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="reveal">
              <SearchBar />
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-4 max-w-3xl">
              {[['1,247', 'Active listings'], ['AED 2.4B', 'Sold YTD'], ['80+', 'Senior agents'], ['25+', 'Developer partners']].map(([n, l]) => (
                <div key={l} className="text-porcelain/90">
                  <div className="font-display text-[28px] num leading-none">{n}</div>
                  <div className="eyebrow text-porcelain/65 mt-2" style={{ fontSize: 10 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCinematic() {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden bg-graphite-900" data-screen-label="Hero · Cinematic">
      <img
        src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=85"
        alt="Dubai skyline at golden hour"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-graphite-900/55 via-graphite-900/30 to-graphite-900/85" />
      <div className="absolute inset-0 bg-gradient-to-tr from-graphite-900/40 to-transparent" />

      <div className="relative h-full min-h-[100vh] flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-40 pb-10">
            <div className="reveal">
              <div className="eyebrow text-ochre mb-6">Est. 2014 · Dubai</div>
              <h1 className="font-display text-porcelain leading-[0.95] tracking-[-0.01em]" style={{ fontSize: 'clamp(56px, 9vw, 144px)', fontWeight: 400 }}>
                Dubai's<br/><em className="not-italic text-ochre font-display" style={{ fontStyle: 'italic', fontWeight: 300 }}>address book.</em>
              </h1>
              <p className="mt-8 max-w-xl text-porcelain/85 text-[17px] leading-relaxed">
                A senior brokerage for the city's most considered addresses — hand-picked off the public market, walked by the people who'll sell them.
              </p>
            </div>
          </div>
        </div>
        <div className="pb-16 md:pb-20">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="reveal">
              <SearchBar />
            </div>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-4 max-w-3xl">
              {[['1,247', 'Active listings'], ['AED 2.4B', 'Sold YTD'], ['80+', 'Senior agents'], ['25+', 'Developer partners']].map(([n, l]) => (
                <div key={l} className="text-porcelain/90">
                  <div className="font-display text-[28px] num leading-none">{n}</div>
                  <div className="eyebrow text-porcelain/65 mt-2" style={{ fontSize: 10 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroEditorial() {
  return (
    <section className="relative min-h-[100vh] w-full bg-porcelain" data-screen-label="Hero · Editorial split">
      <div className="grid lg:grid-cols-[1.05fr_1fr] min-h-[100vh]">
        <div className="relative flex flex-col justify-end px-6 md:px-16 pt-40 pb-16">
          <div className="reveal">
            <div className="eyebrow text-ochre mb-8">Vol. 12 · Spring 2026</div>
            <h1 className="font-display text-graphite-900 leading-[0.95] tracking-[-0.01em]" style={{ fontSize: 'clamp(56px, 8vw, 124px)', fontWeight: 300 }}>
              Dubai's<br/><span className="italic">address book.</span>
            </h1>
            <p className="mt-8 max-w-md text-graphite text-[16px] leading-relaxed">
              A senior brokerage for the city's most considered addresses — hand-picked off the public market, walked by the people who'll sell them.
            </p>
            <div className="mt-12">
              <SearchBar variant="light" />
            </div>
          </div>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=85"
            alt="Palm Jumeirah villa"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-graphite-900/70 to-transparent text-porcelain">
            <div className="eyebrow opacity-80" style={{ fontSize: 10 }}>Currently representing</div>
            <div className="font-display text-[28px] mt-2">Frond M, Palm Jumeirah</div>
            <div className="text-[13px] opacity-85">6 bed · 8,200 sqft · AED 42.5M</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroMonogram() {
  return (
    <section className="relative min-h-[100vh] w-full bg-graphite-900 overflow-hidden" data-screen-label="Hero · Monogram stack">
      <img
        src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=85"
        alt="Dubai Marina"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-graphite-900/60" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 pt-40 pb-20 min-h-[100vh] flex flex-col justify-center">
        <div className="reveal flex items-start gap-12">
          <div className="hidden md:block shrink-0">
            <Wordmark tone="light" height={120} />
          </div>
          <div>
            <div className="eyebrow text-ochre mb-6">A R E · Dubai</div>
            <h1 className="font-display text-porcelain leading-[0.95]" style={{ fontSize: 'clamp(48px, 7.5vw, 112px)', fontWeight: 300 }}>
              Dubai's <span className="italic">address book,</span><br/> kept by people who live here.
            </h1>
            <p className="mt-8 max-w-2xl text-porcelain/85 text-[17px] leading-relaxed">
              A senior brokerage of 80+ specialists across Palm Jumeirah, Downtown, Marina, Emirates Hills and beyond.
            </p>
          </div>
        </div>
        <div className="mt-16 reveal">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

// ─── Featured Communities ──────────────────────────────────────────────────
function Communities() {
  const D = window.CONCEPTPLUS_DATA;
  return (
    <Section eyebrow="Communities" title="Where Dubai lives." sub="Eight neighborhoods, each with its own register of value, light and life. Pick the one that suits how you'd like to wake up.">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
        {D.communities.map((c, i) => (
          <a key={c.name} href="buy.html" className="reveal group cursor-pointer" style={{ transitionDelay: `${i * 30}ms` }}>
            <div className="relative aspect-[16/11] overflow-hidden bg-stone-200">
              <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-900/85 via-graphite-900/15 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-porcelain">
                <div className="font-display text-[22px] leading-tight">{c.name}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="eyebrow opacity-80" style={{ fontSize: 10 }}>{c.count} listings</span>
                  <span className="text-ochre opacity-0 group-hover:opacity-100 transition"><ArrowIcon /></span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

// ─── Featured Listings ─────────────────────────────────────────────────────
function FeaturedListings({ cardVariant, currency, areaUnit, shortlist, compare, onShortlist, onCompare, onOpen }) {
  const D = window.CONCEPTPLUS_DATA;
  // FAM-style stacked list when default ('fam') variant is selected; old horizontal scroller for the alternate (editorial/minimal/agent-forward) variants.
  const isFam = cardVariant === 'fam';
  const scrollRef = useRefS(null);
  const scrollBy = (dir) => scrollRef.current?.scrollBy({ left: dir * 460, behavior: 'smooth' });
  const featured = isFam ? D.listings.slice(0, 4) : D.listings;

  return (
    <Section eyebrow="Featured listings" title="Currently on the books." sub="A sampling from this season's best — Frond M villas, Burj-view penthouses, Marina addresses you won't find on the public portals.">
      {!isFam && (
        <div className="-mt-2 mb-6 flex items-center gap-3 justify-end">
          <button onClick={() => scrollBy(-1)} className="w-11 h-11 grid place-items-center hairline border border-stone-200 text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer"><ArrowIcon dir="left" /></button>
          <button onClick={() => scrollBy(1)} className="w-11 h-11 grid place-items-center hairline border border-stone-200 text-graphite hover:text-ochre hover:border-ochre transition cursor-pointer"><ArrowIcon /></button>
        </div>
      )}

      {isFam ? (
        <div className="flex flex-col gap-6">
          {featured.map((l, i) => (
            <div key={l.id} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <PropertyCard
                listing={l}
                agents={D.agents}
                currency={currency}
                areaUnit={areaUnit}
                variant={cardVariant}
                shortlistOn={shortlist.has(l.id)}
                comparedOn={compare.has(l.id)}
                onShortlist={() => onShortlist(l.id)}
                onCompare={() => onCompare(l.id)}
                onOpen={() => onOpen(l)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar -mx-6 md:-mx-10 px-6 md:px-10 snap-x">
          {featured.map((l, i) => (
            <div key={l.id} className="reveal w-[88vw] sm:w-[420px] md:w-[440px] shrink-0 snap-start" style={{ transitionDelay: `${i * 40}ms` }}>
              <PropertyCard
                listing={l}
                agents={D.agents}
                currency={currency}
                areaUnit={areaUnit}
                variant={cardVariant}
                shortlistOn={shortlist.has(l.id)}
                comparedOn={compare.has(l.id)}
                onShortlist={() => onShortlist(l.id)}
                onCompare={() => onCompare(l.id)}
                onOpen={() => onOpen(l)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <a href="buy.html" className="eyebrow text-ochre gold-underline cursor-pointer">View all 1,247 listings</a>
      </div>
    </Section>
  );
}

// ─── Off-Plan ─────────────────────────────────────────────────────────────
function OffPlan({ onOpenPlan }) {
  const D = window.CONCEPTPLUS_DATA;
  return (
    <Section eyebrow="Off-plan" title="Tomorrow's addresses." sub="Pre-launch allocations, payment plans engineered for absentee owners, and the data to know which towers will hold their value.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {D.offPlan.map((p, i) => (
          <article key={p.id} onClick={onOpenPlan} className="reveal group cursor-pointer bg-porcelain-100 hairline border border-stone-200" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-graphite-900/10 to-graphite-900/85" />
              <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] tracking-[0.22em] uppercase bg-porcelain/95 text-graphite-900">{p.status}</span>
              <div className="absolute bottom-5 left-5 right-5 text-porcelain">
                <div className="eyebrow text-ochre" style={{ fontSize: 10 }}>{p.developer}</div>
                <div className="font-display text-[26px] leading-tight mt-2">{p.name}</div>
              </div>
            </div>
            <div className="p-5 grid grid-cols-3 gap-2 text-[12px]">
              <div>
                <div className="eyebrow text-stone" style={{ fontSize: 9 }}>From</div>
                <div className="text-graphite-900 num text-[14px] mt-1">AED {(p.from / 1_000_000).toFixed(2)}M</div>
              </div>
              <div>
                <div className="eyebrow text-stone" style={{ fontSize: 9 }}>Handover</div>
                <div className="text-graphite-900 mt-1">{p.completion}</div>
              </div>
              <div>
                <div className="eyebrow text-stone" style={{ fontSize: 9 }}>Units</div>
                <div className="text-graphite-900 num mt-1">{p.units}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ─── Stats by the numbers ──────────────────────────────────────────────────
function Stats() {
  const items = [
    ['1,247', 'Active listings', 'Curated and verified by senior brokers — never sourced from public portals.'],
    ['80+', 'Senior agents', 'Median experience: 9 years. Specialists, not generalists.'],
    ['25+', 'Developer partners', 'Pre-launch allocations from Emaar, Sobha, Aldar, Meraas and DAMAC.'],
    ['AED 2.4B', 'Sold YTD', 'Across 184 transactions, with a median time-to-offer of 38 days.'],
  ];
  return (
    <section className="bg-graphite-900 text-porcelain py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-4 gap-12 md:gap-10">
          {items.map(([n, l, d], i) => (
            <div key={l} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="font-display text-ochre num leading-none" style={{ fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 300 }}>{n}</div>
              <div className="eyebrow mt-5 text-porcelain" style={{ fontSize: 11 }}>{l}</div>
              <p className="mt-4 text-stone-200 text-[14px] leading-relaxed max-w-[26ch]">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Concept Plus ──────────────────────────────────────────────────────────
function WhyConceptPlus() {
  const items = [
    { eb: 'Inventory', t: 'Curated, not crawled.', d: 'Every address on Concept Plus has been walked by the broker representing it. We don\'t scrape, repost or re-list.' },
    { eb: 'Team',      t: 'Senior brokerage only.', d: 'No first-year agents. Every Concept Plus broker has closed at least AED 50M and holds active RERA certification.' },
    { eb: 'Process',   t: 'Transparent by default.', d: 'Permit numbers, DLD verification, comparables, and the actual time-on-market — surfaced, not buried.' },
  ];
  return (
    <Section eyebrow="Why Concept Plus" title="Curated by people who live here." sub="">
      <div className="grid md:grid-cols-3 gap-x-12 gap-y-12 mt-4">
        {items.map((x, i) => (
          <div key={x.eb} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="eyebrow text-ochre">{x.eb}</div>
            <h3 className="font-display text-graphite-900 mt-5 leading-tight" style={{ fontSize: 36, fontWeight: 400 }}>{x.t}</h3>
            <div className="hairline border-t mt-6 pt-6 text-graphite text-[15px] leading-relaxed">{x.d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ─── Insights ──────────────────────────────────────────────────────────────
function Insights() {
  const D = window.CONCEPTPLUS_DATA;
  return (
    <Section eyebrow="Latest insights" title="Quietly, in print." sub="Market reports, community guides, and the occasional letter on what's actually changing in Dubai property.">
      <div className="grid md:grid-cols-3 gap-8">
        {D.insights.map((a, i) => (
          <article key={a.title} className="reveal group cursor-pointer" style={{ transitionDelay: `${i * 70}ms` }}>
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
              <img src={a.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" loading="lazy" />
            </div>
            <div className="pt-5">
              <div className="eyebrow text-ochre">{a.kind} · {a.read} read</div>
              <h3 className="font-display text-graphite-900 mt-3 leading-tight" style={{ fontSize: 26, fontWeight: 400 }}>{a.title}</h3>
              <div className="mt-4 inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase text-graphite gold-underline">Read on <ArrowIcon /></div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// ─── Developer Logos (custom monoline marks, not real logos) ──────────────
function DeveloperLogos() {
  const D = window.CONCEPTPLUS_DATA;
  const all = [...D.developers, ...D.developers];
  return (
    <section className="bg-porcelain py-20 hairline border-y border-stone-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="text-center mb-10">
          <div className="eyebrow text-ochre">Trusted by developers</div>
          <p className="font-display text-graphite-900 mt-3" style={{ fontSize: 28, fontWeight: 400 }}>Pre-launch allocations from Dubai's most discerning developers.</p>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-16 marquee-track w-max items-center">
          {all.map((d, i) => (
            <div key={d + i} className="flex items-center gap-3 text-graphite hover:text-ochre transition shrink-0">
              <div className="w-8 h-8 hairline border border-stone-200 grid place-items-center">
                <span className="font-display text-[14px]">{d[0]}</span>
              </div>
              <span className="font-display text-[26px]" style={{ fontWeight: 400, letterSpacing: '0.02em' }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────
function Section({ eyebrow, title, sub, children }) {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {(eyebrow || title || sub) && (
          <div className="reveal max-w-3xl mb-14 md:mb-20">
            {eyebrow && <div className="eyebrow text-ochre mb-5">{eyebrow}</div>}
            {title && <h2 className="font-display text-graphite-900 leading-[1.02]" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400 }}>{title}</h2>}
            {sub && <p className="mt-6 text-graphite text-[16px] leading-relaxed max-w-2xl">{sub}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

// ─── Editorial CTA Strip ─────────────────────────────────────────────────
function EditorialStrip({ onValuation }) {
  return (
    <section className="bg-porcelain-100 py-24 md:py-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">
        <div className="reveal">
          <div className="eyebrow text-ochre mb-5">For owners</div>
          <h2 className="font-display text-graphite-900 leading-[1.02]" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400 }}>What's your home worth?</h2>
          <p className="mt-6 text-graphite text-[16px] leading-relaxed max-w-xl">A senior broker, comparable transactions in your community, and a precise valuation — usually within 48 hours.</p>
          <div className="mt-10 flex items-center gap-4">
            <a href="sell.html" className="bg-graphite-900 text-porcelain px-7 py-4 text-[12px] tracking-[0.22em] uppercase hover:bg-ochre transition cursor-pointer">Request a valuation</a>
            <a href="agents.html" className="eyebrow text-graphite-900 gold-underline cursor-pointer">Or schedule a meeting</a>
          </div>
        </div>
        <div className="reveal aspect-[5/4] overflow-hidden bg-stone-200">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85" alt="Emirates Hills villa" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, TrustStrip, Communities, FeaturedListings, OffPlan, Stats, WhyConceptPlus, Insights, DeveloperLogos, EditorialStrip, Section });
