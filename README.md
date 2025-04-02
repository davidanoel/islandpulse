# IslandPulse - Caribbean Tourism Forecast

IslandPulse is an AI-powered tourism forecasting platform that helps Caribbean businesses make data-driven decisions by analyzing weather patterns, market trends, and local events.

## Features

### 1. Location-Based Forecasting

- Support for major Caribbean destinations:
  - Kingston, Jamaica
  - Montego Bay, Jamaica
  - Bridgetown, Barbados
  - Nassau, Bahamas
  - Port of Spain, Trinidad & Tobago
- Customizable date range selection
- Real-time weather data integration

### 2. Business Profile Analysis

- Detailed business description input
- Property-specific analysis
- Amenity and service consideration
- Location-based insights

### 3. Event Impact Analysis

- Event details input
- Attendance forecasting
- Tourist vs. local visitor ratio analysis
- Event-specific recommendations

### 4. Comprehensive Forecast Results

- Demand Level Assessment

  - High/Medium/Low demand indicators
  - Confidence scoring
  - Price adjustment recommendations

- Weather Analysis

  - Temperature trends
  - Weather conditions
  - Weather alerts
  - Impact scoring

- Competitor Analysis
  - Market position assessment
  - Competitive advantages
  - Market opportunities
  - Pricing strategy recommendations
  - Target market alignment

### 5. Analytics Dashboard

- Historical forecast tracking
- Performance metrics
- Trend analysis
- PDF report generation

## Technical Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **AI Integration**: OpenAI GPT-4
- **Weather Data**: OpenWeatherMap API
- **PDF Generation**: React-PDF

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/islandpulse.git
cd islandpulse
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
MONGODB_URI=your_mongodb_uri
MONGODB_DB=your_database_name
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
islandpulse/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── forecast/
│   │   │   └── analytics/
│   │   ├── components/
│   │   │   ├── ForecastResult.js
│   │   │   ├── WeatherAnalysis.js
│   │   │   └── CompetitorAnalysis.js
│   │   └── page.js
│   ├── lib/
│   │   ├── mongodb.js
│   │   ├── weatherAnalysis.js
│   │   └── competitorAnalysis.js
│   └── context/
│       └── AuthContext.js
├── public/
└── package.json
```

## API Routes

### `/api/forecast`

- **Method**: POST
- Generates tourism forecasts based on:
  - Location
  - Date range
  - Business profile
  - Event details

### `/api/analytics`

- **Method**: GET
- Retrieves historical forecast data
- Provides analytics and trends

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-4 integration
- OpenWeatherMap for weather data
- MongoDB for database services
- Next.js team for the framework
