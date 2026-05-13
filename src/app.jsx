// Concept Plus — root app: state, modals routing, Tweaks panel.

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "hero": "slider",
  "cardVariant": "fam",
  "displayFont": "Cormorant Garamond",
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

  // Apply tweak font
  useEffectA(() => {
    const root = document.documentElement;
    const map = {
      'Cormorant Garamond': '"Cormorant Garamond", Georgia, serif',
      'Bodoni Moda':        '"Bodoni Moda", Georgia, serif',
      'Inter Display':      '"Inter Display", Inter, sans-serif',
      'Playfair Display':   '"Playfair Display", Georgia, serif',
    };
    document.querySelectorAll('.font-display').forEach(el => { el.style.fontFamily = map[tweaks.displayFont] || map['Cormorant Garamond']; });
  }, [tweaks.displayFont]);

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
        <Hero variant={tweaks.hero} />
        <Communities />
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
        <ViewOnMapStrip onOpenMap={() => setMapOpen(true)} />
        <OffPlan onOpenPlan={() => setPaymentOpen(true)} />
        <Stats />
        <WhyConceptPlus />
        {tweaks.showStripe && <EditorialStrip onValuation={() => setScheduleOpen(true)} />}
        <Insights />
        <DeveloperLogos />
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
        <TweakSection title="Typography">
          <TweakSelect label="Display font" value={tweaks.displayFont} onChange={(v) => setTweak('displayFont', v)}
            options={[
              { value: 'Cormorant Garamond', label: 'Cormorant Garamond (default)' },
              { value: 'Bodoni Moda', label: 'Bodoni Moda' },
              { value: 'Inter Display', label: 'Inter Display' },
              { value: 'Playfair Display', label: 'Playfair Display' },
            ]} />
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
