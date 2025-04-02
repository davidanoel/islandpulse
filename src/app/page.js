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
      <div className="container mx-auto p-4">
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
              IslandPulse Tourism Forecast
            </h1>

            {/* Main Content Grid - 3 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Core Inputs (4 columns) */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100 sticky top-8">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Forecast Parameters</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
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
                    <div className="space-y-4">
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
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
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
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm bg-white"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
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

              {/* Middle Column - Business Profile (4 columns) */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Business Profile</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Describe your business:</div>
                      <textarea
                        value={businessProfile}
                        onChange={(e) => setBusinessProfile(e.target.value)}
                        className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Example: Our 4-star beachfront hotel in Montego Bay features 200 rooms, 3 pools, and a private beach. Located 15 minutes from the airport, we offer luxury amenities including spa, multiple restaurants, and water sports."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Events (4 columns) */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Events</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Describe your event:</div>
                      <textarea
                        value={eventDetails}
                        onChange={(e) => setEventDetails(e.target.value)}
                        className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Example: Annual Food & Wine Festival, June 15-17, 2024. Expected attendance: 5,000 visitors (70% tourists, 30% locals). Features include cooking demonstrations, wine tastings, and local food vendors."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {forecast && (
              <div className="mt-8">
                <ForecastResult forecast={forecast} weatherAnalysis={weatherAnalysis} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
