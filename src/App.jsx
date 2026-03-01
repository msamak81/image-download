import { useState, useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import './App.css'
import DemoGrid from './DemoGrid'

const ASPECT_RATIOS = [
  { label: 'Auto', value: 'auto' },
  { label: '1:1 — Square', value: '1-1' },
  { label: '4:3 — Standard', value: '4-3' },
  { label: '3:2 — Classic Photo', value: '3-2' },
  { label: '16:9 — Widescreen', value: '16-9' },
  { label: '21:9 — Ultra-wide', value: '21-9' },
  { label: '9:16 — Vertical / Story', value: '9-16' },
  { label: '2:3 — Portrait', value: '2-3' },
  { label: '3:4 — Tall Standard', value: '3-4' },
  { label: '4:5 — Social Portrait', value: '4-5' },
]

const DESIGNS = [
  { label: 'Glassmorphism', value: 'glass' },
  { label: 'Dynamic Gradient', value: 'gradient-dynamic' },
  { label: 'Solid Brand', value: 'solid-brand' },
  { label: 'Minimal Light', value: 'minimal-light' },
  { label: 'Minimal Dark', value: 'minimal-dark' },
  { label: 'Neon Glow', value: 'neon-glow' },
  { label: 'Neumorphism', value: 'neumorphism' },
]

function App() {
  const [text, setText] = useState('')
  const [aspectRatio, setAspectRatio] = useState('4-3')
  const [design, setDesign] = useState('glass')
  const [isExporting, setIsExporting] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const cardRef = useRef(null)

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || !text.trim()) return

    setIsExporting(true)

    try {
      const fileName = text.trim().replace(/\s+/g, '_') + '.png'
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
    <div className="app-container">
      {/* Header */}
      <header className="app-header fade-in">
        <h1 className="app-title">Text to Image</h1>
        <p className="app-subtitle">
          Type your text, preview it in style, and download as PNG
        </p>
      </header>

      {/* Input Section */}
      <div className="input-section fade-in">
        <div className="input-row">
          <div className="input-wrapper">
            <input
              id="text-input"
              type="text"
              className="text-input"
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              disabled={showDemo}
            />
          </div>
          <div className="select-wrapper">
            <select
              id="design-select"
              className="aspect-select"
              value={design}
              onChange={(e) => setDesign(e.target.value)}
            >
              {DESIGNS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <div className="select-wrapper">
            <select
              id="aspect-ratio-select"
              className="aspect-select"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
            >
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
            </select>
            <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <button
            className="download-btn demo-btn"
            style={{ padding: '0.9rem 1.5rem', borderRadius: '16px', minWidth: 'max-content' }}
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? 'Editor Mode' : 'View Demo Grid'}
          </button>
        </div>
      </div>

      {showDemo ? (
        <DemoGrid design={design} aspectRatio={aspectRatio} />
      ) : (
        <>
          {/* Preview Card — This is what gets exported */}
          <div className="preview-card-wrapper fade-in">
            <div ref={cardRef} className={`preview-card${aspectRatio !== 'auto' ? ` aspect-${aspectRatio}` : ''}`} id="export-card">
              {design === 'glass' ? (
                <>
                 
                  <div className="glass-overlay">
                     <div className="orb orb-purple"></div>
                  <div className="orb orb-pink"></div>
                  <div className="orb orb-cyan"></div>
                    <div className="glass-frost"></div>
                    <div className="glass-content">
                      {text.trim() ? (
                        <>
                          <div className="glass-text">{text}</div>
                          <div className="glass-accent-line"></div>
                        </>
                      ) : (
                        <span className="placeholder-text">
                          Your text will appear here...
                        </span>
                      )}
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
                    {text.trim() ? (
                      <>
                        <div className={`design-text text-${design}`}>{text}</div>
                        <div className={`design-accent accent-${design}`}></div>
                      </>
                    ) : (
                      <span className={`placeholder-text placeholder-${design}`}>
                        Your text will appear here...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Download Button */}
          <button
            id="download-btn"
            className="download-btn fade-in"
            onClick={handleDownload}
            disabled={!text.trim() || isExporting}
          >
            <svg
              className="download-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isExporting ? 'Exporting...' : 'Download PNG'}
          </button>
        </>
      )}
    </div>
  )
}

export default App
