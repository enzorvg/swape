// recruteur-web/triage.jsx — center triage panel + decisions + root App

// ─────────── Right rail (queue preview) ───────────
function RightRail({ cands, currentIdx, decisions, onJump }) {
  return (
    <aside className="right-rail">
      <div className="head">
        <span className="t">File d'attente</span>
        <span className="s">{cands.length}</span>
      </div>
      {cands.map((c, i) => {
        const d = decisions[c.id];
        const cls = "queue-item" +
          (i === currentIdx ? " current" : "") +
          (d === 'accept' ? " done acc" : d === 'decline' ? " done dec" : "");
        return (
          <div key={c.id} className={cls} onClick={() => onJump(i)}>
            <div className="av" style={{ background: c.avBg, color: c.avInk }}>{c.initials}</div>
            <div className="info">
              <div className="t">{c.name}</div>
              <div className="s">
                <span className="pct">{c.match}%</span>
                <span>{c.school.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
}

// ─────────── Candidate detail view ───────────
function CandidateView({ cand }) {
  const matchedCount = cand.skills.filter(s => s.match).length;

  return (
    <>
      <div className="tc-head">
        <div className="av" style={{ background: cand.avBg, color: cand.avInk }}>
          {cand.initials}
          {cand.verified && (
            <span className="verif">
              <svg><use href="#i-check"/></svg>
            </span>
          )}
        </div>
        <div className="info">
          <h1>
            {cand.name}
            <span className="lvl">{cand.lvl}</span>
          </h1>
          <div className="sub">{cand.role} — {cand.school}</div>
          <div className="badges">
            <span className="green">
              <svg><use href="#i-heart"/></svg>
              A swipé · {cand.swiped}
            </span>
            <span><svg><use href="#i-pin"/></svg> {cand.location} · {cand.remote}</span>
            <span><svg><use href="#i-clock"/></svg> {cand.duration} · {cand.start}</span>
            <span>{cand.salary}</span>
            {cand.premium && <span style={{background:'#FFE9A6', color:'#8B6300'}}>Premium</span>}
          </div>
        </div>
        <div className="match-block">
          <div>
            <div className="lab">Match</div>
            <div className="pct">{cand.match}<small>%</small></div>
            <div className="det">{matchedCount}/{cand.skills.length} compétences clés</div>
          </div>
        </div>
      </div>

      <div className="tc-body">
        <div className="tc-col">

          <div className="tc-block">
            <h4>À propos</h4>
            <p>{cand.blurb}</p>
          </div>

          <div className="tc-block">
            <h4>Compétences <span className="more">Voir le détail ({matchedCount}/{cand.skills.length})</span></h4>
            <div className="skill-grid">
              {cand.skills.map(s => (
                <div key={s.n} className={"sk" + (s.match ? " match" : "")}>
                  <span className="ic">
                    {s.match
                      ? <svg><use href="#i-check"/></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/></svg>}
                  </span>
                  {s.n}
                </div>
              ))}
            </div>
          </div>

          <div className="tc-block">
            <h4>Pourquoi cette offre ?</h4>
            <p>« {cand.motivation} »</p>
          </div>

        </div>

        <div className="tc-col">

          <div className="tc-block">
            <h4>Vidéo de présentation</h4>
            <div className="video-card">
              <div className="play"><svg><use href="#i-play"/></svg></div>
              <div className="lbl">
                <div className="t">{cand.name.split(' ')[0]} se présente en 30s</div>
                <div className="s">Cliquer pour lire</div>
              </div>
              <span className="dur">0:32</span>
            </div>
          </div>

          <div className="tc-block">
            <h4>Faits saillants</h4>
            <div className="fact-row">
              <div className="fact">
                <div className="l">Disponibilité</div>
                <div className="v green">{cand.start}</div>
              </div>
              <div className="fact">
                <div className="l">Localisation</div>
                <div className="v">{cand.location}</div>
              </div>
              <div className="fact">
                <div className="l">Niveau</div>
                <div className="v">{cand.lvl} — {cand.school.split(' ')[0]}</div>
              </div>
              <div className="fact">
                <div className="l">Langues</div>
                <div className="v">{cand.languages.length} parlées</div>
              </div>
            </div>
          </div>

          <div className="tc-block">
            <h4>Expériences</h4>
            {cand.experiences.map((e, i) => (
              <div className="timeline-item" key={i}>
                <div className="ic"><svg><use href="#i-briefcase"/></svg></div>
                <div className="body">
                  <div className="t">{e.role}</div>
                  <div className="co">{e.co}</div>
                  <div className="p">{e.period}</div>
                  <div className="d">{e.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="tc-block">
            <h4>Formation</h4>
            {cand.education.map((e, i) => (
              <div className="timeline-item" key={i}>
                <div className="ic"><svg><use href="#i-grad"/></svg></div>
                <div className="body">
                  <div className="t">{e.role}</div>
                  <div className="co">{e.co}</div>
                  <div className="p">{e.period}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

// ─────────── Help overlay ───────────
function HelpOverlay({ onClose }) {
  const rows = [
    ['Accepter le candidat',      ['→']],
    ['Refuser le candidat',       ['←']],
    ['Sauvegarder en favori',     ['S']],
    ['Suivant sans décider',      ['↓']],
    ['Précédent',                 ['↑']],
    ['Annuler la décision',       ['⌘', 'Z']],
    ['Mode bulk select',          ['B']],
    ['Recherche rapide',          ['⌘', 'K']],
    ['Voir cette aide',           ['?']],
    ['Fermer / annuler',          ['Esc']],
  ];
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-sheet" onClick={(e) => e.stopPropagation()}>
        <h3>Raccourcis clavier</h3>
        <div className="help-grid">
          {rows.map(([label, keys], i) => (
            <div className="help-row" key={i}>
              <span className="l">{label}</span>
              <span className="k">
                {keys.map((k, j) => <span key={j} className="kbd">{k}</span>)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────── Root App ───────────
function App() {
  const [offerId, setOfferId] = useState('ux');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [decisions, setDecisions] = useState({}); // id -> 'accept' | 'decline' | 'skip'
  const [flash, setFlash] = useState(null); // 'accept' | 'decline' | null
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all'); // all | top | video | verif
  const [sortBy, setSortBy] = useState('match');
  const [helpOpen, setHelpOpen] = useState(false);
  const cardRef = useRef(null);

  const filtered = useMemo(() => {
    let list = CANDS;
    if (filter === 'top')   list = list.filter(c => c.match >= 90);
    if (filter === 'verif') list = list.filter(c => c.verified);
    if (filter === 'video') list = list; // all have video stub
    if (sortBy === 'match')   list = [...list].sort((a,b) => b.match - a.match);
    if (sortBy === 'recent')  list = [...list].sort((a,b) => a.swiped.localeCompare(b.swiped));
    if (sortBy === 'school')  list = [...list].sort((a,b) => a.school.localeCompare(b.school));
    return list;
  }, [filter, sortBy]);

  const cand = filtered[currentIdx];
  const totalDecided = Object.keys(decisions).length;
  const accepted = Object.values(decisions).filter(d => d === 'accept').length;
  const declined = Object.values(decisions).filter(d => d === 'decline').length;
  const remaining = filtered.length - totalDecided;
  const currentOffer = OFFERS.find(o => o.id === offerId) || OFFERS[0];

  const decide = useCallback((kind) => {
    if (!cand) return;
    if (decisions[cand.id]) return;
    setDecisions(prev => ({ ...prev, [cand.id]: kind }));
    setFlash(kind);
    setToast({ kind, name: cand.name, id: cand.id });
    setTimeout(() => setFlash(null), 400);
    setTimeout(() => setToast(null), 3200);
    setTimeout(() => {
      setCurrentIdx(i => Math.min(i + 1, filtered.length - 1));
    }, 250);
  }, [cand, decisions, filtered.length]);

  const undo = (id) => {
    setDecisions(prev => {
      const n = {...prev};
      delete n[id];
      return n;
    });
    setToast(null);
    const idx = filtered.findIndex(c => c.id === id);
    if (idx >= 0) setCurrentIdx(idx);
  };

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (helpOpen && e.key === 'Escape') { setHelpOpen(false); return; }
      if (helpOpen) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); decide('accept'); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); decide('decline'); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setCurrentIdx(i => Math.min(i+1, filtered.length-1)); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setCurrentIdx(i => Math.max(i-1, 0)); }
      else if (e.key === 's' || e.key === 'S') { /* save fav */ }
      else if (e.key === '?') { setHelpOpen(true); }
      else if (e.key === 'Escape') { setToast(null); }
      else if ((e.key === 'z' || e.key === 'Z') && (e.metaKey || e.ctrlKey)) {
        const last = Object.keys(decisions).pop();
        if (last) { e.preventDefault(); undo(last); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide, decisions, filtered.length, helpOpen]);

  const done = remaining === 0;

  return (
    <div className="app">
      <Icons/>

      <TopBar
        offer={currentOffer}
        decided={Object.keys(decisions).length}
        onPick={() => { /* picker stub */ }}
      />

      <LeftRail activeId={offerId} onPick={setOfferId}/>

      <main className="main">
        <div className="main-head">
          <div className="head-meta">
            <div className="count">
              <span className="n">{Math.min(currentIdx + 1, filtered.length)}</span>
              <span className="tot"> / {filtered.length}</span>
            </div>
            <div className="sub">
              <strong>{currentOffer.title}</strong> · {currentOffer.type}
            </div>
          </div>

          <div className="progress-bar">
            <div className="fill" style={{ width: `${(totalDecided / filtered.length) * 100}%` }}/>
          </div>

          <div className="progress-stats">
            <div className="item"><span className="sw green"/><span className="n">{accepted}</span><span className="l">acceptés</span></div>
            <div className="item"><span className="sw red"/><span className="n">{declined}</span><span className="l">refusés</span></div>
            <div className="item"><span className="sw gray"/><span className="n">{remaining}</span><span className="l">restants</span></div>
          </div>
        </div>

        <div className="filter-row">
          <div className={"filter-pill" + (filter === 'all' ? ' on' : '')} onClick={() => setFilter('all')}>
            Tous <span className="num">{CANDS.length}</span>
          </div>
          <div className={"filter-pill" + (filter === 'top' ? ' on' : '')} onClick={() => setFilter('top')}>
            <span className="ic"><svg><use href="#i-bolt"/></svg></span>
            Top match (≥90%) <span className="num">{CANDS.filter(c => c.match >= 90).length}</span>
          </div>
          <div className={"filter-pill" + (filter === 'verif' ? ' on' : '')} onClick={() => setFilter('verif')}>
            <span className="ic"><svg><use href="#i-check"/></svg></span>
            Vérifiés <span className="num">{CANDS.filter(c => c.verified).length}</span>
          </div>
          <div className={"filter-pill" + (filter === 'video' ? ' on' : '')} onClick={() => setFilter('video')}>
            <span className="ic"><svg><use href="#i-video"/></svg></span>
            Avec vidéo <span className="num">{CANDS.length}</span>
          </div>
          <div className="sep"/>
          <div className="filter-pill">
            <span className="ic"><svg><use href="#i-pin"/></svg></span>
            Paris
          </div>
          <div className="filter-pill">
            <span className="ic"><svg><use href="#i-grad"/></svg></span>
            M2 ou +
          </div>

          <div className="sort-by">
            Trier par
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="match">Match décroissant</option>
              <option value="recent">Plus récent</option>
              <option value="school">École</option>
            </select>
          </div>
        </div>

        {done ? (
          <div className="triage-card">
            <div className="done-state">
              <div className="ic"><svg><use href="#i-check"/></svg></div>
              <div className="big">Inbox zero ✨</div>
              <p>Tu as trié les {filtered.length} profils en attente sur cette offre. {accepted} acceptés, {declined} refusés.</p>
              <div className="acts">
                <button className="act-btn" onClick={() => setDecisions({})}>Recommencer</button>
                <button className="act-btn accept" onClick={() => {}}>Voir les matchs</button>
              </div>
            </div>
          </div>
        ) : cand && (
          <div ref={cardRef} className={"triage-card" + (flash ? ` flash-${flash}` : '')}>
            <CandidateView cand={cand}/>

            <div className="action-bar">
              <div className="left">
                <button className="act-btn refuse" onClick={() => decide('decline')}>
                  <svg><use href="#i-x"/></svg>
                  Refuser
                  <span className="kbd">←</span>
                </button>
                <button className="act-btn skip" onClick={() => setCurrentIdx(i => Math.min(i+1, filtered.length-1))}>
                  <svg><use href="#i-skip"/></svg>
                  Suivant
                  <span className="kbd">↓</span>
                </button>
                <button className="act-btn save">
                  <svg><use href="#i-star"/></svg>
                  Sauvegarder
                  <span className="kbd">S</span>
                </button>
              </div>
              <div className="right">
                <button className="act-btn accept" onClick={() => decide('accept')}>
                  Accepter le match
                  <svg><use href="#i-arrow-right"/></svg>
                  <span className="kbd">→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <RightRail
        cands={filtered}
        currentIdx={currentIdx}
        decisions={decisions}
        onJump={(i) => setCurrentIdx(i)}
      />

      <footer className="footer">
        <div className="shortcuts">
          <div className="group">
            <span className="kbd">←</span> Refuser
          </div>
          <div className="sep"/>
          <div className="group">
            <span className="kbd">→</span> Accepter
          </div>
          <div className="sep"/>
          <div className="group">
            <span className="kbd">↑</span><span className="kbd">↓</span> Naviguer
          </div>
          <div className="sep"/>
          <div className="group">
            <span className="kbd">S</span> Favori
          </div>
          <div className="sep"/>
          <div className="group">
            <span className="kbd">⌘</span><span className="kbd">Z</span> Annuler
          </div>
          <div className="sep"/>
          <div className="group" onClick={() => setHelpOpen(true)} style={{cursor:'pointer'}}>
            <span className="kbd">?</span> Aide
          </div>
        </div>
        <div className="right">
          <span className="dot"/> Synchronisé · maj. il y a 12s
        </div>
      </footer>

      {toast && (
        <div className={"toast " + toast.kind}>
          <div className="ic">
            <svg>
              {toast.kind === 'accept' ? <use href="#i-check"/> : <use href="#i-x"/>}
            </svg>
          </div>
          {toast.kind === 'accept' ? "Match validé avec" : "Profil refusé :"} <strong>{toast.name}</strong>
          <span className="undo" onClick={() => undo(toast.id)}>Annuler</span>
        </div>
      )}

      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)}/>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
