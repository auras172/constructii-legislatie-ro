import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Legislație Construcții România',
  description: 'Legislație românească de construcții, open-source și versionată — structurată pentru oameni, Git, căutare și AI.',
}

const navItems = [
  { href: '/', label: 'Acasă' },
  { href: '/legislation/', label: 'Index legislație' },
  { href: '/search/', label: 'Căutare' },
  { href: '/contribute/', label: 'Contribuie' },
  { href: '/about/', label: 'Despre' },
]

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" width="18" height="18">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.87c.68 0 1.36.09 2 .26 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body>
        <header className="site-header">
          <a className="brand" href="/" aria-label="Legislație Construcții România - acasă">
            <span className="brand-mark">CL</span>
            <span>
              <strong>Legislație Construcții România</strong>
              <small>constructii-legislatie-ro</small>
            </span>
          </a>
          <nav className="site-nav" aria-label="Navigare principală">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>
          <a className="github-link" href="https://github.com/auras172/constructii-legislatie-ro" aria-label="Deschide repository-ul pe GitHub">
            <GitHubIcon />
            <span>GitHub</span>
          </a>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>Nu constituie consultanță juridică. Nu este o sursă oficială a statului. Verificați întotdeauna cu sursele oficiale.</p>
          <div className="footer-links">
            <a href="https://github.com/auras172/constructii-legislatie-ro">
              <GitHubIcon />
              <span>Contribuie pe GitHub</span>
            </a>
            <a href="https://opensource.org/licenses/MIT" aria-label="Licență MIT">
              <img
                src="https://img.shields.io/badge/Licen%C8%9B%C4%83-MIT-yellow.svg"
                alt="Licență MIT"
                width="90"
                height="20"
                loading="lazy"
              />
            </a>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
