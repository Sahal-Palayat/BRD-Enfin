import Link from "next/link"
import React from "react";
import { UserIcon, UsersIcon } from "lucide-react"

async function getUsers() {
  try {
    const response = await fetch("http://localhost:3000/api/participants", {
      cache: "no-store", // Ensures fresh data on every request
    })
    const users = await response.json()
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return null
  }
}

const Users = async () => {
  const users = await getUsers()

  // Generate a random color based on user ID for avatar background
  const getAvatarColor = (id) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ]
    return colors[Number.parseInt(id) % colors.length]
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-md">
              <UsersIcon className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Participants</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">View and manage all participants and their threshold values</p>
        </div>

        {/* User List */}
        {users ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">All Participants</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {Object.keys(users).length} {Object.keys(users).length === 1 ? "User" : "Users"}
                </span>
              </div>
            </div>

            <ul className="divide-y divide-gray-200">
              {Object.entries(users).map(([id, user]) => (
                <li key={id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out group">
                  <Link href={`/user/availability/${id}`} className="block">
                    <div className="px-6 py-4 flex items-center">
                      <div
                        className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-white ${getAvatarColor(id)}`}
                      >
                        {user.name.includes(" ") ? getInitials(user.name) : user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">User ID: {id}</p>
                          </div>
                          <div className="flex items-center">
                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                              <p className="text-sm font-medium text-gray-700">
                                Threshold: <span className="text-blue-600">{user.threshold}</span>
                              </p>
                            </div>
                            <div className="ml-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-sm">View details →</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-3 rounded-full">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No participants found</h3>
            <p className="text-gray-500">
              There are no participants available or there was an error fetching the data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users

