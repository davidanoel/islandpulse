// src/app/api/forecast/route.js
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { getWeatherAnalysis } from "@/lib/weatherAnalysis";
import { getSchoolVacationPeriods, getHistoricalPatterns } from "@/lib/schoolVacations";
import { connectToDatabase } from "@/lib/mongodb";
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

export const maxDuration = 30;

export async function POST(request) {
  try {
    const { location, startDate, endDate, businessProfile, eventDetails } = await request.json();
    console.log("API Request:", { location, startDate, endDate, businessProfile, eventDetails });

    if (!location || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields: location, startDate, endDate" },
        { status: 400 }
      );
    }

    const locationData = locations[location.toLowerCase()];
    if (!locationData) {
      return NextResponse.json({ error: "Invalid location specified" }, { status: 400 });
    }

    const cacheKey = `${location}-${startDate}-${endDate}`;
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

    // 3. Fetch Holidays and Events
    const holidays = await getHolidaysWithFallback(locationData.countryCode, startDate, endDate);
    const events = await getMajorEventsInRange(locationData.countryCode, startDate, endDate);
    const holidayText =
      holidays.length > 0
        ? `Holidays: ${holidays.map((h) => h.name).join(", ")}`
        : "No major holidays during this period.";
    const eventText =
      events.length > 0
        ? `Events: ${events.map((e) => e.name).join(", ")}`
        : "No major events during this period.";

    // Get school vacation periods
    const schoolVacations = getSchoolVacationPeriods(startDate, endDate);
    console.log("School Vacations:", schoolVacations);

    // Get historical patterns based on the month
    const startMonth = new Date(startDate).getMonth() + 1;
    const historicalPatterns = getHistoricalPatterns(startMonth);

    // Enhanced AI prompt with competitor analysis
    const prompt = `You are an expert tourism and hospitality analyst. Analyze the following data and provide a detailed forecast:

Location: ${location}
Date Range: ${startDate} to ${endDate}

Business Profile:
${businessProfile}

Event Details:
${eventDetails}

Weather Analysis:
${weatherSummary}

Known Events and Holidays:
${holidayText}
${eventText}

School Vacation Periods:
${schoolVacations}

Historical Patterns:
${historicalPatterns}

Your task is to:
1. Predict tourism demand level (Very Low, Low, Moderate, High, Very High)
2. Provide detailed reasoning based on:
   - Weather conditions and impact
   - School vacation periods
   - Known holidays and events
   - Location-specific events and festivals
   - Historical patterns
   - Business profile and location
   - Competitor analysis
3. Suggest pricing guidance with specific percentage adjustments:
   - For peak times (holidays, school breaks, major events): Consider 30-50% increases
   - For high demand periods: Consider 20-40% increases
   - For moderate demand: Consider 10-30% increases
   - For low demand: Consider 0-20% decreases
4. Provide confidence score (0-100%)
5. Include daily breakdown if multiple days
6. Provide actionable recommendations for:
   - Staffing
   - Inventory
   - Marketing
   - Risk factors
   - Competitive positioning

Format your response as a JSON object with the following structure:
{
  "demandLevel": "string",
  "reasoning": "string",
  "pricingGuidance": "string",
  "priceAdjustment": number,
  "confidenceScore": number,
  "dailyBreakdown": [
    {
      "date": "string",
      "demandLevel": "string",
      "priceAdjustment": number,
      "factors": ["string"],
      "events": ["string"]  // Include both known and location-specific events
    }
  ],
  "recommendations": {
    "staffing": ["string"],
    "inventory": ["string"],
    "marketing": ["string"],
    "risks": ["string"],
    "competitivePositioning": ["string"]
  },
  "competitorAnalysis": {
    "marketPosition": "string",
    "competitiveAdvantages": ["string"],
    "marketOpportunities": ["string"],
    "pricingStrategy": "string",
    "targetMarketAlignment": "string"
  }
}

Important pricing guidelines:
- Peak season (holidays, school breaks): 30-50% increase
- High demand periods: 20-40% increase
- Moderate demand: 10-30% increase
- Low demand: 0-20% decrease
- Consider business profile strength and unique features
- Factor in event exclusivity and limited capacity
- Account for premium location and amenities
- Consider competitor pricing in the area
- Factor in weather impact on demand
- Consider both known events and location-specific events when determining demand levels and price adjustments`;

    // 5. Call OpenAI API
    let forecastResult = null;
    try {
      console.log("Sending prompt to OpenAI:", prompt);
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const responseContent = completion.choices[0]?.message?.content;
      console.log("OpenAI Response:", responseContent);

      if (!responseContent) {
        throw new Error("OpenAI returned an empty response.");
      }

      // Attempt to parse the JSON response
      try {
        forecastResult = JSON.parse(responseContent);
        console.log("Parsed Forecast Result:", forecastResult);

        // Validate required fields
        const requiredFields = {
          demandLevel: "string",
          reasoning: "string",
          pricingGuidance: "string",
          priceAdjustment: "number",
          confidenceScore: "number",
        };

        const missingFields = Object.entries(requiredFields).filter(
          ([key, type]) => !forecastResult[key] || typeof forecastResult[key] !== type
        );

        if (missingFields.length > 0) {
          console.error("Missing or invalid fields:", missingFields);
          throw new Error(
            `Missing or invalid fields: ${missingFields.map(([key]) => key).join(", ")}`
          );
        }

        // Ensure priceAdjustment is a number
        if (typeof forecastResult.priceAdjustment !== "number") {
          forecastResult.priceAdjustment = Number(forecastResult.priceAdjustment);
          if (isNaN(forecastResult.priceAdjustment)) {
            throw new Error("priceAdjustment must be a valid number");
          }
        }

        // Ensure dailyBreakdown is an array if present
        if (forecastResult.dailyBreakdown && !Array.isArray(forecastResult.dailyBreakdown)) {
          forecastResult.dailyBreakdown = [];
        }

        // Ensure recommendations object exists with required arrays
        forecastResult.recommendations = {
          staffing: Array.isArray(forecastResult.recommendations?.staffing)
            ? forecastResult.recommendations.staffing
            : [],
          inventory: Array.isArray(forecastResult.recommendations?.inventory)
            ? forecastResult.recommendations.inventory
            : [],
          marketing: Array.isArray(forecastResult.recommendations?.marketing)
            ? forecastResult.recommendations.marketing
            : [],
          risks: Array.isArray(forecastResult.recommendations?.risks)
            ? forecastResult.recommendations.risks
            : [],
          competitivePositioning: Array.isArray(
            forecastResult.recommendations?.competitivePositioning
          )
            ? forecastResult.recommendations.competitivePositioning
            : [],
        };
      } catch (parseError) {
        console.error("Failed to parse OpenAI JSON response:", parseError);
        console.error("Raw response:", responseContent);
        throw new Error(`Could not parse AI response: ${parseError.message}`);
      }
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      return NextResponse.json(
        { error: `AI processing failed: ${error.message}` },
        { status: 500 }
      );
    }

    // 6. Store in Cache and Return
    if (forecastResult) {
      try {
        const responseData = {
          ...forecastResult,
          weatherAnalysis: weatherAnalysis || null,
        };
        console.log("Final API Response:", responseData);

        // Store in cache
        await cacheCollection.updateOne(
          { _id: cacheKey },
          { $set: { forecast: responseData, timestamp: new Date() } },
          { upsert: true }
        );

        return NextResponse.json(responseData);
      } catch (dbError) {
        console.error("Error saving to cache:", dbError);
        return NextResponse.json({
          ...forecastResult,
          weatherAnalysis: weatherAnalysis || null,
        });
      }
    } else {
      return NextResponse.json(
        { error: "Failed to generate forecast: No valid result" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}
