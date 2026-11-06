// sections.jsx — How it works, Audiences, Features, Stats, Testimonials, CTA, Footer

function StepIcon({ kind }) {
  if (kind === "profile") return (
    <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="32" y="22" width="136" height="96" rx="14" fill="#fff" stroke="rgba(30,30,30,.1)"/>
      <circle cx="60" cy="58" r="14" fill="#E6F8EE"/>
      <circle cx="60" cy="58" r="8" fill="#00BF63"/>
      <rect x="82" y="48" width="60" height="6" rx="3" fill="#1E1E1E"/>
      <rect x="82" y="60" width="44" height="4" rx="2" fill="rgba(30,30,30,.25)"/>
      <rect x="44" y="84" width="42" height="18" rx="9" fill="#E6F8EE"/>
      <rect x="92" y="84" width="36" height="18" rx="9" fill="#F9F9F9" stroke="rgba(30,30,30,.08)"/>
      <rect x="134" y="84" width="22" height="18" rx="9" fill="#F9F9F9" stroke="rgba(30,30,30,.08)"/>
    </svg>
  );
  if (kind === "swipe") return (
    <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="58" y="14" width="86" height="112" rx="14" fill="#fff" stroke="rgba(30,30,30,.1)" transform="rotate(-8 100 70)"/>
      <rect x="58" y="14" width="86" height="112" rx="14" fill="#fff" stroke="rgba(30,30,30,.12)" transform="rotate(6 100 70)"/>
      <rect x="58" y="14" width="86" height="112" rx="14" fill="#fff" stroke="rgba(30,30,30,.14)"/>
      <rect x="66" y="22" width="70" height="50" rx="8" fill="#E6F8EE"/>
      <text x="101" y="56" fontFamily="Outfit, sans-serif" fontSize="24" fontWeight="700" fill="#008C46" textAnchor="middle">N</text>
      <rect x="66" y="80" width="50" height="6" rx="3" fill="#1E1E1E"/>
      <rect x="66" y="92" width="32" height="4" rx="2" fill="rgba(30,30,30,.3)"/>
      <rect x="66" y="104" width="22" height="10" rx="5" fill="#E6F8EE"/>
      <rect x="92" y="104" width="22" height="10" rx="5" fill="#E6F8EE"/>
      <g transform="translate(160 60)">
        <circle r="14" fill="#00BF63"/>
        <path d="M-5 0l4 4 8-8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      <g transform="translate(40 60)">
        <circle r="11" fill="#fff" stroke="rgba(30,30,30,.1)"/>
        <path d="M-4 -4l8 8M4 -4l-8 8" stroke="#e3506b" strokeWidth="2" strokeLinecap="round"/>
      </g>
    </svg>
  );
  if (kind === "chat") return (
    <svg viewBox="0 0 200 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="20" y="36" width="110" height="28" rx="14" fill="#F9F9F9" stroke="rgba(30,30,30,.08)"/>
      <circle cx="36" cy="50" r="8" fill="#1E1E1E"/>
      <text x="36" y="54" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="700" fill="#fff" textAnchor="middle">L</text>
      <rect x="50" y="46" width="58" height="4" rx="2" fill="#1E1E1E"/>
      <rect x="50" y="54" width="36" height="3" rx="1.5" fill="rgba(30,30,30,.4)"/>

      <rect x="60" y="76" width="120" height="28" rx="14" fill="#00BF63"/>
      <circle cx="166" cy="90" r="8" fill="#fff"/>
      <text x="166" y="94" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="700" fill="#00BF63" textAnchor="middle">M</text>
      <rect x="74" y="86" width="80" height="4" rx="2" fill="rgba(255,255,255,.95)"/>
      <rect x="74" y="94" width="50" height="3" rx="1.5" fill="rgba(255,255,255,.6)"/>
    </svg>
  );
  return null;
}

function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap">
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap: 18}}>
          <span className="eyebrow"><span className="dot"></span> Comment ça marche</span>
          <h2 className="h2">Trois étapes. Zéro friction.</h2>
          <p className="sub" style={{textAlign:'center'}}>
            On a réduit la recherche de stage à l'essentiel : tu te présentes,
            tu swipes, tu discutes. Le reste, on s'en occupe.
          </p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Crée ton profil en 90 sec</h3>
            <p>
              Une photo, deux phrases, tes compétences et le type de stage que tu cherches.
              Pas de CV à formater — Swape s'en charge.
            </p>
            <div className="step-vis"><StepIcon kind="profile"/></div>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Swipe les offres qui te parlent</h3>
            <p>
              Notre algorithme te propose chaque jour des offres ultra-ciblées
              selon ton profil, ta ville et tes envies. À droite : intéressé.
            </p>
            <div className="step-vis"><StepIcon kind="swipe"/></div>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Match, discute, signe</h3>
            <p>
              Si l'entreprise a aussi swipé ton profil, c'est un match.
              Discute directement dans l'app, planifie ton entretien, signe.
            </p>
            <div className="step-vis"><StepIcon kind="chat"/></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Audiences() {
  const Check = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7"/>
    </svg>
  );
  return (
    <section style={{background: 'var(--paper-2)'}}>
      <div className="wrap">
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap: 18}}>
          <span className="eyebrow"><span className="dot"></span> Pour qui</span>
          <h2 className="h2">Deux côtés du match.</h2>
          <p className="sub" style={{textAlign:'center'}}>
            Les étudiants trouvent leur voie. Les entreprises trouvent leurs futurs talents.
            Tout le monde gagne du temps.
          </p>
        </div>
        <div className="audiences">
          <div className="audience students">
            <div className="deco"></div>
            <div className="deco-2"></div>
            <span className="audience-eyebrow">Pour les étudiants</span>
            <h3>Trouve la mission qui te ressemble vraiment.</h3>
            <p>
              Découvre chaque jour des entreprises qui correspondent à ton profil et à tes envies.
              Sans candidatures à la chaîne ni messages sans réponse.
            </p>
            <ul>
              <li><Check/> Profil créé en moins de 2 minutes</li>
              <li><Check/> 100% gratuit, sans frais cachés</li>
              <li><Check/> Réponse en moyenne sous 48h</li>
              <li><Check/> Conseils personnalisés à chaque étape</li>
            </ul>
            <a className="btn btn-flip">Je m'inscris comme étudiant →</a>
          </div>
          <div className="audience companies">
            <div className="deco"></div>
            <div className="deco-2"></div>
            <span className="audience-eyebrow">Pour les entreprises</span>
            <h3>Recrute tes futurs talents en quelques swipes.</h3>
            <p>
              Découvre des profils pré-qualifiés, vérifiés et engagés. Fini les piles de CV :
              tu choisis qui contacter, on simplifie le reste.
            </p>
            <ul>
              <li><Check/> Profils étudiants vérifiés par les écoles</li>
              <li><Check/> Matching par compétences et soft-skills</li>
              <li><Check/> Tableau de bord recrutement intégré</li>
              <li><Check/> Premier match offert, sans engagement</li>
            </ul>
            <a className="btn btn-flip">Recruter avec Swape →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const ic = {
    bolt: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>,
    chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>,
    sparkle: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/></svg>,
    video: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4z"/></svg>,
    calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>,
  };
  return (
    <section id="features">
      <div className="wrap">
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap: 18}}>
          <span className="eyebrow"><span className="dot"></span> Fonctionnalités</span>
          <h2 className="h2">Tout ce qu'il faut, rien de plus.</h2>
          <p className="sub" style={{textAlign:'center'}}>
            Une interface conçue pour aller à l'essentiel : matcher, discuter, décrocher.
          </p>
        </div>
        <div className="features">
          <div className="feature accent">
            <div className="ic">{ic.bolt}</div>
            <h4>Matching instantané</h4>
            <p>Notre algo apprend de tes swipes et affine ses propositions au fil des jours.</p>
          </div>
          <div className="feature wide dark">
            <div className="ic">{ic.chat}</div>
            <h4>Chat intégré sans intermédiaire</h4>
            <p>Discute directement avec le recruteur dès le match. Ton ton, ton rythme — sans plateforme tierce.</p>
          </div>
          <div className="feature">
            <div className="ic">{ic.video}</div>
            <h4>Profil vidéo de 30s</h4>
            <p>Montre qui tu es vraiment, au-delà du CV.</p>
          </div>
          <div className="feature">
            <div className="ic">{ic.shield}</div>
            <h4>Profils vérifiés</h4>
            <p>Tous les comptes sont validés par les écoles partenaires.</p>
          </div>
          <div className="feature">
            <div className="ic">{ic.calendar}</div>
            <h4>Entretien en 2 clics</h4>
            <p>Calendrier partagé et rappels intégrés. Plus d'allers-retours par mail.</p>
          </div>
          <div className="feature">
            <div className="ic">{ic.sparkle}</div>
            <h4>Conseils IA personnalisés</h4>
            <p>Améliore ton profil grâce à des suggestions ciblées avant chaque swipe.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section style={{paddingTop: 24, paddingBottom: 80}}>
      <div className="wrap">
        <div className="stats">
          <div className="stat">
            <div className="num">9 200<span className="unit">+</span></div>
            <div className="label">étudiants accompagnés cette année</div>
          </div>
          <div className="stat">
            <div className="num">2 400<span className="unit">+</span></div>
            <div className="label">entreprises partenaires en France</div>
          </div>
          <div className="stat">
            <div className="num">48<span className="unit">h</span></div>
            <div className="label">temps de réponse moyen après un match</div>
          </div>
          <div className="stat">
            <div className="num">82<span className="unit">%</span></div>
            <div className="label">de matchs aboutissent à un entretien</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote: "J'ai matché avec mon entreprise d'alternance un jeudi soir. Le lundi, j'avais signé. Swape m'a évité trois mois de candidatures dans le vide.",
      name: "Léa M.", role: "M2 Design — Atelier Lumen", mark: "L"
    },
    {
      quote: "On reçoit des profils déjà ciblés, déjà motivés. Le temps qu'on gagne sur le sourcing, on le réinvestit dans l'accompagnement de nos alternants.",
      name: "Karim B.", role: "RH chez Northwind Labs", mark: "K"
    },
    {
      quote: "Enfin une app qui comprend que chercher un stage, c'est aussi une histoire de feeling. L'interface est claire, les conversations sont vraies.",
      name: "Inès D.", role: "M1 Marketing — INSEEC", mark: "I"
    },
  ];
  return (
    <section style={{background: 'var(--paper-2)'}}>
      <div className="wrap">
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap: 18}}>
          <span className="eyebrow"><span className="dot"></span> Ils en parlent</span>
          <h2 className="h2">Des matchs qui changent les parcours.</h2>
        </div>
        <div className="testimonials">
          {items.map(t => (
            <div className="testimonial" key={t.name}>
              <p className="quote">{t.quote}</p>
              <div className="who">
                <div className="avatar">{t.mark}</div>
                <div className="info">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const AppStoreBadge = () => (
    <a className="store-badge" href="#">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.02-2.18 1.78-3.22 1.86-3.27-1.01-1.48-2.59-1.68-3.16-1.71-1.34-.14-2.62.79-3.31.79-.68 0-1.74-.77-2.86-.75-1.47.02-2.83.85-3.59 2.17-1.53 2.65-.39 6.57 1.1 8.71.73 1.05 1.6 2.23 2.73 2.18 1.09-.04 1.51-.71 2.83-.71 1.32 0 1.69.71 2.84.69 1.17-.02 1.92-1.07 2.64-2.12.83-1.22 1.17-2.4 1.19-2.46-.03-.01-2.28-.87-2.27-3.45zM14.99 5.39c.6-.73 1.01-1.74.9-2.74-.87.03-1.92.58-2.54 1.31-.56.65-1.05 1.69-.92 2.67.97.08 1.96-.5 2.56-1.24z"/></svg>
      <div>
        <span className="small">Télécharger sur</span>
        <span className="big">App Store</span>
      </div>
    </a>
  );
  const PlayBadge = () => (
    <a className="store-badge" href="#">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M4.05 2.4c-.27.27-.43.69-.43 1.24v16.72c0 .55.16.97.43 1.24l.08.08L13.4 12.5v-.2L4.13 2.32l-.08.08zM16.65 15.35l-3.25-3.25v-.2l3.25-3.25.08.05 3.85 2.19c1.1.62 1.1 1.64 0 2.27l-3.85 2.19-.08.05zM4.05 21.6c.39.41.97.46 1.61.07l11.06-6.28-3.32-3.32L4.05 21.6zM16.81 8.51L5.66 2.18c-.64-.36-1.22-.31-1.61.1l9.32 9.32 3.44-3.09z"/></svg>
      <div>
        <span className="small">Disponible sur</span>
        <span className="big">Google Play</span>
      </div>
    </a>
  );
  return (
    <section id="cta" className="cta-section">
      <div className="wrap">
        <div className="cta-card">
          <h2 className="h2" style={{fontSize: 'clamp(36px, 4.6vw, 60px)'}}>
            Ton prochain stage<br/>n'attend qu'un swipe.
          </h2>
          <p>
            Rejoins les milliers d'étudiants qui ont choisi de chercher leur stage
            autrement. Téléchargement gratuit, sans engagement.
          </p>
          <div className="store-badges">
            <AppStoreBadge/>
            <PlayBadge/>
          </div>
          <div className="row">
            <a className="btn btn-ghost btn-lg" href="#">
              Recruter avec Swape
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const Logo = () => (
    <div className="logo">
      <div className="smark">
        <img src={(window.__resources && window.__resources.logo) || "assets/swape-logo.png"} alt="Swape"/>
      </div>
      <span>swape<span className="dot">.</span></span>
    </div>
  );

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Logo/>
            <p className="foot-blurb">
              L'app de matching qui simplifie la recherche de stage et d'alternance,
              pour les étudiants comme pour les entreprises.
            </p>
            <div className="foot-social">
              <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h4v4H4zm0 6h4v10H4zm6 0h4v2c.7-1.3 2.2-2.3 4-2.3 3 0 4 2 4 5V20h-4v-4.5c0-1.4-.5-2.5-2-2.5s-2 1.1-2 2.5V20h-4z"/></svg></a>
              <a href="#" aria-label="TikTok"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.7a5.6 5.6 0 0 1-3.4-1.2v8.3a5.7 5.7 0 1 1-4.9-5.7v2.6a3.1 3.1 0 1 0 2.3 3V2h2.6c.2 1.6 1.4 2.9 3 3.1z"/></svg></a>
              <a href="#" aria-label="X"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-7 8 8 10h-6l-5-6.5L4.5 21H1.5l7.5-8.5L1.5 3h6l4.5 6z"/></svg></a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Étudiants</h5>
            <ul>
              <li><a href="#">Trouver un stage</a></li>
              <li><a href="#">Alternance</a></li>
              <li><a href="#">Conseils carrière</a></li>
              <li><a href="#">Témoignages</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Entreprises</h5>
            <ul>
              <li><a href="#">Recruter</a></li>
              <li><a href="#">Tarifs</a></li>
              <li><a href="#">Études de cas</a></li>
              <li><a href="#">Devenir partenaire</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Swape</h5>
            <ul>
              <li><a href="#">À propos</a></li>
              <li><a href="#">Écoles partenaires</a></li>
              <li><a href="#">Presse</a></li>
              <li><a href="#">Nous contacter</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Swape. Fait à Paris, avec ❤️.</span>
          <span>
            <a href="#" style={{marginRight: 20}}>Mentions légales</a>
            <a href="#" style={{marginRight: 20}}>Confidentialité</a>
            <a href="#">CGU</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

window.HowItWorks = HowItWorks;
window.Audiences = Audiences;
window.Features = Features;
window.Stats = Stats;
window.Testimonials = Testimonials;
window.CTA = CTA;
window.Footer = Footer;
