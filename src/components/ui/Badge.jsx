import './ui-components.css';

export default function Badge({ 
  children, 
  variant = 'primary', 
  as = 'span', 
  className = '', 
  active = false,
  ...props 
}) {
  const Component = as;
  const baseClass = `ui-badge ui-badge-${variant} ${active ? 'active' : ''} ${className}`;
  
  return (
    <Component className={baseClass.trim()} {...props}>
      {children}
    </Component>
  );
}
