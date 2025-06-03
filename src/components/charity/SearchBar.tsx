import React, { useState, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface Country {
  id: string;
  name: string;
  code: string;
  flag?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface SearchFilters {
  country?: string;
  category?: string;
  status?: 'active' | 'completed' | 'all';
  sortBy?: 'name' | 'date' | 'popularity';
}

interface SearchBarProps {
  countries: Country[];
  categories: Category[];
  isLoading?: boolean;
  error?: Error | null;
  onSearch: (query: string, filters: SearchFilters) => void;
  onCountrySelect?: (country: Country) => void;
  onCategorySelect?: (category: Category) => void;
  defaultCountry?: Country;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  countries,
  categories,
  isLoading = false,
  error,
  onSearch,
  onCountrySelect,
  onCategorySelect,
  defaultCountry,
  placeholder = 'Search charities...',
  className
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    country: defaultCountry?.code,
    status: 'active',
    sortBy: 'popularity'
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  // Currently unused but may be needed for future search optimization
  // const debouncedSearch = useDebounce(query, 300);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery, filters);
  }, [filters, onSearch]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(query, newFilters);
  }, [filters, query, onSearch]);

  const handleCountryChange = useCallback((countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country && onCountrySelect) {
      onCountrySelect(country);
    }
    handleFilterChange('country', countryCode);
  }, [countries, handleFilterChange, onCountrySelect]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && onCategorySelect) {
      onCategorySelect(category);
    }
    handleFilterChange('category', categoryId);
  }, [categories, handleFilterChange, onCategorySelect]);

  const clearSearch = () => {
    setQuery('');
    onSearch('', filters);
  };

  const renderCountryOption = (country: Country) => {
    const flagEmoji = country.flag || '';
    return (
      <option key={country.code} value={country.code}>
        {flagEmoji && `${flagEmoji} `}{country.name}
      </option>
    );
  };

  return (
    <div 
      ref={searchRef}
      className={cn('relative space-y-4', className)}
    >
      <div className="relative flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className={cn(
              'w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              isLoading && 'bg-gray-50'
            )}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="ml-2"
        >
          Filters
        </Button>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error.message}
        </div>
      )}

      {showFilters && (
        <div className="p-4 bg-white rounded-lg shadow-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={filters.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Countries</option>
                {countries.map(renderCountryOption)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="popularity">Popularity</option>
                <option value="date">Date</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};