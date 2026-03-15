import { render, screen } from '@testing-library/react';
import { Navigation } from '../navigation';

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/nl',
}));

const defaultTranslations = { ourStory: 'Ons Verhaal' };

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

  it('renders the logo', () => {
    render(<Navigation locale="nl" translations={defaultTranslations} />);
    
    expect(screen.getByAltText('Cross & Connect')).toBeInTheDocument();
  });

  it('links to the home page with correct locale', () => {
    render(<Navigation locale="en" translations={defaultTranslations} />);
    
    const links = screen.getAllByRole('link');
    const logoLink = links[0];
    expect(logoLink).toHaveAttribute('href', '/en');
  });

  it('renders with fixed positioning and centered layout', () => {
    const { container } = render(<Navigation locale="nl" translations={defaultTranslations} />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('fixed', 'left-1/2', '-translate-x-1/2');
  });

  it('has glassmorphism styling with pill shape', () => {
    const { container } = render(<Navigation locale="nl" translations={defaultTranslations} />);
    
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    
    // Check inline styles for glassmorphism (React converts to camelCase)
    const style = nav?.getAttribute('style');
    expect(style).toContain('border-radius: 100px');
    expect(style).toContain('rgba(12, 11, 18');
    
    // Check z-index class
    expect(nav).toHaveClass('z-[100]');
  });

  it('renders translated menu item', () => {
    render(<Navigation locale="nl" translations={defaultTranslations} />);
    
    expect(screen.getByText('Ons Verhaal')).toBeInTheDocument();
  });

  it('renders with top-5 class initially (not scrolled)', () => {
    const { container } = render(<Navigation locale="nl" translations={defaultTranslations} />);
    
    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('top-5');
  });

  it('has scroll event listener attached', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    
    render(<Navigation locale="nl" translations={defaultTranslations} />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    );
    
    addEventListenerSpy.mockRestore();
  });

  it('renders site-nav with menu items', () => {
    const { container } = render(<Navigation locale="nl" translations={defaultTranslations} />);
    
    const siteNav = container.querySelector('.site-nav');
    expect(siteNav).toBeInTheDocument();
  });
});
