import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;

  @media (prefers-color-scheme: dark) {
    color: #d1d5db;
  }
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => (props.hasError ? '#ef4444' : '#d1d5db')};
  background: white;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    border-color: ${(props) => (props.hasError ? '#ef4444' : '#0ea5e9')};
    box-shadow: 0 0 0 3px
      ${(props) => (props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)')};
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }

  @media (prefers-color-scheme: dark) {
    background: #1f2937;
    border-color: ${(props) => (props.hasError ? '#ef4444' : '#4b5563')};
    color: #f9fafb;
  }
`;

const ErrorText = styled.span`
  font-size: 0.875rem;
  color: #ef4444;
`;

const HelperText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;

  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

export function Input({ label, error, helperText, fullWidth, ...props }: InputProps) {
  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput hasError={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
}
