import { useState, useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'

const SAMPLE_TEXTS = [
  'Innovate', 'Create', 'Design', 'Future', 'Tech',
  'Code', 'Build', 'Dream', 'Explore', 'Inspire',
  'Vision', 'Logic', 'Magic', 'Clean', 'Modern'
]

export function PreviewItem({ text, design, aspectRatio }) {
  const [isExporting, setIsExporting] = useState(false)
  const cardRef = useRef(null)

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || !text) return

    setIsExporting(true)
    try {
      const fileName = text.replace(/\s+/g, '_') + '.png'
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = fileName
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setIsExporting(false)
    }
  }, [text])

  return (
    <div className="demo-item fade-in">
      <div className="preview-card-wrapper">
        <div ref={cardRef} className={`preview-card${aspectRatio !== 'auto' ? ` aspect-${aspectRatio}` : ''}`} id="export-card">
          {design === 'glass' ? (
            <>
              <div className="orb orb-purple"></div>
              <div className="orb orb-pink"></div>
              <div className="orb orb-cyan"></div>
              <div className="glass-overlay">
                <div className="glass-frost"></div>
                <div className="glass-content">
                  <div className="glass-text">{text}</div>
                  <div className="glass-accent-line"></div>
                </div>
              </div>
            </>
          ) : (
            <div className={`design-layer design-${design}`}>
              {design === 'neon-glow' && (
                <>
                  <div className="neon-orb neon-cyan-orb"></div>
                  <div className="neon-orb neon-pink-orb"></div>
                </>
              )}
              <div className="design-content">
                <div className={`design-text text-${design}`}>{text}</div>
                <div className={`design-accent accent-${design}`}></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        className="demo-download-btn"
        onClick={handleDownload}
        disabled={isExporting}
        title="Download"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  )
}

export default function DemoGrid({ design, aspectRatio }) {
  return (
    <div className="demo-grid fade-in">
      {SAMPLE_TEXTS.map((text, i) => (
        <PreviewItem key={i} text={text} design={design} aspectRatio={aspectRatio} />
      ))}
    </div>
  )
}
