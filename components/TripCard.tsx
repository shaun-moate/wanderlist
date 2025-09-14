'use client'

import React from 'react'
import { Trip } from '@/lib/trip'

interface TripCardProps {
  trip: Trip
}

export function TripCard({ trip }: TripCardProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article
      data-testid="trip-card"
      role="article"
      className="w-full max-w-sm bg-white rounded-lg shadow-md border border-gray-200 border-l-4 border-l-blue-500 p-6 space-y-4 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-800 leading-tight">
          {trip.title}
        </h3>

        <div data-testid="date-range" className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <span className="font-medium">From:</span>
            <span>{formatDate(trip.startDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">To:</span>
            <span>{formatDate(trip.endDate)}</span>
          </div>
        </div>
      </div>

      {trip.notes && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Notes:</p>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-md p-3">
            {trip.notes}
          </p>
        </div>
      )}

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Created {formatDate(trip.createdAt)}
        </p>
      </div>
    </article>
  )
}