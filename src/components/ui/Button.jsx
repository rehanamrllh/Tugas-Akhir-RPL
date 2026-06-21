import './ui-components.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className = '', 
  ...props 
}) {
  const baseClass = `ui-btn ui-btn-${variant} ui-btn-${size} ${className}`;
  
  return (
    <button className={baseClass.trim()} {...props}>
      {icon && <i className={icon}></i>}
      {children}
    </button>
  );
}
