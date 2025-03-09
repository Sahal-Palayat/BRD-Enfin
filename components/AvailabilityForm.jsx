"use client"
import { useState } from "react"
import React from "react";
import PropTypes from "prop-types";


export default function AvailabilityForm({ userId, initialData }) {
  const [availability, setAvailability] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const validateTime = (day, index, type, value) => {
    const updatedSlots = [...availability[day]]
    updatedSlots[index][type] = value

    let errorMsg = ""

    const startTime = updatedSlots[index].start
      ? Number.parseInt(updatedSlots[index].start.split(":")[0]) * 60 +
        Number.parseInt(updatedSlots[index].start.split(":")[1])
      : 0
    const endTime = updatedSlots[index].end
      ? Number.parseInt(updatedSlots[index].end.split(":")[0]) * 60 +
        Number.parseInt(updatedSlots[index].end.split(":")[1])
      : 0

    if (type === "end" && startTime >= endTime) {
      errorMsg = "End time must be after start time."
    }

    const hasOverlap = updatedSlots.some((slot, idx) => {
      if (idx !== index && slot.start && slot.end) {
        const existingStart = Number.parseInt(slot.start.split(":")[0]) * 60 + Number.parseInt(slot.start.split(":")[1])
        const existingEnd = Number.parseInt(slot.end.split(":")[0]) * 60 + Number.parseInt(slot.end.split(":")[1])

        return (
          (startTime >= existingStart && startTime < existingEnd) || (endTime > existingStart && endTime <= existingEnd)
        )
      }
      return false
    })

    if (hasOverlap) {
      errorMsg = "Time slot overlaps with an existing slot."
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${day}-${index}`]: errorMsg,
    }))

    return errorMsg === ""
  }

  const handleTimeChange = (day, index, type, value) => {
    const updatedSlots = [...availability[day]]
    updatedSlots[index][type] = value
    setAvailability({ ...availability, [day]: updatedSlots })
    validateTime(day, index, type, value)
    setSaveSuccess(false)
  }

  const addSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "", end: "" }],
    }))
    setSaveSuccess(false)
  }

  const removeSlot = (day, index) => {
    setAvailability((prev) => {
      const newSlots = prev[day].filter((_, i) => i !== index)
      return { ...prev, [day]: newSlots }
    })
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`${day}-${index}`]
      return newErrors
    })
    setSaveSuccess(false)
  }

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => error === "") &&
      Object.values(availability).some((slots) => slots.some((slot) => slot.start && slot.end))
    )
  }

  const saveAvailability = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const cleanedAvailability = Object.fromEntries(
        Object.entries(availability).map(([day, slots]) => [day, slots.filter((slot) => slot.start && slot.end)]),
      )

      await fetch(`/api/AddSlot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, availability: cleanedAvailability }),
      })

      setSaveSuccess(true)
    } catch (error) {
      console.error("Failed to save availability:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to get day display name
  const getDayDisplayName = (day) => {
    const days = {
      Monday: "Monday",
      Tuesday: "Tuesday",
      Wednesday: "Wednesday",
      Thursday: "Thursday",
      Friday: "Friday",
      Saturday: "Saturday",
      Sunday: "Sunday",
    }
    return days[day] || day
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-4 px-6">
        <h2 className="text-xl font-bold text-white">Set Your Availability</h2>
        <p className="text-blue-100 text-sm">Add time slots for when you're available each day</p>
      </div>

      <div className="p-6">
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Your availability has been saved successfully!
          </div>
        )}

        <div className="space-y-6">
          {Object.keys(availability).map((day) => (
            <div key={day} className="border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800 text-lg">{getDayDisplayName(day)}</h3>
                <button
                  onClick={() => addSlot(day)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Slot
                </button>
              </div>

              {availability[day].length === 0 ? (
                <p className="text-gray-500 text-sm italic py-2">No time slots added yet</p>
              ) : (
                <div className="space-y-3">
                  {availability[day].map((slot, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-3 ${errors[`${day}-${index}`] ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-100"}`}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-col sm:flex-row gap-2 flex-grow">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) => handleTimeChange(day, index, "start", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">End Time</label>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) => handleTimeChange(day, index, "end", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex items-end pb-1">
                          <button
                            onClick={() => removeSlot(day, index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                            aria-label="Remove time slot"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {errors[`${day}-${index}`] && (
                        <p className="text-red-600 text-sm mt-2 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors[`${day}-${index}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={saveAvailability}
          disabled={!isFormValid() || isSaving}
          className={`px-6 py-2.5 rounded-lg font-medium flex items-center ${
            isFormValid() && !isSaving
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition-colors`}
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Availability"
          )}
        </button>
      </div>
    </div>
  )
}




AvailabilityForm.propTypes = {
  userId: PropTypes.string.isRequired,  // Adjust type as needed
  initialData: PropTypes.object,        // Adjust based on actual structure
};