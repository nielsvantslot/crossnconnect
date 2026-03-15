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

// Mock encryption module
jest.mock('@/lib/encryption', () => ({
  encryptIBAN: jest.fn((iban: string) => `encrypted_${iban}`),
  validateIBAN: jest.fn((iban: string) => {
    const clean = iban.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(clean) && clean.length >= 15;
  }),
}));

// Helper to create valid member data
const createValidMemberData = (overrides = {}) => ({
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  city: 'Amsterdam',
  phone: '0612345678',
  email: 'john.doe@example.com',
  accountHolderName: 'J. Doe',
  iban: 'NL91ABNA0417164300',
  occupation: 'Student',
  industry: 'Technology',
  companyName: 'Tech Corp',
  companyRole: 'Developer',
  horseExperience: 'Nee, ik kom alleen voor de drank',
  disciplines: [],
  communityGoals: ['Netwerk', 'Inspiratie'],
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
          occupation: 'Student',
          horseExperience: 'Nee',
          communityGoals: '["Netwerk"]',
          funAnswer: 'Comedy act',
          consentGiven: true,
          status: 'PENDING',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          acceptedAt: null,
          occupationOther: null,
          industry: null,
          companyName: null,
          companyRole: null,
          disciplines: null,
          disciplinesOther: null,
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
    it('creates a new waitlist entry with valid complete data', async () => {
      const requestData = createValidMemberData();
      
      const mockCreatedEntry = {
        id: '1',
        ...requestData,
        iban: 'encrypted_NL91ABNA0417164300',
        dateOfBirth: new Date(requestData.dateOfBirth),
        communityGoals: JSON.stringify(requestData.communityGoals),
        disciplines: JSON.stringify(requestData.disciplines),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        acceptedAt: null,
        occupationOther: null,
        disciplinesOther: null,
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
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
      expect(data.entry.firstName).toBe(requestData.firstName);
      // Verify IBAN is NOT in response
      expect(data.entry.iban).toBeUndefined();
    });

    it('encrypts IBAN before storing', async () => {
      const requestData = createValidMemberData();

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.member.create as jest.Mock).mockResolvedValue({
        id: '1',
        ...requestData,
        iban: 'encrypted_NL91ABNA0417164300',
        dateOfBirth: new Date(requestData.dateOfBirth),
        communityGoals: JSON.stringify(requestData.communityGoals),
        disciplines: JSON.stringify(requestData.disciplines),
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        acceptedAt: null,
        occupationOther: null,
        disciplinesOther: null,
      });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      await POST(request);

      expect(prisma.member.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            iban: 'encrypted_NL91ABNA0417164300',
          }),
        })
      );
    });

    it('returns 400 if required personal information is missing', async () => {
      const testCases = [
        { field: 'firstName', error: 'All personal information fields are required' },
        { field: 'lastName', error: 'All personal information fields are required' },
        { field: 'email', error: 'All personal information fields are required' },
        { field: 'city', error: 'All personal information fields are required' },
        { field: 'phone', error: 'All personal information fields are required' },
        { field: 'dateOfBirth', error: 'All personal information fields are required' },
      ];

      for (const { field, error } of testCases) {
        const data = createValidMemberData();
        delete (data as any)[field];

        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        const response = await POST(request);
        const responseData = await response.json();

        expect(response.status).toBe(400);
        expect(responseData.error).toBe(error);
      }
    });

    it('returns 400 if payment information is missing', async () => {
      const testCases = ['accountHolderName', 'iban'];

      for (const field of testCases) {
        const data = createValidMemberData();
        delete (data as any)[field];

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
      const data = createValidMemberData({ phone: '123' }); // Too short

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Invalid phone number format');
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

    it('validates occupation with "Anders" requires occupationOther', async () => {
      const data = createValidMemberData({ 
        occupation: 'Anders',
        occupationOther: '' 
      });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Please specify your occupation');
    });

    it('validates work details for certain occupations', async () => {
      const occupations = ['Student', 'Young professional', 'Ondernemer', 'Anders'];

      for (const occupation of occupations) {
        const data = createValidMemberData({ 
          occupation,
          occupationOther: occupation === 'Anders' ? 'Freelancer' : undefined,
          industry: '',
          companyName: '',
          companyRole: '',
        });

        const request = new NextRequest('http://localhost:3000/api/waitlist', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        const response = await POST(request);
        const responseData = await response.json();

        expect(response.status).toBe(400);
        expect(responseData.error).toBe('Industry, company name, and role are required for your occupation type');
      }
    });

    it('validates disciplines required when horse experience is yes', async () => {
      const data = createValidMemberData({ 
        horseExperience: 'Ja – actief ruiter / eigenaar / sector',
        disciplines: [],
      });

      const request = new NextRequest('http://localhost:3000/api/waitlist', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.error).toBe('Please select at least one discipline');
    });

    it('returns 409 if email already exists', async () => {
      const existingEntry = {
        id: '1',
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        createdAt: new Date(),
      };

      (prisma.member.findUnique as jest.Mock).mockResolvedValue(existingEntry);

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
      (prisma.member.findUnique as jest.Mock).mockResolvedValue(null);
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
