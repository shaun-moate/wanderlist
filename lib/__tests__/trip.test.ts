import {
  Trip,
  validateTrip,
  isValidTrip,
  saveTrip,
  loadTrips,
  loadTrip,
  deleteTrip,
  clearAllTrips,
  validateTripTitle,
  validateTripDates,
  validateTripNotes,
  generateTripId,
  createTripTemplate
} from '../trip'

describe('Trip Interface and Data Validation', () => {
  describe('Trip Interface', () => {
    it('should create a valid trip object', () => {
      const trip: Trip = {
        id: 'trip-1',
        title: 'Summer Road Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        notes: 'Family vacation to Yellowstone',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      expect(trip.id).toBe('trip-1')
      expect(trip.title).toBe('Summer Road Trip')
      expect(trip.startDate).toBe('2025-07-01')
      expect(trip.endDate).toBe('2025-07-07')
      expect(trip.notes).toBe('Family vacation to Yellowstone')
    })

    it('should allow optional notes field', () => {
      const trip: Trip = {
        id: 'trip-2',
        title: 'Quick Weekend Getaway',
        startDate: '2025-03-15',
        endDate: '2025-03-16',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      expect(trip.notes).toBeUndefined()
    })
  })

  describe('validateTrip function', () => {
    it('should validate a complete valid trip', () => {
      const validTrip = {
        id: 'trip-1',
        title: 'Summer Road Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        notes: 'Family vacation to Yellowstone',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      const result = validateTrip(validTrip)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject trip with missing required fields', () => {
      const invalidTrip = {
        title: 'Summer Road Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07'
      }

      const result = validateTrip(invalidTrip)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Missing required field: id')
      expect(result.errors).toContain('Missing required field: createdAt')
      expect(result.errors).toContain('Missing required field: updatedAt')
    })

    it('should reject trip with empty title', () => {
      const invalidTrip = {
        id: 'trip-1',
        title: '',
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      const result = validateTrip(invalidTrip)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Title cannot be empty')
    })

    it('should reject trip with title too long', () => {
      const longTitle = 'A'.repeat(101)
      const invalidTrip = {
        id: 'trip-1',
        title: longTitle,
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      const result = validateTrip(invalidTrip)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Title cannot exceed 100 characters')
    })

    it('should reject trip with invalid date format', () => {
      const invalidTrip = {
        id: 'trip-1',
        title: 'Summer Road Trip',
        startDate: '07/01/2025', // Wrong format
        endDate: '2025-07-07',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      const result = validateTrip(invalidTrip)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid date format for startDate')
    })

    it('should reject trip with end date before start date', () => {
      const invalidTrip = {
        id: 'trip-1',
        title: 'Summer Road Trip',
        startDate: '2025-07-07',
        endDate: '2025-07-01', // Before start date
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      const result = validateTrip(invalidTrip)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('End date cannot be before start date')
    })

    it('should reject trip with notes too long', () => {
      const longNotes = 'A'.repeat(501)
      const invalidTrip = {
        id: 'trip-1',
        title: 'Summer Road Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        notes: longNotes,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      const result = validateTrip(invalidTrip)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Notes cannot exceed 500 characters')
    })
  })

  describe('isValidTrip function', () => {
    it('should return true for valid trip', () => {
      const validTrip = {
        id: 'trip-1',
        title: 'Summer Road Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z'
      }

      expect(isValidTrip(validTrip)).toBe(true)
    })

    it('should return false for invalid trip', () => {
      const invalidTrip = {
        title: 'Summer Road Trip',
        startDate: '2025-07-01',
        endDate: '2025-07-07'
      }

      expect(isValidTrip(invalidTrip)).toBe(false)
    })
  })

  describe('localStorage Operations', () => {
    let originalSetItem: any
    let originalRemoveItem: any

    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear()
      jest.clearAllMocks()
      originalSetItem = Storage.prototype.setItem
      originalRemoveItem = Storage.prototype.removeItem
    })

    afterEach(() => {
      // Restore original methods after each test
      Storage.prototype.setItem = originalSetItem
      Storage.prototype.removeItem = originalRemoveItem
    })

    describe('saveTrip function', () => {
      it('should save a new trip to localStorage', () => {
        const trip: Trip = {
          id: 'trip-1',
          title: 'Summer Road Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          notes: 'Family vacation',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        saveTrip(trip)

        const stored = localStorage.getItem('wanderlist_trips')
        expect(stored).not.toBeNull()
        const trips = JSON.parse(stored!)
        expect(trips).toHaveLength(1)
        expect(trips[0]).toEqual(trip)
      })

      it('should update existing trip', () => {
        const originalTrip: Trip = {
          id: 'trip-1',
          title: 'Summer Road Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        saveTrip(originalTrip)

        const updatedTrip = { ...originalTrip, title: 'Updated Road Trip' }
        saveTrip(updatedTrip)

        const trips = loadTrips()
        expect(trips).toHaveLength(1)
        expect(trips[0].title).toBe('Updated Road Trip')
      })

      it('should handle localStorage errors', () => {
        // Mock localStorage.setItem to throw an error
        const originalSetItem = localStorage.setItem
        localStorage.setItem = jest.fn(() => {
          throw new Error('Storage quota exceeded')
        })

        const trip: Trip = {
          id: 'trip-1',
          title: 'Test Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        expect(() => saveTrip(trip)).toThrow('Failed to save trip to local storage')
      })
    })

    describe('loadTrips function', () => {
      it('should return empty array when no trips stored', () => {
        const trips = loadTrips()
        expect(trips).toEqual([])
      })

      it('should load trips from localStorage', () => {
        const trip: Trip = {
          id: 'trip-1',
          title: 'Summer Road Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        localStorage.setItem('wanderlist_trips', JSON.stringify([trip]))

        const trips = loadTrips()
        expect(trips).toHaveLength(1)
        expect(trips[0]).toEqual(trip)
      })

      it('should handle corrupted localStorage data', () => {
        localStorage.setItem('wanderlist_trips', 'invalid json')

        const trips = loadTrips()
        expect(trips).toEqual([])
      })
    })

    describe('loadTrip function', () => {
      it('should return null when trip not found', () => {
        const trip = loadTrip('nonexistent')
        expect(trip).toBeNull()
      })

      it('should return trip when found', () => {
        const trip1: Trip = {
          id: 'trip-1',
          title: 'Trip 1',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        const trip2: Trip = {
          id: 'trip-2',
          title: 'Trip 2',
          startDate: '2025-08-01',
          endDate: '2025-08-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        localStorage.setItem('wanderlist_trips', JSON.stringify([trip1, trip2]))

        const loadedTrip = loadTrip('trip-2')
        expect(loadedTrip).toEqual(trip2)
      })
    })

    describe('deleteTrip function', () => {
      it('should return false when trip not found', () => {
        const result = deleteTrip('nonexistent')
        expect(result).toBe(false)
      })

      it('should delete trip and return true', () => {
        const trip: Trip = {
          id: 'trip-1',
          title: 'Summer Road Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        localStorage.setItem('wanderlist_trips', JSON.stringify([trip]))

        const result = deleteTrip('trip-1')
        expect(result).toBe(true)

        const trips = loadTrips()
        expect(trips).toHaveLength(0)
      })

      it('should handle localStorage errors', () => {
        // First save a trip so there's something to delete
        const trip: Trip = {
          id: 'trip-1',
          title: 'Test Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }
        localStorage.setItem('wanderlist_trips', JSON.stringify([trip]))

        // Mock localStorage.setItem to throw an error
        const originalSetItem = localStorage.setItem
        localStorage.setItem = jest.fn(() => {
          throw new Error('Storage error')
        })

        expect(() => deleteTrip('trip-1')).toThrow('Failed to delete trip from local storage')
      })
    })

    describe('clearAllTrips function', () => {
      it('should clear all trips from localStorage', () => {
        const trip: Trip = {
          id: 'trip-1',
          title: 'Summer Road Trip',
          startDate: '2025-07-01',
          endDate: '2025-07-07',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-15T10:00:00Z'
        }

        localStorage.setItem('wanderlist_trips', JSON.stringify([trip]))

        clearAllTrips()

        expect(localStorage.getItem('wanderlist_trips')).toBeNull()
      })

      it('should handle localStorage errors', () => {
        // Mock localStorage.removeItem to throw an error
        const originalRemoveItem = localStorage.removeItem
        localStorage.removeItem = jest.fn(() => {
          throw new Error('Storage error')
        })

        expect(() => clearAllTrips()).toThrow('Failed to clear trips from local storage')
      })
    })
  })

  describe('Validation Helpers', () => {
    describe('validateTripTitle function', () => {
      it('should validate valid titles', () => {
        expect(validateTripTitle('Summer Road Trip')).toBeNull()
        expect(validateTripTitle('A')).toBeNull()
      })

      it('should reject invalid titles', () => {
        expect(validateTripTitle('')).toBe('Title is required')
        expect(validateTripTitle('A'.repeat(101))).toBe('Title cannot exceed 100 characters')
      })
    })

    describe('validateTripDates function', () => {
      it('should validate valid date ranges', () => {
        expect(validateTripDates('2025-07-01', '2025-07-07')).toBeNull()
        expect(validateTripDates('2025-07-01', '2025-07-01')).toBeNull()
      })

      it('should reject invalid date ranges', () => {
        expect(validateTripDates('2025-07-07', '2025-07-01')).toBe('End date cannot be before start date')
        expect(validateTripDates('invalid', '2025-07-01')).toBe('Invalid start date format')
      })
    })

    describe('validateTripNotes function', () => {
      it('should validate valid notes', () => {
        expect(validateTripNotes('Some notes')).toBeNull()
        expect(validateTripNotes('')).toBeNull()
        expect(validateTripNotes(undefined)).toBeNull()
      })

      it('should reject invalid notes', () => {
        expect(validateTripNotes('A'.repeat(501))).toBe('Notes cannot exceed 500 characters')
      })
    })
  })

  describe('Utility Functions', () => {
    describe('generateTripId function', () => {
      it('should generate unique IDs', () => {
        const id1 = generateTripId()
        const id2 = generateTripId()

        expect(id1).not.toBe(id2)
        expect(id1).toMatch(/^trip-\d+-[a-z0-9]+$/)
      })
    })

    describe('createTripTemplate function', () => {
      it('should create a valid trip template', () => {
        const trip = createTripTemplate('Summer Trip', '2025-07-01', '2025-07-07', 'Family vacation')

        expect(trip.title).toBe('Summer Trip')
        expect(trip.startDate).toBe('2025-07-01')
        expect(trip.endDate).toBe('2025-07-07')
        expect(trip.notes).toBe('Family vacation')
        expect(trip.id).toMatch(/^trip-\d+-[a-z0-9]+$/)
        expect(trip.createdAt).toBe(trip.updatedAt)
      })

      it('should handle optional notes', () => {
        const trip = createTripTemplate('Summer Trip', '2025-07-01', '2025-07-07')

        expect(trip.notes).toBeUndefined()
      })
    })
  })
})