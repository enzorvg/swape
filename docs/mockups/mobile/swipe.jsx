// mobile/swipe.jsx — main swipe / discover screen

const SwipeIcons = () => (
  <svg style={{display:'none'}}>
    <defs>
      <symbol id="ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></symbol>
      <symbol id="ic-heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9.5-9.5C.9 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.1 4 4.5 7.5C19 16.65 12 21 12 21z"/></symbol>
      <symbol id="ic-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></symbol>
      <symbol id="ic-bolt" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></symbol>
      <symbol id="ic-undo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></symbol>
      <symbol id="ic-pin" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></symbol>
      <symbol id="ic-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
      <symbol id="ic-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></symbol>
      <symbol id="ic-sliders" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h13M4 12h10M4 18h16"/><circle cx="19" cy="6" r="2"/><circle cx="16" cy="12" r="2"/></symbol>
      <symbol id="ic-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></symbol>
      <symbol id="ic-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></symbol>
      <symbol id="ic-message" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></symbol>
      <symbol id="ic-user" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
      <symbol id="ic-flame" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-3 1-3 6a6 6 0 0 0 12 0c0-6-6-11-6-11z"/></symbol>
      <symbol id="ic-send" viewBox="0 0 24 24" fill="currentColor"><path d="M2 12l20-9-7 20-3-8-10-3z"/></symbol>
      <symbol id="ic-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></symbol>
      <symbol id="ic-camera" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h3l2-3h8l2 3h3v12H3z"/><circle cx="12" cy="13" r="4"/></symbol>
      <symbol id="ic-arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></symbol>
      <symbol id="ic-share" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4M12 2v14"/></symbol>
      <symbol id="ic-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></symbol>
      <symbol id="ic-euro" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 7a7 7 0 1 0 0 10M4 10h9M4 14h9"/></symbol>
      <symbol id="ic-briefcase" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></symbol>
      <symbol id="ic-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19 12c0 .3 0 .6-.1.9l2.1 1.6-2 3.5-2.5-1a7 7 0 0 1-1.5.9l-.4 2.6h-4l-.4-2.6a7 7 0 0 1-1.5-.9l-2.5 1-2-3.5 2.1-1.6c-.1-.3-.1-.6-.1-.9s0-.6.1-.9L4.1 9.5l2-3.5 2.5 1a7 7 0 0 1 1.5-.9l.4-2.6h4l.4 2.6a7 7 0 0 1 1.5.9l2.5-1 2 3.5-2.1 1.6c.1.3.1.6.1.9z"/></symbol>
    </defs>
  </svg>
);

window.SwipeIcons = SwipeIcons;

const COMPANIES = [
  {
    name: "Atelier Lumen", role: "UX Designer · Alternance",
    loc: "Paris 11e", remote: "Hybride", duration: "12 mois", start: "Sept. 2026",
    salary: "1 300 €", salaryNote: "/ mois brut",
    tags: ["Figma", "Design System", "Mobile", "Recherche UX"], skills: ["3+ ans XP", "Niveau Master"],
    color: "#1E1E1E", accent: "#F1F3F0", mark: "L", match: 96,
    tagline: "Studio de design produit pour la fintech et la santé.",
    desc: "Tu rejoindras notre équipe de 8 designers pour travailler sur des produits utilisés par plusieurs millions d'utilisateurs. Mentorat senior, design system maison, et une vraie culture de la critique constructive.",
    photos: 4, verified: true, type: "Alternance",
  },
  {
    name: "Northwind Labs", role: "Data Analyst · Stage",
    loc: "Lyon Part-Dieu", remote: "Full remote", duration: "6 mois", start: "Mars 2026",
    salary: "1 100 €", salaryNote: "/ mois + télétravail",
    tags: ["SQL", "Python", "Tableau", "Statistiques"], skills: ["Bac+4", "Anglais courant"],
    color: "#00BF63", accent: "#003c1d", mark: "N", match: 91,
    tagline: "Data science appliquée à l'énergie verte.",
    desc: "Aide-nous à construire les modèles qui orientent nos décisions stratégiques. Tu travailleras sur des données réelles, avec des notebooks partagés et des revues hebdomadaires en duo.",
    photos: 3, verified: true, type: "Stage",
  },
  {
    name: "Studio Marée", role: "Brand Designer · Alternance",
    loc: "Bordeaux", remote: "Sur site", duration: "24 mois", start: "Sept. 2026",
    salary: "1 200 €", salaryNote: "/ mois",
    tags: ["Identité", "Print", "Direction artistique", "Web"], skills: ["Portfolio requis"],
    color: "#F0A23E", accent: "#5c3505", mark: "M", match: 88,
    tagline: "Identité de marque pour entreprises engagées.",
    desc: "Trois associés, une douzaine de clients chaque année. Tu interviens du brief créatif aux livrables finaux, accompagné par une directrice artistique senior.",
    photos: 5, verified: true, type: "Alternance",
  },
  {
    name: "Nimbus & Co", role: "Dev Frontend · Alternance",
    loc: "Nantes", remote: "Hybride", duration: "12 mois", start: "Oct. 2026",
    salary: "1 400 €", salaryNote: "/ mois brut",
    tags: ["React", "TypeScript", "CSS", "Accessibilité"], skills: ["Bac+4", "Anglais opérationnel"],
    color: "#7A5AE0", accent: "#1d0d4a", mark: "N", match: 93,
    tagline: "SaaS B2B pour les équipes RH.",
    desc: "Squad produit de 6 personnes (2 designers, 3 devs, 1 PM). Tu seras impliqué·e sur toute la chaîne, des specs jusqu'au déploiement, avec un mentor dédié pendant les 3 premiers mois.",
    photos: 3, verified: true, type: "Alternance",
  },
  {
    name: "Verde Maison", role: "Chef·fe de projet · Stage",
    loc: "Marseille", remote: "Hybride", duration: "6 mois", start: "Avril 2026",
    salary: "1 050 €", salaryNote: "/ mois + tickets",
    tags: ["Gestion de projet", "Mode durable", "Retail"], skills: ["Bac+4/5"],
    color: "#008C46", accent: "#cef7e1", mark: "V", match: 85,
    tagline: "Mode upcyclée, faite à Marseille.",
    desc: "Petite équipe créative, gros projets : nouvelle collection capsule, partenariat avec deux ONG, ouverture d'une boutique pop-up à Paris. On cherche quelqu'un d'organisé et curieux.",
    photos: 4, verified: false, type: "Stage",
  },
];

window.COMPANIES = COMPANIES;

function MatchRing({ value }) {
  const r = 24, c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div className="match-ring">
      <svg width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="4"/>
        <circle cx="28" cy="28" r={r} fill="none" stroke="#fff" strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"/>
      </svg>
      <div className="pct">{value}<small>match</small></div>
    </div>
  );
}

function OfferCard({ company, position = 0, isTop = false, dragHandlers = {}, onTap }) {
  let cls = "offer-card";
  if (position === 1) cls += " s2";
  if (position === 2) cls += " s3";
  if (isTop) cls += " top";

  const handlers = isTop ? dragHandlers : {};

  return (
    <div className={cls} {...handlers}>
      <div className="offer-hero" style={{ background: `linear-gradient(155deg, ${company.color} 0%, ${company.color}dd 60%, ${company.color}aa 100%)` }}>
        <div className="pattern"/>
        <div className="offer-top-row">
          <div className="dots-row">
            {Array.from({length: company.photos}).map((_, i) => (
              <div key={i} className={"dot-i" + (i === 0 ? " active" : "")}/>
            ))}
          </div>
          <MatchRing value={company.match}/>
        </div>
        <div className="offer-mark" style={{ color: company.color }}>{company.mark}</div>
      </div>

      <div className="offer-body" onClick={isTop ? onTap : undefined}>
        <h3 className="offer-role">{company.role}</h3>
        <div className="offer-company">
          <span>{company.name}</span>
          {company.verified && (
            <span className="verified">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
            </span>
          )}
        </div>
        <div className="offer-meta">
          <span className="item"><svg><use href="#ic-pin"/></svg> {company.loc} · {company.remote}</span>
          <span className="item"><svg><use href="#ic-clock"/></svg> {company.duration}</span>
        </div>
        <div className="offer-tags">
          {company.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}
          {company.skills.map(s => <span key={s} className="dim">{s}</span>)}
        </div>
        <div className="offer-bottom">
          <div className="salary">
            {company.salary} <small>{company.salaryNote}</small>
          </div>
          <div style={{fontSize: 11, color: 'var(--ink-4)', display: 'flex', alignItems: 'center', gap: 4}}>
            <svg width="11" height="11"><use href="#ic-flame"/></svg>
            Posté il y a 2j
          </div>
        </div>
      </div>

      {isTop && (
        <>
          <div className="stamp like" data-stamp="like">MATCH</div>
          <div className="stamp nope" data-stamp="nope">NOPE</div>
        </>
      )}
    </div>
  );
}

function SwipeScreen({ onMatch, onOpenDetail, onOpenFilters }) {
  const [cards, setCards] = React.useState(COMPANIES);
  const stackRef = React.useRef(null);
  const dragRef = React.useRef({ dragging: false });

  const animateOff = (dir) => {
    const el = stackRef.current?.querySelector('.offer-card.top');
    if (!el) return;
    const xEnd = dir === 'like' ? 500 : -500;
    const rot = dir === 'like' ? 25 : -25;
    el.style.transition = 'transform .35s ease-out, opacity .35s';
    el.style.transform = `translate(${xEnd}px, -30px) rotate(${rot}deg)`;
    el.style.opacity = '0';
    const stamp = el.querySelector(`.stamp.${dir}`);
    if (stamp) stamp.style.opacity = '1';

    const top = cards[0];
    setTimeout(() => {
      setCards(prev => {
        const [first, ...rest] = prev;
        return [...rest, first]; // recycle
      });
      // Trigger match modal sometimes on like
      if (dir === 'like' && top && top.match >= 88 && Math.random() > 0.35) {
        onMatch(top);
      }
    }, 320);
  };

  const onPointerDown = (e) => {
    const el = e.currentTarget;
    el.setPointerCapture?.(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, dx: 0, dy: 0, dragging: true, el, moved: false };
    el.style.transition = 'none';
  };
  const onPointerMove = (e) => {
    const s = dragRef.current;
    if (!s.dragging) return;
    s.dx = e.clientX - s.x;
    s.dy = e.clientY - s.y;
    if (Math.abs(s.dx) > 4 || Math.abs(s.dy) > 4) s.moved = true;
    const rot = s.dx * 0.07;
    s.el.style.transform = `translate(${s.dx}px, ${s.dy}px) rotate(${rot}deg)`;
    const likeStamp = s.el.querySelector('.stamp.like');
    const nopeStamp = s.el.querySelector('.stamp.nope');
    if (likeStamp) likeStamp.style.opacity = Math.max(0, Math.min(1, s.dx / 90));
    if (nopeStamp) nopeStamp.style.opacity = Math.max(0, Math.min(1, -s.dx / 90));
  };
  const onPointerUp = (e) => {
    const s = dragRef.current;
    if (!s.dragging) return;
    s.dragging = false;
    const threshold = 100;
    if (s.dx > threshold) { animateOff('like'); return; }
    if (s.dx < -threshold) { animateOff('nope'); return; }
    s.el.style.transition = 'transform .25s cubic-bezier(.3,.7,.4,1)';
    s.el.style.transform = 'translate(0,0) rotate(0)';
    const likeStamp = s.el.querySelector('.stamp.like');
    const nopeStamp = s.el.querySelector('.stamp.nope');
    if (likeStamp) likeStamp.style.opacity = 0;
    if (nopeStamp) nopeStamp.style.opacity = 0;
  };

  const dragHandlers = {
    onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp,
    style: { touchAction: 'none' }
  };

  return (
    <>
      <div className="topbar">
        <div className="left">
          <div className="icon-btn" style={{background: 'var(--vert-swape)', border: 'none', overflow: 'hidden', padding: 0}}>
            <img src={(window.__resources && window.__resources.logo) || "../assets/swape-logo.png"} alt="Swape" style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}/>
          </div>
        </div>
        <div className="location-pill">
          <svg><use href="#ic-pin"/></svg>
          Paris · 25 km
        </div>
        <div className="right">
          <div className="icon-btn notif">
            <svg><use href="#ic-bell"/></svg>
          </div>
          <div className="icon-btn" onClick={onOpenFilters}>
            <svg><use href="#ic-sliders"/></svg>
          </div>
        </div>
      </div>

      <div className="deck-stage">
        <div className="deck-stack" ref={stackRef}>
          {cards.slice(0, 3).reverse().map((c, revIdx) => {
            const pos = 2 - revIdx;
            return (
              <OfferCard
                key={c.name + '-' + revIdx}
                company={c}
                position={pos}
                isTop={pos === 0}
                dragHandlers={dragHandlers}
                onTap={() => {
                  if (!dragRef.current.moved) onOpenDetail(c);
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="actions">
        <div className="act sm undo" title="Annuler">
          <svg><use href="#ic-undo"/></svg>
        </div>
        <div className="act md nope" onClick={() => animateOff('nope')}>
          <svg><use href="#ic-x"/></svg>
        </div>
        <div className="act lg" onClick={() => animateOff('like')}>
          <svg><use href="#ic-heart"/></svg>
        </div>
        <div className="act md star">
          <svg><use href="#ic-star"/></svg>
        </div>
        <div className="act sm boost">
          <svg><use href="#ic-bolt"/></svg>
        </div>
      </div>
    </>
  );
}

window.SwipeScreen = SwipeScreen;
window.OfferCard = OfferCard;
window.MatchRing = MatchRing;
