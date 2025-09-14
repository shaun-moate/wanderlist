import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TripForm } from '../TripForm'
import { Trip } from '../../lib/trip'

// Mock the trip module
jest.mock('../../lib/trip', () => ({
  saveTrip: jest.fn(),
  generateTripId: jest.fn(() => 'trip-test-123'),
  createTripTemplate: jest.fn((title, startDate, endDate, notes) => ({
    id: 'trip-test-123',
    title,
    startDate,
    endDate,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  validateTripTitle: jest.fn(),
  validateTripDates: jest.fn(),
  validateTripNotes: jest.fn(),
}))

describe('TripForm Component', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()
  const defaultProps = {
    onSubmit: mockOnSubmit,
    onCancel: mockOnCancel,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Structure', () => {
    it('should render the form with all required fields', () => {
      render(<TripForm {...defaultProps} />)

      expect(screen.getByLabelText(/trip title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/notes/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create trip/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should render form labels correctly', () => {
      render(<TripForm {...defaultProps} />)

      expect(screen.getByText('Trip Title')).toBeInTheDocument()
      expect(screen.getByText('Start Date')).toBeInTheDocument()
      expect(screen.getByText('End Date')).toBeInTheDocument()
      expect(screen.getByText('Notes (Optional)')).toBeInTheDocument()
    })

    it('should have proper form structure', () => {
      render(<TripForm {...defaultProps} />)

      const form = screen.getByRole('form', { hidden: true }) || screen.getByTestId('trip-form')
      expect(form).toBeInTheDocument()
    })
  })

  describe('Form State Management', () => {
    it('should initialize with empty form state', () => {
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i) as HTMLInputElement
      const startDateInput = screen.getByLabelText(/start date/i) as HTMLInputElement
      const endDateInput = screen.getByLabelText(/end date/i) as HTMLInputElement
      const notesTextarea = screen.getByLabelText(/notes/i) as HTMLTextAreaElement

      expect(titleInput.value).toBe('')
      expect(startDateInput.value).toBe('')
      expect(endDateInput.value).toBe('')
      expect(notesTextarea.value).toBe('')
    })

    it('should update title field when user types', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      await user.type(titleInput, 'Summer Road Trip')

      expect(titleInput).toHaveValue('Summer Road Trip')
    })

    it('should update date fields when user selects dates', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)

      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-07')

      expect(startDateInput).toHaveValue('2025-07-01')
      expect(endDateInput).toHaveValue('2025-07-07')
    })

    it('should update notes field when user types', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const notesTextarea = screen.getByLabelText(/notes/i)
      await user.type(notesTextarea, 'Family vacation to Yellowstone')

      expect(notesTextarea).toHaveValue('Family vacation to Yellowstone')
    })
  })

  describe('Form Validation', () => {
    it('should show validation error for empty title', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })

    it('should show validation error for invalid date range', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, 'Test Trip')
      await user.type(startDateInput, '2025-07-07')
      await user.type(endDateInput, '2025-07-01') // End before start
      await user.click(submitButton)

      expect(screen.getByText(/end date cannot be before start date/i)).toBeInTheDocument()
    })

    it('should enforce maxlength attribute on title input', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i) as HTMLInputElement

      // Verify maxlength attribute is set
      expect(titleInput).toHaveAttribute('maxlength', '100')

      // Type exactly 100 characters
      await user.clear(titleInput)
      await user.type(titleInput, 'A'.repeat(100))

      // Verify input is limited to 100 characters
      expect(titleInput.value).toHaveLength(100)
    })

    it('should enforce maxlength attribute on notes textarea', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const notesTextarea = screen.getByLabelText(/notes/i) as HTMLTextAreaElement

      // Verify maxlength attribute is set
      expect(notesTextarea).toHaveAttribute('maxlength', '500')

      // Type exactly 500 characters
      await user.clear(notesTextarea)
      await user.type(notesTextarea, 'A'.repeat(500))

      // Verify textarea is limited to 500 characters
      expect(notesTextarea.value).toHaveLength(500)
    })
  })

  describe('Form Submission', () => {
    it('should call onSubmit with valid trip data', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const notesTextarea = screen.getByLabelText(/notes/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, 'Summer Road Trip')
      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-07')
      await user.type(notesTextarea, 'Family vacation')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          id: 'trip-test-123',
          title: 'Summer Road Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          notes: 'Family vacation',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })
    })

    it('should handle optional notes field', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, 'Quick Trip')
      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-07')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          id: 'trip-test-123',
          title: 'Quick Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          notes: undefined,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      })
    })

    it('should not call onSubmit when form is invalid', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Form Cancellation', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should reset form when cancelled', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      await user.type(titleInput, 'Test Trip')

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(titleInput).toHaveValue('')
    })
  })

  describe('Form Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<TripForm {...defaultProps} />)

      expect(screen.getByLabelText(/trip title/i)).toHaveAttribute('aria-label', 'Trip Title')
      expect(screen.getByLabelText(/start date/i)).toHaveAttribute('aria-label', 'Start Date')
      expect(screen.getByLabelText(/end date/i)).toHaveAttribute('aria-label', 'End Date')
      expect(screen.getByLabelText(/notes/i)).toHaveAttribute('aria-label', 'Notes')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      titleInput.focus()

      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/start date/i)).toHaveFocus()

      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/end date/i)).toHaveFocus()

      await user.keyboard('{Tab}')
      expect(screen.getByLabelText(/notes/i)).toHaveFocus()
    })
  })

  describe('Advanced Validation Scenarios', () => {
    it('should clear title error when user starts typing after validation error', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      // Submit empty form to trigger error
      await user.click(submitButton)
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()

      // Start typing to clear error
      await user.type(titleInput, 'T')
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
    })

    it('should clear date error when user fixes date range', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      // Fill form with invalid date range
      await user.type(titleInput, 'Test Trip')
      await user.type(startDateInput, '2025-07-07')
      await user.type(endDateInput, '2025-07-01') // End before start
      await user.click(submitButton)

      expect(screen.getByText(/end date cannot be before start date/i)).toBeInTheDocument()

      // Fix the date range
      await user.clear(endDateInput)
      await user.type(endDateInput, '2025-07-10')
      expect(screen.queryByText(/end date cannot be before start date/i)).not.toBeInTheDocument()
    })

    it('should show multiple validation errors simultaneously', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
      expect(screen.getByText(/start date and end date are required/i)).toBeInTheDocument()
    })

    it('should handle same start and end date (valid)', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, 'Day Trip')
      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-01') // Same date
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })
    })

    it('should handle special characters in title', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, 'Trip to Paris! 🌟 (2025)')
      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-07')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Trip to Paris! 🌟 (2025)'
          })
        )
      })
    })

    it('should handle whitespace-only title as invalid', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, '   ') // Only whitespace
      await user.click(submitButton)

      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })

    it('should trim whitespace from title before validation', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, '  Valid Title  ')
      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-07')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Valid Title'
          })
        )
      })
    })
  })

  describe('Error Message Display', () => {
    it('should display error messages with proper styling', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      const errorMessage = screen.getByText(/title is required/i)
      expect(errorMessage).toHaveClass('text-red-600')
      expect(errorMessage).toHaveAttribute('role', 'alert')
    })

    it('should highlight input fields with errors', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      const titleInput = screen.getByLabelText(/trip title/i)
      expect(titleInput).toHaveClass('border-red-500')
    })

    it('should show character counter for notes', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const notesTextarea = screen.getByLabelText(/notes/i)
      const characterCounter = screen.getByText('0/500 characters')

      expect(characterCounter).toBeInTheDocument()
      expect(characterCounter).toHaveClass('text-gray-500')

      await user.type(notesTextarea, 'Test notes')
      expect(screen.getByText('10/500 characters')).toBeInTheDocument()
    })

    it('should update character counter in real-time', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const notesTextarea = screen.getByLabelText(/notes/i)

      await user.type(notesTextarea, 'Hello')
      expect(screen.getByText('5/500 characters')).toBeInTheDocument()

      await user.type(notesTextarea, ' World')
      expect(screen.getByText('11/500 characters')).toBeInTheDocument()

      await user.clear(notesTextarea)
      expect(screen.getByText('0/500 characters')).toBeInTheDocument()
    })
  })

  describe('Form Reset Behavior', () => {
    it('should reset form after successful submission', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i) as HTMLInputElement
      const startDateInput = screen.getByLabelText(/start date/i) as HTMLInputElement
      const endDateInput = screen.getByLabelText(/end date/i) as HTMLInputElement
      const notesTextarea = screen.getByLabelText(/notes/i) as HTMLTextAreaElement
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      // Fill and submit form
      await user.type(titleInput, 'Test Trip')
      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-07')
      await user.type(notesTextarea, 'Test notes')
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled()
      })

      // Check form is reset
      expect(titleInput.value).toBe('')
      expect(startDateInput.value).toBe('')
      expect(endDateInput.value).toBe('')
      expect(notesTextarea.value).toBe('')
    })

    it('should reset form when cancelled', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i) as HTMLInputElement
      const cancelButton = screen.getByRole('button', { name: /cancel/i })

      // Fill form
      await user.type(titleInput, 'Test Trip')

      // Cancel
      await user.click(cancelButton)

      // Check form is reset
      expect(titleInput.value).toBe('')
      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should clear errors when form is reset', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      const cancelButton = screen.getByRole('button', { name: /cancel/i })

      // Trigger errors
      await user.click(submitButton)
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()

      // Cancel to reset
      await user.click(cancelButton)

      // Check errors are cleared
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
    })
  })
})