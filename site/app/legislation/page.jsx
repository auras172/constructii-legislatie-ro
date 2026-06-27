import { getActs } from '@/lib/content'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Index legislație | Legislație Construcții România',
}

export default function LegislationPage() {
  const acts = getActs()

  return (
    <section className="page-shell">
      <div className="page-heading">
        <h1>Index legislație</h1>
        <p>Acte și metadate curente din repository, generate din fișierele repo la build time.</p>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Act</th>
              <th>Domeniu</th>
              <th>Statut</th>
              <th>Text</th>
              <th>Sursă</th>
            </tr>
          </thead>
          <tbody>
            {acts.map((act) => (
              <tr key={act.slug}>
                <td>
                  <a href={`/legislation/${act.slug}/`}><strong>{act.shortTitle}</strong></a>
                  <span>{act.title}</span>
                  {act.textImported && <small>{act.articleCount} articole · {act.annexCount} anexe</small>}
                </td>
                <td>{act.domain}</td>
                <td>{act.status}</td>
                <td>{act.textImported ? 'Importat' : 'Doar metadate'}</td>
                <td><a href={act.sourceUrl} target="_blank" rel="noopener noreferrer">Sursă oficială ↗</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="note-box">
        <p>Textul juridic nu este reprodus pe această pagină web. Folosiți repository-ul GitHub pentru a inspecta Markdown, metadate, jurnale de import și diff-uri.</p>
        <a href="https://github.com/auras172/constructii-legislatie-ro/tree/main/legi">Deschide fișierele actelor pe GitHub</a>
      </div>
    </section>
  )
}
