// School vacation periods for major tourist source countries
const SCHOOL_VACATIONS = {
  US: {
    springBreak: {
      start: "2025-03-15",
      end: "2025-03-30",
      description: "US Spring Break",
    },
    summerBreak: {
      start: "2025-06-01",
      end: "2025-08-31",
      description: "US Summer Break",
    },
    winterBreak: {
      start: "2025-12-20",
      end: "2025-01-05",
      description: "US Winter Break",
    },
  },
  UK: {
    easterBreak: {
      start: "2025-03-29",
      end: "2025-04-12",
      description: "UK Easter Break",
    },
    summerBreak: {
      start: "2025-07-20",
      end: "2025-09-01",
      description: "UK Summer Break",
    },
    christmasBreak: {
      start: "2025-12-20",
      end: "2025-01-05",
      description: "UK Christmas Break",
    },
  },
  Canada: {
    marchBreak: {
      start: "2025-03-11",
      end: "2025-03-15",
      description: "Canadian March Break",
    },
    summerBreak: {
      start: "2025-06-30",
      end: "2025-09-02",
      description: "Canadian Summer Break",
    },
    winterBreak: {
      start: "2025-12-20",
      end: "2025-01-05",
      description: "Canadian Winter Break",
    },
  },
  Europe: {
    easterBreak: {
      start: "2025-03-29",
      end: "2025-04-12",
      description: "European Easter Break",
    },
    summerBreak: {
      start: "2025-07-01",
      end: "2025-08-31",
      description: "European Summer Break",
    },
    christmasBreak: {
      start: "2025-12-20",
      end: "2025-01-05",
      description: "European Christmas Break",
    },
  },
};

export function getSchoolVacationPeriods(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const relevantPeriods = [];

  // Check each country's vacation periods
  Object.entries(SCHOOL_VACATIONS).forEach(([country, periods]) => {
    Object.values(periods).forEach((period) => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);

      // Check if the vacation period overlaps with the requested date range
      if (
        (periodStart <= end && periodEnd >= start) ||
        (periodStart >= start && periodStart <= end) ||
        (periodEnd >= start && periodEnd <= end)
      ) {
        relevantPeriods.push(period.description);
      }
    });
  });

  if (relevantPeriods.length === 0) {
    return "No major school vacation periods during this time.";
  }

  return relevantPeriods.map((period) => `- ${period}`).join("\n");
}

// Helper function to get historical weather patterns
export function getHistoricalPatterns(month) {
  // This would typically come from a database of historical weather data
  // For now, returning static patterns based on typical Caribbean weather
  const patterns = {
    1: { temperature: "25-30°C", rainfall: "Low", demand: "High" },
    2: { temperature: "25-30°C", rainfall: "Low", demand: "High" },
    3: { temperature: "26-31°C", rainfall: "Low", demand: "High" },
    4: { temperature: "27-32°C", rainfall: "Moderate", demand: "Moderate" },
    5: { temperature: "28-33°C", rainfall: "Moderate", demand: "Moderate" },
    6: { temperature: "29-34°C", rainfall: "High", demand: "Low" },
    7: { temperature: "29-34°C", rainfall: "High", demand: "Low" },
    8: { temperature: "29-34°C", rainfall: "High", demand: "Low" },
    9: { temperature: "28-33°C", rainfall: "High", demand: "Low" },
    10: { temperature: "27-32°C", rainfall: "High", demand: "Low" },
    11: { temperature: "26-31°C", rainfall: "Moderate", demand: "Moderate" },
    12: { temperature: "25-30°C", rainfall: "Low", demand: "High" },
  };

  return patterns[month] || { temperature: "Unknown", rainfall: "Unknown", demand: "Unknown" };
}
