import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitlistForm } from '../waitlist-form';

// Mock fetch
global.fetch = jest.fn();

describe('WaitlistForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with name and email inputs', () => {
    render(<WaitlistForm lng="en" />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get on the waitlist/i })).toBeInTheDocument();
  });

  it('displays validation error when form is submitted empty', async () => {
    render(<WaitlistForm lng="en" />);
    const user = userEvent.setup();
    
    const submitButton = screen.getByRole('button', { name: /get on the waitlist/i });
    await user.click(submitButton);
    
    // HTML5 validation should prevent submission
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits the form successfully with valid data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully joined the waitlist!' }),
    });

    render(<WaitlistForm lng="en" />);
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /get on the waitlist/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'john@example.com', name: 'John Doe' }),
      });
    });
    
    expect(await screen.findByText(/successfully joined the waitlist!/i)).toBeInTheDocument();
  });

  it('displays error message when submission fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' }),
    });

    render(<WaitlistForm lng="en" />);
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /get on the waitlist/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'existing@example.com');
    await user.click(submitButton);
    
    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  });

  it('displays generic error message on network failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<WaitlistForm lng="en" />);
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /get on the waitlist/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);
    
    expect(await screen.findByText(/failed to join waitlist/i)).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ message: 'Success' }),
      }), 100))
    );

    render(<WaitlistForm lng="en" />);
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /get on the waitlist/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);
    
    expect(screen.getByRole('button', { name: /joining\.\.\./i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /joining\.\.\./i })).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /get on the waitlist/i })).toBeInTheDocument();
    });
  });

  it('clears form fields after successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully joined the waitlist!' }),
    });

    render(<WaitlistForm lng="en" />);
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /get on the waitlist/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });

  it('disables inputs during submission', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ message: 'Success' }),
      }), 100))
    );

    render(<WaitlistForm lng="en" />);
    const user = userEvent.setup();
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /get on the waitlist/i });
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);
    
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    
    await waitFor(() => {
      expect(nameInput).not.toBeDisabled();
      expect(emailInput).not.toBeDisabled();
    });
  });
});
