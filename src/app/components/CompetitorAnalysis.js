export default function CompetitorAnalysis({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Competitor Analysis</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Market Position</h3>
          <p className="text-gray-700">{data.marketPosition}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Competitive Advantages</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {data.competitiveAdvantages.map((advantage, index) => (
              <li key={index}>{advantage}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Market Opportunities</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {data.marketOpportunities.map((opportunity, index) => (
              <li key={index}>{opportunity}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Pricing Strategy</h3>
          <p className="text-gray-700">{data.pricingStrategy}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Target Market Alignment</h3>
          <p className="text-gray-700">{data.targetMarketAlignment}</p>
        </div>
      </div>
    </div>
  );
}
