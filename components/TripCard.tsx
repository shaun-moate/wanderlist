'use client'

import React from 'react'
import { Trip, TripStage } from '@/lib/trip'
import { Lightbulb, Map, BookOpen } from 'lucide-react'

interface TripCardProps {
  trip: Trip
  onStageAdvance?: (tripId: string, newStage: TripStage) => void
}

export function TripCard({ trip, onStageAdvance }: TripCardProps) {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStageInfo = (stage: TripStage) => {
    switch (stage) {
      case 'daydream':
        return {
          label: 'Daydream',
          color: 'border-l-blue-400',
          icon: Lightbulb,
          nextStage: 'quest' as TripStage,
          buttonText: 'Start Quest'
        }
      case 'quest':
        return {
          label: 'Quest',
          color: 'border-l-green-500',
          icon: Map,
          nextStage: 'tale' as TripStage,
          buttonText: 'Complete Tale'
        }
      case 'tale':
        return {
          label: 'Tale',
          color: 'border-l-amber-500',
          icon: BookOpen,
          nextStage: null,
          buttonText: null
        }
    }
  }

  const stageInfo = getStageInfo(trip.stage)
  const StageIcon = stageInfo.icon

  const handleAdvance = () => {
    if (onStageAdvance && stageInfo.nextStage) {
      onStageAdvance(trip.id, stageInfo.nextStage)
    }
  }

  return (
    <article
      data-testid="trip-card"
      role="article"
      className={`w-full max-w-sm bg-white rounded-lg shadow-md border border-gray-200 border-l-4 ${stageInfo.color} p-6 space-y-4 hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 leading-tight">
            {trip.title}
          </h3>
          <div className="flex items-center space-x-2">
            <StageIcon
              data-testid="stage-icon"
              data-icon={trip.stage === 'daydream' ? 'lightbulb' : trip.stage === 'quest' ? 'map' : 'book-open'}
              className="w-5 h-5 text-gray-600"
            />
            <span className="text-sm font-medium text-gray-700">
              {stageInfo.label}
            </span>
          </div>
        </div>

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

      {stageInfo.nextStage && onStageAdvance && (
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            onClick={handleAdvance}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            aria-label={stageInfo.buttonText}
          >
            {stageInfo.buttonText}
          </button>
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