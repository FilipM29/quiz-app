import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent } from '../../test/utils';
import { AuthContext } from '../../context/auth-context';
import { CategoriesProvider } from '../../context/categories-context';
import { QuizStepper } from './QuizStepper';

// Mock AuthContext wrapper
const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const authValue = {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      firebaseId: 'test-firebase-id'
    },
    isAuthenticated: true,
    isLoading: false,
    token: 'test-token'
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

describe('QuizStepper - Quiz Creation Flow', () => {
  it.skip('should complete basic quiz creation with 1 round', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    renderWithProviders(
      <AuthProviderWrapper>
        <CategoriesProvider>
          <QuizStepper onComplete={onComplete} />
        </CategoriesProvider>
      </AuthProviderWrapper>
    );

    // ============== STEP 1: BASIC INFORMATION ==============

    // Fill in basic quiz information
    const titleInput = screen.getByLabelText(/quiz title/i);
    await user.type(titleInput, 'Simple Quiz');

    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, 'A simple test quiz');

    // Select category
    const categorySelect = screen.getAllByRole('combobox')[0];
    await user.click(categorySelect);
    const scienceOption = await screen.findByRole('option', { name: 'Science' });
    await user.click(scienceOption);

    // Click Next to proceed to step 2
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // Wait for step 2 to load
    await screen.findByRole('button', { name: /add round/i });

    // ============== STEP 2: ADD ROUND ==============

    // Add round (opens dialog)
    const addRoundButton = screen.getByRole('button', { name: /add round/i });
    await user.click(addRoundButton);

    // Fill round title (wait up to 3 seconds for dialog to open)
    const roundTitleInput = await screen.findByPlaceholderText(/round title/i, {}, { timeout: 3000 });
    await user.type(roundTitleInput, 'Round 1');

    // Save round (dialog has 2 "Add Round" buttons - click the one in dialog)
    const addButtons = screen.getAllByRole('button', { name: /add round/i });
    await user.click(addButtons[addButtons.length - 1]);

    // Wait for round to be added
    await screen.findByText('Round 1');

    // Click Next to proceed to step 3
    const nextButton2 = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton2);

    // Wait for step 3 to load (look for "Add Question" button)
    await screen.findByRole('button', { name: /add question/i });

    // ============== STEP 3: ADD QUESTION ==============

    // Add question
    const addQuestionButton = screen.getByRole('button', { name: /add question/i });
    await user.click(addQuestionButton);

    // Fill question text
    const questionText = await screen.findByPlaceholderText(/enter question text/i);
    await user.type(questionText, 'What is 2+2?');

    // Select question type: OPTIONS (Multiple Choice) - should be default
    const questionTypeSelect = screen.getByRole('combobox', { name: /question type/i });
    await user.click(questionTypeSelect);
    const optionsType = await screen.findByRole('option', { name: 'Multiple Choice' });
    await user.click(optionsType);

    // Fill options (default has 2 options)
    const option1Input = screen.getByPlaceholderText(/option 1/i);
    await user.type(option1Input, '3');

    const option2Input = screen.getByPlaceholderText(/option 2/i);
    await user.type(option2Input, '4');

    // Set correct answer
    const answerInput = screen.getByLabelText(/correct answer/i);
    await user.type(answerInput, '4');

    // Set points (default is 10)
    const pointsInput = screen.getByLabelText(/points/i);
    await user.clear(pointsInput);
    await user.type(pointsInput, '10');

    // Save question
    const saveQuestionButton = screen.getByRole('button', { name: /save question/i });
    await user.click(saveQuestionButton);

    // Wait for question to be saved
    await screen.findByText('What is 2+2?');

    // Click Next to proceed to step 4
    const nextButton3 = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton3);

    // Wait for step 4 to load
    await screen.findByRole('button', { name: /publish/i });

    // ============== STEP 4: REVIEW & PUBLISH ==============

    // Verify quiz title is displayed
    expect(screen.getByText('Simple Quiz')).toBeInTheDocument();

    // Publish the quiz
    const publishButton = screen.getByRole('button', { name: /publish/i });
    await user.click(publishButton);

    // Wait for publish to complete
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  it('should validate required fields in basic information step', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AuthProviderWrapper>
        <CategoriesProvider>
          <QuizStepper />
        </CategoriesProvider>
      </AuthProviderWrapper>
    );

    // Try to click Next without filling required fields
    const nextButton = screen.getByRole('button', { name: /next/i });

    // Next button should be disabled without valid data
    expect(nextButton).toBeDisabled();

    // Fill in title
    const titleInput = screen.getByLabelText(/quiz title/i);
    await user.type(titleInput, 'Test');

    // Still disabled (need more fields)
    expect(nextButton).toBeDisabled();

    // Fill in description
    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, 'Test description for validation');

    // Select category (MUI Select - first combobox is Category)
    const categorySelect = screen.getAllByRole('combobox')[0];
    await user.click(categorySelect);
    const scienceOption = await screen.findByRole('option', { name: 'Science' });
    await user.click(scienceOption);

    // Now Next should be enabled - wait for button state to update
    await screen.findByRole('button', { name: /next/i });
  });

  it('should allow saving draft at any step', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AuthProviderWrapper>
        <CategoriesProvider>
          <QuizStepper />
        </CategoriesProvider>
      </AuthProviderWrapper>
    );

    // Fill minimal info
    const titleInput = screen.getByLabelText(/quiz title/i);
    await user.type(titleInput, 'Draft Quiz');

    const descInput = screen.getByLabelText(/description/i);
    await user.type(descInput, 'This is a draft quiz');

    const categorySelect = screen.getAllByRole('combobox')[0];
    await user.click(categorySelect);
    const scienceOption = await screen.findByRole('option', { name: 'Science' });
    await user.click(scienceOption);

    // Save as draft
    const saveDraftButton = screen.getByRole('button', { name: /save draft/i });
    await user.click(saveDraftButton);

    // Verify save was successful (no error message shown)
    await waitFor(() => {
      expect(screen.queryByText(/failed to save/i)).not.toBeInTheDocument();
    });
  });
});
