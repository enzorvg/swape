// hero.jsx — Swape landing hero with interactive swipeable cards

const { useState, useRef, useEffect, useCallback } = React;

// Sample companies shown as cards in the hero phone
const HERO_COMPANIES = [
  { name: "Atelier Lumen", role: "UX Designer", loc: "Paris · Hybride",
    tags: ["Figma", "Design System", "Mobile"], color: "#1E1E1E", mark: "L", match: 96, type: "Alternance · 12 mois" },
  { name: "Northwind Labs",  role: "Data Analyst", loc: "Lyon · Remote",
    tags: ["SQL", "Python", "Tableau"], color: "#00BF63", mark: "N", match: 91, type: "Stage · 6 mois" },
  { name: "Studio Marée",    role: "Brand Designer", loc: "Bordeaux · Sur site",
    tags: ["Identité", "Print", "Web"], color: "#F0A23E", mark: "M", match: 88, type: "Alternance · 24 mois" },
  { name: "Nimbus & Co",     role: "Dev Frontend", loc: "Nantes · Hybride",
    tags: ["React", "TypeScript", "CSS"], color: "#7A5AE0", mark: "N", match: 93, type: "Alternance · 12 mois" },
];

function SwipeIcons() {
  return (
    <>
      <svg style={{display:'none'}}>
        <defs>
          <symbol id="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
          </symbol>
          <symbol id="ic-heart" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-7-4.35-9.5-9.5C.9 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.1 4 4.5 7.5C19 16.65 12 21 12 21z"/>
          </symbol>
          <symbol id="ic-star" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </symbol>
          <symbol id="ic-bolt" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
          </symbol>
          <symbol id="ic-undo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>
          </symbol>
          <symbol id="ic-pin" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </symbol>
          <symbol id="ic-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
          </symbol>
          <symbol id="ic-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7"/>
          </symbol>
        </defs>
      </svg>
    </>
  );
}

function SwipeCard({ company, isTop, offsetIndex, onSwipe, dragHandlers }) {
  // offsetIndex: 0 = top, 1 = back, 2 = deeper
  let className = "swipe-card";
  if (offsetIndex === 1) className += " stack-2";
  if (offsetIndex >= 2) className += " stack-3";

  const handlers = isTop ? dragHandlers : {};

  return (
    <div className={className} {...handlers}>
      <div className="photo" style={{
        background: `linear-gradient(135deg, ${company.color}18, ${company.color}05),
                     repeating-linear-gradient(45deg, #eef2ee 0 12px, #f3f6f3 12px 24px)`
      }}>
        <span className="logo-tag">{company.type}</span>
        <span className="match-badge">{company.match}% match</span>
        <div className="company-mark" style={{ background: company.color }}>{company.mark}</div>
      </div>
      <div className="meta">
        <h4>{company.role}</h4>
        <div className="row">
          <strong style={{color: 'var(--ink-2)', fontWeight: 600}}>{company.name}</strong>
        </div>
        <div className="row">
          <svg width="12" height="12"><use href="#ic-pin"/></svg>
          <span>{company.loc}</span>
        </div>
        <div className="tags">
          {company.tags.map(t => <span key={t}>{t}</span>)}
        </div>
      </div>
      {isTop && (
        <>
          <div className="swipe-stamp like" data-stamp="like">LIKE</div>
          <div className="swipe-stamp nope" data-stamp="nope">NOPE</div>
        </>
      )}
    </div>
  );
}

function HeroPhone() {
  const [cards, setCards] = useState(HERO_COMPANIES);
  const cardRef = useRef(null);
  const dragRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, dragging: false });

  const animateOff = useCallback((dir) => {
    const el = cardRef.current?.querySelector('.swipe-card:not(.stack-2):not(.stack-3)');
    if (!el) return;
    const xEnd = dir === 'like' ? 600 : -600;
    const rot = dir === 'like' ? 28 : -28;
    el.style.transition = 'transform .35s ease-out, opacity .35s';
    el.style.transform = `translate(${xEnd}px, -40px) rotate(${rot}deg)`;
    el.style.opacity = '0';
    const stamp = el.querySelector(`.swipe-stamp.${dir}`);
    if (stamp) stamp.style.opacity = '1';
    setTimeout(() => {
      setCards(prev => {
        const [first, ...rest] = prev;
        return [...rest, first]; // recycle
      });
    }, 320);
  }, []);

  const onPointerDown = (e) => {
    const el = e.currentTarget;
    el.setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, dragging: true, el };
    el.style.transition = 'none';
  };
  const onPointerMove = (e) => {
    const s = dragRef.current;
    if (!s.dragging) return;
    s.dx = e.clientX - s.x;
    s.dy = e.clientY - s.y;
    const rot = s.dx * 0.08;
    s.el.style.transform = `translate(${s.dx}px, ${s.dy}px) rotate(${rot}deg)`;
    const likeStamp = s.el.querySelector('.swipe-stamp.like');
    const nopeStamp = s.el.querySelector('.swipe-stamp.nope');
    if (likeStamp) likeStamp.style.opacity = Math.max(0, Math.min(1, s.dx / 80));
    if (nopeStamp) nopeStamp.style.opacity = Math.max(0, Math.min(1, -s.dx / 80));
  };
  const onPointerUp = (e) => {
    const s = dragRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    const threshold = 90;
    if (s.dx > threshold) { animateOff('like'); return; }
    if (s.dx < -threshold) { animateOff('nope'); return; }
    // snap back
    s.el.style.transition = 'transform .25s cubic-bezier(.3,.7,.4,1)';
    s.el.style.transform = 'translate(0,0) rotate(0)';
    const likeStamp = s.el.querySelector('.swipe-stamp.like');
    const nopeStamp = s.el.querySelector('.swipe-stamp.nope');
    if (likeStamp) likeStamp.style.opacity = 0;
    if (nopeStamp) nopeStamp.style.opacity = 0;
  };

  return (
    <div className="phone-stage">
      <SwipeIcons />

      {/* Floating chips */}
      <div className="float-chip match">
        <div className="ic">
          <svg width="16" height="16"><use href="#ic-heart"/></svg>
        </div>
        <div>
          <div style={{fontWeight:600, fontSize:13}}>Nouveau match !</div>
          <div style={{fontSize:11, color:'var(--ink-4)'}}>Atelier Lumen · UX</div>
        </div>
      </div>

      <div className="float-chip msg">
        <div className="ic">💬</div>
        <div>
          <div style={{fontWeight:600, fontSize:13}}>Camille — Northwind</div>
          <div style={{fontSize:11, color:'var(--ink-4)'}}>« Tu es libre vendredi ? »</div>
        </div>
      </div>

      <div className="float-chip signed">
        <div className="ic">
          <svg width="16" height="16"><use href="#ic-check"/></svg>
        </div>
        <div>
          <div style={{fontWeight:600, fontSize:13}}>Stage signé</div>
          <div style={{fontSize:11, color:'var(--ink-4)'}}>3 jours après le match</div>
        </div>
      </div>

      <div className="phone">
        <div className="phone-notch"></div>
        <div className="phone-screen">

          <div className="ios-bar">
            <div className="time">9:41</div>
            <div className="right">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M1 9h2v1H1zm3-2h2v3H4zm3-2h2v5H7zm3-2h2v7h-2zm3-2h2v9h-2z"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M7 1.5c2 0 3.8.7 5.2 1.9l-1 1.1A6.4 6.4 0 0 0 7 2.9 6.4 6.4 0 0 0 2.8 4.5L1.8 3.4A8 8 0 0 1 7 1.5zm0 3a5 5 0 0 1 3.4 1.3l-1 1.1A3.4 3.4 0 0 0 7 5.9c-1 0-1.8.3-2.4.9l-1-1.1A5 5 0 0 1 7 4.5zm0 3a2 2 0 0 1 1.4.6L7 9.5 5.6 8.1A2 2 0 0 1 7 7.5z"/></svg>
              <svg width="22" height="10" viewBox="0 0 24 12" fill="none"><rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="1.5" fill="currentColor"/><rect x="21" y="4" width="2" height="4" rx="1" fill="currentColor" opacity=".4"/></svg>
            </div>
          </div>

          <div className="app-header">
            <div className="smark">
              <img src={(window.__resources && window.__resources.logo) || "assets/swape-logo.png"} alt="Swape"/>
            </div>
            <div className="pill">
              <span>📍</span> Paris, 25 km
            </div>
            <div className="icon-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
              </svg>
            </div>
          </div>

          <div className="deck" ref={cardRef}>
            {cards.slice(0, 3).reverse().map((c, revIdx) => {
              const idx = 2 - revIdx; // 0 top, 1 mid, 2 back
              return (
                <SwipeCard
                  key={c.name + idx}
                  company={c}
                  isTop={idx === 0}
                  offsetIndex={idx}
                  dragHandlers={{
                    onPointerDown,
                    onPointerMove,
                    onPointerUp,
                    onPointerCancel: onPointerUp,
                    style: { touchAction: 'none', cursor: 'grab' }
                  }}
                />
              );
            })}
          </div>

          <div className="phone-actions">
            <div className="action-btn small" title="Revenir">
              <svg><use href="#ic-undo"/></svg>
            </div>
            <div className="action-btn nope" title="Passer" onClick={() => animateOff('nope')}>
              <svg><use href="#ic-x"/></svg>
            </div>
            <div className="action-btn big like" title="Postuler" onClick={() => animateOff('like')}>
              <svg style={{color:'#fff'}}><use href="#ic-heart"/></svg>
            </div>
            <div className="action-btn star" title="Favori">
              <svg><use href="#ic-star"/></svg>
            </div>
            <div className="action-btn small" title="Boost">
              <svg style={{color:'#7A5AE0'}}><use href="#ic-bolt"/></svg>
            </div>
          </div>

          <div className="phone-home"></div>
        </div>
      </div>
    </div>
  );
}

function Hero({ tweaks }) {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow"><span className="dot"></span> Stage · Alternance · Premier emploi</span>
          <h1 className="h1" style={{marginTop: 18}}>
            Trouve ton stage en un <span className="swipe-word">swipe</span>.
          </h1>
          <p className="sub" style={{marginTop: 22}}>
            Swape connecte les étudiants et les entreprises avec un système de matching simple,
            humain et instantané. Plus de CV jetés dans le vide — juste les bonnes rencontres,
            au bon moment.
          </p>
          <div className="hero-cta-row">
            <a className="btn btn-primary btn-lg" href="#cta">
              Télécharger l'app
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
            <a className="btn btn-ghost btn-lg" href="#how">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Voir comment ça marche
            </a>
          </div>
          <div className="hero-mini">
            <div className="avatars">
              <span></span><span></span><span></span><span>+9k</span>
            </div>
            <div>
              <strong style={{color: 'var(--ink-2)', fontWeight: 600}}>9 200 étudiants</strong> ont déjà
              trouvé leur alternance cette année
            </div>
          </div>
        </div>
        <HeroPhone />
      </div>
    </section>
  );
}

window.Hero = Hero;
