import { getProjectOverview } from '@/lib/content'

export const dynamic = 'force-static'

export const metadata = {
  title: 'About and disclaimer | Open Construction Law Romania',
}

export default function AboutPage() {
  const overview = getProjectOverview()

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <h1>About and disclaimer</h1>
        <p>This project is technical open-source infrastructure, not legal advice.</p>
      </div>

      <article className="prose-card">
        <h2>Purpose</h2>
        <p>{overview.readme.intro}</p>
        <h2>Disclaimer</h2>
        <p>{overview.disclaimer.intro}</p>
        <p>Official sources remain authoritative: Portal Legislativ, Monitorul Oficial, and relevant public authorities.</p>
        <h2>Neutral infrastructure</h2>
        <p>This repository is designed so other companies, researchers, contributors, and AI builders can reuse the structure without depending on Radar Meșeriași.</p>
      </article>

      <div className="note-box strong">
        <p>No database. No authentication. No chatbot. No legal advice. This website is a static public view over repository content.</p>
      </div>
    </section>
  )
}
