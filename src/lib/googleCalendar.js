const GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
const CALENDAR_IDS = {
  // --- Primarily English-Speaking ---
  AI: "en.ai#holiday@group.v.calendar.google.com", // Anguilla (UK Territory)
  AG: "en.ag#holiday@group.v.calendar.google.com", // Antigua and Barbuda
  BS: "en.bs#holiday@group.v.calendar.google.com", // Bahamas
  BB: "en.bb#holiday@group.v.calendar.google.com", // Barbados
  BM: "en.bm#holiday@group.v.calendar.google.com", // Bermuda (UK Territory, Often Associated)
  VG: "en.vg#holiday@group.v.calendar.google.com", // British Virgin Islands (UK Territory)
  KY: "en.ky#holiday@group.v.calendar.google.com", // Cayman Islands (UK Territory)
  DM: "en.dm#holiday@group.v.calendar.google.com", // Dominica
  GD: "en.gd#holiday@group.v.calendar.google.com", // Grenada
  JM: "en.jm#holiday@group.v.calendar.google.com", // Jamaica
  MS: "en.ms#holiday@group.v.calendar.google.com", // Montserrat (UK Territory)
  KN: "en.kn#holiday@group.v.calendar.google.com", // Saint Kitts and Nevis
  LC: "en.lc#holiday@group.v.calendar.google.com", // Saint Lucia
  VC: "en.vc#holiday@group.v.calendar.google.com", // Saint Vincent and the Grenadines
  TT: "en.tt#holiday@group.v.calendar.google.com", // Trinidad and Tobago
  TC: "en.tc#holiday@group.v.calendar.google.com", // Turks and Caicos Islands (UK Territory)
  VI: "en.vi#holiday@group.v.calendar.google.com", // US Virgin Islands (US Territory - might use en.usa primarily)

  // --- Primarily Spanish-Speaking ---
  CU: "es.cu#holiday@group.v.calendar.google.com", // Cuba
  DO: "es.do#holiday@group.v.calendar.google.com", // Dominican Republic
  PR: "es.pr#holiday@group.v.calendar.google.com", // Puerto Rico (US Territory - might use en.usa primarily)

  // --- Primarily French-Speaking ---
  GP: "fr.gp#holiday@group.v.calendar.google.com", // Guadeloupe (French Overseas Dept - might use fr.fr primarily)
  HT: "fr.ht#holiday@group.v.calendar.google.com", // Haiti
  MQ: "fr.mq#holiday@group.v.calendar.google.com", // Martinique (French Overseas Dept - might use fr.fr primarily)
  BL: "fr.bl#holiday@group.v.calendar.google.com", // Saint Barthélemy (French Overseas Collectivity - might use fr.fr primarily)
  MF: "fr.mf#holiday@group.v.calendar.google.com", // Saint Martin (French Overseas Collectivity - might use fr.fr primarily)
  // GF: "fr.fr#holiday@group.v.calendar.google.com", // French Guiana (Uses France's calendar)

  // --- Primarily Dutch-Speaking ---
  AW: "nl.aw#holiday@group.v.calendar.google.com", // Aruba (Constituent Country of the Kingdom of the Netherlands)
  CW: "nl.cw#holiday@group.v.calendar.google.com", // Curaçao (Constituent Country of the Kingdom of the Netherlands)
  SX: "nl.sx#holiday@group.v.calendar.google.com", // Sint Maarten (Constituent Country of the Kingdom of the Netherlands - might use nl.nl primarily)
  BES: "nl.nl#holiday@group.v.calendar.google.com", // Bonaire, Sint Eustatius, Saba

  BZ: "en.bz#holiday@group.v.calendar.google.com", // Belize
  CO: "es.co#holiday@group.v.calendar.google.com", // Colombia
  CR: "es.cr#holiday@group.v.calendar.google.com", // Costa Rica
  GT: "es.gt#holiday@group.v.calendar.google.com", // Guatemala
  GY: "en.gy#holiday@group.v.calendar.google.com", // Guyana
  HN: "es.hn#holiday@group.v.calendar.google.com", // Honduras
  MX: "es.mx#holiday@group.v.calendar.google.com", // Mexico
  NI: "es.ni#holiday@group.v.calendar.google.com", // Nicaragua
  PA: "es.pa#holiday@group.v.calendar.google.com", // Panama
  SR: "nl.sr#holiday@group.v.calendar.google.com", // Suriname
  VE: "es.ve#holiday@group.v.calendar.google.com", // Venezuela
};

export async function getHolidaysFromGoogleCalendar(countryCode, startDate, endDate) {
  console.log("countryCode", countryCode, startDate, endDate);
  try {
    const calendarId = CALENDAR_IDS[countryCode?.toUpperCase()];
    if (!calendarId) {
      console.warn(`No Google Calendar ID found for country code: ${countryCode}`);
      return [];
    }

    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Calendar API Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.items.map((event) => ({
      date: event.start.date || event.start.dateTime.split("T")[0],
      name: event.summary,
      description: event.description || "",
      // You can add more fields as needed
    }));
  } catch (error) {
    console.error("Error fetching holidays from Google Calendar:", error);
    return [];
  }
}

// Fallback to hardcoded holidays if Google Calendar API fails
export async function getHolidaysWithFallback(countryCode, startDate, endDate) {
  try {
    const googleHolidays = await getHolidaysFromGoogleCalendar(countryCode, startDate, endDate);
    if (googleHolidays.length > 0) {
      return googleHolidays;
    }
  } catch (error) {
    console.warn("Falling back to hardcoded holidays:", error);
  }

  // Import and use the hardcoded holidays as fallback
  const { getHolidaysInRange } = await import("./holidays");
  return getHolidaysInRange(countryCode, startDate, endDate);
}
