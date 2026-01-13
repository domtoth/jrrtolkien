'use client';

import { useQuery } from '@apollo/client';
import { GET_ENTITIES } from '@/lib/graphql/queries';
import { Entity, EntityType } from '@/lib/types';
import { Loading } from '@/app/components/Loading';
import { ErrorMessage } from '@/app/components/ErrorMessage';
import { EntityBadge } from '@/app/components/EntityBadge';
import Link from 'next/link';
import { useState } from 'react';

export default function BrowsePage() {
  const [selectedType, setSelectedType] = useState<EntityType | undefined>(undefined);

  const { data, loading, error } = useQuery(GET_ENTITIES, {
    variables: { type: selectedType, limit: 50 },
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  const entities: Entity[] = data?.entities || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Browse Entities</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedType(undefined)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedType === undefined
              ? 'bg-slate-900 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          All
        </button>
        {Object.values(EntityType).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              selectedType === type
                ? 'bg-slate-900 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Entity Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map((entity) => (
          <Link
            key={entity.id}
            href={`/entity/${entity.slug}`}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-slate-900">{entity.name}</h3>
              <EntityBadge type={entity.type} />
            </div>
            {entity.summary && (
              <p className="text-slate-600 text-sm line-clamp-3">{entity.summary}</p>
            )}
            {entity.aliases && entity.aliases.length > 0 && (
              <div className="mt-3 text-xs text-slate-500">
                Also: {entity.aliases.slice(0, 2).join(', ')}
              </div>
            )}
          </Link>
        ))}
      </div>

      {entities.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No entities found for this filter.
        </div>
      )}
    </div>
  );
}

