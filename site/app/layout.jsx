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
          <a className="github-link" href="https://github.com/auras172/constructii-legislatie-ro">
            GitHub
          </a>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>Nu constituie consultanță juridică. Nu este o sursă oficială a statului. Verificați întotdeauna cu sursele oficiale.</p>
          <div className="footer-links">
            <a href="https://github.com/auras172/constructii-legislatie-ro">Contribuie pe GitHub</a>
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
