import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UrlActions } from '../url-actions';
import { useRouter } from 'next/navigation';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock window.confirm
global.confirm = jest.fn();

describe('UrlActions', () => {
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    // No cleanup needed
  });

  it('renders copy and delete buttons', () => {
    render(
      <UrlActions
        urlId="123"
        slug="test-campaign"
        copyLabel="Copy"
        deleteLabel="Delete"
        deleteConfirm="Are you sure?"
      />
    );

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('copies URL to clipboard and shows confirmation', async () => {
    render(
      <UrlActions
        urlId="123"
        slug="test-campaign"
        copyLabel="Copy"
        deleteLabel="Delete"
        deleteConfirm="Are you sure?"
      />
    );
    const user = userEvent.setup();

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    // Should show "Copied!" feedback
    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });

    // Should revert back to "Copy" after timeout
    await waitFor(() => {
      expect(screen.queryByText(/copied!/i)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  it('deletes URL after confirmation', async () => {
    (global.confirm as jest.Mock).mockReturnValueOnce(true);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <UrlActions
        urlId="123"
        slug="test-campaign"
        copyLabel="Copy"
        deleteLabel="Delete"
        deleteConfirm="Are you sure you want to delete this?"
      />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/trackable-urls/123', {
        method: 'DELETE',
      });
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.confirm as jest.Mock).mockReturnValueOnce(false);

    render(
      <UrlActions
        urlId="123"
        slug="test-campaign"
        copyLabel="Copy"
        deleteLabel="Delete"
        deleteConfirm="Are you sure?"
      />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(global.confirm).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });

  it('disables delete button during deletion', async () => {
    (global.confirm as jest.Mock).mockReturnValueOnce(true);
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    render(
      <UrlActions
        urlId="123"
        slug="test-campaign"
        copyLabel="Copy"
        deleteLabel="Delete"
        deleteConfirm="Are you sure?"
      />
    );
    const user = userEvent.setup();

    const deleteButton = screen.getByRole('button', { name: /delete/i });

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();

    await waitFor(() => {
      expect(deleteButton).not.toBeDisabled();
    });
  });

  it('handles deletion errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (global.confirm as jest.Mock).mockReturnValueOnce(true);
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <UrlActions
        urlId="123"
        slug="test-campaign"
        copyLabel="Copy"
        deleteLabel="Delete"
        deleteConfirm="Are you sure?"
      />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to delete:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('does not refresh on failed delete response', async () => {
    (global.confirm as jest.Mock).mockReturnValueOnce(true);
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <UrlActions
        urlId="123"
        slug="test-campaign"
        copyLabel="Copy"
        deleteLabel="Delete"
        deleteConfirm="Are you sure?"
      />
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
