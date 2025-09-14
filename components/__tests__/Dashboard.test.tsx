import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dashboard } from '../Dashboard'
import { Trip } from '../../lib/trip'

// Mock the trip module
jest.mock('../../lib/trip', () => ({
  loadTrips: jest.fn(),
  saveTrip: jest.fn(),
  generateTripId: jest.fn(() => 'trip-test-123'),
  createTripTemplate: jest.fn(),
}))

// Mock the TripForm and TripCard components
jest.mock('../TripForm', () => ({
  TripForm: ({ onSubmit, onCancel }: any) => (
    <div data-testid="trip-form">
      <button onClick={() => onSubmit({
        id: 'trip-test-123',
        title: 'Test Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      })}>
        Submit Form
      </button>
      <button onClick={onCancel}>Cancel Form</button>
    </div>
  )
}))

jest.mock('../TripCard', () => ({
  TripCard: ({ trip }: any) => (
    <div data-testid={`trip-card-${trip.id}`}>
      <h3>{trip.title}</h3>
      <p>{trip.startDate} to {trip.endDate}</p>
    </div>
  )
}))

describe('Dashboard Component', () => {
  const mockTrips: Trip[] = [
    {
      id: 'trip-1',
      title: 'Summer Road Trip',
      startDate: '2025-07-01',
      endDate: '2025-07-07',
      notes: 'Family vacation',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'trip-2',
      title: 'Weekend Getaway',
      startDate: '2025-03-15',
      endDate: '2025-03-16',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock for loadTrips
    const { loadTrips } = require('../../lib/trip')
    loadTrips.mockReturnValue(mockTrips)
  })

  describe('Component Structure', () => {
    it('should render the dashboard with header', () => {
      render(<Dashboard />)
      expect(screen.getByText('My Wanderlist')).toBeInTheDocument()
      expect(screen.getByText('Create your family adventure stories')).toBeInTheDocument()
    })

    it('should render create new trip button', () => {
      render(<Dashboard />)
      expect(screen.getByRole('button', { name: /Create New Trip/i })).toBeInTheDocument()
    })

    it('should have proper dashboard layout', () => {
      render(<Dashboard />)
      const dashboard = screen.getByTestId('dashboard')
      expect(dashboard).toBeInTheDocument()
      expect(dashboard).toHaveClass('min-h-screen', 'bg-gray-50')
    })
  })

  describe('Trip List Rendering', () => {
    it('should render all trips from localStorage', () => {
      render(<Dashboard />)

      expect(screen.getByTestId('trip-card-trip-1')).toBeInTheDocument()
      expect(screen.getByTestId('trip-card-trip-2')).toBeInTheDocument()
      expect(screen.getByText('Summer Road Trip')).toBeInTheDocument()
      expect(screen.getByText('Weekend Getaway')).toBeInTheDocument()
    })

    it('should render trips in a responsive grid', () => {
      render(<Dashboard />)

      const tripGrid = screen.getByTestId('trip-grid')
      expect(tripGrid).toBeInTheDocument()
      expect(tripGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3')
    })

    it('should handle empty trip list', () => {
      const { loadTrips } = require('../../lib/trip')
      loadTrips.mockReturnValue([])

      render(<Dashboard />)

      expect(screen.getByText(/no trips yet/i)).toBeInTheDocument()
      expect(screen.getByText(/start your first adventure/i)).toBeInTheDocument()
      expect(screen.queryByTestId('trip-grid')).not.toBeInTheDocument()
    })

    it('should show trip count in header', () => {
      render(<Dashboard />)

      expect(screen.getByText('2 Adventures')).toBeInTheDocument()
    })

    it('should show singular "Adventure" for one trip', () => {
      const { loadTrips } = require('../../lib/trip')
      loadTrips.mockReturnValue([mockTrips[0]])

      render(<Dashboard />)

      expect(screen.getByText('1 Adventure')).toBeInTheDocument()
    })
  })

  describe('Create Trip Modal', () => {
    it('should open modal when create button is clicked', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      const createButton = screen.getByRole('button', { name: /create new trip/i })
      await user.click(createButton)

      expect(screen.getByTestId('trip-form')).toBeInTheDocument()
      expect(screen.getByText('Create New Trip')).toBeInTheDocument()
    })

    it('should close modal when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      // Open modal
      const createButton = screen.getByRole('button', { name: /create new trip/i })
      await user.click(createButton)

      // Close modal
      const cancelButton = screen.getByText('Cancel Form')
      await user.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByTestId('trip-form')).not.toBeInTheDocument()
      })
    })

    it('should add new trip to list when form is submitted', async () => {
      const user = userEvent.setup()
      const { loadTrips, saveTrip } = require('../../lib/trip')

      render(<Dashboard />)

      // Open modal
      const createButton = screen.getByRole('button', { name: /create new trip/i })
      await user.click(createButton)

      // Submit form
      const submitButton = screen.getByText('Submit Form')
      await user.click(submitButton)

      await waitFor(() => {
        expect(saveTrip).toHaveBeenCalled()
        expect(screen.queryByTestId('trip-form')).not.toBeInTheDocument()
      })
    })

    it('should refresh trip list after creating new trip', async () => {
      const user = userEvent.setup()
      const { loadTrips } = require('../../lib/trip')

      // Mock updated trip list
      const updatedTrips = [...mockTrips, {
        id: 'trip-test-123',
        title: 'Test Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }]

      loadTrips.mockReturnValue(updatedTrips)

      render(<Dashboard />)

      // Open modal
      const createButton = screen.getByRole('button', { name: /create new trip/i })
      await user.click(createButton)

      // Submit form
      const submitButton = screen.getByText('Submit Form')
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByTestId('trip-card-trip-test-123')).toBeInTheDocument()
        expect(screen.getByText('3 Adventures')).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state while fetching trips', () => {
      const { loadTrips } = require('../../lib/trip')
      loadTrips.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)))

      render(<Dashboard />)

      expect(screen.getByText(/loading adventures/i)).toBeInTheDocument()
    })

    it('should show loading state during trip creation', async () => {
      const user = userEvent.setup()
      const { saveTrip } = require('../../lib/trip')

      saveTrip.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(<Dashboard />)

      // Open modal
      const createButton = screen.getByRole('button', { name: /create new trip/i })
      await user.click(createButton)

      // Submit form
      const submitButton = screen.getByText('Submit Form')
      await user.click(submitButton)

      expect(screen.getByText(/creating trip/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const { loadTrips } = require('../../lib/trip')
      loadTrips.mockImplementation(() => {
        throw new Error('Storage error')
      })

      render(<Dashboard />)

      expect(screen.getByText(/failed to load adventures/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('should retry loading trips when retry button is clicked', async () => {
      const user = userEvent.setup()
      const { loadTrips } = require('../../lib/trip')

      loadTrips.mockImplementationOnce(() => {
        throw new Error('Storage error')
      }).mockReturnValueOnce(mockTrips)

      render(<Dashboard />)

      const retryButton = screen.getByRole('button', { name: /try again/i })
      await user.click(retryButton)

      await waitFor(() => {
        expect(screen.getByTestId('trip-card-trip-1')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Dashboard />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('My Wanderlist')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Create your family adventure stories')
    })

    it('should have descriptive button labels', () => {
      render(<Dashboard />)

      const createButton = screen.getByRole('button', { name: /create new trip/i })
      expect(createButton).toHaveAttribute('aria-label', 'Create a new trip')
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<Dashboard />)

      const createButton = screen.getByRole('button', { name: /create new trip/i })
      createButton.focus()

      await user.keyboard('{Enter}')

      expect(screen.getByTestId('trip-form')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive header layout', () => {
      render(<Dashboard />)

      const header = screen.getByTestId('dashboard-header')
      expect(header).toHaveClass('flex', 'flex-col', 'md:flex-row', 'md:justify-between', 'md:items-center')
    })

    it('should have responsive trip grid', () => {
      render(<Dashboard />)

      const grid = screen.getByTestId('trip-grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')
    })

    it('should have responsive create button', () => {
      render(<Dashboard />)

      const createButton = screen.getByRole('button', { name: /create new trip/i })
      expect(createButton).toHaveClass('w-full', 'md:w-auto')
    })
  })
})