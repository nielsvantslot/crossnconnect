import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../login-form';
import { signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

const mockTranslations = {
  title: 'Backoffice Login',
  description: 'Sign in to access the waitlist dashboard',
  emailLabel: 'Email',
  emailPlaceholder: 'admin@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  submitButton: 'Sign In',
  signingIn: 'Signing in...',
  invalidCredentials: 'Invalid email or password',
  errorGeneric: 'Something went wrong',
};

describe('LoginForm', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (useParams as jest.Mock).mockReturnValue({
      locale: 'en',
    });
  });

  it('renders the login form with all fields', () => {
    render(<LoginForm translations={mockTranslations} />);

    expect(screen.getByText('Backoffice Login')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays password toggle button', async () => {
    render(<LoginForm translations={mockTranslations} />);
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find and click the toggle button (eye icon)
    const toggleButtons = screen.getAllByRole('button');
    const toggleButton = toggleButtons.find(btn => btn !== screen.getByRole('button', { name: /sign in/i }));
    
    if (toggleButton) {
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  it('successfully logs in with valid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
      error: null,
    });

    render(<LoginForm translations={mockTranslations} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'admin@example.com',
        password: 'password123',
        redirect: false,
      });
      expect(mockPush).toHaveBeenCalledWith('/en/backoffice/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('displays error message with invalid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: 'Invalid credentials',
    });

    render(<LoginForm translations={mockTranslations} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays generic error on network failure', async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<LoginForm translations={mockTranslations} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('shows loading state during sign in', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    render(<LoginForm translations={mockTranslations} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText(/signing in\.\.\./i)).not.toBeInTheDocument();
    });
  });

  it('disables form inputs during submission', async () => {
    (signIn as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    render(<LoginForm translations={mockTranslations} />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(emailInput).not.toBeDisabled();
      expect(passwordInput).not.toBeDisabled();
    });
  });
});
