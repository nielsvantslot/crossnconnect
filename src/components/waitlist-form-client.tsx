'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validateEmail, validatePhone, validateIBAN } from '@/lib/validation';
import { cn } from '@/lib/utils';

interface WaitlistFormProps {
  translations: Record<string, string>;
  locale: string;
}

interface FormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  city: string;
  phone: string;
  email: string;
  
  // Step 2: Payment Information
  accountHolderName: string;
  iban: string;
  
  // Step 3: Profile & Work (NORMALIZED with IDs)
  occupationId: string;
  occupationCustom: string;       // For creating new occupation
  industryId: string;
  companyName: string;
  companyRole: string;
  
  // Step 4: Horse Sport (ENUM)
  hasHorseExperience: string;     // 'yes' | 'no' | ''
  horseExperienceLevel: string;   // 'ACTIVE' | 'FAN' | ''
  wantsToDiscover: string;        // 'yes' | 'no' | ''
  disciplineIds: string[];
  disciplineCustom: string;       // For creating new discipline
  
  // Step 5: Community & Privacy
  communityGoalIds: string[];
  funAnswer: string;
  consentGiven: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

interface Occupation {
  id: string;
  name: string;
  nameEn: string;
  requiresWorkDetails: boolean;
}

interface Industry {
  id: string;
  name: string;
  nameEn: string;
}

interface Discipline {
  id: string;
  name: string;
  nameEn: string;
}

interface CommunityGoal {
  id: string;
  name: string;
  nameEn: string;
}

const TOTAL_STEPS = 5;
const CUSTOM_OCCUPATION_VALUE = '__custom__';

export function WaitlistForm({ translations: t, locale }: WaitlistFormProps) {
  // Helper to get localized name
  const getLocalizedName = (item: { name: string; nameEn: string }) => {
    return locale === 'en' ? item.nameEn : item.name;
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  
  // Dynamic data from database
  const [occupations, setOccupations] = useState<Occupation[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [communityGoals, setCommunityGoals] = useState<CommunityGoal[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    city: '',
    phone: '',
    email: '',
    accountHolderName: '',
    iban: '',
    occupationId: '',
    occupationCustom: '',
    industryId: '',
    companyName: '',
    companyRole: '',
    hasHorseExperience: '',
    horseExperienceLevel: '',
    wantsToDiscover: '',
    disciplineIds: [],
    disciplineCustom: '',
    communityGoalIds: [],
    funAnswer: '',
    consentGiven: false,
  });

  // Fetch all reference data
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [occupationsRes, industriesRes, disciplinesRes, goalsRes] = await Promise.all([
          fetch('/api/occupations'),
          fetch('/api/industries'),
          fetch('/api/disciplines'),
          fetch('/api/community-goals'),
        ]);
        
        if (occupationsRes.ok) {
          const data = await occupationsRes.json();
          setOccupations(data);
        }
        
        if (industriesRes.ok) {
          const data = await industriesRes.json();
          setIndustries(data);
        }
        
        if (disciplinesRes.ok) {
          const data = await disciplinesRes.json();
          setDisciplines(data);
        }
        
        if (goalsRes.ok) {
          const data = await goalsRes.json();
          setCommunityGoals(data);
        }
      } catch (error) {
        console.error('Failed to fetch form options:', error);
      }
    }
    
    fetchOptions();
  }, []);

  const updateField = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string): boolean => {
    let error = '';
    
    switch (field) {
      case 'email':
        if (formData.email && !validateEmail(formData.email)) {
          error = t.emailError || 'Enter a valid email address';
        }
        break;
      
      case 'phone':
        if (formData.phone) {
          const { isValid } = validatePhone(formData.phone);
          if (!isValid) {
            error = t.phoneError || 'Enter a valid phone number (minimum 10 digits)';
          }
        }
        break;
      
      case 'iban':
        if (formData.iban && !validateIBAN(formData.iban)) {
          error = t.ibanError || 'Enter a valid IBAN';
        }
        break;
    }
    
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }));
      return false;
    }
    
    return true;
  };

  const toggleArrayField = (field: 'disciplineIds' | 'communityGoalIds', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  // Conditional logic helpers
  const selectedOccupation = occupations.find(o => o.id === formData.occupationId);
  const requiresWorkDetails = selectedOccupation?.requiresWorkDetails || false;
  const isCustomOccupation = formData.occupationId === CUSTOM_OCCUPATION_VALUE;
  const hasHorseExperience = formData.hasHorseExperience === 'yes';
  const noHorseExperience = formData.hasHorseExperience === 'no';
  
  // Find "Anders"/"Other" discipline from database
  const andersDiscipline = disciplines.find(d => d.name === 'Anders' || d.nameEn === 'Other');
  const hasCustomDiscipline = andersDiscipline ? formData.disciplineIds.includes(andersDiscipline.id) : false;

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: {
        const phoneValid = validatePhone(formData.phone);
        return !!(
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.dateOfBirth &&
          formData.city.trim() &&
          phoneValid.isValid &&
          validateEmail(formData.email)
        );
      }
      
      case 2:
        return !!(
          formData.accountHolderName.trim() &&
          validateIBAN(formData.iban)
        );
      
      case 3: {
        // Must select occupation or provide custom
        if (!formData.occupationId && !formData.occupationCustom.trim()) return false;
        
        // If custom occupation selected, need custom text
        if (isCustomOccupation && !formData.occupationCustom.trim()) return false;
        
        // If occupation requires work details
        if (requiresWorkDetails && (!formData.industryId || !formData.companyName.trim() || !formData.companyRole.trim())) {
          return false;
        }
        
        return true;
      }
      
      case 4: {
        // Must answer if they have horse experience
        if (!formData.hasHorseExperience) return false;
        
        // If they have experience, require level
        if (hasHorseExperience && !formData.horseExperienceLevel) return false;
        
        // If no experience, require discover preference
        if (noHorseExperience && !formData.wantsToDiscover) return false;
        
        // If custom discipline selected, need custom text
        if (hasCustomDiscipline && !formData.disciplineCustom.trim()) return false;
        
        return true;
      }
      
      case 5:
        return !!(
          formData.communityGoalIds.length > 0 &&
          formData.funAnswer.trim() &&
          formData.consentGiven
        );
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePhoneInput = (value: string) => {
    // Only allow digits, spaces, dashes, parentheses
    const cleaned = value.replace(/[^\d\s\-()]/g, '');
    updateField('phone', cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(TOTAL_STEPS)) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      // Clean phone to digits only before sending
      const { cleaned: cleanedPhone } = validatePhone(formData.phone);
      
      // Prepare payload for new AP I
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        city: formData.city,
        phone: cleanedPhone,
        email: formData.email,
        accountHolderName: formData.accountHolderName,
        iban: formData.iban,
        
        // Occupation: either ID or custom text
        occupationId: isCustomOccupation ? undefined : formData.occupationId,
        occupationCustom: isCustomOccupation ? formData.occupationCustom : undefined,
        
        industryId: formData.industryId || undefined,
        companyName: formData.companyName || undefined,
        companyRole: formData.companyRole || undefined,
        
        // Horse experience with ENUM
        hasHorseExperience: formData.hasHorseExperience,
        horseExperienceLevel: formData.horseExperienceLevel || undefined,
        wantsToDiscover: formData.wantsToDiscover || undefined,
        
        // Disciplines: if "Anders" is selected, filter it out and send custom text instead
        disciplineIds: andersDiscipline 
          ? formData.disciplineIds.filter(id => id !== andersDiscipline.id)
          : formData.disciplineIds,
        disciplineCustom: hasCustomDiscipline ? formData.disciplineCustom : undefined,
        
        communityGoalIds: formData.communityGoalIds,
        funAnswer: formData.funAnswer,
        consentGiven: formData.consentGiven,
      };
      
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: t.successMessage || 'Successfully registered!' });
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          city: '',
          phone: '',
          email: '',
          accountHolderName: '',
          iban: '',
          occupationId: '',
          occupationCustom: '',
          industryId: '',
          companyName: '',
          companyRole: '',
          hasHorseExperience: '',
          horseExperienceLevel: '',
          wantsToDiscover: '',
          disciplineIds: [],
          disciplineCustom: '',
          communityGoalIds: [],
          funAnswer: '',
          consentGiven: false,
        });
        setCurrentStep(1);
        setTouchedFields({});
        setFieldErrors({});
      } else {
        setMessage({ type: 'error', text: data.error || t.errorGeneric || 'An error occurred' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage({ type: 'error', text: t.errorMessage || 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(step => (
          <div
            key={step}
            className={`flex-1 h-2 mx-1 rounded-full transition-colors ${
              step <= currentStep
                ? 'bg-blue-600 dark:bg-blue-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        {t[`step${currentStep}Title`] || `Stap ${currentStep} van ${TOTAL_STEPS}`}
      </p>
    </div>
  );

  const getInputClassName = (field: string, baseClass: string = "h-12") => {
    const hasError = touchedFields[field] && fieldErrors[field];
    return cn(
      baseClass,
      hasError && "border-red-500 focus-visible:ring-red-500"
    );
  };

  const renderFieldError = (field: string) => {
    if (!touchedFields[field] || !fieldErrors[field]) return null;
    return (
      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
        {fieldErrors[field]}
      </p>
    );
  };

  return (
    <div className="w-full max-w-2xl">
      {renderProgressBar()}
      
      <form onSubmit={currentStep === TOTAL_STEPS ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
        
        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t.step1Title || 'Personal Information'}</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  {t.firstNameLabel || 'First Name'} *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  className={getInputClassName('firstName')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  {t.lastNameLabel || 'Last Name'} *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  className={getInputClassName('lastName')}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">
                {t.dateOfBirthLabel || 'Date of Birth'} *
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                onBlur={() => handleBlur('dateOfBirth')}
                className={getInputClassName('dateOfBirth')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">
                {t.cityLabel || 'City'} *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                className={getInputClassName('city')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">
                {t.phoneLabel || 'Phone Number'} *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneInput(e.target.value)}
                onBlur={() => handleBlur('phone')}
                className={getInputClassName('phone')}
                placeholder="0612345678"
                required
              />
              {renderFieldError('phone')}
              <p className="text-xs text-gray-500">{t.phoneHelp || 'Digits only, minimum 10 digits'}</p>
            </div>
            
           <div className="space-y-2">
              <Label htmlFor="email">
                {t.emailLabel || 'Email Address'} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={getInputClassName('email')}
                required
              />
              {renderFieldError('email')}
            </div>
          </div>
        )}

        {/* STEP 2: Payment Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t.step2Title || 'Payment Information'}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t.paymentInfoText || 'Your payment information is securely encrypted.'}
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="accountHolderName">
                {t.accountHolderLabel || 'Account Holder Name'} *
              </Label>
              <Input
                id="accountHolderName"
                value={formData.accountHolderName}
                onChange={(e) => updateField('accountHolderName', e.target.value)}
                onBlur={() => handleBlur('accountHolderName')}
                className={getInputClassName('accountHolderName')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iban">
                {t.ibanLabel || 'IBAN'} *
              </Label>
              <Input
                id="iban"
                value={formData.iban}
                onChange={(e) => updateField('iban', e.target.value.toUpperCase())}
                onBlur={() => handleBlur('iban')}
                placeholder="NL00 BANK 0123 4567 89"
                className={getInputClassName('iban')}
                required
              />
              {renderFieldError('iban')}
              <p className="text-xs text-gray-500">{t.ibanHelp || 'International format accepted'}</p>
            </div>
          </div>
        )}

        {/* STEP 3: Profile & Work (NORMALIZED) */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t.step3Title || 'Profile & Work'}</h2>
            
            <div className="space-y-2">
              <Label>
                {t.occupationLabel || 'Which function describes you best?'} *
              </Label>
              {occupations.length > 0 ? (
                <Select 
                  value={formData.occupationId} 
                  onValueChange={(val) => {
                    updateField('occupationId', val);
                    // Reset custom if switching away from custom
                    if (val !== CUSTOM_OCCUPATION_VALUE) {
                      updateField('occupationCustom', '');
                    }
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t.occupationPlaceholder || 'Select...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations.map((occ) => (
                      <SelectItem key={occ.id} value={occ.id}>
                        {getLocalizedName(occ)}
                      </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_OCCUPATION_VALUE}>
                      {t.occupationOther || 'Other'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-500">Laden...</p>
              )}
            </div>
            
            {isCustomOccupation && (
              <div className="space-y-2">
                <Label htmlFor="occupationCustom">
                  {t.occupationOtherLabel || 'Please specify'} *
                </Label>
                <Input
                  id="occupationCustom"
                  value={formData.occupationCustom}
                  onChange={(e) => updateField('occupationCustom', e.target.value)}
                  className="h-12"
                  placeholder={t.occupationCustomPlaceholder || 'E.g. Freelancer, Startup founder...'}
                  required
                />
              </div>
            )}
            
            {requiresWorkDetails && (
              <>
                <div className="space-y-2">
                  <Label>
                    {t.industryLabel || 'In which industry do you work?'} *
                  </Label>
                  {industries.length > 0 ? (
                    <Select value={formData.industryId} onValueChange={(val) => updateField('industryId', val)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder={t.industryPlaceholder || 'Select...'} />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem key={ind.id} value={ind.id}>
                            {getLocalizedName(ind)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm text-gray-500">Laden...</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    {t.companyNameLabel || 'Company / Organization name'} *
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyRole">
                    {t.companyRoleLabel || 'Function / Role within the company'} *
                  </Label>
                  <Input
                    id="companyRole"
                    value={formData.companyRole}
                    onChange={(e) => updateField('companyRole', e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4: Horse Sport (ENUM) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">{t.step4Title || 'Horse Sport'}</h2>
            
            {/* Question 1: Do you have horse experience? */}
            <div className="space-y-3">
              <Label>
                {t.hasHorseExperienceLabel || 'Do you have experience with horse sports?'} *
              </Label>
              <RadioGroup 
                value={formData.hasHorseExperience} 
                onValueChange={(val) => {
                  updateField('hasHorseExperience', val);
                  // Reset dependent fields
                  if (val === 'no') {
                    updateField('horseExperienceLevel', '');
                    updateField('disciplineIds', []);
                    updateField('disciplineCustom', '');
                  } else {
                    updateField('wantsToDiscover', '');
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hasExp-yes" />
                  <Label htmlFor="hasExp-yes" className="font-normal cursor-pointer">
                    {t.hasHorseExperienceYes || 'Yes'}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hasExp-no" />
                  <Label htmlFor="hasExp-no" className="font-normal cursor-pointer">
                    {t.hasHorseExperienceNo || 'No'}
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* If YES - Ask about level (ENUM) */}
            {hasHorseExperience && (
              <>
                <div className="space-y-3">
                  <Label>
                    {t.horseExperienceLevelLabel || 'At what level?'} *
                  </Label>
                  <RadioGroup value={formData.horseExperienceLevel} onValueChange={(val) => updateField('horseExperienceLevel', val)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ACTIVE" id="level-active" />
                      <Label htmlFor="level-active" className="font-normal cursor-pointer">
                        {t.horseLevelActive || 'Active (rider/owner/working in sector)'}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FAN" id="level-fan" />
                      <Label htmlFor="level-fan" className="font-normal cursor-pointer">
                        {t.horseLevelFan || 'Enthusiast / fan'}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Disciplines selection */}
                <div className="space-y-3">
                  <Label>{t.disciplinesLabel || 'Discipline(s) of interest (optional)'}</Label>
                  {disciplines.length > 0 ? (
                    <>
                      <div className="space-y-2">
                        {disciplines.map((disc) => (
                          <div key={disc.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`disc-${disc.id}`}
                              checked={formData.disciplineIds.includes(disc.id)}
                              onCheckedChange={() => toggleArrayField('disciplineIds', disc.id)}
                            />
                            <Label htmlFor={`disc-${disc.id}`} className="font-normal cursor-pointer">
                              {getLocalizedName(disc)}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {/* Custom discipline text field */}
                      {hasCustomDiscipline && (
                        <div className="space-y-2">
                          <Label htmlFor="disciplineCustom">
                            {t.disciplinesOtherLabel || 'Describe discipline'} *
                          </Label>
                          <Input
                            id="disciplineCustom"
                            value={formData.disciplineCustom}
                            onChange={(e) => updateField('disciplineCustom', e.target.value)}
                            className="h-12"
                            placeholder={t.disciplineCustomPlaceholder || 'E.g. Polo, Vaulting...'}
                            required
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Laden...</p>
                  )}
                </div>
              </>
            )}
            
            {/* If NO - Ask about interest */}
            {noHorseExperience && (
              <div className="space-y-3">
                <Label>
                  {t.wantsToDiscoverLabel || 'Are you interested in discovering it?'} *
                </Label>
                <RadioGroup value={formData.wantsToDiscover} onValueChange={(val) => updateField('wantsToDiscover', val)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="discover-yes" />
                    <Label htmlFor="discover-yes" className="font-normal cursor-pointer">
                      {t.wantsToDiscoverYes || 'Yes, I would like to discover it'}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="discover-no" />
                    <Label htmlFor="discover-no" className="font-normal cursor-pointer">
                      {t.wantsToDiscoverNo || 'No, I only come for the community/drinks'}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Community & Privacy */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">{t.step5Title || 'Community & Privacy'}</h2>
            
            {/* Community Goals */}
            <div className="space-y-3">
              <Label>
                {t.communityGoalsLabel || 'What do you hope to get from this community?'} *
              </Label>
              {communityGoals.length > 0 ? (
                <div className="space-y-2">
                  {communityGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`goal-${goal.id}`}
                        checked={formData.communityGoalIds.includes(goal.id)}
                        onCheckedChange={() => toggleArrayField('communityGoalIds', goal.id)}
                      />
                      <Label htmlFor={`goal-${goal.id}`} className="font-normal cursor-pointer">
                        {getLocalizedName(goal)}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Laden...</p>
              )}
            </div>
            
            {/* Fun Question */}
            <div className="space-y-2">
              <Label htmlFor="funAnswer">
                {t.funQuestionLabel || 'Fun question: You and your horse are on a talent show. What is your act?'} *
              </Label>
              <Textarea
                id="funAnswer"
                value={formData.funAnswer}
                onChange={(e) => updateField('funAnswer', e.target.value)}
                className="min-h-24"
                placeholder={t.funAnswerPlaceholder || 'Your answer...'}
                required
              />
            </div>
            
            {/* Consent Checkbox */}
            <div className="flex items-start space-x-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <Checkbox
                id="consent"
                checked={formData.consentGiven}
                onCheckedChange={(checked) => updateField('consentGiven', !!checked)}
                required
              />
              <Label htmlFor="consent" className="text-sm font-normal cursor-pointer leading-relaxed">
                {t.consentText || 'I give permission for the use of my data for organizing Cross & Connect activities, payments, and community communication.'} *
              </Label>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {message && (
          <div
            className={`p-4 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900'
                : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-12"
              disabled={isLoading}
            >
              {t.backButton || 'Back'}
            </Button>
          )}
          
          {currentStep < TOTAL_STEPS ? (
            <Button
              type="submit"
              className="flex-1 h-12"
              disabled={!validateStep(currentStep)}
            >
              {t.nextButton || 'Next'}
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 h-12"
              disabled={!validateStep(TOTAL_STEPS) || isLoading}
            >
              {isLoading ? (t.submitting || 'Submitting...') : (t.submitButton || 'Submit')}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
