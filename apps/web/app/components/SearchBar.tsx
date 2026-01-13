'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { SEARCH_ENTITIES } from '@/lib/graphql/queries';
import { SearchResult } from '@/lib/types';
import Link from 'next/link';
import { EntityBadge } from './EntityBadge';

function SearchResults({ query }: { query: string }) {
  const { data } = useSuspenseQuery(SEARCH_ENTITIES, {
    variables: { query },
  });

  const results: SearchResult[] = data?.search || [];

  if (results.length === 0) {
    return (
      <div className="px-4 py-3 text-slate-400 text-center">
        No results found for &quot;{query}&quot;
      </div>
    );
  }

  return (
    <>
      {results.map((result) => (
        <Link
          key={result.id}
          href={`/entity/${result.slug}`}
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
    </>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (value.length >= 2) {
        setIsSearching(true);
        // Debounce the search
        debounceTimerRef.current = setTimeout(() => {
          setDebouncedQuery(value);
          setIsOpen(true);
          setIsSearching(false);
        }, 300);
      } else {
        setIsOpen(false);
        setDebouncedQuery('');
        setIsSearching(false);
      }
    },
    []
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
        setDebouncedQuery('');
      }
    },
    []
  );

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search entities..."
          className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          <Suspense
            fallback={
              <div className="px-4 py-3 text-slate-400 text-center">
                Searching...
              </div>
            }
          >
            <div onClick={handleResultClick}>
              <SearchResults query={debouncedQuery} />
            </div>
          </Suspense>
        </div>
      )}
    </div>
  );
}

