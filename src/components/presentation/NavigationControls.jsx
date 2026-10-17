import React from 'react';

/**
 * NavigationControls Component
 * 
 * Manages presentation navigation:
 * - Top HUD header with brand beacon, slide timeline pills, fullscreen toggle, and close/finish actions.
 * - Bottom persistent navigation bar with telemetry status, slide counter, and arrow navigation cluster.
 * 
 * Supports slot="header" or slot="footer" for clean flexbox shell integration.
 */
export function NavigationControls({
  slot,
  currentSlide,
  totalSlides,
  slidesMeta = [],
  onPrev,
  onNext,
  onSelectSlide,
  onClose,
  onFinish,
  isFullscreen,
  onToggleFullscreen
}) {
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  const renderHeader = () => (
    <header className="pres-header presentation-header">
      <div className="pres-header-left">
        <div className="brand-badge">
          <span className="brand-beacon"></span>
          <span>ADITI</span>
        </div>
        <span className="project-tag">
          Assistive Smart-Glasses System • Final Presentation
        </span>
      </div>

      {/* Center: Slide timeline pill indicators */}
      <div className="pres-header-center">
        <div className="slide-dots-container" role="tablist" aria-label="Slides navigation">
          {slidesMeta.map((slide, idx) => (
            <button
              key={slide.id || idx}
              type="button"
              role="tab"
              aria-selected={idx === currentSlide}
              aria-label={`Slide ${idx + 1}: ${slide.title}`}
              className={`slide-dot-pill ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => onSelectSlide(idx)}
              title={`${idx + 1}. ${slide.title}`}
            />
          ))}
        </div>
      </div>

      {/* Right HUD Action Buttons */}
      <div className="pres-header-right">
        <button
          type="button"
          className="hud-btn"
          onClick={onToggleFullscreen}
          title="Toggle Fullscreen Mode"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isFullscreen ? (
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            ) : (
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            )}
          </svg>
          <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
        </button>

        {isLastSlide ? (
          <button
            type="button"
            className="hud-btn hud-btn-magenta"
            onClick={onFinish}
          >
            <span>Finish Presentation</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="hud-btn"
            onClick={onClose}
            title="Close Presentation View"
          >
            <span>✕ Close</span>
          </button>
        )}
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="pres-footer-bar presentation-footer">
      <div className="footer-telemetry">
        <div className="telemetry-item">
          <span style={{ color: 'var(--accent-cyan)' }}>●</span>
          <span>SYSTEM: ONLINE</span>
        </div>
        <div className="telemetry-item">
          <span>MODE: INTERACTIVE HUD</span>
        </div>
        <div className="telemetry-item">
          <span>PORT: 5176</span>
        </div>
      </div>

      {/* Navigation Arrows Cluster */}
      <div className="nav-cluster">
        <button
          type="button"
          className="nav-arrow-btn"
          onClick={onPrev}
          disabled={isFirstSlide}
          aria-label="Previous Slide"
          title="Previous Slide (Left Arrow)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="slide-counter-display">
          <span className="text-cyan">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
          <span>{String(totalSlides).padStart(2, '0')}</span>
          <span className="key-hint">← →</span>
        </div>

        <button
          type="button"
          className="nav-arrow-btn"
          onClick={onNext}
          disabled={isLastSlide}
          aria-label="Next Slide"
          title="Next Slide (Right Arrow)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </footer>
  );

  if (slot === 'header') return renderHeader();
  if (slot === 'footer') return renderFooter();

  return (
    <>
      {renderHeader()}
      {renderFooter()}
    </>
  );
}

export default NavigationControls;
