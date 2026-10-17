import React, { useState, useEffect, useCallback, useRef } from 'react';
import slides from './slides';
import NavigationControls from './NavigationControls';
import ModalCallback from './ModalCallback';
import './slideStyles/presentation.css';
import './slideStyles/slides.css';

/**
 * PresentationDeck Component
 * 
 * Standalone & embeddable cinematic presentation engine.
 * Supports:
 * - 11 modular slides with unique layouts
 * - 3-part responsive flex layout (Header, Scrollable Viewport, Footer)
 * - Automatic scroll-reset to top on slide transitions
 * - Keyboard navigation (ArrowLeft, ArrowRight, Home, End, F)
 * - Fullscreen mode toggle
 * - Configurable action callbacks (onClose, onFinish, onLaunchExplorer, onLaunchMissionControl)
 * - Standalone notification modal fallback for dashboard callbacks
 */
export function PresentationDeck({
  initialSlide = 0,
  onClose,
  onFinish,
  onLaunchExplorer,
  onLaunchMissionControl,
  isEmbedded = false
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlide);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const viewportRef = useRef(null);

  const totalSlides = slides.length;
  const activeSlideMeta = slides[currentSlideIndex] || slides[0];
  const SlideComponent = activeSlideMeta.component;

  // Reset scroll position to top whenever slide changes
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentSlideIndex]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleSelectSlide = useCallback((index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
    }
  }, [totalSlides]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }, []);

  // Listen to fullscreen changes (e.g. user presses Esc in browser)
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Keyboard Navigation: ArrowLeft/ArrowRight change slides, allowing ArrowUp/ArrowDown/Space/PageUp/PageDown to scroll content
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if focus is on an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlideIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlideIndex(totalSlides - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleToggleFullscreen, totalSlides]);

  // Action Callback Interceptors (Invokes prop callback, or falls back to interactive modal)
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setModalData({
        title: 'Close Presentation',
        badge: 'ACTION: CLOSE',
        message: 'This callback notifies the host dashboard to exit the presentation view.',
        details: 'Configured hook: props.onClose() • Currently operating in standalone viewer mode.',
        actionText: 'Return to Slide 1',
        onAction: () => setCurrentSlideIndex(0)
      });
    }
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      setModalData({
        title: 'Presentation Completed',
        badge: 'MISSION ACCOMPLISHED',
        message: 'You have reached the end of the ADITI final-year capstone engineering presentation.',
        details: 'All 11 slides reviewed • Ready for Q&A session and technical defense.',
        actionText: 'Restart Presentation',
        onAction: () => setCurrentSlideIndex(0)
      });
    }
  };

  const handleLaunchExplorerAction = (payload) => {
    if (onLaunchExplorer) {
      onLaunchExplorer(payload);
    } else {
      setModalData({
        title: 'Live Subsystem Explorer Triggered',
        badge: 'EXPLORER HOOK',
        message: `Dispatched explorer inspection request for subsystem: "${payload?.component || 'Optics'}".`,
        details: 'Configured hook: props.onLaunchExplorer(payload) • In integrated mode, this opens the full interactive 3D CAD dashboard.',
        actionText: 'Acknowledge'
      });
    }
  };

  const handleLaunchMissionControlAction = (payload) => {
    if (onLaunchMissionControl) {
      onLaunchMissionControl(payload);
    } else {
      setModalData({
        title: 'Mission Control Simulator Launched',
        badge: 'SIMULATOR HOOK',
        message: 'Dispatched live telemetry session to the integrated Mission Control operations room.',
        details: 'Configured hook: props.onLaunchMissionControl(payload) • In integrated mode, this boots the real-time sensor stream monitor.',
        actionText: 'Acknowledge'
      });
    }
  };

  return (
    <div className={`presentation-root presentation-shell ${isEmbedded ? 'embedded-mode' : ''}`}>
      {/* 1. Persistent Top HUD Header */}
      <NavigationControls
        slot="header"
        currentSlide={currentSlideIndex}
        totalSlides={totalSlides}
        slidesMeta={slides}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelectSlide={handleSelectSlide}
        onClose={handleClose}
        onFinish={handleFinish}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 2. Main Scrollable Slide Viewport */}
      <main ref={viewportRef} className="slide-viewport presentation-content">
        <div key={activeSlideMeta.id} className="slide-content-wrapper">
          {/* Slide Meta Header */}
          <div className="slide-meta-header">
            <div className="slide-index-chip">
              <span>SLIDE {String(activeSlideMeta.number).padStart(2, '0')}</span>
              <span style={{ color: 'var(--text-muted)' }}>|</span>
              <span className="slide-category-tag">{activeSlideMeta.category}</span>
            </div>
            <div className="slide-title-wrap">
              <h2>{activeSlideMeta.title}</h2>
            </div>
          </div>

          {/* Active Slide Component Body */}
          <div className="slide-component-host">
            <SlideComponent
              onLaunchExplorer={handleLaunchExplorerAction}
              onLaunchMissionControl={handleLaunchMissionControlAction}
              onFinish={handleFinish}
            />
          </div>
        </div>
      </main>

      {/* 3. Persistent Bottom Navigation Footer */}
      <NavigationControls
        slot="footer"
        currentSlide={currentSlideIndex}
        totalSlides={totalSlides}
        slidesMeta={slides}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelectSlide={handleSelectSlide}
        onClose={handleClose}
        onFinish={handleFinish}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Interactive Modal Callback Dialog for Standalone Mode */}
      <ModalCallback
        modalData={modalData}
        onCloseModal={() => setModalData(null)}
      />
    </div>
  );
}

export default PresentationDeck;
