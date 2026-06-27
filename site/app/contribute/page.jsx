import { getContributorResources } from '@/lib/content'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Contributor guide | Open Construction Law Romania',
}

export default function ContributePage() {
  const resources = getContributorResources()

  return (
    <section className="page-shell">
      <div className="page-heading">
        <h1>Contribute safely</h1>
        <p>Small, source-backed pull requests are the heart of this project. Humans and AI agents use the same rules.</p>
      </div>

      <div className="steps">
        {['Pick one issue', 'Read repo rules', 'Create a branch', 'Implement only scope', 'Run validation', 'Open a PR'].map((step, index) => (
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
            <a href={`https://github.com/auras172/constructii-legislatie-ro/blob/main/${resource.path}`}>Read on GitHub</a>
          </article>
        ))}
      </section>

      <div className="feature-band">
        <div>
          <h2>Good first issues</h2>
          <p>Start with metadata, source verification, import logs, taxonomy, or documentation. Do not import legal text unless the issue explicitly asks for it.</p>
        </div>
        <a className="button primary" href="https://github.com/auras172/constructii-legislatie-ro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Browse issues</a>
      </div>
    </section>
  )
}
