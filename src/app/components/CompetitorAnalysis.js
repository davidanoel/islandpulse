export default function CompetitorAnalysis({ data }) {
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Competitor Analysis</h2>
      </div>
      <div className="space-y-4">
        {/* Market Position */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Market Position</h3>
            <span className="text-base sm:text-lg font-bold text-blue-600">
              {data.marketPosition}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  data.marketPosition === "Leader"
                    ? 100
                    : data.marketPosition === "Challenger"
                    ? 75
                    : data.marketPosition === "Follower"
                    ? 50
                    : 25
                }%`,
              }}
            />
          </div>
        </div>

        {/* Competitive Advantages */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Competitive Advantages
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="bg-white rounded-lg p-2 shadow-sm flex items-center">
                <svg
                  className="w-4 h-4 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Opportunities */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Market Opportunities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.marketOpportunities.map((opportunity, index) => (
              <div key={index} className="bg-white rounded-lg p-2 shadow-sm flex items-center">
                <svg
                  className="w-4 h-4 text-blue-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-gray-700">{opportunity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Strategy */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Pricing Strategy
          </h3>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Recommended Strategy</div>
            <div className="text-lg font-bold text-blue-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {data.pricingStrategy}
            </div>
          </div>
        </div>

        {/* Target Market Alignment */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Target Market Alignment
          </h3>
          <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Primary Target</div>
            <div className="text-lg font-bold text-blue-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {data.targetMarketAlignment}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
