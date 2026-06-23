import { forwardRef } from 'react';
import './ui-components.css';

const Input = forwardRef(({ 
  label, 
  icon, 
  error, 
  className = '', 
  wrapperClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`ui-input-wrapper ${wrapperClassName}`}>
      {label && <label className="ui-input-label">{label}</label>}
      <div className="ui-input-container">
        {icon && <i className={`ui-input-icon ${icon}`}></i>}
        <input 
          ref={ref}
          className={`ui-input ${icon ? 'has-icon' : ''} ${error ? 'is-invalid' : ''} ${className}`} 
          {...props} 
        />
      </div>
      {error && <span className="ui-input-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
