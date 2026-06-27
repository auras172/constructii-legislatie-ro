import { getActs } from '@/lib/content'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Legislation index | Open Construction Law Romania',
}

export default function LegislationPage() {
  const acts = getActs()

  return (
    <section className="page-shell">
      <div className="page-heading">
        <h1>Legislation index</h1>
        <p>Current repository acts and metadata, generated from the repository files at build time.</p>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Act</th>
              <th>Domain</th>
              <th>Status</th>
              <th>Text</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {acts.map((act) => (
              <tr key={act.slug}>
                <td>
                  <strong>{act.shortTitle}</strong>
                  <span>{act.title}</span>
                  <small>{act.articleCount} articles · {act.annexCount} annexes</small>
                </td>
                <td>{act.domain}</td>
                <td>{act.status}</td>
                <td>{act.textImported ? 'Imported' : 'Metadata only'}</td>
                <td><a href={act.sourceUrl}>Official source</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="note-box">
        <p>Legal text is not reproduced on this website page. Use the GitHub repository to inspect Markdown, metadata, import logs, and diffs.</p>
        <a href="https://github.com/auras172/constructii-legislatie-ro/tree/main/legi">Open legal act files on GitHub</a>
      </div>
    </section>
  )
}
