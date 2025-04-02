export default function WeatherAnalysis({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Weather Analysis</h2>
      <div className="space-y-4">
        {/* Weather Impact Score */}
        <div>
          <h3 className="font-semibold mb-2">Weather Impact Score</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${data.impactScore * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {Math.round(data.impactScore * 100)}% impact on demand
          </p>
        </div>

        {/* Temperature Details */}
        <div>
          <h3 className="font-semibold mb-2">Temperature</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-lg font-semibold">{data.temperature.average.toFixed(1)}°C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Min</p>
              <p className="text-lg font-semibold">{data.temperature.min.toFixed(1)}°C</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Max</p>
              <p className="text-lg font-semibold">{data.temperature.max.toFixed(1)}°C</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Trend: {data.temperature.trend}</p>
        </div>

        {/* Weather Conditions */}
        <div>
          <h3 className="font-semibold mb-2">Weather Conditions</h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Dominant Condition</p>
              <p className="text-lg font-semibold">{data.conditions.dominant}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Condition Distribution</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.conditions.percentages).map(([condition, percentage]) => (
                  <span
                    key={condition}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
          <div>
            <h3 className="font-semibold mb-2">Weather Alerts</h3>
            <div className="space-y-2">
              {data.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    alert.type === "critical"
                      ? "bg-red-50 border border-red-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <p className={alert.type === "critical" ? "text-red-800" : "text-yellow-800"}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
