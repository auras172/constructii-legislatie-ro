import { getContributorResources } from '@/lib/content'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Ghid contribuitori | Legislație Construcții România',
}

export default function ContributePage() {
  const resources = getContributorResources()

  return (
    <section className="page-shell">
      <div className="page-heading">
        <h1>Contribuie în siguranță</h1>
        <p>Pull request-urile mici, cu sursă verificată, sunt inima acestui proiect. Oamenii și agenții AI folosesc aceleași reguli.</p>
      </div>

      <div className="steps">
        {['Alege un issue', 'Citește regulile repo', 'Creează un branch', 'Implementează doar scope-ul', 'Rulează validarea', 'Deschide un PR'].map((step, index) => (
          <article key={step}>
            <span>{index + 1}</span>
            <h2>{step}</h2>
          </article>
        ))}
      </div>

      <section className="section-grid compact">
        {resources.map((resource) => (
          <article key={resource.path}>
            <h2>{resource.title}</h2>
            <p>{resource.summary}</p>
            <a href={`https://github.com/auras172/constructii-legislatie-ro/blob/main/${resource.path}`}>Citește pe GitHub</a>
          </article>
        ))}
      </section>

      <div className="feature-band">
        <div>
          <h2>Issues bune pentru început</h2>
          <p>Începe cu metadata, verificare surse, jurnale de import, taxonomie sau documentație. Nu importa text juridic dacă issue-ul nu solicită explicit acest lucru.</p>
        </div>
        <a className="button primary" href="https://github.com/auras172/constructii-legislatie-ro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Răsfoiește issues</a>
      </div>
    </section>
  )
}
