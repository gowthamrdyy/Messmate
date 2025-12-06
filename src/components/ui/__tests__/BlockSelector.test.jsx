import { render, screen, fireEvent } from '@testing-library/react';
import BlockSelector from '../BlockSelector';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Building: () => <span>Building Icon</span>,
  Home: () => <span>Home Icon</span>,
}));

describe('BlockSelector Component', () => {
  const mockOnMessChange = jest.fn();

  beforeEach(() => {
    mockOnMessChange.mockClear();
  });

  test('renders both mess options', () => {
    render(
      <BlockSelector 
        selectedMess="sannasi" 
        onMessChange={mockOnMessChange} 
      />
    );
    
    expect(screen.getByText('Sannasi')).toBeInTheDocument();
    expect(screen.getByText('M-Block')).toBeInTheDocument();
    expect(screen.getByText('Boys Hostel')).toBeInTheDocument();
    expect(screen.getByText('Girls Hostel')).toBeInTheDocument();
  });

  test('highlights selected mess', () => {
    render(
      <BlockSelector 
        selectedMess="sannasi" 
        onMessChange={mockOnMessChange} 
      />
    );
    
    const sannasi = screen.getByText('Sannasi').closest('button');
    const mblock = screen.getByText('M-Block').closest('button');
    
    expect(sannasi).toHaveClass('text-white');
    expect(mblock).not.toHaveClass('text-white');
  });

  test('calls onMessChange when option is clicked', () => {
    render(
      <BlockSelector 
        selectedMess="sannasi" 
        onMessChange={mockOnMessChange} 
      />
    );
    
    const mblockButton = screen.getByText('M-Block').closest('button');
    fireEvent.click(mblockButton);
    
    expect(mockOnMessChange).toHaveBeenCalledWith('mblock');
  });

  test('renders icons for each option', () => {
    render(
      <BlockSelector 
        selectedMess="sannasi" 
        onMessChange={mockOnMessChange} 
      />
    );
    
    expect(screen.getByText('Building Icon')).toBeInTheDocument();
    expect(screen.getByText('Home Icon')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <BlockSelector 
        selectedMess="sannasi" 
        onMessChange={mockOnMessChange}
        className="custom-selector"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-selector');
  });
});