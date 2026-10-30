// app.jsx — root component, nav, tweaks wiring

function Nav() {
  return (
    <nav className="nav">
      <div className="wrap nav-inner">
        <div className="logo">
          <div className="smark" aria-label="Swape">
            <img src={(window.__resources && window.__resources.logo) || "assets/swape-logo.png"} alt="Swape"/>
          </div>
          <span>swape<span className="dot">.</span></span>
        </div>
        <div className="nav-links">
          <a href="#how">Comment ça marche</a>
          <a href="mobile/Swape App.html">App étudiant</a>
          <a href="mobile/Swape Recruteur.html">App recruteur</a>
          <a href="recruteur-web/Swape Recruteur Web.html">Web recruteur</a>
        </div>
        <div className="nav-cta">
          <a className="btn btn-ghost" href="mobile/Swape App.html">Essayer la démo</a>
          <a className="btn btn-primary" href="#cta">Télécharger</a>
        </div>
      </div>
    </nav>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#00BF63",
  "btnShape": "pill",
  "displayFont": "Outfit",
  "heroLayout": "phone-right",
  "showFloatChips": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Live apply tweaks to CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--vert-swape', t.accent);
    // derive a darker hover from accent (simple darken)
    root.style.setProperty('--font-display', `"${t.displayFont}", system-ui, sans-serif`);
    root.dataset.btnShape = t.btnShape === 'pill' ? '' : t.btnShape;
    if (t.btnShape === 'pill') {
      root.style.setProperty('--btn-radius', '999px');
    } else if (t.btnShape === 'rounded') {
      root.style.setProperty('--btn-radius', '12px');
    } else {
      root.style.setProperty('--btn-radius', '6px');
    }

    // Hero layout
    const grid = document.querySelector('.hero-grid');
    if (grid) {
      if (t.heroLayout === 'phone-left') {
        grid.style.gridTemplateColumns = '.95fr 1.05fr';
        grid.style.direction = 'rtl';
        Array.from(grid.children).forEach(c => c.style.direction = 'ltr');
      } else if (t.heroLayout === 'centered') {
        grid.style.gridTemplateColumns = '1fr';
        grid.style.textAlign = 'center';
        grid.style.justifyItems = 'center';
        grid.style.direction = 'ltr';
        Array.from(grid.children).forEach(c => c.style.direction = 'ltr');
      } else {
        grid.style.gridTemplateColumns = '1.05fr .95fr';
        grid.style.textAlign = '';
        grid.style.justifyItems = '';
        grid.style.direction = 'ltr';
      }
    }

    // Float chips
    document.querySelectorAll('.float-chip').forEach(el => {
      el.style.display = t.showFloatChips ? '' : 'none';
    });
  }, [t]);

  return (
    <>
      <Nav/>
      <main>
        <Hero tweaks={t}/>
        <HowItWorks/>
        <Audiences/>
        <Features/>
        <Stats/>
        <Testimonials/>
        <CTA/>
      </main>
      <Footer/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Identité"/>
        <TweakColor
          label="Couleur d'accent"
          value={t.accent}
          options={['#00BF63', '#008C46', '#4CD98B', '#1E1E1E']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSelect
          label="Police d'affichage"
          value={t.displayFont}
          options={['Outfit', 'Quicksand', 'Sora', 'Mona Sans', 'Plus Jakarta Sans']}
          onChange={(v) => setTweak('displayFont', v)}
        />

        <TweakSection label="Layout"/>
        <TweakRadio
          label="Hero"
          value={t.heroLayout}
          options={[
            {value: 'phone-right', label: 'Phone droite'},
            {value: 'phone-left',  label: 'Phone gauche'},
            {value: 'centered',    label: 'Centré'},
          ]}
          onChange={(v) => setTweak('heroLayout', v)}
        />
        <TweakRadio
          label="Boutons"
          value={t.btnShape}
          options={[
            {value: 'pill',    label: 'Pill'},
            {value: 'rounded', label: 'Arrondi'},
            {value: 'square',  label: 'Carré'},
          ]}
          onChange={(v) => setTweak('btnShape', v)}
        />
        <TweakToggle
          label="Notifications flottantes"
          value={t.showFloatChips}
          onChange={(v) => setTweak('showFloatChips', v)}
        />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
