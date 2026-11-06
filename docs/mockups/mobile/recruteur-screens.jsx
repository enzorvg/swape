// mobile/recruteur-screens.jsx — Pipeline, Candidates, Detail, Matchs, Profil

// ----- Data -----
const R_OFFERS = [
  { id: 'ux',    title: "UX Designer · Alternance",     mark: "U", waiting: 12, matched: 4, applied: 47, status: "Active", since: "12 jours" },
  { id: 'brand', title: "Brand Designer · Stage",       mark: "B", waiting: 7,  matched: 2, applied: 29, status: "Active", since: "8 jours" },
  { id: 'data',  title: "Data Analyst · Stage",         mark: "D", waiting: 3,  matched: 1, applied: 18, status: "Active", since: "5 jours" },
  { id: 'pm',    title: "Product Manager · Alternance", mark: "P", waiting: 0,  matched: 6, applied: 21, status: "Pause",  since: "21 jours" },
];

const R_CANDIDATES = [
  {
    id: 'lea', name: "Léa Martin", initials: "L", color: "#ffd5a8 / #ffb380",
    bg: "linear-gradient(135deg, #ffd5a8, #ffb380)", ink: "#6e3a17",
    role: "M2 Design", school: "Sciences Po · Paris",
    forOffer: "UX Designer · Alternance", offerId: 'ux',
    match: 96, verified: true, ribbon: "Top match",
    blurb: "Designer produit avec 2 expériences solides en agence et un portfolio orienté fintech. Cherche une alternance pour Sept. 2026.",
    skills: ["Figma", "Design System", "Recherche UX", "Prototypage", "Motion"],
    matchedSkills: 4,
    location: "Paris", remote: "Hybride OK", duration: "12 mois", availableFrom: "Sept. 2026",
    swiped: "il y a 2h", featured: true,
    bio: "Passionnée par les produits B2B et la recherche utilisateur. J'aime travailler en équipe pluridisciplinaire et explorer des terrains complexes.",
    experiences: [
      { co: "Studio Marée", role: "Designer junior", period: "2024 · 6 mois", desc: "Refonte de l'identité d'une marque retail." },
      { co: "Banque Populaire", role: "Stagiaire UX", period: "2023 · 4 mois", desc: "Recherche utilisateur sur l'application mobile." },
    ],
    education: [
      { co: "Sciences Po Paris", role: "Master 2 Design Stratégique", period: "2024 — 2026" },
      { co: "Penninghen", role: "Bachelor Design Graphique", period: "2020 — 2023" },
    ],
    motivation: "Votre studio est exactement le type d'environnement que je cherche : produit, fort accent sur la recherche, et une vraie culture de la critique constructive.",
  },
  {
    id: 'mateo', name: "Matéo Rivière", initials: "M",
    bg: "linear-gradient(135deg, #c4e0ff, #8db5f0)", ink: "#1f3a6e",
    role: "M1 Design Produit", school: "ENSAAMA",
    forOffer: "UX Designer · Alternance", offerId: 'ux',
    match: 91, verified: true, ribbon: null,
    blurb: "Background en design graphique qui a basculé vers le produit. Curieux, méthodique, soft-skills solides en présentation.",
    skills: ["Figma", "UI", "Prototypage", "Illustration"],
    matchedSkills: 3,
    location: "Paris", remote: "Sur site OK", duration: "12 mois", availableFrom: "Sept. 2026",
    swiped: "il y a 5h",
    bio: "Je viens du graphisme et je consolide mes acquis en design produit avec une approche très visuelle.",
    experiences: [
      { co: "Indépendant", role: "Designer freelance", period: "2023 — auj.", desc: "Identités visuelles et UI pour startups." },
    ],
    education: [
      { co: "ENSAAMA", role: "DSAA Design Graphique → Produit", period: "2023 — 2026" },
    ],
    motivation: "Je veux apprendre la rigueur d'un studio mature et participer à des produits à grand impact.",
  },
  {
    id: 'sofia', name: "Sofia Benhamou", initials: "S",
    bg: "linear-gradient(135deg, #e0c4ff, #b08df0)", ink: "#3a1f6e",
    role: "M2 Design d'interaction", school: "Strate",
    forOffer: "UX Designer · Alternance", offerId: 'ux',
    match: 88, verified: false,
    blurb: "Très forte composante recherche et accessibilité. A travaillé sur deux projets d'inclusion numérique pendant son master.",
    skills: ["Recherche UX", "Accessibilité", "Figma", "Wireframing"],
    matchedSkills: 3,
    location: "Bordeaux", remote: "Full remote", duration: "12 mois", availableFrom: "Oct. 2026",
    swiped: "Hier",
    bio: "Designer recherche, sensible aux questions d'inclusion et d'accessibilité, avec une approche scientifique du métier.",
    experiences: [
      { co: "APF France", role: "Stagiaire UX recherche", period: "2024 · 5 mois", desc: "Étude qualitative sur l'inclusion numérique." },
    ],
    education: [
      { co: "Strate École de Design", role: "M2 Design d'interaction", period: "2024 — 2026" },
    ],
    motivation: "J'aimerais découvrir un studio aussi exigeant que le vôtre sur la qualité, en y apportant ma sensibilité recherche.",
  },
  {
    id: 'theo', name: "Théo Lambert", initials: "T",
    bg: "linear-gradient(135deg, #bff5d9, #7ce0a8)", ink: "#1d4f33",
    role: "M2 Innovation digitale", school: "HETIC",
    forOffer: "Brand Designer · Stage", offerId: 'brand',
    match: 85, verified: true,
    blurb: "Profil hybride design-strat. A mené trois projets de refonte de marque pendant son cursus.",
    skills: ["Direction artistique", "Print", "Identité", "Web"],
    matchedSkills: 3,
    location: "Marseille", remote: "Hybride", duration: "6 mois", availableFrom: "Avril 2026",
    swiped: "Hier",
    bio: "Designer généraliste, à l'aise du brief créatif au pixel près.",
    experiences: [
      { co: "Agence Lulu", role: "Stagiaire brand", period: "2024 · 4 mois", desc: "Refonte d'une identité retail." },
    ],
    education: [
      { co: "HETIC", role: "M2 Innovation digitale", period: "2024 — 2026" },
    ],
    motivation: "Travailler dans un studio à taille humaine avec des clients engagés correspond pile à mes valeurs.",
  },
];

window.R_OFFERS = R_OFFERS;
window.R_CANDIDATES = R_CANDIDATES;

// ────────────────────────────────────────────────────────────
// Pipeline / Dashboard screen
// ────────────────────────────────────────────────────────────
function PipelineScreen({ onOpenCandidate, onSwitchTab }) {
  const top3 = R_CANDIDATES.slice(0, 3);

  return (
    <>
      <div className="r-top">
        <div className="brand">
          <div className="mark">A</div>
          <div className="ttl">
            Atelier Lumen
            <span className="role">Espace recruteur</span>
          </div>
        </div>
        <div className="actions">
          <div className="icon-btn notif"><svg><use href="#ic-bell"/></svg></div>
          <div className="icon-btn"><svg><use href="#ic-search"/></svg></div>
        </div>
      </div>

      <div className="r-greet">
        <h2><span className="accent">22 profils</span> à examiner aujourd'hui.</h2>
        <p className="sub">Le pic d'activité est en début de matinée — bonne plage pour passer en revue.</p>
      </div>

      <div className="kpi-strip">
        <div className="kpi">
          <div className="v">22 <span className="delta">+8</span></div>
          <div className="l">À examiner</div>
        </div>
        <div className="kpi">
          <div className="v">13</div>
          <div className="l">Matchs ce mois</div>
        </div>
        <div className="kpi">
          <div className="v">4j</div>
          <div className="l">Temps moyen</div>
        </div>
      </div>

      <div className="r-dark-pad"/>

      <div className="scroll" style={{ background: 'var(--paper-2)' }}>
        <div className="r-section">
          <h3>Mes offres actives</h3>
          <span className="more" onClick={() => onSwitchTab('candidates')}>Voir tout</span>
        </div>
        <div className="offers-strip">
          {R_OFFERS.map(o => (
            <div className="offer-mini" key={o.id} onClick={() => onSwitchTab('candidates')}>
              <div className="top-row">
                <div className="o-mark">{o.mark}</div>
                <div className="dot-status">
                  {o.status === 'Active' && <span className="pulse"/>}
                  {o.status}
                </div>
              </div>
              <h4>{o.title}</h4>
              <div className="meta">Publié il y a {o.since}</div>
              <div className="nums">
                <div>
                  <div className="n live">{o.waiting}</div>
                  <div className="l">En attente</div>
                </div>
                <div>
                  <div className="n">{o.matched}</div>
                  <div className="l">Matchs</div>
                </div>
                <div>
                  <div className="n">{o.applied}</div>
                  <div className="l">Total</div>
                </div>
              </div>
            </div>
          ))}
          <div className="offer-mini new">
            <div className="ic"><svg><use href="#ic-plus"/></svg></div>
            <div className="lbl">Nouvelle offre</div>
          </div>
        </div>

        <div className="r-section">
          <h3>À examiner aujourd'hui</h3>
          <span className="more" onClick={() => onSwitchTab('candidates')}>Voir tout (22)</span>
        </div>
        <div className="cand-list">
          {top3.map(c => (
            <CandidateCard key={c.id} cand={c} onOpen={() => onOpenCandidate(c)} compact/>
          ))}
        </div>
      </div>

      <div className="fab" title="Nouvelle offre">
        <svg><use href="#ic-plus"/></svg>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Candidate card (used in pipeline + queue)
// ────────────────────────────────────────────────────────────
function CandidateCard({ cand, onOpen, onAccept, onDecline, compact, anim }) {
  const cls = "cand-card" + (cand.featured ? " featured" : "") + (anim ? " " + anim : "");

  return (
    <div className={cls}>
      {cand.ribbon && <div className="ribbon">{cand.ribbon}</div>}

      <div className="head">
        <div className="avatar" style={{ background: cand.bg, color: cand.ink }}>
          {cand.initials}
          {cand.verified && (
            <span className="verif">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
            </span>
          )}
        </div>
        <div className="info" onClick={onOpen}>
          <div className="name">
            {cand.name}
          </div>
          <div className="sub">{cand.role} · {cand.school}</div>
          <div className="for-offer">
            <svg><use href="#ic-heart"/></svg> A swipé · {cand.forOffer}
          </div>
        </div>
        <div className="match-pill">{cand.match}%</div>
      </div>

      {!compact && (
        <p className="blurb">{cand.blurb}</p>
      )}

      {!compact && (
        <div className="skills">
          {cand.skills.slice(0, 4).map((s, i) => (
            <span key={s} className={i < cand.matchedSkills ? "match" : ""}>
              {i < cand.matchedSkills ? "✓ " : ""}{s}
            </span>
          ))}
        </div>
      )}

      <div className="meta-row">
        <span className="it"><svg><use href="#ic-pin"/></svg> {cand.location}</span>
        <span className="it"><svg><use href="#ic-clock"/></svg> {cand.availableFrom}</span>
        <span className="it"><svg><use href="#ic-flame"/></svg> Swipé {cand.swiped}</span>
      </div>

      <div className="actions-row">
        <button className="decline" onClick={() => onDecline && onDecline(cand)}>
          <svg><use href="#ic-x"/></svg>
          Refuser
        </button>
        <button className="detail" onClick={onOpen}>
          <svg><use href="#ic-user"/></svg>
          Profil
        </button>
        <button className="accept" onClick={() => onAccept && onAccept(cand)}>
          <svg><use href="#ic-heart"/></svg>
          Accepter
        </button>
      </div>
    </div>
  );
}

window.CandidateCard = CandidateCard;

// ────────────────────────────────────────────────────────────
// Candidates queue screen
// ────────────────────────────────────────────────────────────
function CandidatesScreen({ onOpenCandidate, onAcceptMatch }) {
  const [offerFilter, setOfferFilter] = React.useState('all');
  const [status, setStatus] = React.useState('waiting');
  const [anims, setAnims] = React.useState({}); // id -> 'declining' | 'accepting'
  const [list, setList] = React.useState(R_CANDIDATES);

  const filteredList = list.filter(c => offerFilter === 'all' || c.offerId === offerFilter);

  const handleDecline = (cand) => {
    setAnims(a => ({...a, [cand.id]: 'declining'}));
    setTimeout(() => setList(prev => prev.filter(c => c.id !== cand.id)), 320);
  };
  const handleAccept = (cand) => {
    setAnims(a => ({...a, [cand.id]: 'accepting'}));
    setTimeout(() => {
      setList(prev => prev.filter(c => c.id !== cand.id));
      onAcceptMatch && onAcceptMatch(cand);
    }, 360);
  };

  return (
    <>
      <div className="r-top">
        <div className="brand">
          <div className="mark">A</div>
          <div className="ttl">
            Candidats
            <span className="role">{filteredList.length} en attente</span>
          </div>
        </div>
        <div className="actions">
          <div className="icon-btn"><svg><use href="#ic-sliders"/></svg></div>
        </div>
      </div>

      <div style={{ background: 'var(--paper-2)', paddingTop: 12 }}>
        <div className="filter-bar">
          <div className={"chip" + (offerFilter === 'all' ? " on" : "")} onClick={() => setOfferFilter('all')}>
            Toutes mes offres <span className="num">{list.length}</span>
          </div>
          {R_OFFERS.map(o => (
            <div key={o.id}
              className={"chip" + (offerFilter === o.id ? " on" : "")}
              onClick={() => setOfferFilter(o.id)}
            >
              {o.title.split(' · ')[0]}
              <span className="num">{list.filter(c => c.offerId === o.id).length}</span>
            </div>
          ))}
        </div>

        <div className="status-seg">
          <div className={"seg" + (status === 'waiting' ? " on" : "")} onClick={() => setStatus('waiting')}>
            En attente <span className="count">{filteredList.length}</span>
          </div>
          <div className={"seg" + (status === 'matched' ? " on" : "")} onClick={() => setStatus('matched')}>
            Acceptés
          </div>
          <div className={"seg" + (status === 'declined' ? " on" : "")} onClick={() => setStatus('declined')}>
            Refusés
          </div>
        </div>
      </div>

      <div className="scroll">
        {status === 'waiting' && (
          <div className="cand-list">
            {filteredList.length === 0 ? (
              <div className="empty">
                <div className="ic"><svg><use href="#ic-check"/></svg></div>
                <h4>Plus rien à examiner !</h4>
                <p>Tu as trié tous les profils. Reviens un peu plus tard ou affine tes critères de matching.</p>
              </div>
            ) : (
              filteredList.map(c => (
                <CandidateCard
                  key={c.id}
                  cand={c}
                  anim={anims[c.id]}
                  onOpen={() => onOpenCandidate(c)}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))
            )}
          </div>
        )}

        {status === 'matched' && (
          <div className="empty">
            <div className="ic"><svg><use href="#ic-heart"/></svg></div>
            <h4>Tes matchs validés apparaîtront ici.</h4>
            <p>Quand tu acceptes un profil, la conversation démarre côté Matchs.</p>
          </div>
        )}

        {status === 'declined' && (
          <div className="empty">
            <div className="ic" style={{background: '#FFE9ED', color: '#b8294a'}}><svg><use href="#ic-x"/></svg></div>
            <h4>Aucun profil refusé sur la période.</h4>
            <p>Les profils refusés sont conservés 30 jours puis archivés.</p>
          </div>
        )}
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Candidate detail overlay
// ────────────────────────────────────────────────────────────
function CandidateDetail({ cand, onBack, onAccept, onDecline }) {
  return (
    <div className="cand-detail">
      <div className="back-bar">
        <div className="icon-btn" onClick={onBack} style={{ border: 'none' }}>
          <svg><use href="#ic-arrow-left"/></svg>
        </div>
        <div className="center">Profil candidat</div>
        <div className="icon-btn"><svg><use href="#ic-share"/></svg></div>
      </div>

      <div className="hero">
        <div className="av" style={{ background: cand.bg, color: cand.ink }}>
          {cand.initials}
          {cand.verified && (
            <span className="verif">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
            </span>
          )}
        </div>
        <div className="info">
          <h1>{cand.name}</h1>
          <div className="sub">{cand.role} — {cand.school}</div>
          <div className="tags">
            <span className="green">A swipé ton offre</span>
            <span>{cand.location}</span>
            <span>{cand.duration}</span>
          </div>
        </div>
      </div>

      <div className="match-banner">
        <div className="pct">{cand.match}<small>%</small></div>
        <div className="why">
          <strong>Match excellent</strong>
          {cand.matchedSkills}/{cand.skills.length} compétences clés · {cand.duration} · disponible {cand.availableFrom}
        </div>
      </div>

      <div className="r-block video">
        <div className="play">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div className="lbl">
          <div className="t">Vidéo de présentation</div>
          <div className="s">{cand.name.split(' ')[0]} se présente en 30 secondes</div>
        </div>
        <div className="dur">0:32</div>
      </div>

      <div className="r-block">
        <h4>À propos</h4>
        <p>{cand.bio}</p>
      </div>

      <div className="r-block">
        <h4>Compétences</h4>
        <div className="skills-chips">
          {cand.skills.map((s, i) => (
            <span key={s} className={i < cand.matchedSkills ? "match" : ""}>
              {i < cand.matchedSkills ? "✓ " : ""}{s}
            </span>
          ))}
        </div>
      </div>

      <div className="r-block">
        <h4>Expériences</h4>
        {cand.experiences.map((e, i) => (
          <div className="item" key={i}>
            <div className="ic"><svg><use href="#ic-briefcase"/></svg></div>
            <div className="body">
              <div className="t">{e.role} — {e.co}</div>
              <div className="s">{e.period}</div>
              <div className="d">{e.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="r-block">
        <h4>Formation</h4>
        {cand.education.map((e, i) => (
          <div className="item" key={i}>
            <div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5"/></svg></div>
            <div className="body">
              <div className="t">{e.role}</div>
              <div className="s">{e.co} · {e.period}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="r-block">
        <h4>Pourquoi cette offre ?</h4>
        <p>{cand.motivation}</p>
      </div>

      <div className="cand-cta-bar">
        <button className="decline" onClick={() => { onDecline(cand); onBack(); }}>
          <svg><use href="#ic-x"/></svg>
          Refuser
        </button>
        <button className="save">
          <svg><use href="#ic-star"/></svg>
        </button>
        <button className="accept" onClick={() => { onAccept(cand); onBack(); }}>
          <svg><use href="#ic-heart"/></svg>
          Accepter le match
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Recruiter matches / chats list
// ────────────────────────────────────────────────────────────
function RecruiterMatchesScreen({ onOpenChat }) {
  const convs = [
    { id: 'lea', name: "Léa Martin", initials: "L", bg: "linear-gradient(135deg, #ffd5a8, #ffb380)", ink: "#6e3a17",
      preview: "Parfait, je suis dispo vendredi 14h.", time: "10:42", unread: 2, online: true, offer: "UX Designer" },
    { id: 'nina', name: "Nina Klein", initials: "N", bg: "linear-gradient(135deg, #c4e0ff, #8db5f0)", ink: "#1f3a6e",
      preview: "Merci pour le retour, j'ai bien noté.", time: "Hier", unread: 0, online: false, offer: "Brand Designer" },
    { id: 'omar', name: "Omar Haddad", initials: "O", bg: "linear-gradient(135deg, #bff5d9, #7ce0a8)", ink: "#1d4f33",
      preview: "Voici le lien de mon portfolio mis à jour.", time: "Hier", unread: 1, online: true, offer: "Data Analyst" },
    { id: 'jules', name: "Jules Perrin", initials: "J", bg: "linear-gradient(135deg, #e0c4ff, #b08df0)", ink: "#3a1f6e",
      preview: "Top, à très vite !", time: "Lun.", unread: 0, online: false, offer: "Product Manager" },
  ];

  return (
    <>
      <div className="r-top">
        <div className="brand">
          <div className="mark">A</div>
          <div className="ttl">
            Conversations
            <span className="role">{convs.length} candidats validés</span>
          </div>
        </div>
        <div className="actions">
          <div className="icon-btn"><svg><use href="#ic-search"/></svg></div>
        </div>
      </div>

      <div className="section-h" style={{ background: 'var(--paper-2)' }}>
        Tous les matchs
        <span style={{ color: 'var(--ink-4)', fontWeight: 500, fontSize: 12 }}>Trié par activité</span>
      </div>

      <div className="scroll">
        <div className="conv-list">
          {convs.map(c => (
            <div className="conv" key={c.id} onClick={() => onOpenChat(c.id)}>
              <div className="av" style={{ background: c.bg, color: c.ink }}>
                {c.initials}
                {c.online && <span className="online"/>}
              </div>
              <div className="info">
                <div className="row1">
                  <span className="name">{c.name}</span>
                  <span className="time">{c.time}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--vert-profond)', fontWeight: 600, marginBottom: 2 }}>
                  · {c.offer}
                </div>
                <div className={"preview" + (c.unread ? " unread" : "")}>{c.preview}</div>
              </div>
              {c.unread > 0 && <div className="unread-pill">{c.unread}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Recruiter company profile
// ────────────────────────────────────────────────────────────
function RecruiterProfileScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--paper-2)' }}>
      <div className="co-hero">
        <div className="top">
          <h2>Mon espace</h2>
          <div className="icon-btn"><svg><use href="#ic-gear"/></svg></div>
        </div>
        <div className="row">
          <div className="mk">A</div>
          <div className="info">
            <h3>Atelier Lumen</h3>
            <div className="v">atelierlumen.fr · 18 collaborateurs</div>
            <div className="badges">
              <span className="green">✓ Vérifiée</span>
              <span>Studio · Design produit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="plan-card">
        <div className="row">
          <div>
            <div className="l">Plan actuel</div>
            <div className="v">Pro · 4 offres actives</div>
            <div className="meta">Renouvellement le 12 juin · 280 €/mois</div>
          </div>
          <div className="cta">Gérer</div>
        </div>
      </div>

      <div className="scroll">
        <div className="stats-row" style={{ marginTop: 0, marginBottom: 12 }}>
          <div className="st">
            <div className="n">47</div>
            <div className="l">Profils reçus</div>
          </div>
          <div className="st">
            <div className="n">13</div>
            <div className="l">Matchs ce mois</div>
          </div>
          <div className="st">
            <div className="n">4j</div>
            <div className="l">Réactivité moy.</div>
          </div>
        </div>

        <div className="section-block">
          <div className="head"><h4>Équipe de recrutement</h4><span className="add">Inviter</span></div>
          <div className="team-row">
            <div className="avs">
              <div className="av" style={{ background: '#1E1E1E' }}>C</div>
              <div className="av" style={{ background: '#7A5AE0' }}>P</div>
              <div className="av" style={{ background: '#F0A23E' }}>S</div>
              <div className="av" style={{ background: '#00BF63' }}>+2</div>
            </div>
            <div className="lbl">Camille, Pierre, Sami et 2 autres</div>
          </div>
        </div>

        <div className="section-block">
          <div className="head"><h4>Préférences de matching</h4></div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-sliders"/></svg></div>
            <div className="body">
              <div className="t">Filtres par défaut</div>
              <div className="s">Master · Paris · Hybride ou présentiel</div>
            </div>
            <span style={{ color: 'var(--ink-4)', fontWeight: 600 }}>›</span>
          </div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-bell"/></svg></div>
            <div className="body">
              <div className="t">Alertes nouveaux profils</div>
              <div className="s">Push quand un profil ≥ 90 % de match</div>
            </div>
            <div className="toggle"><i/></div>
          </div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-clock"/></svg></div>
            <div className="body">
              <div className="t">Réponse auto si inactif 7j</div>
              <div className="s">Évite de laisser un candidat sans nouvelle</div>
            </div>
            <div className="toggle off"><i/></div>
          </div>
        </div>

        <div className="section-block">
          <div className="head"><h4>Espace partenaires</h4></div>
          <div className="row-item">
            <div className="ic" style={{background: '#FFF6E0', color: '#8B6300'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5"/></svg>
            </div>
            <div className="body">
              <div className="t">Écoles partenaires</div>
              <div className="s">12 conventions actives</div>
            </div>
            <span style={{ color: 'var(--ink-4)', fontWeight: 600 }}>›</span>
          </div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-share"/></svg></div>
            <div className="body">
              <div className="t">Marque employeur</div>
              <div className="s">Personnalise tes pages d'offre</div>
            </div>
            <span style={{ color: 'var(--ink-4)', fontWeight: 600 }}>›</span>
          </div>
        </div>

        <div style={{ height: 24 }}/>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Match confirmation splash (when recruiter accepts)
// ────────────────────────────────────────────────────────────
function RecruiterMatchSplash({ cand, onClose, onMessage }) {
  return (
    <div className="match-overlay">
      <h2>Match validé !</h2>
      <p className="sub">Tu peux maintenant échanger avec <strong>{cand.name.split(' ')[0]}</strong>. Lance la conversation pendant que c'est chaud.</p>
      <div className="match-avatars">
        <div className="av" style={{ background: cand.bg, color: cand.ink }}>{cand.initials}</div>
        <div className="heart"><svg><use href="#ic-heart"/></svg></div>
        <div className="av" style={{ background: 'var(--vert-mist)', color: 'var(--vert-profond)' }}>A</div>
      </div>
      <div style={{
        background: 'rgba(255,255,255,.12)', color: '#fff',
        padding: '8px 14px', borderRadius: 999,
        fontSize: 13, fontWeight: 500,
        position: 'relative', zIndex: 1,
      }}>
        ✨ {cand.match} % de compatibilité · {cand.forOffer}
      </div>
      <div className="ctas">
        <button className="btn-pill primary" onClick={onMessage}>
          Envoyer un message
          <svg width="14" height="14"><use href="#ic-send"/></svg>
        </button>
        <button className="btn-pill ghost" onClick={onClose}>Continuer à trier</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  PipelineScreen, CandidatesScreen, CandidateDetail,
  RecruiterMatchesScreen, RecruiterProfileScreen, RecruiterMatchSplash,
});
