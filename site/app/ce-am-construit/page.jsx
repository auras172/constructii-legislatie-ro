import { getRepositoryStats } from '@/lib/content'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Ce am construit | Legislație Construcții România',
  description: 'O explicație pe înțelesul tuturor despre ce conține constructii-legislatie-ro și cum poate fi folosit.',
}

const milestones = [
  {
    title: 'Surse oficiale verificate',
    text: 'Fiecare act pornește de la Portal Legislativ, Monitorul Oficial sau pagini oficiale ale autorităților.',
  },
  {
    title: 'Metadate curate',
    text: 'Actele au titlu, domeniu, sursă, stare, date de verificare și relații în fișiere JSON validate.',
  },
  {
    title: 'Text oficial delimitat',
    text: 'Unde textul integral este importat, el stă separat în blocuri marcate și verificabile prin hash.',
  },
  {
    title: 'Graf de relații',
    text: 'Legile, ordinele și normativele sunt conectate doar când există dovadă sau o relație documentată.',
  },
]

const uses = [
  'cauți rapid actele importante pentru o lucrare',
  'vezi ce acte se modifică sau se leagă între ele',
  'diferențiezi textul oficial de notele comunității',
  'alimentezi aplicații, căutare sau AI cu surse verificabile',
]

const mermaid = `flowchart LR
  A["Surse oficiale<br/>Portal Legislativ, Monitorul Oficial, MDLPA, ANRE, ISCIR"]
  B["Repo Git<br/>metadate, text delimitat, jurnale de import"]
  C["Validare<br/>schema, hygiene, hashes, anchors"]
  D["Graph<br/>acte si relații confirmate"]
  E["Site public<br/>căutare și index"]
  F["Aplicații / AI<br/>Radar, RAG, checklists"]
  G["Oameni<br/>ingineri, arhitecți, antreprenori, juriști"]

  A --> B --> C --> D
  B --> E
  D --> F
  E --> G
  F --> G`

export default function WhatWeBuiltPage() {
  const stats = getRepositoryStats()

  return (
    <section className="public-explainer">
      <div className="explainer-hero">
        <div>
          <p className="eyebrow">Pe scurt</p>
          <h1>Am transformat legislația de construcții într-o bază verificabilă.</h1>
          <p>
            Nu este un chatbot și nu este consultanță juridică. Este o infrastructură
            publică: acte urmărite, surse, istoric, relații și verificări automate,
            puse într-o formă pe care oamenii și aplicațiile o pot citi.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/legislation/">Vezi actele urmărite</a>
            <a className="button secondary" href="/search/">Caută în index</a>
          </div>
        </div>

        <div className="explainer-scorecard" aria-label="Starea curentă a proiectului">
          <div>
            <strong>{stats.actsTotal}</strong>
            <span>acte urmărite</span>
          </div>
          <div>
            <strong>{stats.fullTextActs}</strong>
            <span>texte integrale</span>
          </div>
          <div>
            <strong>{stats.metadataOnlyActs}</strong>
            <span>metadata-only</span>
          </div>
          <div>
            <strong>{stats.healthScore}/100</strong>
            <span>health repo</span>
          </div>
        </div>
      </div>

      <div className="visual-map" aria-label="Cum circulă informația în proiect">
        <div className="map-node source">
          <span>1</span>
          <strong>Surse oficiale</strong>
          <small>Portal Legislativ, Monitorul Oficial, autorități</small>
        </div>
        <div className="map-line" aria-hidden="true" />
        <div className="map-node repo">
          <span>2</span>
          <strong>Repository Git</strong>
          <small>metadate, texte, import logs, istoric</small>
        </div>
        <div className="map-line" aria-hidden="true" />
        <div className="map-node checks">
          <span>3</span>
          <strong>Validare</strong>
          <small>schema, hash, anchors, hygiene</small>
        </div>
        <div className="map-line" aria-hidden="true" />
        <div className="map-node users">
          <span>4</span>
          <strong>Oameni + aplicații</strong>
          <small>căutare, graph, AI, Radar</small>
        </div>
      </div>

      <section className="explainer-grid">
        {milestones.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section className="plain-language">
        <div>
          <h2>Ce înseamnă asta pentru cineva non-tehnic?</h2>
          <p>
            În loc să ai o listă de PDF-uri, linkuri și note greu de urmărit,
            proiectul ține evidența într-un mod ordonat: ce act este, de unde
            vine, când a fost verificat, dacă avem text integral și ce alte acte
            sunt legate de el.
          </p>
        </div>
        <ul>
          {uses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="impact-strip" aria-label="Indicatori proiect">
        <div>
          <strong>{stats.domainsTotal}</strong>
          <span>domenii</span>
        </div>
        <div>
          <strong>{stats.importLogs}</strong>
          <span>jurnale de import</span>
        </div>
        <div>
          <strong>{stats.confirmedEdges}</strong>
          <span>relații confirmate</span>
        </div>
        <div>
          <strong>{stats.pendingEdges}</strong>
          <span>relații în review</span>
        </div>
        <div>
          <strong>{stats.articleAnchors}</strong>
          <span>ancore de articol</span>
        </div>
      </section>

      <section className="mermaid-section">
        <div>
          <p className="eyebrow">Pentru documentație</p>
          <h2>Modelul mental al proiectului</h2>
          <p>
            Aceeași hartă poate fi reutilizată în docs sau GitHub ca Mermaid:
            sursele oficiale intră în repo, repo-ul este verificat, apoi devine
            bază pentru site, graph, aplicații și agenți AI.
          </p>
        </div>
        <pre className="mermaid-card" aria-label="Mermaid graph source">
          <code>{mermaid}</code>
        </pre>
      </section>

      <section className="explainer-cta">
        <div>
          <h2>Ce nu face proiectul</h2>
          <p>
            Nu decide ce înseamnă legea, nu înlocuiește sursele oficiale și nu
            promite răspuns juridic automat. Rolul lui este să facă informația
            mai verificabilă, mai ușor de urmărit și mai sigură pentru reutilizare.
          </p>
        </div>
        <a className="button primary" href="/about/">Citește disclaimerul</a>
      </section>
    </section>
  )
}
