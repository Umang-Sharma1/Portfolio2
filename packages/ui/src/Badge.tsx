import styled from 'styled-components';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;

  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
          padding: 0.125rem 0.5rem;
          font-size: 0.75rem;
        `;
      case 'lg':
        return `
          padding: 0.5rem 1rem;
          font-size: 1rem;
        `;
      default:
        return `
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
        `;
    }
  }}

  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'secondary':
        return `
          background: #e5e7eb;
          color: #4b5563;
        `;
      case 'success':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'warning':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'danger':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'outline':
        return `
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

export function Badge({ variant = 'default', size = 'md', children, className }: BadgeProps) {
  return (
    <StyledBadge variant={variant} size={size} className={className}>
      {children}
    </StyledBadge>
  );
}
