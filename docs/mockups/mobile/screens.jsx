// mobile/screens.jsx — Matches list, Chat, Profile, Filters modal, Detail overlay, MatchSplash

function MatchesScreen({ onOpenChat }) {
  const newMatches = [
    { name: "Lumen", mark: "L", color: "#1E1E1E", isNew: true },
    { name: "Northwind", mark: "N", color: "#00BF63", isNew: true },
    { name: "Marée", mark: "M", color: "#F0A23E", isNew: false },
    { name: "Nimbus", mark: "N", color: "#7A5AE0", isNew: true },
    { name: "Verde", mark: "V", color: "#008C46", isNew: false },
    { name: "Atelier", mark: "A", color: "#e3506b", isNew: false },
  ];
  const convs = [
    { id: 'lumen', name: "Camille — Atelier Lumen", mark: "L", color: "#1E1E1E",
      preview: "Super ton portfolio ! Tu serais dispo vendredi pour un café visio ?",
      time: "10:42", unread: 2, online: true },
    { id: 'northwind', name: "Karim — Northwind Labs", mark: "N", color: "#00BF63",
      preview: "On peut planifier un échange technique la semaine prochaine ?",
      time: "Hier", unread: 1, online: false },
    { id: 'maree', name: "Inès — Studio Marée", mark: "M", color: "#F0A23E",
      preview: "Tu m'as envoyé un super travail, je transmets à l'équipe.",
      time: "Lun.", unread: 0, online: true },
    { id: 'nimbus', name: "Théo — Nimbus & Co", mark: "N", color: "#7A5AE0",
      preview: "Voici le test technique dont on a parlé.",
      time: "Lun.", unread: 0, online: false },
    { id: 'verde', name: "Sofia — Verde Maison", mark: "V", color: "#008C46",
      preview: "Merci pour ton temps, je reviens vers toi rapidement.",
      time: "10 mai", unread: 0, online: false },
  ];

  return (
    <>
      <div className="topbar">
        <div className="title">Matchs<span className="dot">.</span></div>
        <div className="icon-btn">
          <svg><use href="#ic-search"/></svg>
        </div>
      </div>

      <div className="section-h">
        Nouveaux matchs
        <span className="count">3 nouveaux</span>
      </div>
      <div className="new-matches">
        {newMatches.map(m => (
          <div className="new-match" key={m.name} onClick={() => onOpenChat(m.name.toLowerCase())}>
            <div className="av" style={{ background: m.color }}>
              {m.mark}
              {m.isNew && <span className="new-dot">NEW</span>}
            </div>
            <div className="name">{m.name}</div>
          </div>
        ))}
      </div>

      <div className="section-h">
        Messages
        <span style={{fontSize: 12, color: 'var(--ink-4)', fontWeight: 500}}>Trié par activité</span>
      </div>
      <div className="scroll">
        <div className="conv-list">
          {convs.map(c => (
            <div className="conv" key={c.id} onClick={() => onOpenChat(c.id)}>
              <div className="av" style={{ background: c.color }}>
                {c.mark}
                {c.online && <span className="online"/>}
              </div>
              <div className="info">
                <div className="row1">
                  <span className="name">{c.name}</span>
                  <span className="time">{c.time}</span>
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

function ChatScreen({ chatId, onBack }) {
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState([
    { id: 1, side: 'them', text: "Bonjour Léa ! Ravie de matcher avec toi ✨", t: "10:14" },
    { id: 2, side: 'them', text: "On a vraiment aimé ton portfolio, surtout le projet pour Banque Populaire.", t: "10:14" },
    { id: 3, side: 'me',   text: "Merci beaucoup ! C'était mon projet préféré du semestre.", t: "10:21" },
    { id: 4, side: 'me',   text: "Vous cherchez quelqu'un sur quel type de produits exactement ?", t: "10:21" },
    { id: 5, side: 'them', text: "Du design produit B2B principalement — gros volet recherche utilisateur, design system, et un peu de motion sur les transitions clés.", t: "10:38" },
    { id: 6, side: 'them', text: "Tu serais dispo vendredi pour un café visio ? 30 min suffiront 😊", t: "10:42" },
  ]);
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    const now = new Date();
    const t = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    setMessages(prev => [...prev, { id: Date.now(), side: 'me', text, t }]);
    setDraft("");
    // Simulate reply
    setTimeout(() => setTyping(true), 600);
    setTimeout(() => {
      setTyping(false);
      const replies = [
        "Super, on en reparle vendredi alors !",
        "Top, je t'envoie une invit Calendar.",
        "Parfait. Tu préfères 10h ou 14h ?",
      ];
      const r = replies[Math.floor(Math.random() * replies.length)];
      setMessages(prev => [...prev, { id: Date.now(), side: 'them', text: r, t }]);
    }, 2200);
  };

  return (
    <>
      <div className="chat-header">
        <div className="icon-btn" onClick={onBack} style={{border:'none'}}>
          <svg><use href="#ic-arrow-left"/></svg>
        </div>
        <div className="av" style={{ background: "#1E1E1E" }}>L</div>
        <div className="info">
          <div className="n">Camille Dubois</div>
          <div className="r">Lead Designer · Atelier Lumen</div>
        </div>
        <div className="icon-btn"><svg><use href="#ic-camera"/></svg></div>
        <div className="icon-btn"><svg><use href="#ic-bell"/></svg></div>
      </div>

      <div className="chat-banner">
        <div className="ic"><svg><use href="#ic-heart"/></svg></div>
        <div>
          <strong>Vous avez matché le 12 mai</strong> · 96 % de compatibilité
        </div>
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        <div className="day-divider">Aujourd'hui</div>
        {messages.map(m => (
          <div key={m.id} className={"msg " + m.side}>
            {m.text}
            <div className="t">{m.t}</div>
          </div>
        ))}
        {typing && (
          <div className="typing"><span/><span/><span/></div>
        )}
      </div>

      <div className="quick-replies">
        <button onClick={() => send("Oui, vendredi 14h ça me va parfaitement.")}>Oui, vendredi 14h ✨</button>
        <button onClick={() => send("Plutôt vendredi 10h pour moi.")}>Vendredi 10h</button>
        <button onClick={() => send("Je te confirme dans la journée.")}>Je confirme</button>
        <button onClick={() => send("Tu peux m'en dire plus sur l'équipe ?")}>L'équipe ?</button>
      </div>

      <div className="chat-input">
        <div className="ic-btn">
          <svg><use href="#ic-plus"/></svg>
        </div>
        <input
          className="pill-in"
          style={{ border: '1px solid var(--line)', background: '#fff', color: 'var(--anthracite)', fontFamily: 'inherit', outline: 'none' }}
          placeholder="Écrire un message…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(draft); }}
        />
        <div className="send-btn" onClick={() => send(draft)}>
          <svg><use href="#ic-send"/></svg>
        </div>
      </div>
    </>
  );
}

function ProfileScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, background: 'var(--paper-2)' }}>
      <div className="profile-hero">
        <div className="top">
          <div className="title" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: '#fff' }}>
            Mon profil
          </div>
          <div className="icon-btn"><svg><use href="#ic-gear"/></svg></div>
        </div>
        <div className="profile-card">
          <div className="av">L</div>
          <div className="info">
            <h3>Léa Martin</h3>
            <div className="uni">M2 Design — Sciences Po Paris</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ background:'rgba(255,255,255,.12)', color:'#fff', fontSize: 11, fontWeight: 600, padding:'4px 8px', borderRadius: 999 }}>
                ✓ Vérifiée par l'école
              </span>
              <span style={{ background:'var(--vert-swape)', color:'#fff', fontSize: 11, fontWeight: 600, padding:'4px 8px', borderRadius: 999 }}>
                Premium
              </span>
            </div>
          </div>
        </div>
        <div className="profile-completion">
          <div className="row">
            <span className="lbl">Profil complété</span>
            <span className="pct">78%</span>
          </div>
          <div className="bar"><div className="fill"/></div>
          <div className="hint">Ajoute ta vidéo de 30s pour atteindre 100 %.</div>
        </div>
      </div>

      <div className="scroll">
        <div className="stats-row">
          <div className="st">
            <div className="n">42</div>
            <div className="l">Swipes restants</div>
          </div>
          <div className="st">
            <div className="n">12</div>
            <div className="l">Matchs ce mois</div>
          </div>
          <div className="st">
            <div className="n">3</div>
            <div className="l">Entretiens</div>
          </div>
        </div>

        <div className="section-block">
          <div className="head">
            <h4>Je recherche</h4>
            <span className="add">Modifier</span>
          </div>
          <div className="chips" style={{ paddingBottom: 4 }}>
            <span>Alternance</span>
            <span>UX Designer</span>
            <span>Product Designer</span>
          </div>
          <div className="chips">
            <span>Paris · 25km</span>
            <span>Hybride</span>
            <span>Démarrage Sept. 2026</span>
          </div>
        </div>

        <div className="section-block">
          <div className="head">
            <h4>Mes compétences</h4>
            <span className="add">+ Ajouter</span>
          </div>
          <div className="chips" style={{ paddingBottom: 12 }}>
            <span>Figma</span>
            <span>Design System</span>
            <span>Recherche UX</span>
            <span>Prototypage</span>
            <span>Motion</span>
            <span className="dim">+ Ajouter</span>
          </div>
        </div>

        <div className="section-block">
          <div className="head"><h4>Mon profil</h4></div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-user"/></svg></div>
            <div className="body">
              <div className="t">Vidéo de présentation</div>
              <div className="s">Non ajoutée — recommandée</div>
            </div>
            <span style={{ color: 'var(--vert-profond)', fontWeight: 600, fontSize: 13 }}>Ajouter</span>
          </div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-briefcase"/></svg></div>
            <div className="body">
              <div className="t">Expériences</div>
              <div className="s">2 expériences renseignées</div>
            </div>
            <span style={{ color: 'var(--ink-4)', fontWeight: 600, fontSize: 13 }}>›</span>
          </div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-bookmark"/></svg></div>
            <div className="body">
              <div className="t">Offres sauvegardées</div>
              <div className="s">14 offres</div>
            </div>
            <span style={{ color: 'var(--ink-4)', fontWeight: 600, fontSize: 13 }}>›</span>
          </div>
        </div>

        <div className="section-block">
          <div className="head"><h4>Préférences</h4></div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-bell"/></svg></div>
            <div className="body">
              <div className="t">Notifications de match</div>
              <div className="s">Reçois une alerte à chaque match</div>
            </div>
            <div className="toggle"><i/></div>
          </div>
          <div className="row-item">
            <div className="ic"><svg><use href="#ic-flame"/></svg></div>
            <div className="body">
              <div className="t">Mode discret</div>
              <div className="s">Ton profil reste visible mais sans push</div>
            </div>
            <div className="toggle off"><i/></div>
          </div>
        </div>

        <div style={{ height: 24 }}/>
      </div>
    </div>
  );
}

function FiltersModal({ onClose }) {
  const [type, setType] = React.useState('Alternance');
  const [remote, setRemote] = React.useState('Hybride');
  const [duration, setDuration] = React.useState(12);
  const [distance, setDistance] = React.useState(25);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"/>
        <div className="modal-head">
          <h3>Filtres</h3>
          <span className="reset">Réinitialiser</span>
        </div>

        <div className="filter-section">
          <div className="lbl">Type de contrat</div>
          <div className="chips-row">
            {['Alternance', 'Stage', 'CDI', 'Freelance'].map(o => (
              <div key={o} className={"chip" + (type === o ? " on" : "")} onClick={() => setType(o)}>{o}</div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="lbl">Mode de travail</div>
          <div className="chips-row">
            {['Sur site', 'Hybride', 'Full remote'].map(o => (
              <div key={o} className={"chip" + (remote === o ? " on" : "")} onClick={() => setRemote(o)}>{o}</div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="lbl">Domaines</div>
          <div className="chips-row">
            {['Design', 'Data', 'Dev', 'Marketing', 'RH', 'Finance', 'Produit', 'Ingénierie'].map(o => (
              <div key={o} className="chip">{o}</div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="lbl">Distance autour de Paris</div>
          <div className="range-row">
            <input type="range" min="5" max="100" step="5" value={distance}
              onChange={(e) => setDistance(+e.target.value)}/>
            <div className="range-val">{distance} km</div>
          </div>
        </div>

        <div className="filter-section">
          <div className="lbl">Durée</div>
          <div className="range-row">
            <input type="range" min="1" max="24" step="1" value={duration}
              onChange={(e) => setDuration(+e.target.value)}/>
            <div className="range-val">{duration} mois</div>
          </div>
        </div>

        <div className="modal-cta" onClick={onClose}>Voir 138 offres</div>
      </div>
    </div>
  );
}

function DetailOverlay({ company, onBack }) {
  return (
    <div className="detail-overlay">
      <div className="detail-hero" style={{ background: `linear-gradient(155deg, ${company.color} 0%, ${company.color}dd 100%)` }}>
        <div className="pattern"/>
        <div className="back">
          <div className="icon-btn" onClick={onBack} style={{ background: 'rgba(255,255,255,.92)' }}>
            <svg><use href="#ic-arrow-left"/></svg>
          </div>
        </div>
        <div className="meta-top">
          <div className="icon-btn"><svg><use href="#ic-share"/></svg></div>
          <div className="icon-btn"><svg><use href="#ic-bookmark"/></svg></div>
        </div>
        <div className="mark" style={{ color: company.color }}>{company.mark}</div>
      </div>
      <div className="detail-body">
        <h1>{company.role}</h1>
        <div className="company-line">
          <strong style={{ color: 'var(--anthracite)' }}>{company.name}</strong>
          {company.verified && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              background: 'var(--vert-mist)', color: 'var(--vert-profond)',
              fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 999
            }}>
              ✓ Vérifié
            </span>
          )}
          · {company.tagline}
        </div>

        <div className="info-grid">
          <div className="cell"><div className="l">Type</div><div className="v">{company.type}</div></div>
          <div className="cell"><div className="l">Durée</div><div className="v">{company.duration}</div></div>
          <div className="cell"><div className="l">Démarrage</div><div className="v">{company.start}</div></div>
          <div className="cell"><div className="l">Rémunération</div><div className="v">{company.salary}<span style={{fontSize: 11, color: 'var(--ink-4)', fontWeight: 500}}>{company.salaryNote}</span></div></div>
          <div className="cell"><div className="l">Lieu</div><div className="v">{company.loc}</div></div>
          <div className="cell"><div className="l">Mode</div><div className="v">{company.remote}</div></div>
        </div>

        <h4>À propos de la mission</h4>
        <p>{company.desc}</p>

        <h4>Compétences attendues</h4>
        <div className="chips" style={{ paddingBottom: 0 }}>
          {company.tags.map(t => <span key={t}>{t}</span>)}
          {company.skills.map(s => <span key={s} className="dim">{s}</span>)}
        </div>

        <h4>Match</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--vert-mist)', borderRadius: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--vert-swape)', color: '#fff',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          }}>
            {company.match}%
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Excellent match</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              Ton profil correspond fortement à 4 compétences clés de cette offre.
            </div>
          </div>
        </div>

        <div style={{ height: 80 }}/>
      </div>

      <div className="detail-cta-bar">
        <div className="act md nope"><svg><use href="#ic-x"/></svg></div>
        <div className="act lg"><svg><use href="#ic-heart"/></svg></div>
        <div className="act md star"><svg><use href="#ic-star"/></svg></div>
      </div>
    </div>
  );
}

function MatchSplash({ company, onClose, onMessage }) {
  return (
    <div className="match-overlay">
      <h2>It's a swape !</h2>
      <p className="sub">Tu as matché avec <strong>{company.name}</strong>. Lance la conversation pendant que c'est chaud.</p>
      <div className="match-avatars">
        <div className="av">L</div>
        <div className="heart"><svg><use href="#ic-heart"/></svg></div>
        <div className="av" style={{ background: company.color, color: '#fff' }}>{company.mark}</div>
      </div>
      <div style={{
        background: 'rgba(255,255,255,.12)', color: '#fff',
        padding: '8px 14px', borderRadius: 999,
        fontSize: 13, fontWeight: 500,
        position: 'relative', zIndex: 1,
      }}>
        ✨ {company.match}% de compatibilité — {company.role}
      </div>
      <div className="ctas">
        <button className="btn-pill primary" onClick={onMessage}>
          Envoyer un message
          <svg width="14" height="14"><use href="#ic-send"/></svg>
        </button>
        <button className="btn-pill ghost" onClick={onClose}>Continuer à swiper</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  MatchesScreen, ChatScreen, ProfileScreen, FiltersModal, DetailOverlay, MatchSplash,
});
