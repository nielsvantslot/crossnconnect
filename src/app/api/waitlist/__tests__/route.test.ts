/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { GET, POST } from '../route';
import prisma from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    member: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/waitlist', () => {
    it('returns all waitlist entries', async () => {
      const mockEntries = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User One',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User Two',
          createdAt: new Date('2024-01-02'),
        },
      ];

      (prisma.member.findMany as jest.Mock).mockResolvedValue(mockEntries);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.length).toBe(2);
      expect(data[0].email).toBe('user1@example.com');
      expect(data[1].email).toBe('user2@example.com');
      expect(prisma.member.findMany).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('handles database errors gracefully', async () => {
      (prisma.member.findMany as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toEqual({ error: 'Failed to fetch waitlist entries' });
    });
  });

  describe('POST /api/waitlist', () => {
    it('creates a new waitlist entry with valid data', async () => {
      const mockEntry = {
        id: '1',
        email: 'newuser@example.com',
        name: 'New User',
        createdAt: new Date(),
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.member.create as jest.Mock).mockResolvedValue(mockEntry);

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          name: 'New User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Successfully joined the waitlist!');
      expect(data.entry.email).toBe(mockEntry.email);
      expect(data.entry.name).toBe(mockEntry.name);
      expect(prisma.member.create).toHaveBeenCalledWith({
        data: {
          email: 'newuser@example.com',
          name: 'New User',
        },
      });
    });

    it('converts email to lowercase', async () => {
      const mockEntry = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.member.create as jest.Mock).mockResolvedValue(mockEntry);

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          email: 'Test@Example.COM',
          name: 'Test User',
        }),
      });

      await POST(request);

      expect(prisma.member.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });
    });

    it('returns 400 if email is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email and name are required');
    });

    it('returns 400 if name is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email and name are required');
    });

    it('returns 400 for invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          name: 'Test User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid email format');
    });

    it('returns 409 if email already exists', async () => {
      const existingEntry = {
        id: '1',
        email: 'existing@example.com',
        name: 'Existing User',
        createdAt: new Date(),
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(existingEntry);

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          name: 'Test User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('You have already signed up for our waitlist');
      expect(prisma.member.create).not.toHaveBeenCalled();
    });

    it('handles database errors during creation', async () => {
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.member.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to join waitlist');
    });

    it('validates various invalid email formats', async () => {
      const invalidEmails = [
        'plaintext',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
      ];

      for (const email of invalidEmails) {
        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          body: JSON.stringify({
            email,
            name: 'Test User',
          }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid email format');
      }
    });

    it('accepts valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@subdomain.example.com',
      ];

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.member.create as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'Test',
        createdAt: new Date(),
      });

      for (const email of validEmails) {
        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          body: JSON.stringify({
            email,
            name: 'Test User',
          }),
        });

        const response = await POST(request);
        expect(response.status).toBe(201);
      }
    });
  });
});
