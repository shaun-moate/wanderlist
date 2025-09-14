import React from 'react'
import { render, screen } from '@testing-library/react'
import { TripCard } from '../TripCard'
import { Trip } from '../../lib/trip'

// Mock the trip module
jest.mock('../../lib/trip', () => ({
  formatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
}))

describe('TripCard Component', () => {
  const mockTrip: Trip = {
    id: 'trip-1',
    title: 'Summer Road Trip',
    startDate: '2025-07-01',
    endDate: '2025-07-07',
    notes: 'Family vacation to Yellowstone',
    stage: 'daydream',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }

  const mockTripWithoutNotes: Trip = {
    id: 'trip-2',
    title: 'Quick Weekend Getaway',
    startDate: '2025-03-15',
    endDate: '2025-03-16',
    stage: 'quest',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }

  describe('Component Structure', () => {
    it('should render trip title', () => {
      render(<TripCard trip={mockTrip} />)
      expect(screen.getByText('Summer Road Trip')).toBeInTheDocument()
    })

    it('should render trip dates', () => {
      render(<TripCard trip={mockTrip} />)
      expect(screen.getByText(/July 1, 2025/)).toBeInTheDocument()
      expect(screen.getByText(/July 7, 2025/)).toBeInTheDocument()
    })

    it('should render trip notes when present', () => {
      render(<TripCard trip={mockTrip} />)
      expect(screen.getByText('Family vacation to Yellowstone')).toBeInTheDocument()
    })

    it('should handle trips without notes', () => {
      render(<TripCard trip={mockTripWithoutNotes} />)
      expect(screen.getByText('Quick Weekend Getaway')).toBeInTheDocument()
      expect(screen.queryByText('Notes:')).not.toBeInTheDocument()
    })

    it('should have proper card structure', () => {
      render(<TripCard trip={mockTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md')
    })
  })

  describe('Date Formatting', () => {
    it('should format single day trips correctly', () => {
      render(<TripCard trip={mockTripWithoutNotes} />)
      expect(screen.getByText(/March 15, 2025/)).toBeInTheDocument()
      expect(screen.getByText(/March 16, 2025/)).toBeInTheDocument()
    })

    it('should format multi-day trips correctly', () => {
      render(<TripCard trip={mockTrip} />)
      expect(screen.getByText(/July 1, 2025/)).toBeInTheDocument()
      expect(screen.getByText(/July 7, 2025/)).toBeInTheDocument()
    })

    it('should show date range format', () => {
      render(<TripCard trip={mockTrip} />)
      const dateRange = screen.getByTestId('date-range')
      expect(dateRange).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(<TripCard trip={mockTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveClass('w-full', 'max-w-sm')
    })

    it('should have proper spacing classes', () => {
      render(<TripCard trip={mockTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveClass('p-6', 'space-y-4')
    })
  })

  describe('Narrative Theme Styling', () => {
    it('should have story-like appearance', () => {
      render(<TripCard trip={mockTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveClass('border-l-4', 'border-l-blue-400')
    })

    it('should have readable typography', () => {
      render(<TripCard trip={mockTrip} />)
      const title = screen.getByText('Summer Road Trip')
      expect(title).toHaveClass('text-xl', 'font-semibold', 'text-gray-800')
    })

    it('should have warm color scheme', () => {
      render(<TripCard trip={mockTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveClass('bg-white', 'border-gray-200')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<TripCard trip={mockTrip} />)
      const title = screen.getByRole('heading', { level: 3 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Summer Road Trip')
    })

    it('should have descriptive date labels', () => {
      render(<TripCard trip={mockTrip} />)
      expect(screen.getByText('From:')).toBeInTheDocument()
      expect(screen.getByText('To:')).toBeInTheDocument()
    })

    it('should have proper semantic structure', () => {
      render(<TripCard trip={mockTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveAttribute('role', 'article')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long titles gracefully', () => {
      const longTitleTrip = { ...mockTrip, title: 'A Very Long Trip Title That Should Be Handled Gracefully Without Breaking The Layout' }
      render(<TripCard trip={longTitleTrip} />)
      expect(screen.getByText(longTitleTrip.title)).toBeInTheDocument()
    })

    it('should handle very long notes gracefully', () => {
      const longNotesTrip = { ...mockTrip, notes: 'A'.repeat(200) }
      render(<TripCard trip={longNotesTrip} />)
      const notesElement = screen.getByText('A'.repeat(200))
      expect(notesElement).toBeInTheDocument()
    })

    it('should handle empty notes string', () => {
      const emptyNotesTrip = { ...mockTrip, notes: '' }
      render(<TripCard trip={emptyNotesTrip} />)
      expect(screen.getByText('Summer Road Trip')).toBeInTheDocument()
      expect(screen.queryByText('Notes:')).not.toBeInTheDocument()
    })
  })

  describe('Stage Display', () => {
    it('should display stage label for daydream trips', () => {
      render(<TripCard trip={mockTrip} />)
      expect(screen.getByText('Daydream')).toBeInTheDocument()
    })

    it('should display stage label for quest trips', () => {
      render(<TripCard trip={mockTripWithoutNotes} />)
      expect(screen.getByText('Quest')).toBeInTheDocument()
    })

    it('should display stage label for tale trips', () => {
      const taleTrip = { ...mockTrip, stage: 'tale' as const }
      render(<TripCard trip={taleTrip} />)
      expect(screen.getByText('Tale')).toBeInTheDocument()
    })

    it('should have stage-specific visual styling for daydream', () => {
      render(<TripCard trip={mockTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveClass('border-l-blue-400')
    })

    it('should have stage-specific visual styling for quest', () => {
      render(<TripCard trip={mockTripWithoutNotes} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveClass('border-l-green-500')
    })

    it('should have stage-specific visual styling for tale', () => {
      const taleTrip = { ...mockTrip, stage: 'tale' as const }
      render(<TripCard trip={taleTrip} />)
      const card = screen.getByTestId('trip-card')
      expect(card).toHaveClass('border-l-amber-500')
    })

    it('should display stage icon for daydream', () => {
      render(<TripCard trip={mockTrip} />)
      const stageIcon = screen.getByTestId('stage-icon')
      expect(stageIcon).toBeInTheDocument()
      expect(stageIcon).toHaveAttribute('data-icon', 'lightbulb')
    })

    it('should display stage icon for quest', () => {
      render(<TripCard trip={mockTripWithoutNotes} />)
      const stageIcon = screen.getByTestId('stage-icon')
      expect(stageIcon).toBeInTheDocument()
      expect(stageIcon).toHaveAttribute('data-icon', 'map')
    })

    it('should display stage icon for tale', () => {
      const taleTrip = { ...mockTrip, stage: 'tale' as const }
      render(<TripCard trip={taleTrip} />)
      const stageIcon = screen.getByTestId('stage-icon')
      expect(stageIcon).toBeInTheDocument()
      expect(stageIcon).toHaveAttribute('data-icon', 'book-open')
    })
  })

  describe('Stage Progression', () => {
    it('should show advance button for daydream trips', () => {
      render(<TripCard trip={mockTrip} onStageAdvance={() => {}} />)
      const advanceButton = screen.getByRole('button', { name: /start quest/i })
      expect(advanceButton).toBeInTheDocument()
    })

    it('should show advance button for quest trips', () => {
      render(<TripCard trip={mockTripWithoutNotes} onStageAdvance={() => {}} />)
      const advanceButton = screen.getByRole('button', { name: /complete tale/i })
      expect(advanceButton).toBeInTheDocument()
    })

    it('should not show advance button for tale trips', () => {
      const taleTrip = { ...mockTrip, stage: 'tale' as const }
      render(<TripCard trip={taleTrip} />)
      const advanceButton = screen.queryByRole('button', { name: /advance/i })
      expect(advanceButton).not.toBeInTheDocument()
    })

    it('should call onStageAdvance when advance button is clicked', () => {
      const mockOnStageAdvance = jest.fn()
      render(<TripCard trip={mockTrip} onStageAdvance={mockOnStageAdvance} />)
      const advanceButton = screen.getByRole('button', { name: /start quest/i })
      advanceButton.click()
      expect(mockOnStageAdvance).toHaveBeenCalledWith('trip-1', 'quest')
    })
  })

  describe('Data Integrity', () => {
    it('should display all required trip data', () => {
      render(<TripCard trip={mockTrip} />)

      expect(screen.getByText('Summer Road Trip')).toBeInTheDocument()
      expect(screen.getByText(/July 1, 2025/)).toBeInTheDocument()
      expect(screen.getByText(/July 7, 2025/)).toBeInTheDocument()
      expect(screen.getByText('Family vacation to Yellowstone')).toBeInTheDocument()
      expect(screen.getByText('Daydream')).toBeInTheDocument()
    })

    it('should not crash with minimal trip data', () => {
      const minimalTrip: Trip = {
        id: 'minimal',
        title: 'Minimal Trip',
        startDate: '2025-01-01',
        endDate: '2025-01-01',
        stage: 'daydream',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z'
      }

      expect(() => render(<TripCard trip={minimalTrip} />)).not.toThrow()
      expect(screen.getByText('Minimal Trip')).toBeInTheDocument()
      expect(screen.getByText('Daydream')).toBeInTheDocument()
    })
  })
})