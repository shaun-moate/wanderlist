// Trip data types and validation utilities

export interface Trip {
  id: string
  title: string
  startDate: string
  endDate: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateTrip(trip: any): ValidationResult {
  const errors: string[] = []

  // Required fields validation
  const requiredFields = ['id', 'title', 'startDate', 'endDate', 'createdAt', 'updatedAt']
  for (const field of requiredFields) {
    if (!trip[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Title validation
  if (trip.title !== undefined) {
    if (typeof trip.title !== 'string') {
      errors.push('Title must be a string')
    } else if (trip.title.trim() === '') {
      errors.push('Title cannot be empty')
    } else if (trip.title.length > 100) {
      errors.push('Title cannot exceed 100 characters')
    }
  }

  // Date validation
  const dateFields = ['startDate', 'endDate', 'createdAt', 'updatedAt']
  for (const field of dateFields) {
    if (trip[field] && !isValidDateString(trip[field])) {
      errors.push(`Invalid date format for ${field}`)
    }
  }

  // Date logic validation
  if (trip.startDate && trip.endDate) {
    const startDate = new Date(trip.startDate)
    const endDate = new Date(trip.endDate)
    if (startDate > endDate) {
      errors.push('End date cannot be before start date')
    }
  }

  // Notes validation
  if (trip.notes !== undefined) {
    if (typeof trip.notes !== 'string') {
      errors.push('Notes must be a string')
    } else if (trip.notes.length > 500) {
      errors.push('Notes cannot exceed 500 characters')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export function isValidTrip(trip: any): boolean {
  return validateTrip(trip).isValid
}

// Additional validation helpers
export function validateTripTitle(title: string): string | null {
  if (!title || typeof title !== 'string') {
    return 'Title is required'
  }
  if (title.trim() === '') {
    return 'Title cannot be empty'
  }
  if (title.length > 100) {
    return 'Title cannot exceed 100 characters'
  }
  return null
}

export function validateTripDates(startDate: string, endDate: string): string | null {
  if (!isValidDateString(startDate)) {
    return 'Invalid start date format'
  }
  if (!isValidDateString(endDate)) {
    return 'Invalid end date format'
  }
  if (new Date(startDate) > new Date(endDate)) {
    return 'End date cannot be before start date'
  }
  return null
}

export function validateTripNotes(notes?: string): string | null {
  if (notes && typeof notes !== 'string') {
    return 'Notes must be a string'
  }
  if (notes && notes.length > 500) {
    return 'Notes cannot exceed 500 characters'
  }
  return null
}

export function generateTripId(): string {
  return `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function createTripTemplate(title: string, startDate: string, endDate: string, notes?: string): Trip {
  const now = new Date().toISOString()
  return {
    id: generateTripId(),
    title: title.trim(),
    startDate,
    endDate,
    notes: notes?.trim(),
    createdAt: now,
    updatedAt: now
  }
}

function isValidDateString(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}/) !== null
}

// localStorage utility functions
const TRIPS_STORAGE_KEY = 'wanderlist_trips'

export function saveTrip(trip: Trip): void {
  try {
    const trips = loadTrips()
    const existingIndex = trips.findIndex(t => t.id === trip.id)

    if (existingIndex >= 0) {
      // Update existing trip
      trips[existingIndex] = { ...trip, updatedAt: new Date().toISOString() }
    } else {
      // Add new trip
      trips.push(trip)
    }

    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips))
  } catch (error) {
    console.error('Failed to save trip:', error)
    throw new Error('Failed to save trip to local storage')
  }
}

export function loadTrips(): Trip[] {
  try {
    const stored = localStorage.getItem(TRIPS_STORAGE_KEY)
    if (!stored) return []

    const trips = JSON.parse(stored)
    return Array.isArray(trips) ? trips : []
  } catch (error) {
    console.error('Failed to load trips:', error)
    return []
  }
}

export function loadTrip(id: string): Trip | null {
  const trips = loadTrips()
  return trips.find(trip => trip.id === id) || null
}

export function deleteTrip(id: string): boolean {
  try {
    const trips = loadTrips()
    const filteredTrips = trips.filter(trip => trip.id !== id)

    if (filteredTrips.length === trips.length) {
      return false // Trip not found
    }

    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filteredTrips))
    return true
  } catch (error) {
    console.error('Failed to delete trip:', error)
    throw new Error('Failed to delete trip from local storage')
  }
}

export function clearAllTrips(): void {
  try {
    localStorage.removeItem(TRIPS_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear trips:', error)
    throw new Error('Failed to clear trips from local storage')
  }
}