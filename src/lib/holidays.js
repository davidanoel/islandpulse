// Very basic example - expand significantly for real use
const holidays = {
  JM: [
    // Jamaica
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-02-14", name: "Ash Wednesday" },
    { date: "2025-08-01", name: "Emancipation Day" },
    { date: "2025-08-06", name: "Independence Day" },
    { date: "2025-12-25", name: "Christmas Day" },
    { date: "2025-12-26", name: "Boxing Day" },
  ],
  BB: [
    // Barbados
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-01-21", name: "Errol Barrow Day" },
    { date: "2025-04-28", name: "National Heroes Day" },
    { date: "2025-08-01", name: "Emancipation Day" },
    { date: "2025-11-30", name: "Independence Day" },
    { date: "2025-12-25", name: "Christmas Day" },
    { date: "2025-12-26", name: "Boxing Day" },
  ],
  BS: [
    // Bahamas
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-01-10", name: "Majority Rule Day" },
    { date: "2025-07-10", name: "Independence Day" },
    { date: "2025-08-05", name: "Emancipation Day" },
    { date: "2025-10-14", name: "National Heroes' Day" },
    { date: "2025-12-25", name: "Christmas Day" },
    { date: "2025-12-26", name: "Boxing Day" },
  ],
  TT: [
    // Trinidad & Tobago - Added for events example
    { date: "2025-01-01", name: "New Year's Day" },
    { date: "2025-02-12", name: "Carnival Monday" }, // Example event within holidays for simplicity
    { date: "2025-02-13", name: "Carnival Tuesday" },
    { date: "2025-12-25", name: "Christmas Day" },
    { date: "2025-12-26", name: "Boxing Day" },
  ],
};

// Function for ranges
export function getHolidaysInRange(locationCode, startDate, endDate) {
  const locationHolidays = holidays[locationCode?.toUpperCase()] || [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  return locationHolidays.filter((h) => {
    // Simple comparison - might need timezone adjustments in production
    try {
      const holidayDate = new Date(h.date);
      // Check if holidayDate is valid before comparing
      if (isNaN(holidayDate.getTime())) return false;
      return holidayDate >= start && holidayDate <= end;
    } catch (e) {
      // Handle potential invalid date strings in the data
      console.error(`Invalid date format for holiday: ${h.date}`);
      return false;
    }
  });
}

const MAJOR_CARIBBEAN_EVENTS = {
  AI: [
    // Anguilla
    {
      year: 2024,
      name: "Anguilla Summer Festival (Carnival)",
      startDate: "2024-08-01",
      endDate: "2024-08-11",
      type: "Carnival/Festival",
      notes: "Centered around August Monday",
    },
  ],
  AG: [
    // Antigua and Barbuda
    {
      year: 2025,
      name: "Antigua Sailing Week",
      startDate: "2025-04-26",
      endDate: "2025-05-02",
      type: "Sailing Regatta",
    },
    {
      year: 2024,
      name: "Antigua Carnival",
      startDate: "2024-07-25",
      endDate: "2024-08-06",
      type: "Carnival",
      notes: "Centered around August Monday",
    },
  ],
  BS: [
    // Bahamas
    {
      year: 2024,
      name: "Junkanoo (Boxing Day Parade)",
      startDate: "2024-12-26",
      endDate: "2024-12-26",
      type: "Cultural Festival/Parade",
    },
    {
      year: 2025,
      name: "Junkanoo (New Year's Parade)",
      startDate: "2025-01-01",
      endDate: "2025-01-01",
      type: "Cultural Festival/Parade",
    },
    {
      year: 2025,
      name: "Bahamas Carnival",
      startDate: "2025-05-15",
      endDate: "2025-05-18",
      type: "Carnival",
      notes: "Dates approximate, usually mid-May",
    },
  ],
  BB: [
    // Barbados
    {
      year: 2024,
      name: "Crop Over Festival - Grand Kadooment",
      startDate: "2024-08-05",
      endDate: "2024-08-05",
      type: "Carnival/Festival",
      notes: "Climax event, festival runs July-Aug",
    },
    {
      year: 2024,
      name: "Barbados Food and Rum Festival",
      startDate: "2024-10-24",
      endDate: "2024-10-27",
      type: "Food Festival",
    },
  ],
  BM: [
    // Bermuda
    {
      year: 2024,
      name: "Bermuda Carnival (Revel de Road)",
      startDate: "2024-06-17",
      endDate: "2024-06-17",
      type: "Carnival",
      notes: "Part of National Heroes Weekend events",
    },
    {
      year: 2024,
      name: "Cup Match (Cricket Festival)",
      startDate: "2024-08-01",
      endDate: "2024-08-02",
      type: "Cultural Festival/Sport",
    },
  ],
  VG: [
    // British Virgin Islands
    {
      year: 2024,
      name: "BVI Emancipation Festival (August Festival)",
      startDate: "2024-07-28",
      endDate: "2024-08-06",
      type: "Carnival/Festival",
      notes: "Centered around August Monday",
    },
  ],
  KY: [
    // Cayman Islands
    {
      year: 2025,
      name: "Cayman Cookout",
      startDate: "2025-01-15",
      endDate: "2025-01-20",
      type: "Food Festival",
      notes: "Approximate dates",
    },
    {
      year: 2025,
      name: "Cayman Carnival Batabano",
      startDate: "2025-05-03",
      endDate: "2025-05-03",
      type: "Carnival",
      notes: "Road parade date approximate, usually first Sat in May",
    },
    {
      year: 2024,
      name: "Cayman Pirates Fest (Pirates Week)",
      startDate: "2024-11-08",
      endDate: "2024-11-17",
      type: "Cultural Festival",
      notes: "Spread across islands",
    },
  ],
  DM: [
    // Dominica
    {
      year: 2025,
      name: "Mas Domnik (Real Mas - Carnival)",
      startDate: "2025-03-03",
      endDate: "2025-03-04",
      type: "Carnival",
      notes: "Traditional pre-Lenten dates",
    },
    {
      year: 2024,
      name: "World Creole Music Festival",
      startDate: "2024-10-25",
      endDate: "2024-10-27",
      type: "Music Festival",
    },
  ],
  GD: [
    // Grenada
    {
      year: 2024,
      name: "Spicemas (Carnival)",
      startDate: "2024-08-12",
      endDate: "2024-08-13",
      type: "Carnival",
      notes: "Main parade days, events lead up",
    },
  ],
  JM: [
    // Jamaica
    {
      year: 2025,
      name: "Rebel Salute",
      startDate: "2025-01-17",
      endDate: "2025-01-18",
      type: "Music Festival",
      notes: "Approximate dates",
    },
    {
      year: 2025,
      name: "Jamaica Carnival (Road March)",
      startDate: "2025-04-27",
      endDate: "2025-04-27",
      type: "Carnival",
      notes: "Main parade date approx, usually Sunday after Easter",
    },
    {
      year: 2024,
      name: "Reggae Sumfest",
      startDate: "2024-07-14",
      endDate: "2024-07-20",
      type: "Music Festival",
    },
  ],
  MS: [
    // Montserrat
    {
      year: 2025,
      name: "St. Patrick's Festival",
      startDate: "2025-03-08",
      endDate: "2025-03-17",
      type: "Cultural Festival",
      notes: "Unique Caribbean celebration of St. Patrick",
    },
    {
      year: 2024,
      name: "Montserrat Annual Festival (Carnival)",
      startDate: "2024-12-21",
      endDate: "2025-01-01",
      type: "Carnival",
      notes: "Approximate dates spanning Christmas/New Year",
    },
  ],
  KN: [
    // Saint Kitts and Nevis
    {
      year: 2024,
      name: "St. Kitts Music Festival",
      startDate: "2024-06-27",
      endDate: "2024-06-29",
      type: "Music Festival",
    },
    {
      year: 2024,
      name: "Culturama (Nevis)",
      startDate: "2024-07-25",
      endDate: "2024-08-06",
      type: "Cultural Festival",
      notes: "Nevis main festival",
    },
    {
      year: 2024,
      name: "Sugar Mas (St. Kitts National Carnival)",
      startDate: "2024-12-26",
      endDate: "2025-01-02",
      type: "Carnival",
      notes: "Main parade days, events start earlier",
    },
  ],
  LC: [
    // Saint Lucia
    {
      year: 2025,
      name: "Saint Lucia Jazz & Arts Festival",
      startDate: "2025-04-30",
      endDate: "2025-05-11",
      type: "Music Festival/Arts",
      notes: "Approximate dates",
    },
    {
      year: 2024,
      name: "Saint Lucia Carnival",
      startDate: "2024-07-15",
      endDate: "2024-07-16",
      type: "Carnival",
      notes: "Main parade days",
    },
  ],
  VC: [
    // Saint Vincent and the Grenadines
    {
      year: 2025,
      name: "Bequia Easter Regatta",
      startDate: "2025-04-17",
      endDate: "2025-04-21",
      type: "Sailing Regatta",
      notes: "Approximate dates",
    },
    {
      year: 2024,
      name: "Vincy Mas (Carnival)",
      startDate: "2024-07-08",
      endDate: "2024-07-09",
      type: "Carnival",
      notes: "Main parade days (Mardi Gras), events lead up",
    },
  ],
  TT: [
    // Trinidad and Tobago
    {
      year: 2025,
      name: "Trinidad and Tobago Carnival",
      startDate: "2025-03-03",
      endDate: "2025-03-04",
      type: "Carnival",
      notes: "Pre-Lenten dates",
    },
    {
      year: 2025,
      name: "Tobago Jazz Experience",
      startDate: "2025-04-20",
      endDate: "2025-04-27",
      type: "Music Festival",
      notes: "Dates approximate",
    },
  ],
  TC: [
    // Turks and Caicos Islands
    {
      year: 2024,
      name: "Maskanoo",
      startDate: "2024-12-26",
      endDate: "2024-12-26",
      type: "Cultural Festival/Parade",
      notes: "Boxing Day street festival",
    },
  ],
  VI: [
    // US Virgin Islands
    {
      year: 2025,
      name: "Crucian Christmas Festival (St. Croix Carnival)",
      startDate: "2024-12-28",
      endDate: "2025-01-04",
      type: "Carnival/Festival",
      notes: "Main parade days, events span Dec-Jan",
    },
    {
      year: 2025,
      name: "St. Thomas Carnival",
      startDate: "2025-04-26",
      endDate: "2025-05-03",
      type: "Carnival",
      notes: "Main parade dates approx, events span April/May",
    },
    {
      year: 2024,
      name: "St. John Celebration (Carnival)",
      startDate: "2024-06-28",
      endDate: "2024-07-04",
      type: "Carnival/Festival",
      notes: "Centered around July 3rd & 4th",
    },
  ],

  // --- Primarily Spanish-Speaking ---
  CU: [
    // Cuba
    {
      year: 2025,
      name: "Havana International Jazz Festival (Jazz Plaza)",
      startDate: "2025-01-19",
      endDate: "2025-01-26",
      type: "Music Festival",
      notes: "Approximate dates",
    },
    {
      year: 2024,
      name: "Carnaval de Santiago de Cuba",
      startDate: "2024-07-21",
      endDate: "2024-07-27",
      type: "Carnival",
      notes: "Dates approximate",
    },
  ],
  DO: [
    // Dominican Republic
    {
      year: 2025,
      name: "Dominican Republic Carnival (National Parade)",
      startDate: "2025-03-02",
      endDate: "2025-03-02",
      type: "Carnival",
      notes: "National parade date approx (first Sun in Mar), local parades throughout Feb",
    },
    {
      year: 2024,
      name: "Festival Presidente (Major Concerts)",
      startDate: "2024-10-01",
      endDate: "2024-10-31",
      type: "Music Festival",
      notes: "Not annual, occurs sporadically, Oct 2024 is placeholder - VERIFY",
    },
  ],
  PR: [
    // Puerto Rico
    {
      year: 2025,
      name: "Fiestas de la Calle San Sebastián (SanSe)",
      startDate: "2025-01-16",
      endDate: "2025-01-19",
      type: "Cultural Festival",
      notes: "Approx dates (mid-Jan)",
    },
    {
      year: 2025,
      name: "Carnaval de Ponce",
      startDate: "2025-02-27",
      endDate: "2025-03-04",
      type: "Carnival",
      notes: "Approx dates (week leading up to Ash Wednesday)",
    },
  ],

  // --- Primarily French-Speaking ---
  GP: [
    // Guadeloupe
    {
      year: 2025,
      name: "Guadeloupe Carnival (Mardi Gras)",
      startDate: "2025-03-02",
      endDate: "2025-03-05",
      type: "Carnival",
      notes: "Main days Sun-Wed around Mardi Gras",
    },
    {
      year: 2024,
      name: "Festival Terre de Blues (Marie-Galante)",
      startDate: "2024-05-17",
      endDate: "2024-05-20",
      type: "Music Festival",
    },
  ],
  HT: [
    // Haiti
    {
      year: 2025,
      name: "Haiti Kanaval (Jacmel/Port-au-Prince)",
      startDate: "2025-03-02",
      endDate: "2025-03-04",
      type: "Carnival",
      notes: "Approx pre-Lenten dates; *Subject to national stability*",
    },
  ],
  MQ: [
    // Martinique
    {
      year: 2025,
      name: "Martinique Carnival (Mardi Gras)",
      startDate: "2025-03-02",
      endDate: "2025-03-05",
      type: "Carnival",
      notes: "Main days Sun-Wed around Mardi Gras",
    },
    {
      year: 2024,
      name: "Tour des Yoles Rondes (Sailboat Race/Festival)",
      startDate: "2024-07-28",
      endDate: "2024-08-04",
      type: "Cultural Festival/Sport",
    },
  ],
  BL: [
    // Saint Barthélemy
    {
      year: 2025,
      name: "St. Barth Carnival (Mardi Gras)",
      startDate: "2025-03-04",
      endDate: "2025-03-05",
      type: "Carnival",
      notes: "Main days Tue/Wed",
    },
    {
      year: 2025,
      name: "St. Barth Bucket Regatta",
      startDate: "2025-03-20",
      endDate: "2025-03-23",
      type: "Sailing Regatta",
    },
  ],
  MF: [
    // Saint Martin (French side)
    {
      year: 2025,
      name: "St. Martin Carnival (French Side)",
      startDate: "2025-02-16",
      endDate: "2025-03-05",
      type: "Carnival",
      notes: "Approximate pre-Lenten period",
    },
  ],

  // --- Primarily Dutch-Speaking ---
  AW: [
    // Aruba
    {
      year: 2025,
      name: "Aruba Carnival (Grand Parade)",
      startDate: "2025-03-02",
      endDate: "2025-03-02",
      type: "Carnival",
      notes: "Main parade date approx (Sun before Ash Wed), events span Jan-Mar",
    },
    {
      year: 2024,
      name: "Aruba Soul Beach Music Festival",
      startDate: "2024-05-22",
      endDate: "2024-05-27",
      type: "Music Festival",
    },
  ],
  CW: [
    // Curaçao
    {
      year: 2025,
      name: "Curaçao Carnival (Gran Marcha)",
      startDate: "2025-03-02",
      endDate: "2025-03-02",
      type: "Carnival",
      notes: "Main parade date approx (Sun before Ash Wed), events span Jan-Mar",
    },
    {
      year: 2024,
      name: "Curaçao North Sea Jazz Festival",
      startDate: "2024-08-29",
      endDate: "2024-08-31",
      type: "Music Festival",
      notes: "Occurs approx every 2 years - VERIFY",
    },
  ],
  SX: [
    // Sint Maarten (Dutch side)
    {
      year: 2025,
      name: "Sint Maarten Carnival",
      startDate: "2025-04-14",
      endDate: "2025-05-03",
      type: "Carnival",
      notes: "Approximate dates centered around King's Day (Apr 27)",
    },
    {
      year: 2024,
      name: "St. Maarten Heineken Regatta",
      startDate: "2024-02-29",
      endDate: "2024-03-03",
      type: "Sailing Regatta",
    },
  ],
};

export function getMajorEventsInRange(locationCode, startDate, endDate) {
  const locationEvents = MAJOR_CARIBBEAN_EVENTS[locationCode?.toUpperCase()] || [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  return locationEvents.filter((e) => {
    try {
      const eventDate = new Date(e.startDate);
      if (isNaN(eventDate.getTime())) return false;
      return eventDate >= start && eventDate <= end;
    } catch (e) {
      console.error(`Invalid date format for event: ${e.date}`);
      return false;
    }
  });
}
