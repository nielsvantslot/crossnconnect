/**
 * Reference Data Codes
 * 
 * Type-safe constants for system reference data codes.
 * These match the seeded values in prisma/seed.ts
 * 
 * Note: These are SYSTEM codes only. Custom entries can be created at runtime
 * with isSystem=false.
 * 
 * Usage:
 * ```typescript
 * import { OccupationCode, DisciplineCode } from '@/lib/reference-codes';
 * 
 * // Type-safe checking
 * if (member.occupation?.code === OccupationCode.STUDENT) {
 *   // Student-specific logic
 * }
 * 
 * // Type-safe in conditionals
 * switch (discipline.code as DisciplineCode) {
 *   case DisciplineCode.SHOW_JUMPING:
 *     // ...
 *     break;
 *   default:
 *     // Custom discipline
 *     break;
 * }
 * ```
 */

/**
 * System Occupation Codes
 */
export const OccupationCode = {
  STUDENT: 'STUDENT',
  YOUNG_PROFESSIONAL: 'YOUNG_PROFESSIONAL',
  ENTREPRENEUR: 'ENTREPRENEUR',
  RIDER: 'RIDER',
  HORSE_INDUSTRY: 'HORSE_INDUSTRY',
} as const;

export type OccupationCode = typeof OccupationCode[keyof typeof OccupationCode];

/**
 * System Industry Codes
 */
export const IndustryCode = {
  TECH_IT: 'TECH_IT',
  FINANCE: 'FINANCE',
  MARKETING: 'MARKETING',
  RETAIL: 'RETAIL',
  HEALTHCARE: 'HEALTHCARE',
  EDUCATION: 'EDUCATION',
  HOSPITALITY: 'HOSPITALITY',
  HORSE_INDUSTRY: 'HORSE_INDUSTRY',
  CREATIVE: 'CREATIVE',
  GOVERNMENT: 'GOVERNMENT',
} as const;

export type IndustryCode = typeof IndustryCode[keyof typeof IndustryCode];

/**
 * System Discipline Codes
 */
export const DisciplineCode = {
  SHOW_JUMPING: 'SHOW_JUMPING',
  DRESSAGE: 'DRESSAGE',
  EVENTING: 'EVENTING',
  WESTERN: 'WESTERN',
  RECREATIONAL: 'RECREATIONAL',
  OTHER: 'OTHER',
} as const;

export type DisciplineCode = typeof DisciplineCode[keyof typeof DisciplineCode];

/**
 * System Community Goal Codes
 */
export const CommunityGoalCode = {
  NETWORK: 'NETWORK',
  INSPIRATION: 'INSPIRATION',
  FUN: 'FUN',
  SHARE_KNOWLEDGE: 'SHARE_KNOWLEDGE',
  COLLABORATE: 'COLLABORATE',
} as const;

export type CommunityGoalCode = typeof CommunityGoalCode[keyof typeof CommunityGoalCode];

/**
 * Helper: Check if code is a system code
 */
export function isSystemOccupation(code: string): code is OccupationCode {
  return Object.values(OccupationCode).includes(code as OccupationCode);
}

export function isSystemIndustry(code: string): code is IndustryCode {
  return Object.values(IndustryCode).includes(code as IndustryCode);
}

export function isSystemDiscipline(code: string): code is DisciplineCode {
  return Object.values(DisciplineCode).includes(code as DisciplineCode);
}

export function isSystemCommunityGoal(code: string): code is CommunityGoalCode {
  return Object.values(CommunityGoalCode).includes(code as CommunityGoalCode);
}
