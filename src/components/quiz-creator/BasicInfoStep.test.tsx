import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent } from '../../test/utils';
import { CategoriesProvider } from '../../context/categories-context';
import { BasicInfoStep } from './BasicInfoStep';
import { QuizBasicInfo } from '../../types/quiz-creation';

describe('BasicInfoStep', () => {
  const mockBasicInfo: QuizBasicInfo = {
    title: '',
    description: '',
    category: '',
    quizType: 'SLIDES',
    difficulty: 'MEDIUM',
    quizVisibility: 'PUBLIC',
    pictureUrl: ''
  };

  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  it('should render all form fields', () => {
    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    expect(screen.getByLabelText(/quiz title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/quiz description/i)).toBeInTheDocument();
    expect(screen.getAllByText('Category *').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Quiz Type').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Difficulty').length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/cover image url/i)).toBeInTheDocument();
  });

  it('should update title when user types', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const titleInput = screen.getByLabelText(/quiz title/i);
    await user.type(titleInput, 'Test');

    // Verify onUpdate was called with each character
    expect(mockOnUpdate).toHaveBeenCalled();
    const calls = mockOnUpdate.mock.calls;
    expect(calls[0][0].title).toBe('T');
    expect(calls[1][0].title).toBe('e');
    expect(calls[2][0].title).toBe('s');
    expect(calls[3][0].title).toBe('t');
  });

  it('should update description when user types', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const descInput = screen.getByLabelText(/quiz description/i);
    await user.type(descInput, 'Test');

    // Verify onUpdate was called with each character
    expect(mockOnUpdate).toHaveBeenCalled();
    const calls = mockOnUpdate.mock.calls;
    expect(calls[0][0].description).toBe('T');
    expect(calls[1][0].description).toBe('e');
    expect(calls[2][0].description).toBe('s');
    expect(calls[3][0].description).toBe('t');
  });

  it('should show error when title is too short on blur', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={{ ...mockBasicInfo, title: 'AB' }} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const titleInput = screen.getByLabelText(/quiz title/i);
    await user.click(titleInput);
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show error when description is too short on blur', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={{ ...mockBasicInfo, description: 'Short' }} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const descInput = screen.getByLabelText(/quiz description/i);
    await user.click(descInput);
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/description must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('should show error when title is empty on blur', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const titleInput = screen.getByLabelText(/quiz title/i);
    await user.click(titleInput);
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('should show error when description is empty on blur', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const descInput = screen.getByLabelText(/quiz description/i);
    await user.click(descInput);
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('should update category when selected', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    // Click the category select (first combobox)
    const selects = screen.getAllByRole('combobox');
    await user.click(selects[0]);

    // Select Science
    const scienceOption = await screen.findByRole('option', { name: 'Science' });
    await user.click(scienceOption);

    const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];
    expect(lastCall.category).toBe('SCIENCE');
  });

  it('should update difficulty when selected', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    // Click the difficulty select (third combobox - category, quizType, difficulty)
    const selects = screen.getAllByRole('combobox');
    await user.click(selects[2]);

    // Select Easy
    const easyOption = await screen.findByRole('option', { name: 'Easy' });
    await user.click(easyOption);

    const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];
    expect(lastCall.difficulty).toBe('EASY');
  });

  it('should toggle visibility switch', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    // Find the switch - look for the label text and find the associated input
    const publicLabel = screen.getByText(/public \(anyone can find and play\)/i);

    // Find the checkbox input that's a sibling of the label
    const switchContainer = publicLabel.closest('.MuiFormControlLabel-root');
    const visibilitySwitch = switchContainer?.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(visibilitySwitch).toBeChecked(); // PUBLIC by default

    // Toggle to PRIVATE
    await user.click(visibilitySwitch);

    const lastCall = mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1][0];
    expect(lastCall.quizVisibility).toBe('PRIVATE');
  });

  it('should show error for invalid image URL', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={{ ...mockBasicInfo, pictureUrl: 'not-a-url' }} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const urlInput = screen.getByLabelText(/cover image url/i);
    await user.click(urlInput);
    await user.tab(); // Trigger blur

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });
  });

  it('should show image preview for valid URL', () => {
    const validUrl = 'https://example.com/image.jpg';

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={{ ...mockBasicInfo, pictureUrl: validUrl }} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const image = screen.getByAltText(/quiz cover preview/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', validUrl);
  });

  it('should display helper text for each field', () => {
    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    expect(screen.getByText(/give your quiz an engaging title/i)).toBeInTheDocument();
    expect(screen.getByText(/describe what your quiz is about/i)).toBeInTheDocument();
    expect(screen.getByText(/add a cover image to make your quiz more appealing/i)).toBeInTheDocument();
  });

  it('should show tip alert for image upload', () => {
    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={mockBasicInfo} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    expect(screen.getByText(/tip:/i)).toBeInTheDocument();
    expect(screen.getByText(/for best results, use images that are 16:9 aspect ratio/i)).toBeInTheDocument();
  });

  it('should clear error when user starts typing after validation error', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CategoriesProvider>
        <BasicInfoStep basicInfo={{ ...mockBasicInfo, title: 'AB' }} onUpdate={mockOnUpdate} />
      </CategoriesProvider>
    );

    const titleInput = screen.getByLabelText(/quiz title/i);

    // Trigger blur to show error
    await user.click(titleInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    await user.click(titleInput);
    await user.type(titleInput, 'C');

    await waitFor(() => {
      expect(screen.queryByText(/title must be at least 3 characters/i)).not.toBeInTheDocument();
    });
  });
});
