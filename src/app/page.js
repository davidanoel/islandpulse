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

// Weather Analysis Component
function WeatherAnalysis({ data }) {
  if (!data) return null;

  const getImpactColor = (score) => {
    if (score >= 70) return "bg-green-100 text-green-800";
    if (score >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Weather Analysis</h2>
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${getImpactColor(data.impactScore * 100)}`}>
          <h3 className="font-semibold">Weather Impact Score</h3>
          <p className="text-lg">{(data.impactScore * 100).toFixed(0)}%</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Temperature</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-lg">{data.temperature.average.toFixed(1)}°C</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Min</p>
              <p className="text-lg">{data.temperature.min.toFixed(1)}°C</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Max</p>
              <p className="text-lg">{data.temperature.max.toFixed(1)}°C</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">Trend: {data.temperature.trend}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Weather Conditions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.conditions.percentages || {}).map(([condition, percentage]) => (
              <div key={condition} className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600 capitalize">{condition}</p>
                <p className="text-lg">{percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {data.alerts.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Weather Alerts</h3>
            <div className="space-y-2">
              {data.alerts.map((alert, index) => (
                <div key={index} className="bg-red-50 text-red-800 p-3 rounded">
                  {alert.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ForecastResult({ forecast, weatherAnalysis }) {
  if (!forecast) return null;

  const getDemandColor = (level) => {
    const colors = {
      "Very Low": "bg-red-100 text-red-800",
      Low: "bg-orange-100 text-orange-800",
      Moderate: "bg-yellow-100 text-yellow-800",
      High: "bg-green-100 text-green-800",
      "Very High": "bg-emerald-100 text-emerald-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getConfidenceColor = (score) => {
    const colors = {
      Low: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      High: "bg-green-100 text-green-800",
    };
    return colors[score] || "bg-gray-100 text-gray-800";
  };

  const getPriceAdjustmentColor = (adjustment) => {
    if (adjustment > 0) return "bg-green-100 text-green-800";
    if (adjustment < 0) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${getDemandColor(forecast.demandLevel)}`}>
          <h3 className="font-semibold">Demand Level</h3>
          <p className="text-lg">{forecast.demandLevel}</p>
        </div>
        <div className={`p-4 rounded-lg ${getConfidenceColor(forecast.confidenceScore)}`}>
          <h3 className="font-semibold">Confidence</h3>
          <p className="text-lg">{forecast.confidenceScore}</p>
        </div>
        <div className={`p-4 rounded-lg ${getPriceAdjustmentColor(forecast.priceAdjustment)}`}>
          <h3 className="font-semibold">Price Adjustment</h3>
          <p className="text-lg">
            {forecast.priceAdjustment > 0 ? "+" : ""}
            {forecast.priceAdjustment}%
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Pricing Guidance</h3>
        <p className="text-gray-700">{forecast.pricingGuidance}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Analysis</h3>
        <p className="text-gray-700">{forecast.reasoning}</p>
      </div>

      {weatherAnalysis && <WeatherAnalysis data={weatherAnalysis} />}
    </div>
  );
}

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
  const [weatherAnalysis, setWeatherAnalysis] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setForecast(null);
    setWeatherAnalysis(null);

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
      console.log("API Response:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // Basic check if data looks like expected forecast
      if (data && data.demandLevel && data.reasoning) {
        console.log("Weather Analysis from API:", data.weatherAnalysis); // Debug log
        setForecast(data);
        setWeatherAnalysis(data.weatherAnalysis);
        console.log("Weather Analysis State:", data.weatherAnalysis); // Debug log
      } else {
        throw new Error("Received invalid forecast data from server.");
      }
    } catch (err) {
      setError(err.message || "An unknown error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add debug log for weatherAnalysis state
  console.log("Current weatherAnalysis state:", weatherAnalysis);

  // --- JSX remains largely the same as the TypeScript version ---
  // Ensure all type-related syntax is removed if any existed in JSX attributes (usually not the case)
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="z-10 w-full max-w-3xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center lg:text-left w-full">
          Caribbean Demand Forecaster
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {/* Add debug display */}
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>Weather Analysis State: {weatherAnalysis ? "Present" : "Not Present"}</p>
        </div>

        {forecast && <ForecastResult forecast={forecast} weatherAnalysis={weatherAnalysis} />}
      </div>
      <footer className="mt-8 text-center text-xs text-gray-500">
        MVP - Uses public weather, holidays, and AI general knowledge. Does not include
        flight/cruise data. Accuracy may vary.
      </footer>
    </main>
  );
}
