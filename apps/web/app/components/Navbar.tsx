'use client';

import Link from 'next/link';
import { SearchBar } from './SearchBar';

export function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-blue-400 transition">
            ArdaGraph
          </Link>
          
          <div className="flex-1 max-w-md mx-8">
            <SearchBar />
          </div>
          
          <div className="flex gap-6">
            <Link href="/browse" className="hover:text-blue-400 transition">
              Browse
            </Link>
            <Link href="/about" className="hover:text-blue-400 transition">
              About
            </Link>
            <a
              href="https://github.com/yourusername/ardagraph"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

