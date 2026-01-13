'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_ENTITIES } from '@/lib/graphql/queries';
import { SearchResult } from '@/lib/types';
import Link from 'next/link';
import { EntityBadge } from './EntityBadge';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchEntities, { data, loading }] = useLazyQuery(SEARCH_ENTITIES);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.length >= 2) {
        searchEntities({ variables: { query: value, limit: 10 } });
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [searchEntities]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results: SearchResult[] = data?.search || [];

  return (
    <div ref={searchRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search entities..."
        className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/entity/${result.slug}`}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="block px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-white">{result.name}</div>
                  {result.snippet && (
                    <div className="text-sm text-slate-400 mt-1">{result.snippet}</div>
                  )}
                </div>
                <EntityBadge type={result.type} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl p-4 text-slate-400 z-50">
          No results found
        </div>
      )}
    </div>
  );
}

