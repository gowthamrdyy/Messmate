import { render, screen } from '@testing-library/react';
import Glass from '../Glass';

describe('Glass Component', () => {
  test('renders children correctly', () => {
    render(
      <Glass>
        <div>Test Content</div>
      </Glass>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies default variant classes', () => {
    const { container } = render(
      <Glass data-testid="glass">
        Content
      </Glass>
    );
    
    const glassElement = container.firstChild;
    expect(glassElement).toHaveClass('bg-white/80');
    expect(glassElement).toHaveClass('backdrop-blur-md');
    expect(glassElement).toHaveClass('rounded-lg');
  });

  test('applies custom variant', () => {
    const { container } = render(
      <Glass variant="light">
        Content
      </Glass>
    );
    
    const glassElement = container.firstChild;
    expect(glassElement).toHaveClass('bg-white/90');
  });

  test('applies custom blur level', () => {
    const { container } = render(
      <Glass blur="xl">
        Content
      </Glass>
    );
    
    const glassElement = container.firstChild;
    expect(glassElement).toHaveClass('backdrop-blur-xl');
  });

  test('applies custom rounded level', () => {
    const { container } = render(
      <Glass rounded="3xl">
        Content
      </Glass>
    );
    
    const glassElement = container.firstChild;
    expect(glassElement).toHaveClass('rounded-3xl');
  });

  test('applies border when enabled', () => {
    const { container } = render(
      <Glass border={true}>
        Content
      </Glass>
    );
    
    const glassElement = container.firstChild;
    expect(glassElement).toHaveClass('border');
  });

  test('applies shadow when enabled', () => {
    const { container } = render(
      <Glass shadow={true}>
        Content
      </Glass>
    );
    
    const glassElement = container.firstChild;
    expect(glassElement).toHaveClass('shadow-lg');
  });

  test('merges custom className', () => {
    const { container } = render(
      <Glass className="custom-class">
        Content
      </Glass>
    );
    
    const glassElement = container.firstChild;
    expect(glassElement).toHaveClass('custom-class');
  });
});