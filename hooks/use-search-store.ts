import { create } from 'zustand';
import { SearchResult, searchIndex } from '@/config/search-index';

interface SearchStore {
    query: string;
    setQuery: (val: string) => void;
    dynamicResults: SearchResult[];
    setDynamicResults: (results: SearchResult[]) => void;
    clearDynamicResults: () => void;
    getFullIndex: () => SearchResult[];
}

export const useSearchStore = create<SearchStore>((set, get) => ({
    query: '',
    setQuery: (val) => set({ query: val }),
    dynamicResults: [],
    setDynamicResults: (results) => set({ dynamicResults: results }),
    clearDynamicResults: () => set({ dynamicResults: [] }),
    getFullIndex: () => [...searchIndex, ...get().dynamicResults],
}));
