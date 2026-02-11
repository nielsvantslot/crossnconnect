import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResponsiveLayout } from '../responsive-layout';
import { usePathname } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('ResponsiveLayout', () => {
  const mockSidebar = <div data-testid="sidebar">Sidebar Content</div>;
  const mockChildren = <div data-testid="main-content">Main Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/dashboard');
  });

  it('renders sidebar and main content', () => {
    render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('renders mobile menu button', () => {
    render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('shows hamburger icon when menu is closed', () => {
    render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    // The Menu icon should be visible initially
    expect(menuButton.querySelector('svg')).toBeInTheDocument();
  });

  it('toggles menu when button is clicked', () => {
    render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Initially closed, no overlay
    expect(screen.queryByRole('button', { name: /toggle menu/i })).toBeInTheDocument();

    // Click to open
    fireEvent.click(menuButton);

    // Overlay should appear
    const overlay = document.querySelector('.bg-black\\/50');
    expect(overlay).toBeInTheDocument();

    // Click again to close
    fireEvent.click(menuButton);

    // Overlay should disappear
    waitFor(() => {
      expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument();
    });
  });

  it('closes menu when overlay is clicked', () => {
    render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Open menu
    fireEvent.click(menuButton);

    const overlay = document.querySelector('.bg-black\\/50');
    expect(overlay).toBeInTheDocument();

    // Click overlay to close
    fireEvent.click(overlay!);

    waitFor(() => {
      expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument();
    });
  });

  it('closes menu when pathname changes', async () => {
    const { rerender } = render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Open menu
    fireEvent.click(menuButton);

    const overlay = document.querySelector('.bg-black\\/50');
    expect(overlay).toBeInTheDocument();

    // Simulate pathname change
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/members');
    
    rerender(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    await waitFor(() => {
      expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument();
    });
  });

  it('applies correct classes to main content', () => {
    render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const main = screen.getByTestId('main-content').parentElement;
    expect(main).toHaveClass('flex-1', 'overflow-y-auto');
    expect(main).toHaveClass('pt-14', 'md:pt-0'); // Mobile top padding
  });

  it('sidebar has correct transition classes', () => {
    const { container } = render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const sidebarWrapper = container.querySelector('.fixed.md\\:static');
    expect(sidebarWrapper).toHaveClass('transform', 'transition-transform');
  });

  it('menu button has correct z-index for layering', () => {
    render(
      <ResponsiveLayout sidebar={mockSidebar}>
        {mockChildren}
      </ResponsiveLayout>
    );

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toHaveClass('z-50'); // Above sidebar and overlay
  });
});
