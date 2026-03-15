import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getTranslation } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X, AlertCircle } from 'lucide-react';
import { ActionButtons } from '../action-buttons';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function WaitlistDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const { t } = await getTranslation(locale, 'common');
  
  // Fetch member with all relations
  const member = await prisma.member.findUnique({
    where: { id },
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
          name: true,
          email: true,
        },
      },
    },
  });

  if (!member) {
    notFound();
  }

  // Get next pending member (for navigation after accept/deny)
  const nextPendingMember = await prisma.member.findFirst({
    where: {
      status: 'PENDING',
      deletedAt: null,
      createdAt: { gt: member.createdAt }, // Next one after current
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
    },
  });

  // If no next member, get previous one
  const prevPendingMember = !nextPendingMember ? await prisma.member.findFirst({
    where: {
      status: 'PENDING',
      deletedAt: null,
      createdAt: { lt: member.createdAt }, // Previous one before current
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
    },
  }) : null;

  const nextMemberUrl = nextPendingMember 
    ? `/${locale}/backoffice/waitlist/${nextPendingMember.id}`
    : prevPendingMember
    ? `/${locale}/backoffice/waitlist/${prevPendingMember.id}`
    : `/${locale}/backoffice/waitlist`;

  const getLocalizedName = (item: { name: string; nameEn: string } | null) => {
    if (!item) return '-';
    return locale === 'en' ? item.nameEn : item.name;
  };

  return (
    <div className="container mx-auto px-4 py-2 sm:p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Link href={`/${locale}/backoffice/waitlist`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backoffice.waitlist.backToWaitlist')}
          </Button>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">{member.email}</p>
          </div>
          <Badge variant={
            member.status === 'ACCEPTED' ? 'default' : 
            member.status === 'DENIED' ? 'destructive' : 
            'secondary'
          } className="self-start">
            {member.status}
          </Badge>
        </div>
      </div>

      {/* Status Alert for ACCEPTED/DENIED */}
      {member.status === 'ACCEPTED' && (
        <Alert variant="success" className="mb-6">
          <Check className="h-4 w-4" />
          <AlertDescription>
            {t('backoffice.waitlist.detail.alreadyAccepted')}
            {member.acceptedBy && ` - ${member.acceptedBy.name}`}
          </AlertDescription>
        </Alert>
      )}

      {member.status === 'DENIED' && (
        <Alert variant="destructive" className="mb-6">
          <X className="h-4 w-4" />
          <AlertDescription>
            {t('backoffice.waitlist.detail.alreadyDenied')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{t('backoffice.waitlist.detail.personalInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.firstName')}</dt>
              <dd className="mt-1">{member.firstName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.lastName')}</dt>
              <dd className="mt-1">{member.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.dateOfBirth')}</dt>
              <dd className="mt-1">
                {new Date(member.dateOfBirth).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' '}
                <span className="text-muted-foreground text-sm">
                  ({Math.floor((Date.now() - new Date(member.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} {locale === 'nl' ? 'jaar' : 'years'})
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.city')}</dt>
              <dd className="mt-1">{member.city}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.phone')}</dt>
              <dd className="mt-1">{member.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.email')}</dt>
              <dd className="mt-1">{member.email}</dd>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{t('backoffice.waitlist.detail.paymentInfo')}</CardTitle>
            <CardDescription>{t('backoffice.waitlist.detail.paymentInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.accountHolder')}</dt>
              <dd className="mt-1">{member.accountHolderName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.iban')}</dt>
              <dd className="mt-1 font-mono text-xs">
                {member.iban ? t('backoffice.waitlist.detail.ibanEncrypted') : '-'}
              </dd>
            </div>
          </CardContent>
        </Card>

        {/* Profile & Work */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{t('backoffice.waitlist.detail.profileWork')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.occupation')}</dt>
              <dd className="mt-1">{member.occupation ? getLocalizedName(member.occupation) : '-'}</dd>
            </div>
            {member.industry && (
              <>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.industry')}</dt>
                  <dd className="mt-1">{getLocalizedName(member.industry)}</dd>
                </div>
                {member.companyName && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.companyName')}</dt>
                    <dd className="mt-1">{member.companyName}</dd>
                  </div>
                )}
                {member.companyRole && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.companyRole')}</dt>
                    <dd className="mt-1">{member.companyRole}</dd>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Horse Sport */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{t('backoffice.waitlist.detail.horseSport')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.hasExperience')}</dt>
              <dd className="mt-1">
                {member.hasHorseExperience ? (
                  <Badge variant="default">{t('backoffice.waitlist.detail.yes')}</Badge>
                ) : (
                  <Badge variant="secondary">{t('backoffice.waitlist.detail.no')}</Badge>
                )}
              </dd>
            </div>
            
            {member.hasHorseExperience && (
              <>
                {member.horseExperienceLevel && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.experienceLevel')}</dt>
                    <dd className="mt-1">
                      <Badge>{member.horseExperienceLevel}</Badge>
                    </dd>
                  </div>
                )}
                {member.disciplines.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.disciplines')}</dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {member.disciplines.map(({ discipline }) => (
                        <Badge key={discipline.id} variant="outline">
                          {getLocalizedName(discipline)}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
              </>
            )}
            
            {!member.hasHorseExperience && member.wantsToDiscover !== null && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.wantsDiscover')}</dt>
                <dd className="mt-1">
                  {member.wantsToDiscover ? (
                    <Badge variant="default">{t('backoffice.waitlist.detail.yes')}</Badge>
                  ) : (
                    <Badge variant="secondary">{t('backoffice.waitlist.detail.no')}</Badge>
                  )}
                </dd>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community & Fun */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{t('backoffice.waitlist.detail.communityPrivacy')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4">
            {member.communityGoals.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.communityGoals')}</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {member.communityGoals.map(({ communityGoal }) => (
                    <Badge key={communityGoal.id} variant="outline">
                      {getLocalizedName(communityGoal)}
                    </Badge>
                  ))}
                </dd>
              </div>
            )}
            {member.funAnswer && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.funAnswer')}</dt>
                <dd className="mt-2 p-3 bg-muted rounded-md text-sm">
                  {member.funAnswer}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.consentGiven')}</dt>
              <dd className="mt-1">
                {member.consentGiven ? (
                  <Badge variant="default">
                    <Check className="mr-1 h-3 w-3" />
                    {t('backoffice.waitlist.detail.yes')}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <X className="mr-1 h-3 w-3" />
                    {t('backoffice.waitlist.detail.no')}
                  </Badge>
                )}
              </dd>
            </div>
          </CardContent>
        </Card>

        {/* Meta Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{t('backoffice.waitlist.detail.applicationDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.signedUp')}</dt>
              <dd className="mt-1">
                {new Date(member.createdAt).toLocaleString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.lastUpdated')}</dt>
              <dd className="mt-1">
                {new Date(member.updatedAt).toLocaleString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            {member.acceptedBy && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.acceptedBy')}</dt>
                <dd className="mt-1">{member.acceptedBy.name}</dd>
              </div>
            )}
            {member.dataRetentionUntil && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">{t('backoffice.waitlist.detail.dataRetentionUntil')}</dt>
                <dd className="mt-1">
                  {new Date(member.dataRetentionUntil).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {member.status === 'PENDING' && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <Link href={`/${locale}/backoffice/waitlist`}>
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('backoffice.waitlist.backToWaitlist')}
                  </Button>
                </Link>
                <ActionButtons 
                  entryId={member.id}
                  acceptLabel={t('backoffice.waitlist.accept')}
                  denyLabel={t('backoffice.waitlist.deny')}
                  nextMemberUrl={nextMemberUrl}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back button for non-pending statuses */}
        {member.status !== 'PENDING' && (
          <div className="flex justify-center pt-4">
            <Link href={`/${locale}/backoffice/waitlist`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backoffice.waitlist.backToWaitlist')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
