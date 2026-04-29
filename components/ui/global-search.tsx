'use client';

import {useState, useEffect, useRef, useMemo} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {Search} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {useSearchStore} from '@/hooks/use-search-store';
import {SearchResult} from '@/config/search-index';
import {cn} from "@/lib/utils";

const PATH_PLACEHOLDERS: Record<string, string> = {
    '/dashboard': 'Search anything...',
    '/events': 'Search in events...',
    '/feedback': 'Search in feedback forms...',
    '/reports': 'Search reports...',
    '/settings': 'Search settings...',
};

export function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchRef = useRef<HTMLDivElement>(null);

    const getFullIndex = useSearchStore((state) => state.getFullIndex);
    const currentUserType = pathname.includes('moderator') ? 'moderator' : 'organizer';

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const resultsListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [results]);

    useEffect(() => {
        if (selectedIndex >= 0 && resultsListRef.current) {
            const selectedElement = resultsListRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [selectedIndex]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    navigateTo(results[selectedIndex].href);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const setGlobalQuery = useSearchStore(state => state.setQuery);
    const handleSearch = (val: string) => {
        setQuery(val);
        setGlobalQuery(val);

        if (val.length > 0) {
            const items = getFullIndex();

            const isFilteringPage = pathname.includes('/feedback') || pathname.includes('/events');

            const filtered = items.filter(item => {
                const matchesUserType = item.user === currentUserType;

                const matchesQuery =
                    item.title.toLowerCase().includes(val.toLowerCase()) ||
                    item.description.toLowerCase().includes(val.toLowerCase());

                const matchesContext = isFilteringPage
                    ? item.category === 'event'
                    : true;

                return matchesUserType && matchesQuery && matchesContext;
            });

            setResults(filtered);
            setIsOpen(!isFilteringPage);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        setQuery('');
        setGlobalQuery('');
        setResults([]);
        setIsOpen(false);
    }, [pathname, setGlobalQuery]);


    const navigateTo = (href: string) => {
        const cleanHref = href.startsWith('/') ? href.slice(1) : href;

        router.push(`/${currentUserType}/${cleanHref}`);
        setIsOpen(false);
        setQuery('');
    };

    const dynamicPlaceholder = useMemo(() => {
        const match = Object.keys(PATH_PLACEHOLDERS).find(path =>
            pathname.endsWith(path)
        );
        return match ? PATH_PLACEHOLDERS[match] : "Search anything...";
    }, [pathname]);

    return (
        <div className="relative w-full px-5" ref={searchRef}>
            <Search className="absolute right-10 top-1/2 h-6 w-6 -translate-y-1/2 text-[#312245] z-10"/>
            <Input
                placeholder={dynamicPlaceholder}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => query.length > 1 && setIsOpen(true)}
                className="h-12 rounded-xl border-2 border-[#5C5C5C] bg-white pl-4 font-display !text-base text-[#0E0E0E] shadow-[4px_4px_0px_0px_rgba(87,66,114,1)] focus:ring-0"
            />

            {isOpen && results.length > 0 && (
                <div
                    className="absolute top-full left-5 right-5 mt-4 bg-white border-2 border-[#5C5C5C] rounded-xl shadow-[8px_8px_0px_0px_rgba(87,66,114,1)] z-50 overflow-hidden">
                    <ul
                        ref={resultsListRef}
                        className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#7B55A3]">
                        {results.map((result, index) => (
                            <li
                                key={`${result.href}-${index}`}
                                onClick={() => navigateTo(result.href)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={cn(
                                    "px-4 py-3 cursor-pointer border-b last:border-none border-[#5C5C5C]/10 transition-colors",
                                    index === selectedIndex ? "bg-[#261A36]/15" : "hover:bg-[#261A36]/15"
                                )}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="font-bold text-[#261A36] truncate">{result.title}</p>
                                        <p className="text-sm text-[#574272] truncate">{result.description}</p>
                                    </div>
                                    <span className={cn(
                                        "text-[10px] uppercase font-black px-2 py-1 rounded-md shrink-0",
                                        result.category === 'event' ? "bg-orange-100 text-orange-900" : "bg-purple-100 text-purple-900"
                                    )}>
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
