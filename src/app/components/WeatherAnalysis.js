export default function WeatherAnalysis({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
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
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Weather Analysis</h2>
      </div>
      <div className="space-y-6">
        {/* Weather Impact Score */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Weather Impact Score
          </h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${data.impactScore * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Math.round(data.impactScore * 100)}% impact on demand
          </p>
        </div>

        {/* Temperature Details */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Temperature
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-xl font-semibold text-blue-600">
                {data.temperature.average.toFixed(1)}°C
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Min</p>
              <p className="text-xl font-semibold text-blue-600">
                {data.temperature.min.toFixed(1)}°C
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Max</p>
              <p className="text-xl font-semibold text-blue-600">
                {data.temperature.max.toFixed(1)}°C
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Trend: {data.temperature.trend}
          </div>
        </div>

        {/* Weather Conditions */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Weather Conditions
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Dominant Condition</p>
              <p className="text-lg font-semibold text-blue-600">{data.conditions.dominant}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Condition Distribution</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.conditions.percentages).map(([condition, percentage]) => (
                  <span
                    key={condition}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {condition}: {percentage}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {data.alerts && data.alerts.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Weather Alerts
            </h3>
            <div className="space-y-2">
              {data.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                    alert.type === "critical"
                      ? "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
                      : "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200"
                  }`}
                >
                  <div className="flex items-start">
                    <svg
                      className={`w-5 h-5 mr-2 ${
                        alert.type === "critical" ? "text-red-500" : "text-yellow-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p
                      className={`font-medium ${
                        alert.type === "critical" ? "text-red-800" : "text-yellow-800"
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
