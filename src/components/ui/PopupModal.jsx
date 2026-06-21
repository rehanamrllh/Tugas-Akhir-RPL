import { useEffect, useState } from 'react';
import './ui-components.css';

export default function PopupModal({ 
  isOpen, 
  onClose, 
  title, 
  label, 
  children, 
  width = '500px',
  className = ''
}) {
  const [showAnim, setShowAnim] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowAnim(true), 10);
    } else {
      setShowAnim(false);
    }
  }, [isOpen]);

  if (!isOpen && !showAnim) return null;

  return (
    <div 
      className={`ui-modal-overlay ${showAnim ? 'show' : ''}`} 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`ui-modal-container ${className}`} style={{ maxWidth: width }}>
        <div className="ui-modal-header">
          <div className="ui-modal-title-group">
            {label && <div className="ui-modal-label">{label}</div>}
            {title && <h3 className="ui-modal-title">{title}</h3>}
          </div>
          <button className="ui-modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="ui-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
