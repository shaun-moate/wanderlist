'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trip, validateTripTitle, validateTripDates, validateTripNotes, createTripTemplate } from '@/lib/trip'

interface TripFormProps {
  onSubmit: (trip: Trip) => void
  onCancel: () => void
}

interface FormData {
  title: string
  startDate: string
  endDate: string
  notes: string
}

interface FormErrors {
  title?: string
  dates?: string
  notes?: string
}

export function TripForm({ onSubmit, onCancel }: TripFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    startDate: '',
    endDate: '',
    notes: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }

    // Validate dates
    if (!formData.startDate) {
      newErrors.dates = 'Start date is required'
    } else if (!formData.endDate) {
      newErrors.dates = 'End date is required'
    } else {
      const startDate = new Date(formData.startDate)
      const endDate = new Date(formData.endDate)
      if (startDate > endDate) {
        newErrors.dates = 'End date cannot be before start date'
      }
    }

    // Validate notes
    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes cannot exceed 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const trip = createTripTemplate(
        formData.title,
        formData.startDate,
        formData.endDate,
        formData.notes || undefined
      )

      onSubmit(trip)

      // Reset form
      setFormData({
        title: '',
        startDate: '',
        endDate: '',
        notes: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Failed to create trip:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      notes: '',
    })
    setErrors({})
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} data-testid="trip-form" role="form" className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Trip Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Summer Road Trip to Yellowstone"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          aria-label="Trip Title"
          className={errors.title ? 'border-red-500' : ''}
          maxLength={100}
        />
        {errors.title && (
          <p className="text-sm text-red-600" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            aria-label="Start Date"
            className={errors.dates ? 'border-red-500' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            aria-label="End Date"
            className={errors.dates ? 'border-red-500' : ''}
          />
        </div>
      </div>

      {errors.dates && (
        <p className="text-sm text-red-600" role="alert">
          {errors.dates}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add any special notes, packing reminders, or expectations for this trip..."
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          aria-label="Notes"
          className={errors.notes ? 'border-red-500' : ''}
          rows={3}
          maxLength={500}
        />
        {errors.notes && (
          <p className="text-sm text-red-600" role="alert">
            {errors.notes}
          </p>
        )}
        <p className="text-xs text-gray-500">
          {formData.notes.length}/500 characters
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}