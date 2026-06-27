import { getActBySlug, getActSlugs, getImportLogs } from '@/lib/content'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getActSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const act = getActBySlug(params.slug)
  if (!act) return {}
  return {
    title: `Proveniență ${act.shortTitle} | Legislație Construcții România`,
  }
}

export default function ProvenancePage({ params }) {
  const act = getActBySlug(params.slug)
  if (!act) notFound()

  const logs = getImportLogs(params.slug)
  if (logs.length === 0) notFound()

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <h1>Proveniență — {act.shortTitle}</h1>
        <p>Jurnale tehnice de import pentru textul oficial al acestui act.</p>
      </div>

      <div className="breadcrumb">
        <a href="/legislation/">Index legislație</a>
        {' › '}
        <a href={`/legislation/${params.slug}/`}>{act.shortTitle}</a>
        {' › '}
        <span>Proveniență</span>
      </div>

      {logs.map((log) => (
        <article key={log.filename} className="prose-card">
          <div className="provenance-header">
            <h2>Import din {log.date}</h2>
            <a href={log.githubUrl} target="_blank" rel="noopener noreferrer" className="github-link">
              Vezi pe GitHub ↗
            </a>
          </div>
          <pre className="provenance-log">{log.content}</pre>
        </article>
      ))}

      <div className="note-box">
        <p>Jurnalele de proveniență sunt înregistrări tehnice, nu comentariu juridic. Sursa oficială rămâne autoritară.</p>
      </div>
    </section>
  )
}
