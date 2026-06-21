import './ui-components.css';

export default function Input({ 
  label, 
  icon, 
  error, 
  className = '', 
  wrapperClassName = '',
  ...props 
}) {
  return (
    <div className={`ui-input-wrapper ${wrapperClassName}`}>
      {label && <label className="ui-input-label">{label}</label>}
      <div className="ui-input-container">
        {icon && <i className={`ui-input-icon ${icon}`}></i>}
        <input 
          className={`ui-input ${icon ? 'has-icon' : ''} ${error ? 'is-invalid' : ''} ${className}`} 
          {...props} 
        />
      </div>
      {error && <span className="ui-input-error">{error}</span>}
    </div>
  );
}
