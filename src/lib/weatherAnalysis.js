const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Weather impact thresholds
const WEATHER_THRESHOLDS = {
  temperature: {
    ideal: { min: 25, max: 30 }, // Ideal temperature range for Caribbean tourism
    warning: { min: 20, max: 35 }, // Warning temperature range
    critical: { min: 15, max: 40 }, // Critical temperature range
  },
  precipitation: {
    warning: 5, // 5mm of rain in 3 hours
    critical: 15, // 15mm of rain in 3 hours
  },
  wind: {
    warning: 20, // 20 m/s
    critical: 30, // 30 m/s
  },
};

// Weather condition impact scores (0-1)
const WEATHER_IMPACT_SCORES = {
  Clear: 1.0,
  Clouds: 0.8,
  Rain: 0.4,
  Thunderstorm: 0.2,
  Snow: 0.1,
};

export async function getWeatherAnalysis(lat, lon, startDate, endDate) {
  try {
    console.log("Starting weather analysis with params:", { lat, lon, startDate, endDate });

    // Get 5-day forecast with 3-hour intervals
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    console.log("Fetching weather data from:", forecastUrl);

    const response = await fetch(forecastUrl);
    console.log("Weather API Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Weather API Response data:", data);

    const forecasts = data.list || [];
    console.log("Number of forecast entries:", forecasts.length);

    // Get all alerts
    const temperatureAlerts = generateTemperatureAlerts(forecasts.map((f) => f.main.temp));
    const precipitationAlerts = generatePrecipitationAlerts(
      forecasts.map((f) => f.rain?.["3h"] || 0)
    );
    const windAlerts = generateWindAlerts(forecasts.map((f) => f.wind.speed));
    const conditionAlerts = generateConditionAlerts(forecasts.map((f) => f.weather[0].main));

    // Combine all alerts
    const allAlerts = [
      ...temperatureAlerts,
      ...precipitationAlerts,
      ...windAlerts,
      ...conditionAlerts,
    ];

    // Analyze weather patterns
    const analysis = {
      temperature: analyzeTemperature(forecasts),
      precipitation: analyzePrecipitation(forecasts),
      wind: analyzeWind(forecasts),
      conditions: analyzeConditions(forecasts),
      alerts: allAlerts,
      impactScore: calculateImpactScore(forecasts),
      trends: analyzeTrends(forecasts),
    };

    console.log("Final weather analysis:", analysis);
    return analysis;
  } catch (error) {
    console.error("Error in weather analysis:", error);
    return null;
  }
}

function analyzeTemperature(forecasts) {
  const temps = forecasts.map((f) => f.main.temp);
  return {
    average: temps.reduce((a, b) => a + b, 0) / temps.length,
    min: Math.min(...temps),
    max: Math.max(...temps),
    trend: calculateTrend(temps),
    alerts: generateTemperatureAlerts(temps),
  };
}

function analyzePrecipitation(forecasts) {
  const precip = forecasts.map((f) => f.rain?.["3h"] || 0);
  return {
    average: precip.reduce((a, b) => a + b, 0) / precip.length,
    max: Math.max(...precip),
    trend: calculateTrend(precip),
    alerts: generatePrecipitationAlerts(precip),
  };
}

function analyzeWind(forecasts) {
  const winds = forecasts.map((f) => f.wind.speed);
  return {
    average: winds.reduce((a, b) => a + b, 0) / winds.length,
    max: Math.max(...winds),
    trend: calculateTrend(winds),
    alerts: generateWindAlerts(winds),
  };
}

function analyzeConditions(forecasts) {
  const conditions = forecasts.map((f) => f.weather[0].main);
  const conditionCounts = conditions.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  const totalPeriods = forecasts.length;
  const conditionPercentages = Object.entries(conditionCounts).reduce((acc, [condition, count]) => {
    acc[condition] = Math.round((count / totalPeriods) * 100);
    return acc;
  }, {});

  return {
    dominant: Object.entries(conditionCounts).sort(([, a], [, b]) => b - a)[0][0],
    distribution: conditionCounts,
    percentages: conditionPercentages,
    alerts: generateConditionAlerts(conditions),
  };
}

function calculateTrend(values) {
  if (values.length < 2) return "stable";

  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));

  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  const difference = secondAvg - firstAvg;
  const threshold = (Math.max(...values) - Math.min(...values)) * 0.1;

  if (Math.abs(difference) < threshold) return "stable";
  return difference > 0 ? "increasing" : "decreasing";
}

function calculateImpactScore(forecasts) {
  let score = 1.0;

  // Calculate average conditions across all forecasts
  const avgTemp = forecasts.reduce((sum, f) => sum + f.main.temp, 0) / forecasts.length;
  const avgPrecip = forecasts.reduce((sum, f) => sum + (f.rain?.["3h"] || 0), 0) / forecasts.length;
  const avgWind = forecasts.reduce((sum, f) => sum + f.wind.speed, 0) / forecasts.length;

  // Temperature impact
  if (
    avgTemp < WEATHER_THRESHOLDS.temperature.ideal.min ||
    avgTemp > WEATHER_THRESHOLDS.temperature.ideal.max
  ) {
    score *= 0.8;
  }

  // Precipitation impact
  if (avgPrecip > WEATHER_THRESHOLDS.precipitation.warning) {
    score *= 0.6;
  }

  // Wind impact
  if (avgWind > WEATHER_THRESHOLDS.wind.warning) {
    score *= 0.7;
  }

  // Weather condition impact
  const conditions = forecasts.map((f) => f.weather[0].main);
  const conditionCounts = conditions.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});

  // Calculate weighted average of condition scores
  const totalPeriods = forecasts.length;
  const conditionScore = Object.entries(conditionCounts).reduce((sum, [condition, count]) => {
    return sum + WEATHER_IMPACT_SCORES[condition] * (count / totalPeriods);
  }, 0);

  score *= conditionScore;

  return Math.round(score * 100) / 100;
}

function analyzeTrends(forecasts) {
  return {
    temperature: calculateTrend(forecasts.map((f) => f.main.temp)),
    precipitation: calculateTrend(forecasts.map((f) => f.rain?.["3h"] || 0)),
    wind: calculateTrend(forecasts.map((f) => f.wind.speed)),
    conditions: forecasts
      .map((f) => f.weather[0].main)
      .reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {}),
  };
}

// Helper functions for specific alerts
function generateTemperatureAlerts(temps) {
  return temps
    .map((temp) => {
      if (temp < WEATHER_THRESHOLDS.temperature.critical.min) {
        return { type: "critical", message: `Critical low temperature: ${temp}°C` };
      }
      if (temp > WEATHER_THRESHOLDS.temperature.critical.max) {
        return { type: "critical", message: `Critical high temperature: ${temp}°C` };
      }
      return null;
    })
    .filter(Boolean);
}

function generatePrecipitationAlerts(precipChances) {
  return precipChances
    .map((precip) => {
      if (precip > WEATHER_THRESHOLDS.precipitation.critical) {
        return {
          type: "critical",
          message: `Heavy rainfall expected: ${precip.toFixed(1)}mm in 3 hours`,
        };
      }
      if (precip > WEATHER_THRESHOLDS.precipitation.warning) {
        return {
          type: "warning",
          message: `Moderate rainfall expected: ${precip.toFixed(1)}mm in 3 hours`,
        };
      }
      return null;
    })
    .filter(Boolean);
}

function generateWindAlerts(winds) {
  return winds
    .map((wind) => {
      if (wind > WEATHER_THRESHOLDS.wind.critical) {
        return { type: "critical", message: `Critical wind speed: ${wind}m/s` };
      }
      return null;
    })
    .filter(Boolean);
}

function generateConditionAlerts(conditions) {
  return conditions
    .map((condition) => {
      if (condition === "Thunderstorm") {
        return { type: "critical", message: "Thunderstorm conditions detected" };
      }
      return null;
    })
    .filter(Boolean);
}
