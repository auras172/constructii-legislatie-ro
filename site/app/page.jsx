import { getActs, getProjectOverview } from '@/lib/content'

export const dynamic = 'force-static'

export default function HomePage() {
  const acts = getActs()
  const overview = getProjectOverview()
  const importedCount = acts.filter((act) => act.textImported).length

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Open-source, versioned construction legislation for Romania.</h1>
          <p>
            Structured for humans, Git, search, and AI. Built as neutral infrastructure for builders,
            engineers, architects, contractors, legal researchers, and AI builders.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="https://github.com/auras172/constructii-legislatie-ro">View on GitHub</a>
            <a className="button secondary" href="/legislation/">Explore index</a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Repository status summary">
          <div>
            <span className="metric">{acts.length}</span>
            <span className="metric-label">tracked act</span>
          </div>
          <div>
            <span className="metric">{importedCount}</span>
            <span className="metric-label">official text import</span>
          </div>
          <div>
            <span className="metric">MIT</span>
            <span className="metric-label">repo license</span>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <article>
          <h2>Why Git?</h2>
          <p>{overview.readme.intro}</p>
          <p>Git history makes source-backed changes reviewable, reversible, and useful for future automation.</p>
        </article>
        <article>
          <h2>Vision</h2>
          <p>{overview.vision?.intro ?? 'A public infrastructure layer for Romanian construction legislation.'}</p>
        </article>
        <article>
          <h2>No legal advice</h2>
          <p>{overview.disclaimer.intro}</p>
        </article>
      </section>

      <section className="feature-band">
        <div>
          <h2>What can be built on top?</h2>
          <p>Search, article-level citations, change alerts, RAG systems, compliance checklists, and open datasets for research.</p>
        </div>
        <a className="button primary" href="/contribute/">Start contributing</a>
      </section>
    </>
  )
}
