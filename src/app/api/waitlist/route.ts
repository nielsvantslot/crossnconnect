import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit';
import { sanitizeEmail, sanitizeString } from '@/lib/sanitize';
import { encryptIBAN } from '@/lib/encryption';
import { validateEmail, validatePhone, validateIBAN } from '@/lib/validation';
import { HorseExperienceLevel, Prisma } from '@prisma/client';

// GET /api/waitlist - Get all waitlist entries (admin only)
export async function GET() {
  try {
    const entries = await prisma.member.findMany({
      where: {
        deletedAt: null,  // Only non-deleted members
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        occupation: true,
        industry: true,
        disciplines: {
          include: {
            discipline: true,
          },
        },
        communityGoals: {
          include: {
            communityGoal: true,
          },
        },
        acceptedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    // Don't return encrypted IBANs to client
    const sanitizedEntries = entries.map((entry) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iban: _excludedIban, ...safeData } = entry;
      return safeData;
    });
    
    return NextResponse.json(sanitizedEntries);
  } catch (error) {
    console.error('Failed to fetch waitlist entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist entries' },
      { status: 500 }
    );
  }
}

// POST /api/waitlist - Add new waitlist entry
export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 requests per 5 minutes per IP (stricter due to payment info)
    const identifier = getRateLimitIdentifier(request);
    if (!rateLimit(identifier, 3, 300000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      // Personal Information
      firstName,
      lastName,
      dateOfBirth,
      city,
      phone,
      email,
      
      // Payment Information
      accountHolderName,
      iban,
      
      // Profile & Work (now with IDs + optional custom text)
      occupationId,
      occupationCustom,  // For creating new occupation
      industryId,
      companyName,
      companyRole,
      
      // Horse Sport (RESTRUCTURED with ENUM)
      hasHorseExperience,
      horseExperienceLevel,  // 'ACTIVE' | 'FAN'
      wantsToDiscover,
      disciplineIds,
      disciplineCustom,  // For creating new discipline
      
      // Community & Privacy
      communityGoalIds,
      funAnswer,
      consentGiven,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !city || !phone || !email) {
      return NextResponse.json(
        { error: 'All personal information fields are required' },
        { status: 400 }
      );
    }

    if (!accountHolderName || !iban) {
      return NextResponse.json(
        { error: 'Payment information is required' },
        { status: 400 }
      );
    }

    if (!occupationId && !occupationCustom) {
      return NextResponse.json(
        { error: 'Occupation is required' },
        { status: 400 }
      );
    }

    if (hasHorseExperience === undefined || hasHorseExperience === null || hasHorseExperience === '') {
      return NextResponse.json(
        { error: 'Horse sport experience information is required' },
        { status: 400 }
      );
    }

    if (!communityGoalIds || communityGoalIds.length === 0 || !funAnswer || !consentGiven) {
      return NextResponse.json(
        { error: 'Community goals, fun answer, and consent are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedFirstName = sanitizeString(firstName);
    const sanitizedLastName = sanitizeString(lastName);
    const sanitizedCity = sanitizeString(city);
    const sanitizedAccountHolder = sanitizeString(accountHolderName);

    // Validate email format
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate IBAN format
    if (!validateIBAN(iban)) {
      return NextResponse.json(
        { error: 'Invalid IBAN format' },
        { status: 400 }
      );
    }

    // Validate phone (must be 10-15 digits)
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { error: 'Invalid phone number format - must contain 10-15 digits' },
        { status: 400 }
      );
    }

    // Validate date of birth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date of birth' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEntry = await prisma.member.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'You have already signed up for our waitlist' },
        { status: 409 }
      );
    }

    // Encrypt IBAN before storage
    const encryptedIBAN = encryptIBAN(iban);

    // Handle Occupation (create new if custom)
    let finalOccupationId = occupationId;
    if (occupationCustom && !occupationId) {
      const customOccupation = await prisma.occupation.create({
        data: {
          name: sanitizeString(occupationCustom),
          nameEn: sanitizeString(occupationCustom),
          requiresWorkDetails: false,
          order: 999,  // Custom occupations at end
        },
      });
      finalOccupationId = customOccupation.id;
    }

    // Validate occupation exists
    if (finalOccupationId) {
      const occupation = await prisma.occupation.findUnique({
        where: { id: finalOccupationId },
      });

      if (!occupation) {
        return NextResponse.json(
          { error: 'Invalid occupation' },
          { status: 400 }
        );
      }

      // Check if work details are required
      if (occupation.requiresWorkDetails && (!industryId || !companyName || !companyRole)) {
        return NextResponse.json(
          { error: 'Industry, company name, and role are required for this occupation' },
          { status: 400 }
        );
      }
    }

    // Validate horse experience fields
    const hasExperience = hasHorseExperience === 'yes' || hasHorseExperience === true;
    const noExperience = hasHorseExperience === 'no' || hasHorseExperience === false;

    if (hasExperience && !horseExperienceLevel) {
      return NextResponse.json(
        { error: 'Please specify your horse experience level' },
        { status: 400 }
      );
    }

    if (noExperience && wantsToDiscover === undefined) {
      return NextResponse.json(
        { error: 'Please indicate if you want to discover horse sports' },
        { status: 400 }
      );
    }

    // Validate ENUM value
    let validatedLevel: HorseExperienceLevel | null = null;
    if (horseExperienceLevel) {
      const upperLevel = horseExperienceLevel.toUpperCase();
      if (upperLevel !== 'ACTIVE' && upperLevel !== 'FAN') {
        return NextResponse.json(
          { error: 'Invalid horse experience level' },
          { status: 400 }
        );
      }
      validatedLevel = upperLevel as HorseExperienceLevel;
    }

    // Handle Disciplines (create new if custom)
    const finalDisciplineIds = disciplineIds || [];
    
    if (disciplineCustom && disciplineCustom.trim()) {
      // Check if this custom discipline already exists
      const existingDiscipline = await prisma.discipline.findFirst({
        where: {
          name: {
            equals: sanitizeString(disciplineCustom),
            mode: 'insensitive',
          },
        },
      });

      if (existingDiscipline) {
        // Use existing
        if (!finalDisciplineIds.includes(existingDiscipline.id)) {
          finalDisciplineIds.push(existingDiscipline.id);
        }
      } else {
        // Create new discipline
        const newDiscipline = await prisma.discipline.create({
          data: {
            name: sanitizeString(disciplineCustom),
            nameEn: sanitizeString(disciplineCustom),
            order: 999,
            isPredefined: false,
          },
        });
        finalDisciplineIds.push(newDiscipline.id);
      }
    }

    // Set data retention (e.g., 2 years from now if not accepted)
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

    // Create member entry with normalized relations
    const entry = await prisma.member.create({
      data: {
        // Personal Information
        firstName: sanitizedFirstName,
        lastName: sanitizedLastName,
        dateOfBirth: dob,
        city: sanitizedCity,
        phone: phoneValidation.cleaned,
        email: sanitizedEmail,
        
        // Payment Information (IBAN is encrypted)
        accountHolderName: sanitizedAccountHolder,
        iban: encryptedIBAN,
        
        // Profile & Work (NORMALIZED)
        occupationId: finalOccupationId,
        industryId: industryId || null,
        companyName: companyName ? sanitizeString(companyName) : null,
        companyRole: companyRole ? sanitizeString(companyRole) : null,
        
        // Horse Sport (ENUM)
        hasHorseExperience: hasExperience,
        horseExperienceLevel: validatedLevel,
        wantsToDiscover: noExperience ? (wantsToDiscover === 'yes' || wantsToDiscover === true) : null,
        
        // Community & Privacy
        funAnswer: sanitizeString(funAnswer),
        consentGiven: !!consentGiven,
        
        // GDPR: Data Retention
        dataRetentionUntil: twoYearsFromNow,
        
        // Create relations for disciplines
        disciplines: finalDisciplineIds.length > 0 ? {
          create: finalDisciplineIds.map((disciplineId: string) => ({
            discipline: {
              connect: { id: disciplineId },
            },
          })),
        } : undefined,
        
        // Create relations for community goals
        communityGoals: {
          create: communityGoalIds.map((goalId: string) => ({
            communityGoal: {
              connect: { id: goalId },
            },
          })),
        },
      },
      include: {
        occupation: true,
        industry: true,
        disciplines: {
          include: {
            discipline: true,
          },
        },
        communityGoals: {
          include: {
            communityGoal: true,
          },
        },
      },
    });

    // Return success but without sensitive data
    const safeEntry = (() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iban: _excludedIban2, ...safe } = entry;
      return safe;
    })();

    return NextResponse.json(
      { 
        message: 'Successfully joined the waitlist!',
        entry: safeEntry
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist registration error:', error);
    
    // Handle Prisma unique constraint violations
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}
