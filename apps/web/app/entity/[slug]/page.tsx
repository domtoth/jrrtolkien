'use client';

import { use } from 'react';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { GET_ENTITY, GET_ENTITY_GRAPH } from '@/lib/graphql/queries';
import { EntityWithRelationships, GraphData } from '@/lib/types';
import { Loading } from '@/app/components/Loading';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { EntityBadge } from '@/app/components/EntityBadge';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GraphVisualization = dynamic(() => import('@/app/components/GraphVisualization'), {
  ssr: false,
  loading: () => <div className="h-96 bg-slate-100 rounded-lg animate-pulse"></div>,
});

export default function EntityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data, error } = useSuspenseQuery(GET_ENTITY, {
    variables: { slug },
  });

  const {
    data: graphData,
    error: graphError,
  } = useSuspenseQuery(GET_ENTITY_GRAPH, {
    variables: { slug, depth: 1 },
  });

  if (error) return <ErrorMessage message={error.message} />;
  if (!data?.entity) return <ErrorMessage message="Entity not found" />;

  const entity: EntityWithRelationships = data.entity;
  const graph: GraphData | undefined = graphData?.entityGraph;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Entity Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{entity.name}</h1>
            <EntityBadge type={entity.type} />
          </div>
        </div>

        {entity.aliases && entity.aliases.length > 0 && (
          <div className="mb-4">
            <span className="text-slate-600 font-semibold">Also known as: </span>
            <span className="text-slate-700">{entity.aliases.join(', ')}</span>
          </div>
        )}

        {entity.summary && (
          <div className="mt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Synopsis</h2>
            <p className="text-slate-700 leading-relaxed">{entity.summary}</p>
          </div>
        )}
      </div>

      {/* Graph Visualization */}
      {graph && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Relationship Graph</h2>
          <GraphVisualization data={graph} centerSlug={slug} />
        </div>
      )}

      {/* Relationships List */}
      {entity.relationships && entity.relationships.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Relationships</h2>
          <div className="space-y-3">
            {entity.relationships.map((rel) => (
              <div
                key={rel.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-slate-600 font-medium">{rel.predicate}</span>
                  <Link
                    href={`/entity/${rel.targetSlug}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    {rel.targetName}
                  </Link>
                </div>
                <EntityBadge type={rel.targetType} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

