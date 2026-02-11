import { render, screen } from '@testing-library/react';
import { Sidebar } from '../sidebar';
import { signOut } from 'next-auth/react';
import { usePathname, useParams } from 'next/navigation';

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useParams: jest.fn(),
}));

const mockUser = {
  name: 'Admin User',
  email: 'admin@example.com',
};

const mockTranslations = {
  dashboard: 'Dashboard',
  membership: 'Membership',
  waitlist: 'Waitlist',
  members: 'Members',
  denied: 'Denied',
  marketing: 'Marketing',
  trackableUrls: 'Trackable URLs',
  signOut: 'Sign Out',
};

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ locale: 'en' });
  });

  it('renders the brand name', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/dashboard');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    expect(screen.getByText('Cross & Connect')).toBeInTheDocument();
  });

  it('displays user information', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/dashboard');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/dashboard');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Membership')).toBeInTheDocument();
    expect(screen.getByText('Waitlist')).toBeInTheDocument();
    expect(screen.getByText('Members')).toBeInTheDocument();
    expect(screen.getByText('Denied')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Trackable URLs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('highlights active dashboard link', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/dashboard');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    const dashboardLink = screen.getByText('Dashboard').closest('div');
    expect(dashboardLink).toHaveClass('bg-primary');
    expect(dashboardLink).toHaveClass('text-primary-foreground');
  });

  it('highlights active waitlist link', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/waitlist');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    const waitlistLink = screen.getByText('Waitlist').closest('div');
    expect(waitlistLink).toHaveClass('bg-primary');
    expect(waitlistLink).toHaveClass('text-primary-foreground');
  });

  it('highlights active members link', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/members');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    const membersLink = screen.getByText('Members').closest('div');
    expect(membersLink).toHaveClass('bg-primary');
    expect(membersLink).toHaveClass('text-primary-foreground');
  });

  it('highlights active denied link', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/denied');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    const deniedLink = screen.getByText('Denied').closest('div');
    expect(deniedLink).toHaveClass('bg-primary');
    expect(deniedLink).toHaveClass('text-primary-foreground');
  });

  it('highlights active trackable URLs link', () => {
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/trackable-urls');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    const trackableUrlsLink = screen.getByText('Trackable URLs').closest('div');
    expect(trackableUrlsLink).toHaveClass('bg-primary');
    expect(trackableUrlsLink).toHaveClass('text-primary-foreground');
  });

  it('generates correct locale-based URLs', () => {
    (useParams as jest.Mock).mockReturnValue({ locale: 'nl' });
    (usePathname as jest.Mock).mockReturnValue('/nl/backoffice/dashboard');
    
    render(<Sidebar user={mockUser} translations={mockTranslations} />);
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/nl/backoffice/dashboard');
  });

  it('handles user with only email (no name)', () => {
    const userWithoutName = {
      email: 'admin@example.com',
    };
    (usePathname as jest.Mock).mockReturnValue('/en/backoffice/dashboard');
    
    render(<Sidebar user={userWithoutName} translations={mockTranslations} />);
    
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });
});
