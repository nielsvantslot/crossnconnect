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
    occupation: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    discipline: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock encryption module
jest.mock('@/lib/encryption', () => ({
  encryptIBAN: jest.fn((iban: string) => `encrypted_${iban}`),
  validateIBAN: jest.fn((iban: string) => {
    const clean = iban.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(clean) && clean.length >= 15;
  }),
}));

// Helper to create valid member data (new normalized format)
const createValidMemberData = (overrides = {}) => ({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  city: 'Amsterdam',
  phone: '0612345678',
  email: 'john.doe@example.com',
  accountHolderName: 'J. Doe',
  iban: 'NL91ABNA0417164300',
  occupationId: 'occ-1',
  industryId: 'ind-1',
  companyName: 'Tech Corp',
  companyRole: 'Developer',
  hasHorseExperience: 'no',
  wantsToDiscover: 'yes',
  disciplineIds: [],
  communityGoalIds: ['goal-1', 'goal-2'],
  funAnswer: 'We would do a comedy act!',
  consentGiven: true,
  ...overrides,
});

describe('/api/waitlist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/waitlist', () => {
    it('returns all waitlist entries without IBAN', async () => {
      const mockEntries = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'user1@example.com',
          city: 'Amsterdam',
          phone: '0612345678',
          dateOfBirth: new Date('1990-01-01'),
          accountHolderName: 'J. Doe',
          iban: 'encrypted_NL91ABNA0417164300',
          occupationId: 'occ-1',
          occupation: { id: 'occ-1', code: 'STUDENT', name: 'Student' },
          hasHorseExperience: false,
          communityGoals: [],
          disciplines: [],
          funAnswer: 'Comedy act',
          consentGiven: true,
          status: 'PENDING',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          deletedAt: null,
          acceptedAt: null,
          acceptedBy: null,
        },
      ];

      (prisma.member.findMany as jest.Mock).mockResolvedValue(mockEntries);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.length).toBe(1);
      expect(data[0].email).toBe('user1@example.com');
      // Verify IBAN is NOT in response
      expect(data[0].iban).toBeUndefined();
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
    it('creates a new waitlist entry with valid complete data', async () => {
      const requestData = createValidMemberData();
      
      const mockOccupation = { id: 'occ-1', code: 'STUDENT', name: 'Student', requiresWorkDetails: true };
      
      const mockCreatedEntry = {
        id: '1',
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        email: requestData.email,
        iban: 'encrypted_NL91ABNA0417164300',
        occupation: mockOccupation,
        status: 'PENDING',
        createdAt: new Date(),
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.occupation.findUnique as jest.Mock).mockResolvedValue(mockOccupation);
      (prisma.member.create as jest.Mock).mockResolvedValue(mockCreatedEntry);

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Successfully joined the waitlist!');
      expect(data.entry.email).toBe(requestData.email);
      // Verify IBAN is NOT in response
      expect(data.entry.iban).toBeUndefined();
    });

    it('returns 400 if required personal information is missing', async () => {
      const fields = ['firstName', 'lastName', 'email', 'city', 'phone', 'dateOfBirth'];

      for (const field of fields) {
        const data = createValidMemberData();
        delete (data as Record<string, unknown>)[field];

        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        const response = await POST(request);
        const responseData = await response.json();

        expect(response.status).toBe(400);
        expect(responseData.error).toBe('All personal information fields are required');
      }
    });

    it('returns 400 if payment information is missing', async () => {
      for (const field of ['accountHolderName', 'iban']) {
        const data = createValidMemberData();
        delete (data as Record<string, unknown>)[field];

        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        const response = await POST(request);
        const responseData = await response.json();

        expect(response.status).toBe(400);
        expect(responseData.error).toBe('Payment information is required');
      }
    });

    it('returns 400 if occupation is missing', async () => {
      const data = createValidMemberData({ occupationId: undefined, occupationCustom: undefined });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Occupation is required');
    });

    it('returns 400 for invalid email format', async () => {
      const data = createValidMemberData({ email: 'invalid-email' });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Invalid email format');
    });

    it('returns 400 for invalid IBAN format', async () => {
      const data = createValidMemberData({ iban: 'INVALID' });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Invalid IBAN format');
    });

    it('returns 400 for invalid phone number', async () => {
      const data = createValidMemberData({ phone: '123' });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toContain('Invalid phone number format');
    });

    it('returns 400 if consent is not given', async () => {
      const data = createValidMemberData({ consentGiven: false });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Community goals, fun answer, and consent are required');
    });

    it('returns 409 if email already exists', async () => {
      (prisma.member.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'existing@example.com',
      });

      const data = createValidMemberData({ email: 'existing@example.com' });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(409);
      expect(responseData.error).toBe('You have already signed up for our waitlist');
      expect(prisma.member.create).not.toHaveBeenCalled();
    });

    it('handles database errors during creation', async () => {
      const mockOccupation = { id: 'occ-1', code: 'STUDENT', name: 'Student', requiresWorkDetails: true };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.occupation.findUnique as jest.Mock).mockResolvedValue(mockOccupation);
      (prisma.member.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(createValidMemberData()),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to join waitlist. Please try again.');
    });
  });
});
