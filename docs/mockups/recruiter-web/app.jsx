// recruteur-web/app.jsx — fast triage interface for HR

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ─────────── Icons ───────────
const Icons = () => (
  <svg style={{display:'none'}}>
    <defs>
      <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></symbol>
      <symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></symbol>
      <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></symbol>
      <symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></symbol>
      <symbol id="i-bolt" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></symbol>
      <symbol id="i-star" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/></symbol>
      <symbol id="i-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></symbol>
      <symbol id="i-briefcase" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></symbol>
      <symbol id="i-grad" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5"/></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-8 7-13a7 7 0 0 0-14 0c0 5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
      <symbol id="i-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3-7 4 14 3-7h4"/></symbol>
      <symbol id="i-keyboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/></symbol>
      <symbol id="i-question" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5"/><path d="M12 17h.01"/></symbol>
      <symbol id="i-funnel" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18l-7 9v6l-4 2v-8z"/></symbol>
      <symbol id="i-arrow-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></symbol>
      <symbol id="i-arrow-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></symbol>
      <symbol id="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></symbol>
      <symbol id="i-skip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4v16l8-8zM14 4v16M19 4v16"/></symbol>
      <symbol id="i-heart" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.35-9.5-9.5C.9 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.1 4 4.5 7.5C19 16.65 12 21 12 21z"/></symbol>
      <symbol id="i-target" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></symbol>
      <symbol id="i-video" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4z"/></symbol>
    </defs>
  </svg>
);

// ─────────── Data ───────────
const OFFERS = [
  { id:'ux',    title:"UX Designer",        type:"Alternance · 12 mois", mark:"U", count:22, matched:4 },
  { id:'brand', title:"Brand Designer",     type:"Stage · 6 mois",       mark:"B", count:9,  matched:2 },
  { id:'data',  title:"Data Analyst",       type:"Stage · 6 mois",       mark:"D", count:5,  matched:1 },
  { id:'pm',    title:"Product Manager",    type:"Alternance · 24 mois", mark:"P", count:14, matched:6 },
  { id:'dev',   title:"Dev Frontend",       type:"Alternance · 12 mois", mark:"F", count:18, matched:3 },
];

const CANDS = [
  {
    id:'lea', name:"Léa Martin", initials:"L", lvl:"M2",
    avBg:"linear-gradient(135deg,#ffd5a8,#ffb380)", avInk:"#6e3a17",
    school:"Sciences Po Paris", role:"M2 Design Stratégique",
    location:"Paris", remote:"Hybride", duration:"12 mois", start:"Sept. 2026",
    salary:"1 300 €/mois",
    match: 96, swiped:"il y a 2h", verified:true, premium:true,
    blurb:"Designer produit avec deux expériences en agence et un portfolio orienté fintech. Recherche une alternance à fort impact pour Sept. 2026.",
    skills:[
      {n:"Figma", match:true}, {n:"Design System", match:true},
      {n:"Recherche UX", match:true}, {n:"Prototypage", match:true},
      {n:"Motion", match:false}, {n:"Workshops", match:false},
    ],
    experiences:[
      { co:"Studio Marée", role:"Designer junior", period:"2024 · 6 mois", desc:"Refonte complète de l'identité d'une marque retail française." },
      { co:"Banque Populaire", role:"Stagiaire UX", period:"2023 · 4 mois", desc:"Recherche utilisateur sur l'app mobile (12 interviews, 4 personas)." },
    ],
    education:[
      { co:"Sciences Po Paris", role:"Master 2 Design Stratégique", period:"2024 — 2026" },
      { co:"Penninghen", role:"Bachelor Design Graphique", period:"2020 — 2023" },
    ],
    motivation:"Votre studio est exactement le type d'environnement que je cherche : produit, accent sur la recherche, culture de la critique constructive.",
    languages:["Français natif","Anglais courant","Espagnol B2"],
  },
  {
    id:'mateo', name:"Matéo Rivière", initials:"M", lvl:"M1",
    avBg:"linear-gradient(135deg,#c4e0ff,#8db5f0)", avInk:"#1f3a6e",
    school:"ENSAAMA", role:"DSAA Design Produit",
    location:"Paris", remote:"Sur site", duration:"12 mois", start:"Sept. 2026",
    salary:"1 200 €/mois",
    match: 91, swiped:"il y a 5h", verified:true,
    blurb:"Background en design graphique qui a basculé vers le produit. Curieux, méthodique, fortes soft-skills en présentation client.",
    skills:[
      {n:"Figma", match:true}, {n:"UI Design", match:true},
      {n:"Prototypage", match:true}, {n:"Illustration", match:false},
      {n:"Typographie", match:false}, {n:"Print", match:false},
    ],
    experiences:[
      { co:"Indépendant", role:"Designer freelance", period:"2023 — auj.", desc:"Identités visuelles et UI pour 4 startups early-stage." },
    ],
    education:[
      { co:"ENSAAMA Olivier de Serres", role:"DSAA Design Graphique → Produit", period:"2023 — 2026" },
    ],
    motivation:"Je veux apprendre la rigueur d'un studio mature et participer à des produits B2B à grand impact.",
    languages:["Français natif","Anglais opérationnel"],
  },
  {
    id:'sofia', name:"Sofia Benhamou", initials:"S", lvl:"M2",
    avBg:"linear-gradient(135deg,#e0c4ff,#b08df0)", avInk:"#3a1f6e",
    school:"Strate Sèvres", role:"M2 Design d'interaction",
    location:"Bordeaux", remote:"Full remote", duration:"12 mois", start:"Oct. 2026",
    salary:"1 250 €/mois",
    match: 88, swiped:"hier", verified:false,
    blurb:"Très forte composante recherche et accessibilité. A travaillé sur deux projets d'inclusion numérique pendant son master.",
    skills:[
      {n:"Recherche UX", match:true}, {n:"Accessibilité", match:true},
      {n:"Figma", match:true}, {n:"Wireframing", match:false},
      {n:"Co-design", match:false},
    ],
    experiences:[
      { co:"APF France Handicap", role:"Stagiaire UX recherche", period:"2024 · 5 mois", desc:"Étude qualitative sur l'inclusion numérique des seniors." },
    ],
    education:[
      { co:"Strate École de Design", role:"M2 Design d'interaction", period:"2024 — 2026" },
    ],
    motivation:"J'aimerais découvrir un studio aussi exigeant que le vôtre sur la qualité, en y apportant ma sensibilité recherche.",
    languages:["Français natif","Anglais courant","Arabe natif"],
  },
  {
    id:'theo', name:"Théo Lambert", initials:"T", lvl:"M2",
    avBg:"linear-gradient(135deg,#bff5d9,#7ce0a8)", avInk:"#1d4f33",
    school:"HETIC", role:"M2 Innovation digitale",
    location:"Marseille", remote:"Hybride", duration:"12 mois", start:"Avril 2026",
    salary:"1 100 €/mois",
    match: 85, swiped:"hier", verified:true,
    blurb:"Profil hybride design-stratégie. A mené trois projets de refonte de marque pendant son cursus.",
    skills:[
      {n:"Direction artistique", match:true}, {n:"Identité", match:true},
      {n:"Web", match:true}, {n:"Print", match:false}, {n:"Motion", match:false},
    ],
    experiences:[
      { co:"Agence Lulu", role:"Stagiaire brand", period:"2024 · 4 mois", desc:"Refonte d'une identité retail B2C." },
    ],
    education:[
      { co:"HETIC", role:"M2 Innovation digitale", period:"2024 — 2026" },
    ],
    motivation:"Travailler dans un studio à taille humaine avec des clients engagés correspond pile à mes valeurs.",
    languages:["Français natif","Anglais opérationnel"],
  },
  {
    id:'nina', name:"Nina Klein", initials:"N", lvl:"M2",
    avBg:"linear-gradient(135deg,#ffe1c4,#ffb89a)", avInk:"#6c2f0f",
    school:"Gobelins", role:"M2 Direction artistique",
    location:"Paris", remote:"Hybride", duration:"12 mois", start:"Sept. 2026",
    salary:"1 300 €/mois",
    match: 82, swiped:"il y a 2 jours", verified:true,
    blurb:"Direction artistique forte avec un goût marqué pour la typographie et le motion design. Cherche un environnement créatif exigeant.",
    skills:[
      {n:"Direction artistique", match:true}, {n:"Motion", match:true},
      {n:"Figma", match:false}, {n:"Typographie", match:true},
      {n:"Illustration", match:false},
    ],
    experiences:[
      { co:"Studio Pamplemousse", role:"DA junior", period:"2023 · 8 mois", desc:"DA sur 3 campagnes print + digital pour des marques mode." },
    ],
    education:[
      { co:"Gobelins", role:"Direction artistique", period:"2024 — 2026" },
    ],
    motivation:"J'ai besoin d'un studio où je peux pousser la qualité visuelle sans compromis.",
    languages:["Français natif","Anglais courant","Allemand natif"],
  },
  {
    id:'omar', name:"Omar Haddad", initials:"O", lvl:"M1",
    avBg:"linear-gradient(135deg,#c4d4ff,#8da4f0)", avInk:"#1f2d6e",
    school:"42 Paris", role:"42 Cursus + Bachelor",
    location:"Paris", remote:"Sur site", duration:"6 mois", start:"Mars 2026",
    salary:"1 200 €/mois",
    match: 79, swiped:"il y a 2 jours", verified:true,
    blurb:"Profil dev qui a basculé vers le design produit. Très à l'aise sur le prototypage avancé et la documentation technique.",
    skills:[
      {n:"Figma", match:true}, {n:"Prototypage", match:true},
      {n:"Code (React)", match:false}, {n:"Docs", match:false},
    ],
    experiences:[
      { co:"42 Network", role:"Tutor & étudiant", period:"2022 — auj.", desc:"Plus de 800 heures de cursus design + dev." },
    ],
    education:[
      { co:"42 Paris", role:"Cursus 42 + Bachelor Design", period:"2022 — 2026" },
    ],
    motivation:"Apprendre auprès d'une équipe qui maîtrise la rigueur produit me ferait franchir un palier.",
    languages:["Français natif","Anglais courant","Arabe natif"],
  },
  {
    id:'jules', name:"Jules Perrin", initials:"J", lvl:"M2",
    avBg:"linear-gradient(135deg,#d6c4ff,#a890f0)", avInk:"#311f6e",
    school:"Strate", role:"M2 Design produit",
    location:"Paris", remote:"Hybride", duration:"12 mois", start:"Sept. 2026",
    salary:"1 350 €/mois",
    match: 76, swiped:"il y a 3 jours", verified:false,
    blurb:"Designer produit avec un focus B2B SaaS. Profil structuré, bon en documentation et systèmes.",
    skills:[
      {n:"Figma", match:true}, {n:"Design System", match:true},
      {n:"Documentation", match:false}, {n:"Recherche UX", match:false},
    ],
    experiences:[
      { co:"Spendesk", role:"Stagiaire produit", period:"2024 · 6 mois", desc:"Refonte du module de notes de frais." },
    ],
    education:[
      { co:"Strate École de Design", role:"M2 Design Produit", period:"2024 — 2026" },
    ],
    motivation:"Je veux travailler dans un studio qui combine design et stratégie produit.",
    languages:["Français natif","Anglais courant"],
  },
];

// ─────────── Top bar ───────────
function TopBar({ offer, onPick, queue, decided }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="mark">
          <img src={(window.__resources && window.__resources.logo) || "../assets/swape-logo.png"} alt="Swape" style={{width:'100%',height:'100%',objectFit:'cover',display:'block',borderRadius: 'inherit'}}/>
        </div>
        <span className="name">swape</span>
        <span className="pipe">/</span>
        <span className="ctx">Atelier Lumen · Recruteur</span>
      </div>

      <div className="top-center">
        <div className="offer-picker" onClick={onPick}>
          <div className="o-mark">{offer.mark}</div>
          <div className="meta">
            <strong>{offer.title}</strong>
            <span>{offer.type} · {offer.count - decided} à examiner</span>
          </div>
          <svg className="caret" width="14" height="14"><use href="#i-caret"/></svg>
        </div>
        <div className="search-box">
          <svg width="14" height="14"><use href="#i-search"/></svg>
          <span>Rechercher un candidat…</span>
          <span className="kbd">⌘K</span>
        </div>
      </div>

      <div className="top-right">
        <button className="icon-btn-sm" title="Aide">
          <svg><use href="#i-question"/></svg>
        </button>
        <button className="icon-btn-sm" title="Notifications">
          <svg><use href="#i-bell"/></svg>
          <span className="dot-notif"></span>
        </button>
        <div className="user-pill">
          <div className="av">C</div>
          Camille D.
        </div>
      </div>
    </header>
  );
}

// ─────────── Left rail ───────────
function LeftRail({ activeId, onPick }) {
  return (
    <aside className="rail">
      <div className="rail-section">Workspace</div>
      <div className="rail-link active">
        <span className="ic"><svg><use href="#i-pulse"/></svg></span>
        File d'attente
        <span className="num">68</span>
      </div>
      <div className="rail-link">
        <span className="ic"><svg><use href="#i-heart"/></svg></span>
        Matchs confirmés
        <span className="num">13</span>
      </div>
      <div className="rail-link">
        <span className="ic"><svg><use href="#i-star"/></svg></span>
        Favoris
        <span className="num">5</span>
      </div>
      <div className="rail-link">
        <span className="ic"><svg><use href="#i-mail"/></svg></span>
        Conversations
        <span className="num">9</span>
      </div>

      <div className="rail-divider"/>
      <div className="rail-section">Mes offres</div>
      {OFFERS.map(o => (
        <div key={o.id}
          className={"rail-mini-offer" + (activeId === o.id ? " active" : "")}
          onClick={() => onPick(o.id)}>
          <div className="o-mark">{o.mark}</div>
          <div className="info">
            <div className="t">{o.title}</div>
            <div className="s"><b>{o.count}</b> · {o.matched} matchs</div>
          </div>
        </div>
      ))}

      <div className="rail-divider"/>
      <div className="rail-section">Espace</div>
      <div className="rail-link">
        <span className="ic"><svg><use href="#i-briefcase"/></svg></span>
        Entreprise
      </div>
      <div className="rail-link">
        <span className="ic"><svg><use href="#i-funnel"/></svg></span>
        Préférences
      </div>
    </aside>
  );
}

window.TopBar = TopBar;
window.LeftRail = LeftRail;
window.OFFERS = OFFERS;
window.CANDS = CANDS;
window.Icons = Icons;
