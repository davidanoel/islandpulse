"use client";

import { useState } from "react";

export default function BusinessProfile({
  businessProfile,
  setBusinessProfile,
  eventDetails,
  setEventDetails,
}) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Business Profile & Events</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Profile Section */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Describe your business, including:</div>
          <textarea
            value={businessProfile}
            onChange={(e) => setBusinessProfile(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Example: Our 4-star beachfront hotel in Montego Bay features 200 rooms, 3 pools, and a private beach. Located 15 minutes from the airport, we offer luxury amenities including spa, multiple restaurants, and water sports. Our target market is upscale travelers seeking a premium Caribbean experience. Unique features include an infinity pool overlooking the ocean and exclusive beach cabanas."
          />
        </div>

        {/* Event Details Section */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Describe your event, including:</div>
          <textarea
            value={eventDetails}
            onChange={(e) => setEventDetails(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Example: Annual Food & Wine Festival, June 15-17, 2024. Expected attendance: 5,000 visitors (70% tourists, 30% locals). Features include cooking demonstrations, wine tastings, and local food vendors. Special requirements: outdoor venue with covered areas, parking for 1,000 vehicles. Pricing considerations: early bird discounts, VIP packages, and group rates available."
          />
        </div>
      </div>
    </div>
  );
}
