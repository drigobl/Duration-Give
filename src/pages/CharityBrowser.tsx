import React, { useState } from 'react';
import { Search, Filter, CheckCircle } from 'lucide-react';
import { SearchBar } from '../components/charity/SearchBar';
import { CharityGrid } from '../components/charity/CharityGrid';
import { PortfolioGrid } from '../components/charity/PortfolioGrid';
import { CauseGrid } from '../components/charity/CauseGrid';
import { Button } from '../components/ui/Button';

type ViewMode = 'charities' | 'causes' | 'portfolios';

const CharityBrowser: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('charities');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'charities':
        return (
          <CharityGrid
            searchTerm={searchTerm}
            category={selectedCategory}
            verifiedOnly={verifiedOnly}
          />
        );
      case 'causes':
        return (
          <CauseGrid
            searchTerm={searchTerm}
            category={selectedCategory}
          />
        );
      case 'portfolios':
        return (
          <PortfolioGrid
            searchTerm={searchTerm}
            category={selectedCategory}
          />
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Discover Impact Opportunities</h1>
          
          <div className="flex space-x-4 mb-6">
            <Button
              variant={viewMode === 'charities' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('charities')}
            >
              Charities
            </Button>
            <Button
              variant={viewMode === 'causes' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('causes')}
            >
              Causes
            </Button>
            <Button
              variant={viewMode === 'portfolios' ? 'primary' : 'secondary'}
              onClick={() => setViewMode('portfolios')}
            >
              Portfolio Funds
            </Button>
          </div>

          <div className="space-y-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearch}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={[
                'Water & Sanitation',
                'Education',
                'Healthcare',
                'Environment',
                'Poverty Relief',
                'Animal Welfare'
              ]}
            />

            {viewMode === 'charities' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label htmlFor="verified" className="text-sm text-gray-700 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-indigo-600" />
                  Verified Charities Only
                </label>
              </div>
            )}
          </div>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default CharityBrowser;