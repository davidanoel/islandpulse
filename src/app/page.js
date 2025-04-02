// src/app/page.jsx
"use client"; // Still needed for client components

import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ForecastResult from "@/app/components/ForecastResult";

// Helper for conditional class names (same as before)
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Match keys from the backend locations object
const locationOptions = [
  { value: "kingston", label: "Kingston, Jamaica" },
  { value: "montego_bay", label: "Montego Bay, Jamaica" },
  { value: "bridgetown", label: "Bridgetown, Barbados" },
  { value: "nassau", label: "Nassau, Bahamas" },
  { value: "port_of_spain", label: "Port of Spain, Trinidad & Tobago" },
];

export default function Home() {
  const [location, setLocation] = useState("");
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const [startDate, setStartDate] = useState(today.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(nextWeek.toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState(null);
  const [weatherAnalysis, setWeatherAnalysis] = useState(null);
  const [businessProfile, setBusinessProfile] = useState("");
  const [eventDetails, setEventDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setForecast(null);
    setWeatherAnalysis(null);

    try {
      const response = await fetch("/api/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          startDate,
          endDate,
          businessProfile,
          eventDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch forecast");
      }

      if (!data.demandLevel || !data.reasoning || !data.pricingGuidance) {
        throw new Error("Invalid forecast data received from server");
      }

      setForecast(data);
      setWeatherAnalysis(data.weatherAnalysis);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-2 sm:p-4">
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-8 sm:mb-12">
              <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Pulse line */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12h4l3 8 4-16 3 8h4"
                    />
                    {/* Chart line */}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 20h18"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    IslandPulse
                  </h1>
                </div>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 font-medium text-center max-w-2xl mx-auto">
                Caribbean Tourism Forecast
                <span className="block text-sm text-gray-500 mt-1">
                  Powered by advanced AI to analyze weather, events, and market trends
                </span>
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
              {/* Left Column - Core Inputs */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-blue-100 sticky top-4 sm:top-8">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Forecast Parameters
                    </h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    {/* Location Input */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Location
                      </label>
                      <select
                        id="location"
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white"
                        required
                      >
                        <option value="">Select a location</option>
                        {locationOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white",
                          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                          loading
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        )}
                      >
                        {loading ? "Analyzing..." : "Get Forecast"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Middle Column - Business Profile */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-blue-100">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Business Profile
                    </h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Describe your business:</div>
                      <textarea
                        value={businessProfile}
                        onChange={(e) => setBusinessProfile(e.target.value)}
                        className="w-full h-32 sm:h-48 p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Example: Our 4-star beachfront hotel in Montego Bay features 200 rooms, 3 pools, and a private beach. Located 15 minutes from the airport, we offer luxury amenities including spa, multiple restaurants, and water sports."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Events */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-blue-100">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Events
                    </h2>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Describe your event:</div>
                      <textarea
                        value={eventDetails}
                        onChange={(e) => setEventDetails(e.target.value)}
                        className="w-full h-32 sm:h-48 p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Example: Annual Food & Wine Festival, June 15-17, 2024. Expected attendance: 5,000 visitors (70% tourists, 30% locals). Features include cooking demonstrations, wine tastings, and local food vendors."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {forecast && (
              <div className="mt-6 sm:mt-8">
                <ForecastResult forecast={forecast} weatherAnalysis={weatherAnalysis} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
