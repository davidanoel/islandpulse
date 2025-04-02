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
      <div className="space-y-4">
        {/* Weather Impact Score */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Weather Impact Score
            </h3>
            <span className="text-base sm:text-lg font-bold text-blue-600">
              {(data.impactScore * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.impactScore * 100}%` }}
            />
          </div>
        </div>

        {/* Temperature Details */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Temperature Details
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-sm text-gray-700">Average</div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                {data.temperature.average.toFixed(1)}°C
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-700">Min</div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                {data.temperature.min.toFixed(1)}°C
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-700">Max</div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">
                {data.temperature.max.toFixed(1)}°C
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center text-sm text-gray-700">
            <svg
              className={`w-4 h-4 mr-1 ${
                data.temperature.trend === "increasing" ? "text-red-500" : "text-blue-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  data.temperature.trend === "increasing"
                    ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                }
              />
            </svg>
            Temperature Trend: {data.temperature.trend === "increasing" ? "Rising" : "Decreasing"}
          </div>
        </div>

        {/* Weather Conditions */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Weather Conditions
          </h3>
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Dominant Condition</div>
              <div className="text-lg font-bold text-blue-600 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                {data.conditions.dominant}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(data.conditions.percentages).map(([condition, percentage]) => (
                <div
                  key={condition}
                  className="bg-white rounded-lg p-2 shadow-sm flex items-center justify-between"
                >
                  <span className="text-gray-700">{condition}</span>
                  <span className="font-medium text-blue-600">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {data.alerts && data.alerts.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
              Weather Alerts
            </h3>
            <div className="space-y-2">
              {data.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg shadow-sm ${
                    alert.type === "critical"
                      ? "bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
                      : "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`p-1 rounded-lg mr-2 ${
                        alert.type === "critical"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
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
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{alert.title}</div>
                      <div className="text-sm text-gray-700 mt-1">{alert.description}</div>
                    </div>
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
