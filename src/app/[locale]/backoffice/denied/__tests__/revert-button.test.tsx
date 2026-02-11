import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RevertButton } from '../revert-button';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('RevertButton', () => {
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  it('renders the revert button', () => {
    render(<RevertButton entryId="123" label="Revert to Pending" />);

    expect(screen.getByRole('button', { name: /revert to pending/i })).toBeInTheDocument();
  });

  it('reverts entry to pending status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<RevertButton entryId="123" label="Revert to Pending" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /revert to pending/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/waitlist/123', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'PENDING' }),
      });
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('disables button during update', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    render(<RevertButton entryId="123" label="Revert to Pending" />);
    const user = userEvent.setup();

    const button = screen.getByRole('button', { name: /revert to pending/i });

    await user.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('handles network errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<RevertButton entryId="123" label="Revert to Pending" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /revert to pending/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to revert entry:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('does not refresh on failed response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<RevertButton entryId="123" label="Revert to Pending" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /revert to pending/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
