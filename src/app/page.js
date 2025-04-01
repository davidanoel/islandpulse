// src/app/page.jsx
"use client"; // Still needed for client components

import { useState } from "react"; // Removed FormEvent type
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import BusinessProfile from "@/components/BusinessProfile";

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
    <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Weather Analysis</h2>
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
      {/* Key Metrics Grid */}
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

      {/* Daily Breakdown */}
      {forecast.dailyBreakdown && forecast.dailyBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold mb-4">Daily Demand Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demand Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Adjustment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Factors
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecast.dailyBreakdown.map((day, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDemandColor(
                          day.demandLevel
                        )}`}
                      >
                        {day.demandLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriceAdjustmentColor(
                          day.priceAdjustment
                        )}`}
                      >
                        {day.priceAdjustment > 0 ? "+" : ""}
                        {day.priceAdjustment}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {day.factors.map((factor, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analysis and Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold mb-2">Analysis</h3>
            <p className="text-gray-700">{forecast.reasoning}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold mb-2">Pricing Guidance</h3>
            <p className="text-gray-700">{forecast.pricingGuidance}</p>
          </div>
        </div>

        <div className="space-y-4">
          {forecast.recommendations && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-4">
                {forecast.recommendations.staffing && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Staffing</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.staffing.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {forecast.recommendations.inventory && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Inventory</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.inventory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {forecast.recommendations.marketing && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Marketing</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.marketing.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {forecast.recommendations.risks && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.risks.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weather Analysis */}
      {weatherAnalysis && <WeatherAnalysis data={weatherAnalysis} />}
    </div>
  );
}

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
      console.log("Sending request with data:", {
        location,
        startDate,
        endDate,
        businessProfile,
        eventDetails,
      });

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
      console.log("API Response:", data);

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
                      loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
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

        {/* Results Area - Full Width Below */}
        <div className="mt-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}

          {forecast && (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Forecast Results</h2>
              <ForecastResult forecast={forecast} weatherAnalysis={weatherAnalysis} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
