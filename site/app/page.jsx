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
          <h1>Legislație românească de construcții — open-source și versionată.</h1>
          <p>
            Structurată pentru oameni, Git, căutare și AI. Infrastructură neutră pentru constructori,
            ingineri, arhitecți, antreprenori, cercetători juridici și dezvoltatori AI.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="https://github.com/auras172/constructii-legislatie-ro">Vezi pe GitHub</a>
            <a className="button secondary" href="/legislation/">Explorează indexul</a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Rezumat stare repository">
          <div>
            <span className="metric">{acts.length}</span>
            <span className="metric-label">acte urmărite</span>
          </div>
          <div>
            <span className="metric">{importedCount}</span>
            <span className="metric-label">texte importate oficial</span>
          </div>
          <div>
            <span className="metric">MIT</span>
            <span className="metric-label">licență repo</span>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <article>
          <h2>De ce Git?</h2>
          <p>{overview.readme.intro}</p>
          <p>Istoricul Git face ca modificările cu sursă să fie verificabile, reversibile și utile pentru automatizări viitoare.</p>
        </article>
        <article>
          <h2>Viziune</h2>
          <p>{overview.vision?.intro ?? 'Un strat de infrastructură publică pentru legislația română de construcții.'}</p>
        </article>
        <article>
          <h2>Fără consultanță juridică</h2>
          <p>{overview.disclaimer.intro}</p>
        </article>
      </section>

      <section className="feature-band">
        <div>
          <h2>Ce poate fi construit deasupra?</h2>
          <p>Căutare, citări la nivel de articol, alerte la modificări, sisteme RAG, liste de conformitate și seturi de date deschise pentru cercetare.</p>
        </div>
        <a className="button primary" href="/contribute/">Începe să contribui</a>
      </section>
    </>
  )
}
