// src/app/page.jsx
"use client"; // Still needed for client components

import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import WeatherAnalysis from "@/app/components/WeatherAnalysis";
import CompetitorAnalysis from "@/app/components/CompetitorAnalysis";

// Helper for conditional class names (same as before)
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Color helper functions
const getDemandColor = (level) => {
  switch (level) {
    case "Very High":
      return "bg-green-100 text-green-800";
    case "High":
      return "bg-green-50 text-green-700";
    case "Moderate":
      return "bg-yellow-100 text-yellow-800";
    case "Low":
      return "bg-red-50 text-red-700";
    case "Very Low":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getConfidenceColor = (score) => {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const getPriceAdjustmentColor = (adjustment) => {
  if (adjustment > 0) return "bg-green-100 text-green-800";
  if (adjustment < 0) return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

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
                      Generate Forecast
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
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white text-gray-900"
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
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white text-gray-900"
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
                          className="mt-1 block w-full pl-3 pr-3 py-2 text-sm sm:text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm bg-white text-gray-900"
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
                      <div className="text-sm text-gray-700 mb-2">Describe your business:</div>
                      <textarea
                        value={businessProfile}
                        onChange={(e) => setBusinessProfile(e.target.value)}
                        className="w-full h-32 sm:h-48 p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder:text-gray-600"
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
                      <div className="text-sm text-gray-700 mb-2">Describe your event:</div>
                      <textarea
                        value={eventDetails}
                        onChange={(e) => setEventDetails(e.target.value)}
                        className="w-full h-32 sm:h-48 p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder:text-gray-600"
                        placeholder="Example: Annual Food & Wine Festival, June 15-17, 2024. Expected attendance: 5,000 visitors (70% tourists, 30% locals). Features include cooking demonstrations, wine tastings, and local food vendors."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {forecast && (
              <div className="space-y-6 mt-8 sm:mt-12">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`p-6 rounded-lg shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 ${getDemandColor(
                      forecast.demandLevel
                    )}`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white/50 rounded-lg mr-3">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Demand Level</h3>
                    </div>
                    <p className="text-2xl font-bold">{forecast.demandLevel}</p>
                  </div>
                  <div
                    className={`p-6 rounded-lg shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 ${getConfidenceColor(
                      forecast.confidenceScore
                    )}`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white/50 rounded-lg mr-3">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Confidence</h3>
                    </div>
                    <p className="text-2xl font-bold">{forecast.confidenceScore}%</p>
                  </div>
                  <div
                    className={`p-6 rounded-lg shadow-lg border border-blue-100 hover:shadow-xl transition-shadow duration-300 ${getPriceAdjustmentColor(
                      forecast.priceAdjustment
                    )}`}
                  >
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-white/50 rounded-lg mr-3">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold">Price Adjustment</h3>
                    </div>
                    <p className="text-2xl font-bold">{forecast.priceAdjustment}%</p>
                  </div>
                </div>

                {/* Weather and Competitor Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weather Analysis */}
                  {weatherAnalysis && <WeatherAnalysis data={weatherAnalysis} />}

                  {/* Competitor Analysis */}
                  {forecast.competitorAnalysis && (
                    <CompetitorAnalysis
                      data={forecast.competitorAnalysis}
                      businessProfile={businessProfile}
                    />
                  )}
                </div>

                {/* Analysis and Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Analysis Card */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Analysis</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Reasoning</h3>
                        <p className="text-gray-700">{forecast.reasoning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Guidance Card */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">Pricing Guidance</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Guidance</h3>
                        <p className="text-gray-700">{forecast.pricingGuidance}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                    <h2 className="text-xl font-semibold text-gray-800">Recommendations</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Staffing */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Staffing</h3>
                      <ul className="space-y-2">
                        {forecast.recommendations.staffing.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-4 h-4 text-blue-500 mr-2 mt-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Inventory */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Inventory</h3>
                      <ul className="space-y-2">
                        {forecast.recommendations.inventory.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-4 h-4 text-blue-500 mr-2 mt-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Marketing */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Marketing</h3>
                      <ul className="space-y-2">
                        {forecast.recommendations.marketing.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-4 h-4 text-blue-500 mr-2 mt-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Daily Demand Breakdown */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg mr-3">
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                    <h2 className="text-xl font-semibold text-gray-800">Daily Demand Breakdown</h2>
                  </div>
                  <div className="space-y-4">
                    {forecast.dailyBreakdown.map((day, index) => (
                      <div key={index} className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-blue-800">{day.date}</h3>
                          <span className="text-sm font-medium text-blue-600">
                            {day.priceAdjustment}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700">Demand Level: {day.demandLevel}</p>
                          <div className="flex flex-wrap gap-2">
                            {day.factors.map((factor, factorIndex) => (
                              <span
                                key={factorIndex}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                              >
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
