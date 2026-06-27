import { getActBySlug, getActSlugs, getActs } from '@/lib/content'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getActSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }) {
  const act = getActBySlug(params.slug)
  if (!act) return {}
  return {
    title: `${act.shortTitle} | Legislație Construcții România`,
    description: act.title,
  }
}

const STATUS_LABEL = {
  active: 'În vigoare',
  repealed: 'Abrogat',
  partially_repealed: 'Parțial abrogat',
  unknown: 'Necunoscut',
}

const VERSION_KIND_LABEL = {
  original: 'Text original',
  republicat: 'Republicat',
  consolidat: 'Formă consolidată',
  'excerpt-only': 'Extras parțial',
}

const RELATION_LABEL = {
  relatedActs: 'Acte corelate',
  implements: 'Implementează',
  amends: 'Modifică',
  amendedBy: 'Modificat de',
}

function RelatedActsList({ slugs, allActs, relation }) {
  if (!slugs || slugs.length === 0) return null
  return (
    <div className="related-acts-group">
      <h3>{RELATION_LABEL[relation]}</h3>
      <ul>
        {slugs.map((slug) => {
          const related = allActs.find((a) => a.slug === slug)
          return (
            <li key={slug}>
              {related ? (
                <a href={`/legislation/${slug}/`}>
                  {related.shortTitle || related.canonicalCitation || slug}
                </a>
              ) : (
                <span>{slug}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function ActPage({ params }) {
  const act = getActBySlug(params.slug)
  if (!act) notFound()
  const allActs = getActs()
  const hasRelations =
    act.relatedActs?.length > 0 ||
    act.implements?.length > 0 ||
    act.amends?.length > 0 ||
    act.amendedBy?.length > 0

  const githubFileUrl = act.markdownPath
    ? `https://github.com/auras172/constructii-legislatie-ro/blob/main/${act.markdownPath}`
    : `https://github.com/auras172/constructii-legislatie-ro/blob/main/metadata/acts/${params.slug}.json`

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <h1>{act.shortTitle}</h1>
        {act.canonicalCitation && <p className="canonical-citation">{act.canonicalCitation}</p>}
        <p>{act.title}</p>
      </div>

      <div className="act-meta-grid">
        <dl>
          <div>
            <dt>Tip</dt>
            <dd>{act.type}</dd>
          </div>
          <div>
            <dt>Domeniu</dt>
            <dd>{act.domain}</dd>
          </div>
          <div>
            <dt>Statut</dt>
            <dd className={`status-badge status-${act.status}`}>{STATUS_LABEL[act.status] ?? act.status}</dd>
          </div>
          {act.issuer && (
            <div>
              <dt>Emitent</dt>
              <dd>{act.issuer}</dd>
            </div>
          )}
          {act.issueDate && (
            <div>
              <dt>Data emiterii</dt>
              <dd>{act.issueDate}</dd>
            </div>
          )}
          {act.versionKind && (
            <div>
              <dt>Versiune</dt>
              <dd>{VERSION_KIND_LABEL[act.versionKind] ?? act.versionKind}</dd>
            </div>
          )}
          {act.consolidatedAsOf && (
            <div>
              <dt>Consolidată până la</dt>
              <dd>{act.consolidatedAsOf}</dd>
            </div>
          )}
          {act.textImported && (
            <div>
              <dt>Structură</dt>
              <dd>{act.articleCount} articole · {act.annexCount} anexe</dd>
            </div>
          )}
          <div>
            <dt>Ultima verificare</dt>
            <dd>{act.lastChecked}</dd>
          </div>
        </dl>
      </div>

      <div className="act-actions">
        <a className="button primary" href={act.officialDetailUrl ?? act.sourceUrl} target="_blank" rel="noopener noreferrer">
          Sursă oficială ↗
        </a>
        <a className="button secondary" href={githubFileUrl} target="_blank" rel="noopener noreferrer">
          Fișier pe GitHub ↗
        </a>
        {act.importLogPaths.length > 0 && (
          <a className="button secondary" href={`/legislation/${params.slug}/provenance/`}>
            Proveniență
          </a>
        )}
      </div>

      {act.textImported ? (
        <div className="note-box">
          <p>Textul oficial este disponibil în fișierul Markdown din repository. Nu este reprodus pe această pagină.</p>
          <a href={githubFileUrl} target="_blank" rel="noopener noreferrer">Deschide textul oficial pe GitHub ↗</a>
        </div>
      ) : (
        <div className="note-box">
          <p>Acest act are doar intrare de metadate. Textul oficial nu a fost importat încă.</p>
        </div>
      )}

      {act.rightsNote && (
        <div className="note-box">
          <p>{act.rightsNote}</p>
        </div>
      )}

      {hasRelations && (
        <section className="related-acts">
          <h2>Acte corelate</h2>
          <RelatedActsList slugs={act.relatedActs} allActs={allActs} relation="relatedActs" />
          <RelatedActsList slugs={act.implements} allActs={allActs} relation="implements" />
          <RelatedActsList slugs={act.amends} allActs={allActs} relation="amends" />
          <RelatedActsList slugs={act.amendedBy} allActs={allActs} relation="amendedBy" />
        </section>
      )}

      {act.topics.length > 0 && (
        <div className="tag-list">
          {act.topics.map((t) => <span key={t} className="tag">{t}</span>)}
        </div>
      )}
    </section>
  )
}
