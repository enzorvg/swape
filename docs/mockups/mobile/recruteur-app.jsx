// mobile/recruteur-app.jsx — recruiter mobile root

const RTabBar = ({ active, onChange, badges = {} }) => {
  const tabs = [
    { id: 'pipeline',   label: 'Pipeline',  icon: 'ic-briefcase' },
    { id: 'candidates', label: 'Candidats', icon: 'ic-user' },
    { id: 'matches',    label: 'Matchs',    icon: 'ic-message' },
    { id: 'profile',    label: 'Espace',    icon: 'ic-gear' },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <div key={t.id} className={"tab" + (active === t.id ? " active" : "")} onClick={() => onChange(t.id)}>
          <svg><use href={"#" + t.icon}/></svg>
          <span>{t.label}</span>
          {badges[t.id] && <span className="badge">{badges[t.id]}</span>}
        </div>
      ))}
    </div>
  );
};

function RecruiterApp() {
  const [tab, setTab] = React.useState('pipeline');
  const [detail, setDetail] = React.useState(null); // candidate
  const [matchPopup, setMatchPopup] = React.useState(null); // candidate
  const [chatId, setChatId] = React.useState(null);

  const openChat = (id) => { setChatId(id); setTab('matches'); };

  React.useEffect(() => {
    if (tab !== 'matches') setChatId(null);
  }, [tab]);

  const acceptMatch = (cand) => setMatchPopup(cand);
  const declineMatch = (cand) => { /* no-op visual */ };

  return (
    <div className="screen">
      <SwipeIcons/>

      {tab === 'pipeline' && (
        <PipelineScreen
          onOpenCandidate={(c) => setDetail(c)}
          onSwitchTab={(t) => setTab(t)}
        />
      )}

      {tab === 'candidates' && (
        <CandidatesScreen
          onOpenCandidate={(c) => setDetail(c)}
          onAcceptMatch={acceptMatch}
        />
      )}

      {tab === 'matches' && !chatId && (
        <RecruiterMatchesScreen onOpenChat={(id) => setChatId(id)}/>
      )}

      {tab === 'matches' && chatId && (
        <ChatScreen chatId={chatId} onBack={() => setChatId(null)}/>
      )}

      {tab === 'profile' && <RecruiterProfileScreen/>}

      {detail && (
        <CandidateDetail
          cand={detail}
          onBack={() => setDetail(null)}
          onAccept={acceptMatch}
          onDecline={declineMatch}
        />
      )}

      {matchPopup && (
        <RecruiterMatchSplash
          cand={matchPopup}
          onClose={() => setMatchPopup(null)}
          onMessage={() => {
            const id = matchPopup.id;
            setMatchPopup(null);
            openChat(id);
          }}
        />
      )}

      {!chatId && !detail && !matchPopup && (
        <RTabBar active={tab} onChange={setTab} badges={{ candidates: 22 }}/>
      )}
    </div>
  );
}

const R_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#00BF63",
  "showRibbons": true,
  "density": "regular"
}/*EDITMODE-END*/;

function RecruiterRoot() {
  const [t, setTweak] = useTweaks(R_TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--vert-swape', t.accent);
    document.querySelectorAll('.ribbon').forEach(r => r.style.display = t.showRibbons ? '' : 'none');
  }, [t]);

  return (
    <>
      <IOSDevice width={390} height={844} keyboard={false}>
        <RecruiterApp/>
      </IOSDevice>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Identité"/>
        <TweakColor
          label="Couleur d'accent"
          value={t.accent}
          options={['#00BF63', '#008C46', '#4CD98B', '#1E1E1E', '#7A5AE0']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Affichage"/>
        <TweakToggle
          label="Rubans 'Top match'"
          value={t.showRibbons}
          onChange={(v) => setTweak('showRibbons', v)}
        />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RecruiterRoot/>);
