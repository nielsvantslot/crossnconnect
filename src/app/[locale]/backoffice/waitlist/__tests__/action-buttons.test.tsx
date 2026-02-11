import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActionButtons } from '../action-buttons';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('ActionButtons', () => {
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  it('renders accept and deny buttons', () => {
    render(<ActionButtons entryId="123" acceptLabel="Accept" denyLabel="Deny" />);

    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deny/i })).toBeInTheDocument();
  });

  it('accepts a waitlist entry', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ActionButtons entryId="123" acceptLabel="Accept" denyLabel="Deny" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/waitlist/123', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      });
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('denies a waitlist entry', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ActionButtons entryId="456" acceptLabel="Accept" denyLabel="Deny" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /deny/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/waitlist/456', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DENIED' }),
      });
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('disables buttons during update', async () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    render(<ActionButtons entryId="123" acceptLabel="Accept" denyLabel="Deny" />);
    const user = userEvent.setup();

    const acceptButton = screen.getByRole('button', { name: /accept/i });
    const denyButton = screen.getByRole('button', { name: /deny/i });

    await user.click(acceptButton);

    expect(acceptButton).toBeDisabled();
    expect(denyButton).toBeDisabled();

    await waitFor(() => {
      expect(acceptButton).not.toBeDisabled();
      expect(denyButton).not.toBeDisabled();
    });
  });

  it('handles network errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ActionButtons entryId="123" acceptLabel="Accept" denyLabel="Deny" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to update status:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('does not refresh on failed response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<ActionButtons entryId="123" acceptLabel="Accept" denyLabel="Deny" />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
