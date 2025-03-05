import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from "react";


export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">BRD</div>
          <div className="flex space-x-4">
            <Link href="/user" className="px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
              Users
            </Link>
            <Link href="/user/availability" className="px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
              Check Availability
            </Link>
            {/* <Link href="/user-slots" className="px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">
              User Slots
            </Link> */}
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to Our Platform</h1>
          <p className="text-xl text-gray-600 mb-10">
            Manage users, check availability, and organize user slots all in one place.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Link href="/user" className="group">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
                <p className="text-gray-600 mb-6">View and manage all users in the system.</p>
                <div className="text-blue-600 group-hover:text-blue-700 flex items-center justify-center">
                  Explore Users <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>
            </Link>
            
            <Link href="/user/availability" className="group">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Check Availability</h2>
                <p className="text-gray-600 mb-6">Check and manage resource availability.</p>
                <div className="text-blue-600 group-hover:text-blue-700 flex items-center justify-center">
                  Check Now <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>
            </Link>
            
            {/* <Link href="/user-slots" className="group">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Slots</h2>
                <p className="text-gray-600 mb-6">Manage and assign slots to users.</p>
                <div className="text-blue-600 group-hover:text-blue-700 flex items-center justify-center">
                  View Slots <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              </div>
            </Link> */}
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 mt-auto">
        <div className="border-t border-gray-200 pt-8 text-center text-gray-500">
          <p>© 2025 BRD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
