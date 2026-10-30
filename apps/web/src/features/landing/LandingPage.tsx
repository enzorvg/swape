const steps = [
  {
    number: '01',
    title: 'Crée ton profil en 90 secondes',
    description:
      'Une photo, deux phrases, tes compétences et le type de poste que tu cherches. Pas de CV à formater, Swape s’en charge.',
    icon: <ProfileIcon />,
  },
  {
    number: '02',
    title: 'Swipe les offres qui te parlent',
    description:
      'Chaque jour, des offres ciblées selon ton profil, ta ville et tes envies. À droite : intéressé.',
    icon: <SwipeIcon />,
  },
  {
    number: '03',
    title: 'Match, discute, signe',
    description:
      'Si l’entreprise swipe aussi ton profil, c’est un match. Discute directement, planifie ton entretien, signe.',
    icon: <ChatIcon />,
  },
];

function ProfileIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-16 w-16">
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="16"
        fill="var(--color-background)"
        stroke="var(--color-border)"
      />
      <circle cx="24" cy="26" r="8" fill="var(--color-primary-soft)" />
      <circle cx="24" cy="26" r="4" fill="var(--color-primary)" />
      <rect x="36" y="22" width="20" height="4" rx="2" fill="var(--color-text)" />
      <rect x="36" y="30" width="14" height="3" rx="1.5" fill="var(--color-text-muted)" />
      <rect x="14" y="42" width="16" height="8" rx="4" fill="var(--color-primary-soft)" />
      <rect
        x="34"
        y="42"
        width="16"
        height="8"
        rx="4"
        fill="var(--color-background)"
        stroke="var(--color-border)"
      />
    </svg>
  );
}

function SwipeIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-16 w-16">
      <rect
        x="8"
        y="10"
        width="36"
        height="46"
        rx="10"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
        transform="rotate(6 26 33)"
      />
      <rect
        x="8"
        y="10"
        width="36"
        height="46"
        rx="10"
        fill="var(--color-surface)"
        stroke="var(--color-border)"
      />
      <rect x="14" y="16" width="24" height="18" rx="6" fill="var(--color-primary-soft)" />
      <rect x="14" y="40" width="16" height="4" rx="2" fill="var(--color-text)" />
      <circle cx="54" cy="18" r="9" fill="var(--color-primary)" />
      <path
        d="M50 18l3 3 6-6"
        stroke="var(--color-surface)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-16 w-16">
      <rect
        x="4"
        y="10"
        width="40"
        height="18"
        rx="9"
        fill="var(--color-background)"
        stroke="var(--color-border)"
      />
      <circle cx="16" cy="19" r="6" fill="var(--color-text)" />
      <rect x="26" y="16" width="14" height="3" rx="1.5" fill="var(--color-text)" />
      <rect x="26" y="22" width="10" height="2.5" rx="1.25" fill="var(--color-text-muted)" />

      <rect x="20" y="34" width="40" height="18" rx="9" fill="var(--color-primary)" />
      <circle cx="48" cy="43" r="6" fill="var(--color-surface)" />
      <rect x="24" y="40" width="18" height="3" rx="1.5" fill="var(--color-surface)" />
      <rect x="24" y="46" width="12" height="2.5" rx="1.25" fill="var(--color-primary-soft)" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 overflow-x-hidden p-8">
      <header className="flex flex-col items-center gap-4 pt-8 text-center">
        <h1 className="font-display text-5xl text-primary">Swape</h1>
        <p className="text-text-muted">Le recrutement, en un swipe.</p>
      </header>

      <section
        aria-labelledby="how-it-works-title"
        className="flex w-full max-w-4xl flex-col items-center gap-8"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
            Comment ça marche
          </span>
          <h2 id="how-it-works-title" className="font-display text-3xl text-text">
            Trois étapes. Zéro friction.
          </h2>
          <p className="max-w-xl text-text-muted">
            On réduit la recherche d’un poste à l’essentiel : tu te présentes, tu swipes, tu
            discutes. Le reste, on s’en occupe.
          </p>
        </div>

        <ol className="grid w-full gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col items-center gap-3 rounded-xl bg-surface p-6 text-center shadow-card"
            >
              <span className="font-display text-sm text-primary">{step.number}</span>
              {step.icon}
              <h3 className="font-display text-lg text-text">{step.title}</h3>
              <p className="text-sm text-text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <a
        href="/recruiter/login"
        className="rounded-full bg-primary px-6 py-3 font-display text-surface shadow-soft"
      >
        Espace recruteur
      </a>
    </main>
  );
}
