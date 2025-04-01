// src/app/page.jsx
"use client"; // Still needed for client components

import { useState } from "react"; // Removed FormEvent type
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  // Add the same locations as in the backend...
];

// No ForecastResult interface needed

export default function Home() {
  // Use useState without generic types
  const [location, setLocation] = useState(locationOptions[0].value);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  });
  const [forecast, setForecast] = useState(null); // Initialize state with null
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    // Removed event type
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setForecast(null);

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, startDate, endDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use the error message from the API response if available
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Basic check if data looks like expected forecast
      if (data && data.demandLevel && data.reasoning) {
        setForecast(data);
      } else {
        throw new Error("Received invalid forecast data from server.");
      }
    } catch (err) {
      // err is implicitly 'any' in JS
      // Display the error message from the caught error
      setError(err.message || "An unknown error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX remains largely the same as the TypeScript version ---
  // Ensure all type-related syntax is removed if any existed in JSX attributes (usually not the case)
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 bg-gradient-to-br from-cyan-100 to-blue-200">
      <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center lg:text-left w-full">
          Caribbean Demand Forecaster <span className="text-sm font-light">(MVP - JS)</span>
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Input */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            >
              {locationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                isLoading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              {isLoading ? "Analyzing..." : "Get Forecast"}
            </button>
          </div>
        </form>

        {/* Results Area */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Runtime check for forecast object before accessing properties */}
        {forecast && typeof forecast === "object" && !isLoading && (
          <div className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Forecast Results:</h2>
            <div>
              <span className="font-semibold text-gray-700">Demand Level: </span>
              {/* Check property exists before using includes */}
              <span
                className={cn(
                  "font-bold px-2 py-0.5 rounded text-sm",
                  forecast.demandLevel?.includes("High")
                    ? "bg-red-100 text-red-800"
                    : forecast.demandLevel?.includes("Moderate")
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                )}
              >
                {forecast.demandLevel || "N/A"} {/* Provide fallback */}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                (Confidence: {forecast.confidenceScore || "N/A"})
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Reasoning:</p>
              <p className="text-sm text-gray-600">
                {forecast.reasoning || "No reasoning provided."}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Pricing Guidance:</p>
              <p className="text-sm text-gray-600">
                {forecast.pricingGuidance || "No guidance provided."}
              </p>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center text-xs text-gray-500">
        MVP (JS Version) - Uses public weather, holidays, and AI general knowledge. Does not include
        flight/cruise data. Accuracy may vary.
      </footer>
    </main>
  );
}
