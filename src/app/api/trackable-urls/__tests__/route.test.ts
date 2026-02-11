/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Mock dependencies
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    trackableUrl: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/trackable-urls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/trackable-urls', () => {
    it('returns 401 if user is not authenticated', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns trackable URLs with stats for authenticated user', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const mockUrls = [
        {
          id: '1',
          slug: 'abc123',
          name: 'Campaign 1',
          createdAt: new Date('2024-01-01'),
          clicks: [
            { id: '1', ipAddress: '192.168.1.1', clickedAt: new Date('2024-01-02') },
            { id: '2', ipAddress: '192.168.1.2', clickedAt: new Date('2024-01-03') },
            { id: '3', ipAddress: '192.168.1.1', clickedAt: new Date('2024-01-04') },
          ],
        },
        {
          id: '2',
          slug: 'def456',
          name: 'Campaign 2',
          createdAt: new Date('2024-01-05'),
          clicks: [],
        },
      ];

      (prisma.trackableUrl.findMany as jest.Mock).mockResolvedValue(mockUrls);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0]).toEqual({
        id: '1',
        slug: 'abc123',
        name: 'Campaign 1',
        createdAt: mockUrls[0].createdAt.toISOString(),
        totalClicks: 3,
        uniqueClicks: 2,
        lastClickedAt: mockUrls[0].clicks[2].clickedAt.toISOString(),
      });
      expect(data[1]).toEqual({
        id: '2',
        slug: 'def456',
        name: 'Campaign 2',
        createdAt: mockUrls[1].createdAt.toISOString(),
        totalClicks: 0,
        uniqueClicks: 0,
        lastClickedAt: null,
      });
    });

    it('filters out null IP addresses when calculating unique clicks', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const mockUrls = [
        {
          id: '1',
          slug: 'abc123',
          name: 'Test',
          createdAt: new Date(),
          clicks: [
            { id: '1', ipAddress: '192.168.1.1', clickedAt: new Date() },
            { id: '2', ipAddress: null, clickedAt: new Date() },
            { id: '3', ipAddress: '192.168.1.1', clickedAt: new Date() },
          ],
        },
      ];

      (prisma.trackableUrl.findMany as jest.Mock).mockResolvedValue(mockUrls);

      const response = await GET();
      const data = await response.json();

      expect(data[0].totalClicks).toBe(3);
      expect(data[0].uniqueClicks).toBe(1);
    });

    it('handles database errors gracefully', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (prisma.trackableUrl.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch trackable URLs');
    });
  });

  describe('POST /api/trackable-urls', () => {
    it('returns 401 if user is not authenticated', async () => {
      (auth as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Campaign' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('creates a trackable URL with valid data', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (prisma.trackableUrl.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.trackableUrl.create as jest.Mock).mockResolvedValue({
        id: '1',
        slug: 'abc123',
        name: 'Test Campaign',
        createdAt: new Date(),
      });

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Campaign' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.slug).toBeDefined();
      expect(data.name).toBe('Test Campaign');
      expect(prisma.trackableUrl.create).toHaveBeenCalled();
    });

    it('trims whitespace from name', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (prisma.trackableUrl.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.trackableUrl.create as jest.Mock).mockResolvedValue({
        id: '1',
        slug: 'abc123',
        name: 'Test Campaign',
        createdAt: new Date(),
      });

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({ name: '  Test Campaign  ' }),
      });

      await POST(request);

      expect(prisma.trackableUrl.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test Campaign',
        }),
      });
    });

    it('returns 400 if name is missing', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Name is required');
    });

    it('returns 400 if name is empty string', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({ name: '   ' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Name is required');
    });

    it('returns 400 if name is not a string', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({ name: 123 }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Name is required');
    });

    it('generates unique slug on collision', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      
      // First call returns existing, second returns null (unique)
      (prisma.trackableUrl.findUnique as jest.Mock)
        .mockResolvedValueOnce({ id: '1', slug: 'abc123' })
        .mockResolvedValueOnce(null);

      (prisma.trackableUrl.create as jest.Mock).mockResolvedValue({
        id: '2',
        slug: 'def456',
        name: 'Test',
        createdAt: new Date(),
      });

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      });

      const response = await POST(request);

      expect(response.status).toBe(201);
      expect(prisma.trackableUrl.findUnique).toHaveBeenCalledTimes(2);
    });

    it('handles database errors gracefully', async () => {
      (auth as jest.Mock).mockResolvedValue({ user: { id: '1' } });
      (prisma.trackableUrl.findUnique as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const request = new NextRequest('http://localhost:3000/api/trackable-urls', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create trackable URL');
    });
  });
});
