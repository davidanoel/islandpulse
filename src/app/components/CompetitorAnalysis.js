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
      <div className="space-y-6">
        {/* Market Position */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Market Position
          </h3>
          <p className="text-gray-700 leading-relaxed">{data.marketPosition}</p>
        </div>

        {/* Competitive Advantages */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Competitive Advantages
          </h3>
          <div className="space-y-2">
            {data.competitiveAdvantages.map((advantage, index) => (
              <div
                key={index}
                className="flex items-start bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
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
                <p className="text-gray-700">{advantage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Opportunities */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Market Opportunities
          </h3>
          <div className="space-y-2">
            {data.marketOpportunities.map((opportunity, index) => (
              <div
                key={index}
                className="flex items-start bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <svg
                  className="w-5 h-5 text-blue-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <p className="text-gray-700">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Strategy */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Pricing Strategy
          </h3>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 leading-relaxed">{data.pricingStrategy}</p>
          </div>
        </div>

        {/* Target Market Alignment */}
        <div className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Target Market Alignment
          </h3>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 leading-relaxed">{data.targetMarketAlignment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
