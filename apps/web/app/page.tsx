import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            Explore Tolkien's Legendarium
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            An interactive knowledge graph of J.R.R. Tolkien's Middle-earth, featuring characters,
            places, artifacts, and events from across the ages.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-blue-400 text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Search & Discover</h3>
            <p className="text-slate-400">
              Search for any character, place, or artifact and explore their connections.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-green-400 text-4xl mb-4">🕸️</div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Graph</h3>
            <p className="text-slate-400">
              Visualize relationships between entities in an interactive graph.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="text-purple-400 text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">Rich Context</h3>
            <p className="text-slate-400">
              Discover which works each entity appears in and their role in the story.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/browse"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
