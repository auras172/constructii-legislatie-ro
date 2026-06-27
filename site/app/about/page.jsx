import { getProjectOverview } from '@/lib/content'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Despre și disclaimer | Legislație Construcții România',
}

export default function AboutPage() {
  const overview = getProjectOverview()

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <h1>Despre și disclaimer</h1>
        <p>Acest proiect este infrastructură tehnică open-source, nu consultanță juridică.</p>
      </div>

      <article className="prose-card">
        <h2>Scop</h2>
        <p>{overview.readme.intro}</p>
        <h2>Disclaimer</h2>
        <p>{overview.disclaimer.intro}</p>
        <p>Sursele oficiale rămân autoritare: Portal Legislativ, Monitorul Oficial și autoritățile publice relevante.</p>
        <h2>Infrastructură neutră</h2>
        <p>Acest repository este conceput astfel încât alte companii, cercetători, contribuitori și dezvoltatori AI să poată reutiliza structura fără să depindă de Radar Meșeriași.</p>
        <h2>Licență</h2>
        <p>
          Conținutul și codul sunt distribuite sub{' '}
          <a href="https://opensource.org/licenses/MIT">Licența MIT</a>.{' '}
          <img
            src="https://img.shields.io/badge/Licen%C8%9B%C4%83-MIT-yellow.svg"
            alt="Licență MIT"
            width="90"
            height="20"
            style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }}
          />
        </p>
      </article>

      <div className="note-box strong">
        <p>Fără bază de date. Fără autentificare. Fără chatbot. Fără consultanță juridică. Acest site este o vizualizare statică publică a conținutului din repository.</p>
      </div>
    </section>
  )
}
