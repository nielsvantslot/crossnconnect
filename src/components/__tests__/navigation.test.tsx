import { render, screen, waitFor, act } from '@testing-library/react';
import { Navigation } from '../navigation';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/nl',
}));

describe('Navigation - Floating Glassmorphism', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    jest.clearAllMocks();
  });

  it('renders the logo and brand name', () => {
    render(<Navigation locale="nl" />);
    
    expect(screen.getByText('Cross & Connect')).toBeInTheDocument();
    expect(screen.getByText('&')).toBeInTheDocument();
  });

  it('links to the home page with correct locale', () => {
    render(<Navigation locale="en" />);
    
    const links = screen.getAllByRole('link');
    const logoLink = links[0];
    expect(logoLink).toHaveAttribute('href', '/en');
  });

  it('renders with fixed positioning and centered layout', () => {
    const { container } = render(<Navigation locale="nl" />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('fixed', 'left-1/2', '-translate-x-1/2');
  });

  it('has glassmorphism styling with pill shape', () => {
    const { container } = render(<Navigation locale="nl" />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    
    // Check inline styles for glassmorphism (React converts to camelCase)
    const style = nav?.getAttribute('style');
    expect(style).toContain('border-radius: 100px');
    expect(style).toContain('rgba(12, 11, 18');
    
    // Check z-index class
    expect(nav).toHaveClass('z-[100]');
  });

  it('renders brand icon svg', () => {
    const { container } = render(<Navigation locale="nl" />);
    
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with top-5 class initially (not scrolled)', () => {
    const { container } = render(<Navigation locale="nl" />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('top-5');
  });

  it('has scroll event listener attached', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    render(<Navigation locale="nl" />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
    
    addEventListenerSpy.mockRestore();
  });

  it('hides divider and nav when no menu items', () => {
    const { container } = render(<Navigation locale="nl" />);
    
    // Divider should not be visible when menuItems is empty
    const divider = container.querySelector('.h-6.w-px');
    expect(divider).not.toBeInTheDocument();
    
    // Site-nav should not be visible
    const siteNav = container.querySelector('.site-nav');
    expect(siteNav).not.toBeInTheDocument();
  });
});
