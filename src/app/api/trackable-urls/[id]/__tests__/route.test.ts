/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { DELETE } from '../route';

// Mock auth before importing
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    trackableUrl: {
      delete: jest.fn(),
    },
  },
}));

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

describe('DELETE /api/trackable-urls/[id]', () => {
  const mockSession = {
    user: {
      id: 'admin-id',
      email: 'admin@example.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requires authentication', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost:3000/api/trackable-urls/123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('successfully deletes a trackable URL', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.trackableUrl.delete as jest.Mock).mockResolvedValueOnce({
      id: '123',
      name: 'Test Campaign',
      slug: 'test-campaign',
    });

    const request = new NextRequest('http://localhost:3000/api/trackable-urls/123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prisma.trackableUrl.delete).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });

  it('returns 404 for non-existent trackable URL', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.trackableUrl.delete as jest.Mock).mockRejectedValueOnce({
      code: 'P2025',
      message: 'Record not found',
    });

    const request = new NextRequest('http://localhost:3000/api/trackable-urls/999', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: '999' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Trackable URL not found');
  });

  it('handles database errors', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.trackableUrl.delete as jest.Mock).mockRejectedValueOnce(
      new Error('Database connection error')
    );

    const request = new NextRequest('http://localhost:3000/api/trackable-urls/123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to delete trackable URL');
  });

  it('deletes the correct trackable URL by ID', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.trackableUrl.delete as jest.Mock).mockResolvedValueOnce({
      id: '456',
      name: 'Another Campaign',
      slug: 'another-campaign',
    });

    const request = new NextRequest('http://localhost:3000/api/trackable-urls/456', {
      method: 'DELETE',
    });

    await DELETE(request, { params: Promise.resolve({ id: '456' }) });

    expect(prisma.trackableUrl.delete).toHaveBeenCalledWith({
      where: { id: '456' },
    });
  });
});
