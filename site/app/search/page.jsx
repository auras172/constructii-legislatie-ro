'use client'

import { useEffect, useRef } from 'react'

export default function SearchPage() {
  const containerRef = useRef(null)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/pagefind/pagefind-ui.css'
    document.head.appendChild(link)

    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = () => {
      if (containerRef.current && window.PagefindUI) {
        new window.PagefindUI({ element: containerRef.current, showImages: false })
      }
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  return (
    <section className="page-shell">
      <div className="page-heading">
        <h1>Căutare</h1>
        <p>Caută în acte, metadate și documentație din repository.</p>
      </div>
      <div ref={containerRef} className="search-container" />
      <div className="note-box">
        <p>Căutarea este statică și funcționează offline după prima încărcare. Nu trimite date către servere externe.</p>
      </div>
    </section>
  )
}
