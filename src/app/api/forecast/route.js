// src/app/api/forecast/route.js
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { openai } from "@/lib/openai";
import { getHolidaysInRange, getMajorEventsInRange } from "@/lib/holidays";
import { getHolidaysWithFallback } from "@/lib/googleCalendar";

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
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.lat}&lon=${locationData.lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    let weatherSummary = "Weather data unavailable.";
    try {
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) throw new Error(`Weather API Error: ${weatherResponse.statusText}`);
      const weatherData = await weatherResponse.json();
      const firstForecast = weatherData.list?.[0];
      if (firstForecast) {
        weatherSummary = `Sample forecast around start date: ${firstForecast.main.temp}°C, ${firstForecast.weather[0].description}. Precipitation chance varies.`;
      } else {
        weatherSummary = "Could not retrieve detailed weather forecast.";
      }
    } catch (error) {
      console.error("Error fetching weather:", error.message);
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

    // 4. Construct OpenAI Prompt (Same prompt as before)
    const prompt = `
      You are an expert Caribbean tourism demand forecaster for ${locationData.name}.
      Analyze the following information for the period ${startDate} to ${endDate}.

      Context:
      - Location: ${locationData.name}
      - Weather Summary: ${weatherSummary}
      - ${holidayText}
      - ${eventText}
      - General Factors: Consider typical tourist seasons, school holidays (if applicable, e.g., North America/Europe summer), and general appeal of the location. Do not use flight/cruise data unless provided.

      Task:
      Predict the general tourism demand level (impacting hotels, tours, attractions).
      Provide reasoning based ONLY on the provided context and general knowledge of Caribbean tourism patterns.
      Suggest basic pricing guidance.
      Estimate your confidence in this forecast.

      Output Format:
      Respond ONLY with a valid JSON object with NO MARKDOWN formatting, containing these exact keys:
      - "demandLevel": string (Valid values: "Very Low", "Low", "Moderate", "High", "Very High")
      - "reasoning": string (Brief explanation citing key factors)
      - "pricingGuidance": string (Simple advice: e.g., "Consider Discounts", "Maintain Base Rates", "Potential for Increase", "Strong Increase Recommended")
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
        await cacheCollection.updateOne(
          { _id: cacheKey },
          { $set: { forecast: forecastResult, timestamp: new Date() } },
          { upsert: true }
        );
        return NextResponse.json(forecastResult);
      } catch (dbError) {
        console.error("Error saving to cache:", dbError);
        // Still return the forecast even if caching fails
        return NextResponse.json(forecastResult);
      }
    } else {
      // Fallback if forecastResult is somehow null after checks
      return NextResponse.json({ error: "Failed to generate forecast." }, { status: 500 });
    }
  } catch (error) {
    console.error("API Route Error:", error);
    // Avoid exposing internal error messages directly
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
