/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';

// Mock auth before importing middleware
jest.mock('@/lib/auth-config', () => ({
  auth: jest.fn(),
}));

import { auth } from '@/lib/auth-config';

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets x-pathname header for all requests', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'test' } });

    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/en/test');
    const response = await middleware(request);

    expect(response.headers.get('x-pathname')).toBe('/en/test');
  });

  it('sets x-pathname header for 404 routes', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/en/nonexistent');
    const response = await middleware(request);

    expect(response.headers.get('x-pathname')).toBe('/en/nonexistent');
  });

  it('sets x-pathname header for Dutch routes', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'test' } });

    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/nl/test');
    const response = await middleware(request);

    expect(response.headers.get('x-pathname')).toBe('/nl/test');
  });

  it('redirects paths without locale to include locale', async () => {
    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/test', {
      headers: {
        'accept-language': 'en-US,en;q=0.9',
      },
    });
    const response = await middleware(request);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get('location')).toContain('/en/test');
  });

  it('detects Dutch from accept-language header', async () => {
    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/test', {
      headers: {
        'accept-language': 'nl-NL,nl;q=0.9,en;q=0.8',
      },
    });
    const response = await middleware(request);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get('location')).toContain('/nl/test');
  });

  it('redirects to login for unauthenticated backoffice access', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/en/backoffice/dashboard');
    const response = await middleware(request);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get('location')).toBe('http://localhost:3000/en/backoffice');
  });

  it('allows authenticated backoffice access', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'admin' } });

    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/en/backoffice/dashboard');
    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('x-pathname')).toBe('/en/backoffice/dashboard');
  });

  it('allows unauthenticated access to login page', async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const middleware = (await import('../middleware')).default;
    const request = new NextRequest('http://localhost:3000/en/backoffice');
    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('x-pathname')).toBe('/en/backoffice');
  });
});
