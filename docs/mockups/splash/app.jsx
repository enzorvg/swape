// Splash screens — 3 variants inside iOS frames

function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 54, padding: '21px 30px 0',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 20, color: c, pointerEvents: 'none',
    }}>
      <span style={{
        fontFamily: '-apple-system, "SF Pro", system-ui',
        fontWeight: 600, fontSize: 15,
      }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="18" height="11" viewBox="0 0 19 12" fill={c}>
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7"/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7"/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7"/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7"/>
        </svg>
        <svg width="22" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke={c} opacity=".5"/>
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill={c}/>
          <rect x="21" y="4" width="2" height="4" rx="1" fill={c} opacity=".4"/>
        </svg>
      </div>
    </div>
  );
}

function PhoneFrame({ children, dark = false }) {
  return (
    <div style={{
      width: 320, height: 640,
      borderRadius: 42, background: '#0d0d0d',
      padding: 8, position: 'relative',
      boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        width: 96, height: 24, borderRadius: 16, background: '#0d0d0d',
        zIndex: 30,
      }}/>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        borderRadius: 34, overflow: 'hidden',
      }}>
        <StatusBar dark={dark}/>
        {children}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 4, borderRadius: 2,
          background: dark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.4)',
          zIndex: 30,
        }}/>
      </div>
    </div>
  );
}

// ─── Variant A: solid vert Swape, pulsing logo ───
function SplashA() {
  return (
    <PhoneFrame dark={true}>
      <div className="splash a">
        <div className="badge-top">Lancement</div>
        <div className="logo-block">
          <div className="logo-img">
            <img src="assets/swape-logo.png" alt="Swape"/>
          </div>
          <div className="wordmark">swape<span className="dot">.</span></div>
          <div className="tagline">Trouve ton stage en un swipe.</div>
        </div>
        <div className="dots">
          <i/><i/><i/>
        </div>
        <div className="copyright">© Swape 2026</div>
      </div>
    </PhoneFrame>
  );
}

// ─── Variant B: swipe deck behind logo on light bg ───
function SplashB() {
  return (
    <PhoneFrame dark={false}>
      <div className="splash b">
        <div className="deck-bg">
          <div className="card k1">
            <div className="photo"/>
            <div className="meta">
              <div className="l1"/><div className="l2"/>
              <div className="chip"/>
            </div>
          </div>
          <div className="card k2">
            <div className="photo"/>
            <div className="meta">
              <div className="l1"/><div className="l2"/>
              <div className="chip"/>
            </div>
          </div>
          <div className="card k3">
            <div className="photo"/>
            <div className="meta">
              <div className="l1"/><div className="l2"/>
              <div className="chip"/>
            </div>
          </div>
        </div>
        <div className="logo-overlay">
          <div className="logo-img">
            <img src="assets/swape-logo.png" alt="Swape"/>
          </div>
          <div className="wordmark">swape<span className="dot">.</span></div>
          <div className="tagline">Le match qui simplifie ta recherche</div>
        </div>
        <div className="dots">
          <i/><i/><i/>
        </div>
        <div className="copyright">v 2.4 · Sécurisé par Swape</div>
      </div>
    </PhoneFrame>
  );
}

// ─── Variant C: dark gradient + rotating progress ring ───
function SplashC() {
  const r = 84;
  const c = 2 * Math.PI * r;
  return (
    <PhoneFrame dark={true}>
      <div className="splash c">
        <div className="logo-block">
          <div className="ring-wrap">
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="3"/>
              <circle cx="90" cy="90" r={r} fill="none" stroke="#4CD98B" strokeWidth="3"
                strokeDasharray={c} strokeDashoffset={c * 0.7} strokeLinecap="round"
                transform="rotate(-90 90 90)"/>
            </svg>
            <div className="logo-img">
              <img src="assets/swape-logo.png" alt="Swape"/>
            </div>
          </div>
          <div className="wordmark">swape<span className="dot">.</span></div>
          <div className="tagline">On prépare tes prochaines opportunités…</div>
        </div>
        <div className="copyright">Connexion sécurisée</div>
      </div>
    </PhoneFrame>
  );
}

window.SplashA = SplashA;
window.SplashB = SplashB;
window.SplashC = SplashC;

// ─── Root with DesignCanvas ───
function App() {
  return (
    <DesignCanvas title="Swape — Splash screens"
      subtitle="3 variations animées · 2-5s pendant le chargement de l'app">
      <DCSection id="splash" title="Splash screens" subtitle="Animations en boucle">
        <DCArtboard id="a" label="A · Vert Swape" width={340} height={660}>
          <div style={{
            display: 'grid', placeItems: 'center',
            width: '100%', height: '100%',
            background: '#F4F4F2',
          }}>
            <SplashA/>
          </div>
        </DCArtboard>
        <DCArtboard id="b" label="B · Cartes & light" width={340} height={660}>
          <div style={{
            display: 'grid', placeItems: 'center',
            width: '100%', height: '100%',
            background: '#F4F4F2',
          }}>
            <SplashB/>
          </div>
        </DCArtboard>
        <DCArtboard id="c" label="C · Dark gradient ring" width={340} height={660}>
          <div style={{
            display: 'grid', placeItems: 'center',
            width: '100%', height: '100%',
            background: '#F4F4F2',
          }}>
            <SplashC/>
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
