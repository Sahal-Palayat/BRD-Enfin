"use client"
import { useState, useEffect } from "react"
import axios from "axios"

async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/api/participants", {
      cache: "no-store",
    })
    const users = await response.json()
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return null
  }
}

export default function UserAvailability() {
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [participants, setParticipants] = useState([])
  const [availData, setAvailData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getUsers().then((users) => {
      if (users) {
        setParticipants(
          Object.entries(users).map(([key, value]) => ({
            id: key,
            name: value.name,
            threshold: value.threshold,
          })),
        )
      }
    })
  }, [])

  const handleParticipantChange = (id) => {
    setSelectedParticipants((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const handleSubmit = async () => {
    if (selectedParticipants.length === 0) {
      alert("Please select at least one participant")
      return
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates")
      return
    }

    setIsLoading(true)
    try {
      const res = await axios.post("http://localhost:3000/api/saveAvailability", {
        userId: selectedParticipants,
        startDate,
        endDate,
      })

      setAvailData(res.data.data)
    } catch (error) {
      console.error("Error checking availability:", error)
      alert("Failed to check availability. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">Availability Checker</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selection Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Select Parameters
            </h2>

            {/* Participants Selection */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Participants</label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                {participants.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">Loading participants...</div>
                ) : (
                  participants.map((participant) => (
                    <div key={participant.id} className="mb-2 last:mb-0">
                      <label className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedParticipants.includes(participant.id)}
                          onChange={() => handleParticipantChange(participant.id)}
                        />
                        <span className="text-gray-800">{participant.name}</span>
                      </label>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500">{selectedParticipants.length} participant(s) selected</div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                "Check Available Slots"
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Available Slots
            </h2>

            <div className="overflow-y-auto max-h-[400px]">
              {availData.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {isLoading
                    ? "Checking availability..."
                    : "No availability data yet. Select participants and dates to check available slots."}
                </div>
              ) : (
                <div className="space-y-4">
                  {availData.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="font-medium text-indigo-700 mb-2">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.slot.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                          >
                            {slot.start} - {slot.end}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

