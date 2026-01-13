export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">About ArdaGraph</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What is ArdaGraph?</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          ArdaGraph is an interactive knowledge graph explorer for J.R.R. Tolkien's Middle-earth
          legendarium. It provides a unique way to discover and explore the rich world of Tolkien's
          creation through an interconnected web of characters, places, artifacts, events, and
          groups.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Technology</h2>
        <ul className="space-y-2 text-slate-700">
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>
              <strong>Neo4j:</strong> Graph database for storing entities and relationships
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>
              <strong>GraphQL:</strong> API layer for querying the knowledge graph
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>
              <strong>Next.js 14:</strong> React framework with App Router
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>
              <strong>TailwindCSS:</strong> Utility-first CSS framework
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-semibold mr-2">•</span>
            <span>
              <strong>Railway:</strong> Cloud platform for deployment
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data & Copyright</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          ArdaGraph contains only factual information and short summaries. No copyrighted prose
          from Tolkien's works is included. All content is presented for educational and reference
          purposes.
        </p>
        <p className="text-slate-600 text-sm">
          This is a fan-made project and is not affiliated with or endorsed by the Tolkien Estate
          or any official Tolkien entities.
        </p>
      </div>
    </div>
  );
}

