import WeatherAnalysis from "./WeatherAnalysis";
import CompetitorAnalysis from "./CompetitorAnalysis";

export default function ForecastResult({ forecast, weatherAnalysis }) {
  if (!forecast) return null;

  const getDemandColor = (level) => {
    switch (level) {
      case "Very High":
        return "bg-green-100 text-green-800";
      case "High":
        return "bg-green-50 text-green-700";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-red-50 text-red-700";
      case "Very Low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getPriceAdjustmentColor = (adjustment) => {
    if (adjustment > 0) return "bg-green-100 text-green-800";
    if (adjustment < 0) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${getDemandColor(forecast.demandLevel)}`}>
          <h3 className="font-semibold">Demand Level</h3>
          <p className="text-lg">{forecast.demandLevel}</p>
        </div>
        <div className={`p-4 rounded-lg ${getConfidenceColor(forecast.confidenceScore)}`}>
          <h3 className="font-semibold">Confidence</h3>
          <p className="text-lg">{forecast.confidenceScore}</p>
        </div>
        <div className={`p-4 rounded-lg ${getPriceAdjustmentColor(forecast.priceAdjustment)}`}>
          <h3 className="font-semibold">Price Adjustment</h3>
          <p className="text-lg">
            {forecast.priceAdjustment > 0 ? "+" : ""}
            {forecast.priceAdjustment}%
          </p>
        </div>
      </div>

      {/* Daily Breakdown */}
      {forecast.dailyBreakdown && forecast.dailyBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
          <h3 className="text-lg font-semibold mb-4">Daily Demand Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demand Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Adjustment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key Factors
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forecast.dailyBreakdown.map((day, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDemandColor(
                          day.demandLevel
                        )}`}
                      >
                        {day.demandLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriceAdjustmentColor(
                          day.priceAdjustment
                        )}`}
                      >
                        {day.priceAdjustment > 0 ? "+" : ""}
                        {day.priceAdjustment}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {day.factors.map((factor, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {factor}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analysis and Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold mb-2">Analysis</h3>
            <p className="text-gray-700">{forecast.reasoning}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold mb-2">Pricing Guidance</h3>
            <p className="text-gray-700">{forecast.pricingGuidance}</p>
          </div>
        </div>

        <div className="space-y-4">
          {forecast.recommendations && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
              <div className="space-y-4">
                {forecast.recommendations.staffing && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Staffing</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.staffing.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {forecast.recommendations.inventory && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Inventory</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.inventory.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {forecast.recommendations.marketing && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Marketing</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.marketing.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {forecast.recommendations.risks && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.risks.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {forecast.recommendations.competitivePositioning && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Competitive Positioning</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {forecast.recommendations.competitivePositioning.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Competitor Analysis */}
      {forecast.competitorAnalysis && <CompetitorAnalysis data={forecast.competitorAnalysis} />}

      {/* Weather Analysis */}
      {weatherAnalysis && <WeatherAnalysis data={weatherAnalysis} />}
    </div>
  );
}
