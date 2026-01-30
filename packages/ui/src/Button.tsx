import styled from 'styled-components';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'default';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
}

const StyledButton = styled.button<Omit<ButtonProps, 'asChild'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  /* Sizes */
  ${(props) => {
    switch (props.size) {
      case 'sm':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return `
          padding: 1rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}

  /* Variants */
  ${(props) => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: #6b7280;
          color: white;
          &:hover:not(:disabled) {
            background: #4b5563;
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #0ea5e9;
          border: 2px solid #0ea5e9;
          &:hover:not(:disabled) {
            background: #0ea5e9;
            color: white;
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: #0ea5e9;
          &:hover:not(:disabled) {
            background: rgba(14, 165, 233, 0.1);
          }
        `;
      case 'default':
      default:
        return `
          background: #0ea5e9;
          color: white;
          &:hover:not(:disabled) {
            background: #0284c7;
          }
        `;
    }
  }}

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Active state */
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', type = 'button', asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : StyledButton;
  return <Comp ref={ref} variant={variant} size={size} type={type} {...props} />;
});
