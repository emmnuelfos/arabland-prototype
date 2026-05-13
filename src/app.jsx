// Concept Plus — root app: state, modals routing, Tweaks panel.

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "slider",
  "cardVariant": "fam",
  "showStripe": true
}/*EDITMODE-END*/;

function App() {
  // Toggles
  const [currency, setCurrency] = useStateA('AED');
  const [areaUnit, setAreaUnit] = useStateA('sqft');
  const [lang, setLang] = useStateA('EN');

  // Saved sets
  const [shortlist, setShortlist] = useStateA(() => new Set());
  const [compare, setCompare]     = useStateA(() => new Set());

  // Modal/drawer state
  const [openListing, setOpenListing] = useStateA(null);
  const [photoOpen, setPhotoOpen] = useStateA(false);
  const [mortgageOpen, setMortgageOpen] = useStateA(false);
  const [shortlistOpen, setShortlistOpen] = useStateA(false);
  const [scheduleOpen, setScheduleOpen] = useStateA(false);
  const [paymentOpen, setPaymentOpen] = useStateA(false);
  const [mapOpen, setMapOpen] = useStateA(false);

  // Tweaks
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useReveal();

  // Macan Pan is the only typeface — no runtime font override needed.

  // Helpers
  const toggleSet = (set, setter, max) => (id) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else { if (max && next.size >= max) return; next.add(id); }
    setter(next);
  };
  const onShortlistToggle = toggleSet(shortlist, setShortlist);
  const onCompareToggle   = toggleSet(compare, setCompare, 4);

  const D = window.CONCEPTPLUS_DATA;
  const shortlistItems = useMemoA(() => D.listings.filter(l => shortlist.has(l.id)), [shortlist]);
  const compareItems   = useMemoA(() => D.listings.filter(l => compare.has(l.id)), [compare]);

  return (
    <>
      <Header
        shortlistCount={shortlist.size}
        onShortlist={() => setShortlistOpen(true)}
        onCompare={() => compare.size > 0 && setMapOpen(false)}
        currency={currency} setCurrency={setCurrency}
        areaUnit={areaUnit} setAreaUnit={setAreaUnit}
        lang={lang} setLang={setLang}
      />

      <main>
        {/* 1. Hero ─ tabbed search + featured property carousel */}
        <Hero
          variant={tweaks.hero}
          onOpenListing={(l) => setOpenListing(l)}
          onOpenProject={() => setPaymentOpen(true)}
        />
        {/* 2. Trust strip ─ DLD / RERA / Top 50 / sold YTD + featured-in row */}
        <TrustStrip />
        {/* 3. Google reviews bar ─ 4.9 / 14,000+ */}
        <ReviewsBar />
        {/* 4. Developer partners */}
        <DeveloperLogos />
        {/* 5. Latest launched (off-plan first, matches FAM "Latest Launched Projects") */}
        <OffPlan onOpenPlan={() => setPaymentOpen(true)} />
        {/* 6. Featured properties for sale */}
        <FeaturedListings
          cardVariant={tweaks.cardVariant}
          currency={currency}
          areaUnit={areaUnit}
          shortlist={shortlist}
          compare={compare}
          onShortlist={onShortlistToggle}
          onCompare={onCompareToggle}
          onOpen={(l) => { setOpenListing(l); }}
        />
        {/* 7. Communities grid */}
        <Communities />
        {/* 8. Map strip */}
        <ViewOnMapStrip onOpenMap={() => setMapOpen(true)} />
        {/* 9. Mortgage calculator section (new) */}
        <MortgageSection />
        {/* 10. Stats ─ AED transacted, repeat clients */}
        <Stats />
        {/* 11. Why Concept Plus */}
        <WhyConceptPlus />
        {/* 12. Awards & press (new) */}
        <Awards />
        {/* 13. Testimonials carousel (new) */}
        <Testimonials />
        {/* 14. Insights / Blog */}
        <Insights />
        {/* 15. Instagram strip (new) */}
        <InstagramStrip />
        {/* 16. Sell valuation editorial strip */}
        {tweaks.showStripe && <EditorialStrip onValuation={() => setScheduleOpen(true)} />}
      </main>
      <Footer />

      {/* Modals */}
      <PropertyDetail
        open={!!openListing}
        listing={openListing}
        currency={currency}
        onClose={() => setOpenListing(null)}
        onPhotos={() => setPhotoOpen(true)}
        onMortgage={() => setMortgageOpen(true)}
        onSchedule={() => setScheduleOpen(true)}
      />
      <PhotoLightbox open={photoOpen} listing={openListing || D.listings[0]} onClose={() => setPhotoOpen(false)} />
      <MortgageCalc open={mortgageOpen} listing={openListing || D.listings[0]} currency={currency} onClose={() => setMortgageOpen(false)} />
      <ShortlistDrawer open={shortlistOpen} items={shortlistItems} currency={currency} onRemove={onShortlistToggle} onClose={() => setShortlistOpen(false)} />
      <ScheduleViewing open={scheduleOpen} listing={openListing || D.listings[0]} agents={D.agents} onClose={() => setScheduleOpen(false)} />
      <PaymentPlanModal open={paymentOpen} onClose={() => setPaymentOpen(false)} />
      <MapPreview open={mapOpen} currency={currency} onClose={() => setMapOpen(false)} />

      {/* Compare tray */}
      <CompareTray
        items={compareItems}
        currency={currency}
        agents={D.agents}
        onRemove={onCompareToggle}
        onClear={() => setCompare(new Set())}
      />

      {/* Tweaks */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Homepage hero">
          <TweakRadio label="Hero variant" value={tweaks.hero} onChange={(v) => setTweak('hero', v)}
            options={[{ value: 'slider', label: 'Slider' }, { value: 'video', label: 'Video' }, { value: 'cinematic', label: 'Cinematic' }, { value: 'editorial-split', label: 'Editorial' }, { value: 'monogram-stack', label: 'Monogram' }]} />
        </TweakSection>
        <TweakSection title="Listing card">
          <TweakRadio label="Card style" value={tweaks.cardVariant} onChange={(v) => setTweak('cardVariant', v)}
            options={[{ value: 'fam', label: 'FAM' }, { value: 'editorial', label: 'Editorial' }, { value: 'minimal', label: 'Minimal' }, { value: 'agent-forward', label: 'Agent' }]} />
        </TweakSection>
        <TweakSection title="Sections">
          <TweakToggle label="Valuation strip" value={tweaks.showStripe} onChange={(v) => setTweak('showStripe', v)} />
        </TweakSection>
        <TweakSection title="Try the experience">
          <TweakButton label="Open property detail" onClick={() => setOpenListing(D.listings[0])} />
          <TweakButton label="Open map view" onClick={() => setMapOpen(true)} />
          <TweakButton label="Mortgage calculator" onClick={() => setMortgageOpen(true)} />
          <TweakButton label="Schedule a viewing" onClick={() => setScheduleOpen(true)} />
          <TweakButton label="Payment plan" onClick={() => setPaymentOpen(true)} />
          <TweakButton label="Shortlist drawer" onClick={() => setShortlistOpen(true)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function ViewOnMapStrip({ onOpenMap }) {
  return (
    <section className="bg-graphite-900 text-porcelain">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 grid md:grid-cols-[1fr_auto] items-center gap-8">
        <div className="reveal">
          <div className="eyebrow text-ochre">Map view</div>
          <h3 className="font-display mt-2 leading-tight" style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', fontWeight: 400 }}>1,247 addresses, mapped to the meter.</h3>
        </div>
        <button onClick={onOpenMap} className="reveal justify-self-start md:justify-self-end px-6 py-4 hairline border border-porcelain/40 text-[11px] tracking-[0.22em] uppercase hover:border-ochre hover:text-ochre cursor-pointer flex items-center gap-3">
          Open the map <ArrowIcon />
        </button>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
