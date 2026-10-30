// mobile/app.jsx — root of the Swape mobile prototype

const TabBar = ({ active, onChange, badges = {} }) => {
  const tabs = [
    { id: 'swipe',   label: 'Découvrir', icon: 'ic-heart' },
    { id: 'matches', label: 'Matchs',    icon: 'ic-message' },
    { id: 'profile', label: 'Profil',    icon: 'ic-user' },
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

function MobileApp({ tweaks }) {
  const [tab, setTab] = React.useState('swipe');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [detail, setDetail] = React.useState(null); // company object
  const [matchPopup, setMatchPopup] = React.useState(null); // company object
  const [chatId, setChatId] = React.useState(null); // string

  // When user opens chat from match, jump to matches tab + chat
  const openChat = (id) => {
    setChatId(id);
    setTab('matches');
  };

  // Reset chat when changing tabs away from matches
  React.useEffect(() => {
    if (tab !== 'matches') setChatId(null);
  }, [tab]);

  return (
    <div className="screen">
      <SwipeIcons/>

      {/* Active screen */}
      {tab === 'swipe' && (
        <SwipeScreen
          onMatch={(c) => setMatchPopup(c)}
          onOpenDetail={(c) => setDetail(c)}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      )}

      {tab === 'matches' && !chatId && (
        <MatchesScreen onOpenChat={(id) => setChatId(id)}/>
      )}

      {tab === 'matches' && chatId && (
        <ChatScreen chatId={chatId} onBack={() => setChatId(null)}/>
      )}

      {tab === 'profile' && <ProfileScreen/>}

      {/* Detail overlay */}
      {detail && <DetailOverlay company={detail} onBack={() => setDetail(null)}/>}

      {/* Match splash */}
      {matchPopup && (
        <MatchSplash
          company={matchPopup}
          onClose={() => setMatchPopup(null)}
          onMessage={() => {
            setMatchPopup(null);
            openChat(matchPopup.name.toLowerCase().split(' ')[0]);
          }}
        />
      )}

      {/* Filters modal */}
      {filtersOpen && <FiltersModal onClose={() => setFiltersOpen(false)}/>}

      {/* Bottom tab bar — hide when in chat or in detail */}
      {!chatId && !detail && !matchPopup && (
        <TabBar active={tab} onChange={setTab} badges={{ matches: 3 }}/>
      )}
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#00BF63",
  "darkMode": false,
  "cardStyle": "rounded",
  "showStamps": true
}/*EDITMODE-END*/;

function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--vert-swape', t.accent);
    // Card radius via tweak
    document.documentElement.style.setProperty(
      '--card-radius',
      t.cardStyle === 'sharp' ? '12px' : t.cardStyle === 'square' ? '4px' : '28px'
    );
    document.querySelectorAll('.offer-card, .detail-overlay').forEach(el => {
      el.style.borderRadius = (t.cardStyle === 'sharp' ? '12px' : t.cardStyle === 'square' ? '4px' : '28px');
    });
  }, [t]);

  return (
    <>
      <IOSDevice width={390} height={844} keyboard={false}>
        <MobileApp tweaks={t}/>
      </IOSDevice>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Identité"/>
        <TweakColor
          label="Couleur d'accent"
          value={t.accent}
          options={['#00BF63', '#008C46', '#4CD98B', '#7A5AE0', '#1E1E1E']}
          onChange={(v) => setTweak('accent', v)}
        />
        <TweakSection label="Style"/>
        <TweakRadio
          label="Cartes"
          value={t.cardStyle}
          options={[
            { value: 'rounded', label: 'Doux' },
            { value: 'sharp',   label: 'Moyen' },
            { value: 'square',  label: 'Net' },
          ]}
          onChange={(v) => setTweak('cardStyle', v)}
        />
        <TweakToggle
          label="Stamps LIKE / NOPE"
          value={t.showStamps}
          onChange={(v) => {
            setTweak('showStamps', v);
            document.querySelectorAll('.stamp').forEach(s => s.style.display = v ? '' : 'none');
          }}
        />
      </TweaksPanel>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root/>);
