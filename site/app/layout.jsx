import './globals.css'

export const metadata = {
  title: 'Open Construction Law Romania',
  description: 'Open-source, versioned construction legislation for Romania, structured for humans, Git, search, and AI.',
}

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/legislation/', label: 'Legislation' },
  { href: '/contribute/', label: 'Contribute' },
  { href: '/about/', label: 'About' },
]

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <a className="brand" href="/" aria-label="Open Construction Law Romania home">
            <span className="brand-mark">CL</span>
            <span>
              <strong>Open Construction Law Romania</strong>
              <small>constructii-legislatie-ro</small>
            </span>
          </a>
          <nav className="site-nav" aria-label="Main navigation">
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
          <p>Not legal advice. Not an official government source. Always verify with official sources.</p>
          <a href="https://github.com/auras172/constructii-legislatie-ro">Contribute on GitHub</a>
        </footer>
      </body>
    </html>
  )
}
