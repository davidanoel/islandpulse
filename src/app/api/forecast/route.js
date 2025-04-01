// src/app/api/forecast/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { openai } from "@/lib/openai";
import { getHolidaysInRange, getMajorEventsInRange } from "@/lib/holidays";
import { getHolidaysWithFallback } from "@/lib/googleCalendar";
import { getWeatherAnalysis } from "@/lib/weatherAnalysis";

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const CACHE_DURATION_HOURS = 6; // How long to cache results

// Location mapping (Example - expand!)
const locations = {
  kingston: { lat: 17.97, lon: -76.79, countryCode: "JM", name: "Kingston, Jamaica" },
  montego_bay: { lat: 18.47, lon: -77.91, countryCode: "JM", name: "Montego Bay, Jamaica" },
  bridgetown: { lat: 13.1, lon: -59.61, countryCode: "BB", name: "Bridgetown, Barbados" },
  nassau: { lat: 25.04, lon: -77.35, countryCode: "BS", name: "Nassau, Bahamas" },
  port_of_spain: {
    lat: 10.65,
    lon: -61.51,
    countryCode: "TT",
    name: "Port of Spain, Trinidad & Tobago",
  },
  // Add many more locations...
};

export async function POST(request) {
  try {
    const { location: locationKey, startDate, endDate } = await request.json();
    console.log("API Request:", { locationKey, startDate, endDate }); // Debug log

    if (!locationKey || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields: location, startDate, endDate" },
        { status: 400 }
      );
    }

    const locationData = locations[locationKey.toLowerCase()];
    if (!locationData) {
      return NextResponse.json({ error: "Invalid location specified" }, { status: 400 });
    }

    const cacheKey = `${locationKey}-${startDate}-${endDate}`;
    const { db } = await connectToDatabase();
    const cacheCollection = db.collection("forecastCache");

    // 1. Check Cache
    const cachedData = await cacheCollection.findOne({ _id: cacheKey }); // No type needed

    if (
      cachedData &&
      cachedData.timestamp &&
      new Date().getTime() - new Date(cachedData.timestamp).getTime() <
        CACHE_DURATION_HOURS * 60 * 60 * 1000
    ) {
      console.log(`Cache hit for ${cacheKey}`);
      // Ensure the cached data has the forecast structure before returning
      if (cachedData.forecast && cachedData.forecast.demandLevel) {
        return NextResponse.json(cachedData.forecast);
      } else {
        console.log(`Cache invalid structure for ${cacheKey}, fetching fresh data.`);
        // Proceed to fetch fresh data if cache structure is wrong
      }
    } else {
      console.log(`Cache miss or expired for ${cacheKey}`);
    }

    // --- If not cached or expired, proceed ---

    // 2. Fetch Weather Data
    let weatherSummary = "Weather data unavailable.";
    let weatherAnalysis = null;
    try {
      console.log("Fetching weather analysis for location:", locationData);
      weatherAnalysis = await getWeatherAnalysis(
        locationData.lat,
        locationData.lon,
        startDate,
        endDate
      );
      console.log("Weather Analysis Result:", weatherAnalysis);

      if (weatherAnalysis) {
        const { temperature, conditions, alerts, impactScore, trends } = weatherAnalysis;
        weatherSummary = `Weather Analysis:
          - Temperature: ${temperature.average.toFixed(1)}°C (${temperature.trend} trend)
          - Range: ${temperature.min.toFixed(1)}°C to ${temperature.max.toFixed(1)}°C
          - Dominant Conditions: ${conditions.dominant}
          - Weather Impact Score: ${(impactScore * 100).toFixed(0)}%
          - Weather Trends: ${Object.entries(trends)
            .filter(([key]) => key !== "conditions")
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")}
          ${alerts.length > 0 ? `- Alerts: ${alerts.map((a) => a.message).join(", ")}` : ""}`;
      } else {
        console.log("Weather analysis returned null");
        weatherSummary = "Could not retrieve detailed weather forecast.";
      }
    } catch (error) {
      console.error("Error fetching weather:", error.message);
      weatherSummary = `Weather data unavailable: ${error.message}`;
    }

    // 3. Get Holidays & Events
    const holidays = await getHolidaysWithFallback(locationData.countryCode, startDate, endDate);
    const events = getMajorEventsInRange(locationData.countryCode, startDate, endDate);

    const holidayText =
      holidays.length > 0
        ? `Holidays: ${holidays.map((h) => `${h.name} (${h.date})`).join(", ")}.`
        : "No major public holidays detected in range.";

    const eventText =
      events.length > 0
        ? `Major Events: ${events
            .map((e) => `${e.name} (${e.startDate} - ${e.endDate})`)
            .join(", ")}.`
        : "No major specific events noted in range.";

    // 4. Construct OpenAI Prompt
    const prompt = `
      You are an expert Caribbean tourism demand forecaster for ${locationData.name}.
      Analyze the following information for the period ${startDate} to ${endDate}.

      Context:
      - Location: ${locationData.name}
      - Weather Analysis: ${weatherSummary}
      - ${holidayText}
      - ${eventText}
      - General Factors: Consider typical tourist seasons, school holidays (if applicable, e.g., North America/Europe summer), and general appeal of the location. Do not use flight/cruise data unless provided.

      Task:
      1. Predict the general tourism demand level (impacting hotels, tours, attractions).
      2. Provide detailed reasoning that specifically addresses:
         - How weather conditions and trends will impact tourism
         - The influence of holidays and events
         - Seasonal factors and general tourism patterns
      3. Suggest specific pricing guidance based on:
         - Weather impact score and conditions
         - Demand level prediction
         - Local tourism patterns
         - Recommended percentage adjustment to base prices (e.g., +15%, -10%, etc.)
      4. Estimate your confidence in this forecast, considering:
         - Weather forecast reliability
         - Event/holiday certainty
         - Historical pattern consistency

      Output Format:
      Respond ONLY with a valid JSON object with NO MARKDOWN formatting, containing these exact keys:
      - "demandLevel": string (Valid values: "Very Low", "Low", "Moderate", "High", "Very High")
      - "reasoning": string (Detailed explanation citing key factors)
      - "pricingGuidance": string (Specific pricing advice based on weather and demand)
      - "priceAdjustment": number (Recommended percentage adjustment to base prices, e.g., 15 for +15%, -10 for -10%)
      - "confidenceScore": string (Valid values: "Low", "Medium", "High")
    `;

    // 5. Call OpenAI API
    let forecastResult = null; // Initialize as null
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        // response_format: { type: "json_object" }, // Check if model supports it
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        throw new Error("OpenAI returned an empty response.");
      }

      // Attempt to parse the JSON response
      try {
        forecastResult = JSON.parse(responseContent);
        // **Runtime Check (Important in JS)**
        if (
          !forecastResult ||
          typeof forecastResult !== "object" ||
          !forecastResult.demandLevel ||
          typeof forecastResult.demandLevel !== "string" ||
          !forecastResult.reasoning ||
          typeof forecastResult.reasoning !== "string" ||
          !forecastResult.pricingGuidance ||
          typeof forecastResult.pricingGuidance !== "string" ||
          !forecastResult.priceAdjustment ||
          typeof forecastResult.priceAdjustment !== "number" ||
          !forecastResult.confidenceScore ||
          typeof forecastResult.confidenceScore !== "string"
        ) {
          throw new Error("Parsed JSON missing required keys or has incorrect types.");
        }
      } catch (parseError) {
        console.error("Failed to parse OpenAI JSON response:", responseContent, parseError);
        throw new Error(`Could not parse AI response: ${parseError.message}`);
      }
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      // Return error response (don't expose raw error details in production)
      return NextResponse.json({ error: `AI processing failed.` }, { status: 500 });
    }

    // 6. Store in Cache and Return
    if (forecastResult) {
      try {
        // Include weather analysis in the response
        const responseData = {
          ...forecastResult,
          weatherAnalysis: weatherAnalysis || null, // Ensure weatherAnalysis is included
        };
        console.log("Final API Response:", responseData);

        // Store the complete response data in cache
        await cacheCollection.updateOne(
          { _id: cacheKey },
          { $set: { forecast: responseData, timestamp: new Date() } },
          { upsert: true }
        );
        return NextResponse.json(responseData);
      } catch (dbError) {
        console.error("Error saving to cache:", dbError);
        // Return the complete response data even if caching fails
        return NextResponse.json({
          ...forecastResult,
          weatherAnalysis: weatherAnalysis || null,
        });
      }
    } else {
      return NextResponse.json({ error: "Failed to generate forecast." }, { status: 500 });
    }
  } catch (error) {
    console.error("API Route Error:", error);
    // Avoid exposing internal error messages directly
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
