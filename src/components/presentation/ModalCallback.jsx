import React from 'react';

/**
 * ModalCallback Component
 * 
 * Provides interactive feedback when triggering action callbacks
 * like 'Launch Live Explorer', 'Launch Mission Control', 'Close', or 'Finish'.
 * Seamlessly hooks into parent dashboard integration or operates standalone.
 */
export function ModalCallback({ modalData, onCloseModal }) {
  if (!modalData) return null;

  const { title, badge, message, details, actionText, onAction } = modalData;

  return (
    <div className="modal-overlay" onClick={onCloseModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <span className="text-cyan">◈</span>
          <span>{title}</span>
          {badge && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                background: 'rgba(0, 240, 255, 0.12)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 240, 255, 0.3)'
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <p className="modal-body">{message}</p>

        {details && (
          <div
            style={{
              background: 'rgba(5, 9, 22, 0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.85rem',
              marginBottom: '1.25rem',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)'
            }}
          >
            {details}
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="hud-btn" onClick={onCloseModal}>
            Dismiss
          </button>
          {actionText && (
            <button
              type="button"
              className="hud-btn hud-btn-cyan"
              onClick={() => {
                if (onAction) onAction();
                onCloseModal();
              }}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalCallback;
