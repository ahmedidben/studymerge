import { useState, useEffect } from 'react'
import { mergeImages } from './mergeImage'
import { useTrials } from './useTrials'
import { extractTextFromImages } from './extractText'

type ImageFile = {
  id: number
  file: File
  url: string
}

function App() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedText, setExtractedText] = useState<string>('')
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'merge' | 'ocr'>('merge')
  const [isLight, setIsLight] = useState(false)

  const { trialsLeft, hasTrials, useTrial } = useTrials()

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light')
    } else {
      document.body.classList.remove('light')
    }
  }, [isLight])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newImages: ImageFile[] = Array.from(files).map((file, index) => ({
      id: index,
      file: file,
      url: URL.createObjectURL(file)
    }))
    setImages(newImages)
    setExtractedText('')
  }

  const handleMerge = async () => {
    if (!hasTrials) return
    setIsMerging(true)
    const urls = images.map((image) => image.url)
    const mergedUrl = await mergeImages(urls)
    const link = document.createElement('a')
    link.href = mergedUrl
    link.download = 'studymerge-result.png'
    link.click()
    useTrial()
    window.open('https://chatgpt.com', '_blank')
    setIsMerging(false)
  }

  const handleExtractText = async () => {
    if (images.length === 0) return
    setIsExtracting(true)
    setExtractedText('')
    const results = await extractTextFromImages(
      images.map((img) => ({ id: img.id, url: img.url }))
    )
    const combined = results
      .map((r) => `--- Image ${r.imageId + 1} ---\n${r.text}`)
      .join('\n\n')
    setExtractedText(combined)
    setIsExtracting(false)
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied! Send it to your friends 🎉')
  }

  const handleOpenChatGPT = () => {
    window.open('https://chatgpt.com', '_blank')
  }

  const linkedInStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    transition: 'border-color 0.2s ease, background 0.2s ease'
  }

  return (
    <>
      <div
        className="cursor-glow"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      <div
        className="app-container"
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '40px 24px',
          position: 'relative',
          zIndex: 1
        }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '36px' }}>
          <div
            className="app-header"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              gap: '12px'
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                background: 'linear-gradient(135deg, #7F77DD, #a78bfa)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '700',
                boxShadow: '0 0 20px rgba(127,119,221,0.4)',
                flexShrink: 0
              }}>S</div>
              <h1
                className="app-title"
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  background: 'linear-gradient(90deg, #7F77DD, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>StudyMerge</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className={trialsLeft <= 3 ? 'pulse' : ''}
                style={{
                  background: trialsLeft <= 3 ? '#450a0a' : 'var(--badge-bg)',
                  color: trialsLeft <= 3 ? '#fca5a5' : 'var(--badge-color)',
                  fontSize: '12px',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  fontWeight: '500',
                  border: `1px solid ${trialsLeft <= 3 ? '#7f1d1d' : 'var(--badge-border)'}`,
                  whiteSpace: 'nowrap'
                }}>
                {trialsLeft} free merge{trialsLeft !== 1 ? 's' : ''} left
              </span>

              <button
                className="theme-toggle"
                onClick={() => setIsLight(!isLight)}
                title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {isLight ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', paddingLeft: '50px' }}>
            Upload screenshots → merge into one image → send to AI
          </p>
        </div>

        {/* ── No trials warning ── */}
        {!hasTrials && activeTab === 'merge' && (
          <div style={{
            background: 'rgba(127,119,221,0.06)',
            border: '1px solid rgba(127,119,221,0.2)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</p>
            <p style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '6px', fontWeight: '600' }}>
              You used all 10 free merges
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Share StudyMerge with a friend — it's free for them too
            </p>
            <button
              className="share-btn"
              onClick={handleShare}
              style={{
                padding: '10px 28px',
                background: 'transparent',
                color: '#a78bfa',
                border: '1px solid #7F77DD',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>
              Share with a friend
            </button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          background: 'var(--bg-tab)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-tab)'
        }}>
          <button
            onClick={() => setActiveTab('merge')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'merge'
                ? 'linear-gradient(135deg, #7F77DD, #a78bfa)'
                : 'transparent',
              color: activeTab === 'merge' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}>
            ✦ Merge Images
          </button>

          <button
            onClick={() => setActiveTab('ocr')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'ocr'
                ? 'linear-gradient(135deg, #7F77DD, #a78bfa)'
                : 'transparent',
              color: activeTab === 'ocr' ? 'white' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '9px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}>
            ⌨ Extract Text
          </button>
        </div>

        {/* ── Upload area ── */}
        <label
          className="upload-label"
          style={{
            display: 'block',
            border: '1.5px dashed var(--border)',
            borderRadius: '20px',
            padding: '52px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '24px',
            background: 'var(--bg-upload)',
            backdropFilter: 'blur(10px)',
          }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(127,119,221,0.1)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="10" width="28" height="22" rx="4" stroke="#a78bfa" strokeWidth="1.5"/>
              <circle cx="15" cy="18" r="3" stroke="#a78bfa" strokeWidth="1.2"/>
              <path d="M6 26l8-6 6 5 5-4 9 7" stroke="#a78bfa" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: '15px', marginBottom: '6px', fontWeight: '500' }}>
            Click to upload images
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            PNG, JPG, WEBP — up to 10 images
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </label>

        {/* ── Image count badge ── */}
        {images.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {images.length} image{images.length > 1 ? 's' : ''} ready
            </p>
            <span style={{
              background: 'rgba(127,119,221,0.1)',
              color: '#a78bfa',
              fontSize: '12px',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: '500',
              border: '1px solid rgba(127,119,221,0.2)'
            }}>
              {images.length <= 4 ? '2×2 grid' : '3×3 grid'}
            </span>
          </div>
        )}

        {/* ── Grid preview ── */}
        {images.length > 0 && (
          <div
            className={images.length === 1 ? 'grid-single-col' : ''}
            style={{
              display: 'grid',
              gridTemplateColumns: images.length <= 4 ? '1fr 1fr' : '1fr 1fr 1fr',
              gap: '10px',
              marginBottom: '28px'
            }}>
            {images.map((image, i) => (
              <div
                key={image.id}
                className="image-card"
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-card)',
                  animationDelay: `${i * 0.05}s`,
                  opacity: 0
                }}>
                <img
                  src={image.url}
                  alt={`Image ${image.id + 1}`}
                  className="grid-image"
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '500',
                  padding: '16px 10px 8px',
                }}>
                  Image {image.id + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MERGE TAB ── */}
        {activeTab === 'merge' && images.length > 0 && (
          <button
            className="merge-btn"
            onClick={handleMerge}
            disabled={isMerging || !hasTrials}
            style={{
              width: '100%',
              padding: '16px',
              background: !hasTrials
                ? 'var(--bg-card)'
                : 'linear-gradient(135deg, #7F77DD, #a78bfa)',
              color: !hasTrials ? 'var(--text-muted)' : 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: !hasTrials || isMerging ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: hasTrials ? '0 0 30px rgba(127,119,221,0.3)' : 'none',
              letterSpacing: '0.2px',
              fontFamily: 'inherit'
            }}>
            {isMerging ? '⏳ Merging your images...' : !hasTrials ? 'No merges left' : '✦ Merge & Open in ChatGPT'}
          </button>
        )}

        {/* ── OCR TAB ── */}
        {activeTab === 'ocr' && (
          <div>
            {images.length > 0 && (
              <button
                className="merge-btn"
                onClick={handleExtractText}
                disabled={isExtracting}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isExtracting
                    ? '#4a4490'
                    : 'linear-gradient(135deg, #7F77DD, #a78bfa)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isExtracting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 0 30px rgba(127,119,221,0.3)',
                  fontFamily: 'inherit',
                  marginBottom: '16px'
                }}>
                {isExtracting ? '⏳ Reading your images...' : '⌨ Extract Text from Images'}
              </button>
            )}

            {extractedText !== '' && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    Extracted text
                  </p>
                  <span style={{
                    background: 'rgba(127,119,221,0.1)',
                    color: '#a78bfa',
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    border: '1px solid rgba(127,119,221,0.2)'
                  }}>
                    {extractedText.length} characters
                  </span>
                </div>
                <textarea
                  readOnly
                  value={extractedText}
                  style={{
                    width: '100%',
                    minHeight: '180px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-area)',
                    fontSize: '13px',
                    lineHeight: '1.7',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            )}

            {extractedText !== '' && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="merge-btn"
                  onClick={handleCopyText}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: copied
                      ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                      : 'rgba(127,119,221,0.1)',
                    color: copied ? 'white' : '#a78bfa',
                    border: '1px solid rgba(127,119,221,0.2)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease'
                  }}>
                  {copied ? '✓ Copied!' : 'Copy Text'}
                </button>

                <button
                  className="merge-btn"
                  onClick={handleOpenChatGPT}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #7F77DD, #a78bfa)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 0 20px rgba(127,119,221,0.3)'
                  }}>
                  Open ChatGPT ↗
                </button>
              </div>
            )}

            {images.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Upload images above to extract text from them
              </p>
            )}
          </div>
        )}

        {/* ── Empty state ── */}
        {images.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button
              className="share-btn"
              onClick={handleShare}
              style={{
                padding: '8px 20px',
                background: 'transparent',
                color: '#7F77DD',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}>
              Share StudyMerge ↗
            </button>
          </div>
        )}

        {/* ── Footer signature ── */}
        <div style={{
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Built for students, by a student ♥
          </p>

          
            <a href="https://linkedin.com/in/ahmed-amine-id-benadi-02baba262"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#7F77DD'
              e.currentTarget.style.background = 'rgba(127,119,221,0.08)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = ''
              e.currentTarget.style.background = ''
            }}
            style={linkedInStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#a78bfa">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Ahmed Amine ID-BENADI
            </span>
          </a>
        </div>
      </div>
    </>
  )
}

export default App