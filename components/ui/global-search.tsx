'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchIndex, SearchResult } from '@/config/search-index';

export function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (val: string) => {
        setQuery(val);
        if (val.length > 1) {
            const filtered = searchIndex.filter(item =>
                item.title.toLowerCase().includes(val.toLowerCase()) ||
                item.description.toLowerCase().includes(val.toLowerCase())
            );
            setResults(filtered);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const navigateTo = (href: string) => {
        router.push(href);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative w-full px-5" ref={searchRef}>
            <Search className="absolute right-10 top-1/2 h-6 w-6 -translate-y-1/2 text-[#312245] z-10" />
            <Input
                placeholder="Search anything..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => query.length > 1 && setIsOpen(true)}
                className="h-12 rounded-xl border-2 border-[#5C5C5C] bg-white pl-4 font-display !text-base text-[#0E0E0E] shadow-[4px_4px_0px_0px_rgba(87,66,114,1)] focus:ring-0"
            />

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white border-2 border-[#5C5C5C] rounded-xl shadow-[8px_8px_0px_0px_rgba(87,66,114,1)] z-50 overflow-hidden">
                    <ul className="max-h-60 overflow-y-auto">
                        {results.map((result, index) => (
                            <li
                                key={index}
                                onClick={() => navigateTo(result.href)}
                                className="px-4 py-3 hover:!bg-[#261A36]/15 cursor-pointer border-b last:border-none border-[#5C5C5C]/10 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-[#261A36]">{result.title}</p>
                                        <p className="text-sm text-[#574272]">{result.description}</p>
                                    </div>
                                    <span className="text-[10px] uppercase font-black px-2 py-1 bg-purple-100 text-purple-900 rounded-md">
                    {result.category}
                  </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}