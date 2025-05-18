import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Globe, Search, Download, Filter } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { DonationLeaderboard } from '@/components/contribution/DonationLeaderboard';
import { VolunteerLeaderboard } from '@/components/contribution/VolunteerLeaderboard';
import { GlobalStats } from '@/components/contribution/GlobalStats';
import { RegionFilter } from '@/components/contribution/RegionFilter';
import { TimeRangeFilter } from '@/components/contribution/TimeRangeFilter';
import { useWalletAlias } from '@/hooks/useWalletAlias';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/contexts/ToastContext';

type TimeRange = 'all' | 'year' | 'month' | 'week';
type Region = 'all' | 'na' | 'eu' | 'asia' | 'africa' | 'sa' | 'oceania';

export const ContributionTracker: React.FC = () => {
  const location = useLocation();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [region, setRegion] = useState<Region>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptOut, setShowOptOut] = useState(false);
  const [showAliasModal, setShowAliasModal] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const { alias, setWalletAlias } = useWalletAlias();
  const { isConnected, address } = useWeb3();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'donations' | 'volunteer'>(
    (location.state?.activeTab as 'donations' | 'volunteer') || 'donations'
  );

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleExport = (format: 'csv' | 'pdf') => {
    // Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleSetAlias = async () => {
    if (!isConnected || !address) {
      showToast('error', 'Wallet not connected', 'Please connect your wallet to set an alias');
      return;
    }

    if (!newAlias.trim()) {
      showToast('error', 'Invalid alias', 'Please enter a valid alias');
      return;
    }

    const success = await setWalletAlias(newAlias);
    if (success) {
      setNewAlias('');
      setShowAliasModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Global Impact Rankings</h1>
        <p className="mt-2 text-gray-600">
          Track and celebrate the collective impact of our community
        </p>
      </div>

      {/* Global Stats */}
      <GlobalStats />

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search contributors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <TimeRangeFilter value={timeRange} onChange={(value) => setTimeRange(value as TimeRange)} />
          
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => handleExport('csv')}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleExport('pdf')}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center space-x-4">
            <RegionFilter value={region} onChange={(value) => setRegion(value as Region)} />
            
            <label className="flex items-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showOptOut}
                onChange={(e) => setShowOptOut(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Hide my contributions from rankings</span>
            </label>
          </div>
          
          {isConnected && (
            <div>
              {alias ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Your alias: <span className="font-medium text-indigo-600">{alias}</span></span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setNewAlias(alias);
                      setShowAliasModal(true);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowAliasModal(true)}
                >
                  Set Wallet Alias
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Alias Modal */}
      {showAliasModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Set Wallet Alias</h2>
              <p className="text-gray-600 mb-4">
                Your alias will be displayed on the contribution tracker instead of your wallet address.
              </p>
              <Input
                label="Alias"
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                placeholder="Enter your preferred alias"
                className="mb-4"
              />
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowAliasModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSetAlias}
                >
                  Save Alias
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rankings Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'donations' | 'volunteer')} className="space-y-6">
        <TabsList>
          <TabsTrigger value="donations">Donation Rankings</TabsTrigger>
          <TabsTrigger value="volunteer">Volunteer Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="donations">
          <Card className="p-6">
            <DonationLeaderboard
              timeRange={timeRange}
              region={region}
              searchTerm={searchTerm}
            />
          </Card>
        </TabsContent>

        <TabsContent value="volunteer">
          <Card className="p-6">
            <VolunteerLeaderboard
              timeRange={timeRange}
              region={region}
              searchTerm={searchTerm}
              highlightSkill={location.state?.skill}
              section={location.state?.section}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContributionTracker;