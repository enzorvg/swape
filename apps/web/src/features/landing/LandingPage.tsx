const steps = [
  {
    title: 'Crée ton profil',
    description:
      'Renseigne ton parcours, tes compétences et ce que tu recherches en quelques minutes.',
    icon: '📝',
  },
  {
    title: 'Swipe les offres',
    description:
      'Découvre des offres qui te correspondent et swipe à droite celles qui t’intéressent.',
    icon: '👉',
  },
  {
    title: 'Matche et discute',
    description: 'En cas de match, échange directement avec le recruteur pour la suite.',
    icon: '💬',
  },
];

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
        <h2 id="how-it-works-title" className="font-display text-3xl text-text">
          Comment ça marche
        </h2>

        <ol className="grid w-full gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col items-center gap-3 rounded-xl bg-surface p-6 text-center shadow-card"
            >
              <span aria-hidden="true" className="text-4xl">
                {step.icon}
              </span>
              <h3 className="font-display text-lg text-text">
                {index + 1}. {step.title}
              </h3>
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
