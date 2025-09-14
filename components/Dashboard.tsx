'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TripForm } from './TripForm'
import { TripCard } from './TripCard'
import { Trip, loadTrips, saveTrip } from '@/lib/trip'

export function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTripsData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const loadedTrips = loadTrips()
      setTrips(loadedTrips)
    } catch (err) {
      setError('Failed to load adventures. Please try again.')
      console.error('Failed to load trips:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTripsData()
  }, [])

  const handleCreateTrip = async (trip: Trip) => {
    try {
      setIsCreating(true)
      await saveTrip(trip)
      await loadTripsData() // Refresh the trip list
      setIsCreateModalOpen(false)
    } catch (err) {
      console.error('Failed to create trip:', err)
      setError('Failed to create trip. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false)
  }

  const getTripCountText = () => {
    if (trips.length === 0) return 'No Adventures Yet'
    if (trips.length === 1) return '1 Adventure'
    return `${trips.length} Adventures`
  }

  if (error && trips.length === 0) {
    return (
      <div data-testid="dashboard" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Oops!</h1>
          <p className="text-gray-600">{error}</p>
          <Button onClick={loadTripsData} data-testid="retry-button">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div data-testid="dashboard" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header data-testid="dashboard-header" className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wanderlist</h1>
              <p className="text-gray-600 mt-1">Create your family adventure stories</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-500">
                {isLoading ? 'Loading adventures...' : getTripCountText()}
              </div>

              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                    aria-label="Create a new trip"
                  >
                    Create New Trip
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Trip</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {isCreating ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Creating trip...</p>
                      </div>
                    ) : (
                      <TripForm
                        onSubmit={handleCreateTrip}
                        onCancel={handleCancelCreate}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your adventures...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No trips yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start your first adventure
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Trip
              </Button>
            </div>
          </div>
        ) : (
          <div data-testid="trip-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}