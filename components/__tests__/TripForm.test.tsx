import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TripForm } from '../TripForm'
import { Trip } from '../../lib/trip'

// Mock the trip module
jest.mock('../../lib/trip', () => ({
  saveTrip: jest.fn(),
  generateTripId: jest.fn(() => 'trip-test-123'),
  createTripTemplate: jest.fn(),
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

    it('should show validation error for title too long', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      // Clear the input first, then type exactly 101 characters
      await user.clear(titleInput)
      // Since maxlength="100", we need to set the value directly
      await user.type(titleInput, 'A'.repeat(100))
      // Now manually set a value longer than 100 to test validation
      titleInput.setAttribute('value', 'A'.repeat(101))
      fireEvent.change(titleInput)

      const submitButton = screen.getByRole('button', { name: /create trip/i })
      await user.click(submitButton)

      expect(screen.getByText(/title cannot exceed 100 characters/i)).toBeInTheDocument()
    })

    it('should show validation error for notes too long', async () => {
      const user = userEvent.setup()
      render(<TripForm {...defaultProps} />)

      const titleInput = screen.getByLabelText(/trip title/i)
      const startDateInput = screen.getByLabelText(/start date/i)
      const endDateInput = screen.getByLabelText(/end date/i)
      const notesTextarea = screen.getByLabelText(/notes/i)
      const submitButton = screen.getByRole('button', { name: /create trip/i })

      await user.type(titleInput, 'Test Trip')
      await user.type(startDateInput, '2025-07-01')
      await user.type(endDateInput, '2025-07-07')
      await user.type(notesTextarea, 'A'.repeat(501))
      await user.click(submitButton)

      expect(screen.getByText(/notes cannot exceed 500 characters/i)).toBeInTheDocument()
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
})