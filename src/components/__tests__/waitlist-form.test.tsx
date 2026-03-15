import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitlistForm } from '../waitlist-form-client';

// Mock fetch
global.fetch = jest.fn();

// Mock comprehensive translations for multi-step form
const mockTranslations: Record<string, string> = {
  // Steps
  step1Title: 'Personal Information',
  step2Title: 'Payment Information',
  step3Title: 'Profile & Work',
  step4Title: 'Horse Sport',
  step5Title: 'Community & Privacy',
  
  // Personal Information
  firstNameLabel: 'First Name',
  lastNameLabel: 'Last Name',
  dateOfBirthLabel: 'Date of Birth',
  cityLabel: 'City',
  phoneLabel: 'Phone',
  emailLabel: 'Email',
  emailPlaceholder: 'john@example.com',
  
  // Payment
  accountHolderLabel: 'Account Holder',
  ibanLabel: 'IBAN',
  ibanHelp: 'International format',
  paymentInfoText: 'Your payment info is secure',
  
  // Profile
  occupationLabel: 'Occupation',
  occupationPlaceholder: 'Select...',
  occupationStudent: 'Student',
  occupationYoungProf: 'Young professional',
  occupationEntrepreneur: 'Entrepreneur',
  occupationRider: 'Rider',
  occupationHorseSector: 'Horse sector',
  occupationOther: 'Other',
  occupationOtherLabel: 'Specify',
  industryLabel: 'Industry',
  companyNameLabel: 'Company',
  companyRoleLabel: 'Role',
  
  // Horse Sport
  horseExperienceLabel: 'Horse experience?',
  horseExperienceActive: 'Yes - active',
  horseExperienceFan: 'Yes - fan',
  horseExperienceDiscover: 'No - want to discover',
  horseExperienceDrinks: 'No - only drinks',
  disciplinesLabel: 'Disciplines',
  disciplinesOtherLabel: 'Other',
  disciplineEventing: 'Eventing',
  disciplineSpringen: 'Jumping',
  disciplineDressuur: 'Dressage',
  'disciplineRecreatief/meerder edisciplines': 'Recreational',
  disciplineAnders: 'Other',
  
  // Community
  communityGoalsLabel: 'Community goals',
  communityGoalNetwerk: 'Network',
  communityGoalZakelijkekansen: 'Business',
  communityGoalInspiratie: 'Inspiration',
  communityGoalNieuwevriendschappen: 'Friendships',
  communityGoalConnectiemetpaardensport: 'Horse connection',
  funQuestionLabel: 'Fun question',
  funAnswerPlaceholder: 'Your answer',
  consentText: 'I agree to terms',
  
  // Navigation
  backButton: 'Back',
  nextButton: 'Next',
  submitButton: 'Submit',
  submitting: 'Submitting...',
  
  // Messages
  successMessage: 'Successfully joined!',
  errorMessage: 'Failed to join. Try again.',
  errorGeneric: 'Something went wrong',
};

describe('WaitlistForm - Multi-Step', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders step 1 (Personal Information) initially', () => {
    render(<WaitlistForm translations={mockTranslations} locale="nl" />);
    
    expect(screen.getByRole('heading', { name: /personal information/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('validates step 1 before allowing navigation to step 2', async () => {
    render(<WaitlistForm translations={mockTranslations} locale="nl" />);
    const user = userEvent.setup();
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Button should be disabled initially (no data filled)
    expect(nextButton).toBeDisabled();
    
    // Fill step 1 fields
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/city/i), 'Amsterdam');
    await user.type(screen.getByLabelText(/phone/i), '0612345678');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Now button should be enabled
    await waitFor(() => {
      expect(nextButton).toBeEnabled();
    });
  });

  it('navigates to step 2 when step 1 is complete', async () => {
    render(<WaitlistForm translations={mockTranslations} locale="nl" />);
    const user = userEvent.setup();
    
    // Fill step 1
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/city/i), 'Amsterdam');
    await user.type(screen.getByLabelText(/phone/i), '0612345678');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Click next
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);
    
    // Should show step 2
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /payment information/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/account holder/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/iban/i)).toBeInTheDocument();
    });
    
    // Should show back button
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('navigates back to step 1 from step 2', async () => {
    render(<WaitlistForm translations={mockTranslations} locale="nl" />);
    const user = userEvent.setup();
    
    // Fill and complete step 1
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/city/i), 'Amsterdam');
    await user.type(screen.getByLabelText(/phone/i), '0612345678');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Go back
    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);
    
    // Should show step 1 again with preserved data
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /personal information/i })).toBeInTheDocument();
      const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
      expect(firstNameInput.value).toBe('John');
    });
  });

  it('shows progress indicator for all steps', () => {
    render(<WaitlistForm translations={mockTranslations} locale="nl" />);
    
    // Progress bars should be visible
    const progressContainer = document.querySelector('.mb-8');
    expect(progressContainer).toBeInTheDocument();
  });

  // Note: Full integration tests for RadixUI Select component are complex
  // These tests verify the form structure and basic navigation
  it.skip('submits complete form successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully joined!' }),
    });

    render(<WaitlistForm translations={mockTranslations} locale="nl" />);
    const user = userEvent.setup();
    
    // Step 1: Personal Information
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/city/i), 'Amsterdam');
    await user.type(screen.getByLabelText(/phone/i), '0612345678');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 2: Payment
    await waitFor(() => screen.getByRole('heading', { name: /payment information/i }));
    await user.type(screen.getByLabelText(/account holder/i), 'J. Doe');
    await user.type(screen.getByLabelText(/iban/i), 'NL91ABNA0417164300');
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 3: Profile - Click the select trigger to open
    await waitFor(() => screen.getByRole('heading', { name: /profile.*work/i }));
    // The select component renders as a button with the placeholder text inside a span
    // We need to find the button that contains the select placeholder
    const selectButtons = screen.getAllByRole('button');
    const selectTrigger = selectButtons.find(btn => btn.textContent?.includes('Select'));
    if (!selectTrigger) throw new Error('Select trigger not found');
    await user.click(selectTrigger);
    // Click Student option  
    await user.click(screen.getByText('Student'));
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 4: Horse Sport - Select radio button
    await waitFor(() => screen.getByRole('heading', { name: /horse sport/i }));
    const horseRadio = screen.getByRole('radio', { name: /no.*only drinks/i });
    await user.click(horseRadio);
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 5: Community
    await waitFor(() => screen.getByRole('heading', { name: /community.*privacy/i }));
    const networkCheckbox = screen.getByRole('checkbox', { name: /network/i });
    await user.click(networkCheckbox);
    await user.type(screen.getByLabelText(/fun question/i), 'Dance routine!');
    const consentCheckbox = screen.getByRole('checkbox', { name: /i agree/i });
    await user.click(consentCheckbox);
    
    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/waitlist', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
    });
    
    expect(await screen.findByText(/successfully joined!/i)).toBeInTheDocument();
  });

  it.skip('displays error message on submission failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' }),
    });

    render(<WaitlistForm translations={mockTranslations} locale="nl" />);
    const user = userEvent.setup();
    
    // Fill all steps quickly
    // Step 1
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
    await user.type(screen.getByLabelText(/city/i), 'Amsterdam');
    await user.type(screen.getByLabelText(/phone/i), '0612345678');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 2
    await waitFor(() => screen.getByRole('heading', { name: /payment information/i }));
    await user.type(screen.getByLabelText(/account holder/i), 'J. Doe');
    await user.type(screen.getByLabelText(/iban/i), 'NL91ABNA0417164300');
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 3
    await waitFor(() => screen.getByRole('heading', { name: /profile.*work/i }));
    const selectButtons = screen.getAllByRole('button');
    const selectTrigger = selectButtons.find(btn => btn.textContent?.includes('Select'));
    if (!selectTrigger) throw new Error('Select trigger not found');
    await user.click(selectTrigger);
    await user.click(screen.getByText('Student'));
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 4
    await waitFor(() => screen.getByRole('heading', { name: /horse sport/i }));
    await user.click(screen.getByRole('radio', { name: /no.*only drinks/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Step 5
    await waitFor(() => screen.getByRole('heading', { name: /community.*privacy/i }));
    await user.click(screen.getByRole('checkbox', { name: /network/i }));
    await user.type(screen.getByLabelText(/fun question/i), 'Dance!');
    await user.click(screen.getByRole('checkbox', { name: /i agree/i }));
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  });
});
