/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { PATCH } from '../route';

// Mock auth before importing
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    member: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

describe('PATCH /api/waitlist/[id]', () => {
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

    const request = new NextRequest('http://localhost:3000/api/waitlist/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('validates status field', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(mockSession);

    const request = new NextRequest('http://localhost:3000/api/waitlist/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'INVALID_STATUS' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid status');
  });

  it('returns 404 for non-existent entry', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.member.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost:3000/api/waitlist/999', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '999' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Entry not found');
  });

  it('accepts a pending entry', async () => {
    const existingEntry = {
      id: '123',
      email: 'user@example.com',
      name: 'Test User',
      status: 'PENDING',
      acceptedAt: null,
    };

    const updatedEntry = {
      ...existingEntry,
      status: 'ACCEPTED',
      acceptedAt: new Date('2024-01-01'),
    };

    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.member.findUnique as jest.Mock).mockResolvedValueOnce(existingEntry);
    (prisma.member.update as jest.Mock).mockResolvedValueOnce(updatedEntry);

    const request = new NextRequest('http://localhost:3000/api/waitlist/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('ACCEPTED');
    expect(prisma.member.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: {
        status: 'ACCEPTED',
        acceptedAt: expect.any(Date),
      },
    });
  });

  it('denies a pending entry', async () => {
    const existingEntry = {
      id: '123',
      email: 'user@example.com',
      name: 'Test User',
      status: 'PENDING',
      acceptedAt: null,
    };

    const updatedEntry = {
      ...existingEntry,
      status: 'DENIED',
    };

    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.member.findUnique as jest.Mock).mockResolvedValueOnce(existingEntry);
    (prisma.member.update as jest.Mock).mockResolvedValueOnce(updatedEntry);

    const request = new NextRequest('http://localhost:3000/api/waitlist/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'DENIED' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('DENIED');
    expect(prisma.member.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { status: 'DENIED' },
    });
  });

  it('reverts denied entry to pending', async () => {
    const existingEntry = {
      id: '123',
      email: 'user@example.com',
      name: 'Test User',
      status: 'DENIED',
      acceptedAt: null,
    };

    const updatedEntry = {
      ...existingEntry,
      status: 'PENDING',
    };

    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.member.findUnique as jest.Mock).mockResolvedValueOnce(existingEntry);
    (prisma.member.update as jest.Mock).mockResolvedValueOnce(updatedEntry);

    const request = new NextRequest('http://localhost:3000/api/waitlist/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'PENDING' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('PENDING');
  });

  it('clears acceptedAt when moving from ACCEPTED to DENIED', async () => {
    const existingEntry = {
      id: '123',
      email: 'user@example.com',
      name: 'Test User',
      status: 'ACCEPTED',
      acceptedAt: new Date('2024-01-01'),
    };

    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.member.findUnique as jest.Mock).mockResolvedValueOnce(existingEntry);
    (prisma.member.update as jest.Mock).mockResolvedValueOnce({
      ...existingEntry,
      status: 'DENIED',
      acceptedAt: null,
    });

    const request = new NextRequest('http://localhost:3000/api/waitlist/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'DENIED' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });

    expect(response.status).toBe(200);
    expect(prisma.member.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: {
        status: 'DENIED',
        acceptedAt: null,
      },
    });
  });

  it('handles database errors', async () => {
    (auth as jest.Mock).mockResolvedValueOnce(mockSession);
    (prisma.member.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/waitlist/123', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: '123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to update entry');
  });
});
