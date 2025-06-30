import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWeb3 } from '@/contexts/Web3Context';
import { DollarSign, Clock, Award, Download, Filter, Calendar, CheckCircle, ExternalLink, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Transaction } from '@/types/contribution';
import { DonationExportModal } from '@/components/contribution/DonationExportModal';
import { formatDate } from '@/utils/date';
import { useTranslation } from '@/hooks/useTranslation';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { WalletAliasSettings } from '@/components/settings/WalletAliasSettings';
import { ScheduledDonations } from '@/components/donor/ScheduledDonations';

type View = 'select' | 'donor' | 'charity' | 'forgotPassword' | 'forgotUsername';

export const GiveDashboard: React.FC = () => {
  const [view, setView] = useState<View>('select');
  const { user, userType } = useAuth();
  const { isConnected, connect } = useWeb3();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [showScheduledDonations, setShowScheduledDonations] = useState(false);
  const { t } = useTranslation();
  
  // Check if we should show wallet settings from location state
  useEffect(() => {
    if (location.state?.showWalletSettings) {
      setShowWalletSettings(true);
    }
  }, [location.state]);
  
  // Sample data - replace with actual data fetching
  const [contributions, setContributions] = useState<Transaction[]>([
    {
      id: '1',
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x0987654321098765432109876543210987654321',
      amount: 0.5,
      cryptoType: 'GLMR',
      fiatValue: 500,
      fee: 0.0001,
      timestamp: '2024-03-15T10:30:00Z',
      status: 'completed',
      purpose: 'Donation',
      metadata: {
        organization: 'Global Water Foundation',
        category: 'Water & Sanitation'
      }
    },
    {
      id: '2',
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x2345678901234567890123456789012345678901',
      amount: 0.3,
      cryptoType: 'GLMR',
      fiatValue: 300,
      fee: 0.0001,
      timestamp: '2023-12-20T14:45:00Z',
      status: 'completed',
      purpose: 'Donation',
      metadata: {
        organization: 'Climate Action Now',
        category: 'Environment'
      }
    },
    {
      id: '3',
      hash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x3456789012345678901234567890123456789012',
      amount: 1.2,
      cryptoType: 'GLMR',
      fiatValue: 1200,
      fee: 0.0002,
      timestamp: '2024-03-14T09:15:00Z',
      status: 'completed',
      purpose: 'Donation',
      metadata: {
        organization: 'Education for All',
        category: 'Education'
      }
    },
    // Volunteer contribution examples
    {
      id: '4',
      hash: '0xef89012345678901234567890123456789012345678901234567890123456789',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x4567890123456789012345678901234567890123',
      amount: 0,
      cryptoType: '',
      fiatValue: 0,
      fee: 0,
      timestamp: '2024-04-05T13:20:00Z',
      status: 'completed',
      purpose: 'Volunteer Application',
      metadata: {
        organization: 'Education for All',
        opportunity: 'Web Development for Education Platform',
        verificationHash: '0xef89012345678901234567890123456789012345678901234567890123456789',
        blockNumber: 1234567
      }
    },
    {
      id: '5',
      hash: '0x23456789012345678901234567890123456789012345678901234567890123ef',
      from: '0x1234567890123456789012345678901234567890',
      to: '0x5678901234567890123456789012345678901234',
      amount: 0,
      cryptoType: '',
      fiatValue: 0,
      fee: 0,
      timestamp: '2024-04-10T15:45:00Z',
      status: 'completed',
      purpose: 'Volunteer Hours',
      metadata: {
        organization: 'Global Water Foundation',
        hours: 8,
        description: 'Website development for donation portal',
        verificationHash: '0x23456789012345678901234567890123456789012345678901234567890123ef',
        blockNumber: 1235678
      }
    }
  ]);

  const isActive = (path: string) => 
    location.pathname === path ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-primary-50';

  const handleSkillClick = (skill: string) => {
    navigate('/contributions', { 
      state: { 
        activeTab: 'volunteer',
        section: 'endorsements',
        skill 
      }
    });
  };

  const filteredContributions = contributions.filter(contribution => {
    const contributionDate = new Date(contribution.timestamp);
    const matchesYear = selectedYear === 'all' || 
      contributionDate.getFullYear().toString() === selectedYear;
    const matchesType = selectedType === 'all' || 
      contribution.purpose === selectedType;
    return matchesYear && matchesType;
  });

  const years = ['all', ...new Set(contributions.map(c => 
    new Date(c.timestamp).getFullYear().toString()
  ))].sort((a, b) => b.localeCompare(a));

  if (!user) {
    return <Navigate to="/login?type=donor" />;
  }

  // Redirect charity users to charity portal
  if (userType === 'charity') {
    return <Navigate to="/charity-portal" />;
  }

  // Show blank page for admin users - they should use /admin instead
  if (userType === 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Please use the admin panel to manage the platform.
          </p>
          <Button onClick={() => window.location.href = `${window.location.origin}/admin`}>
            Go to Admin Panel
          </Button>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            To view your dashboard and make donations, please connect your wallet.
          </p>
          <Button onClick={connect}>Connect Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="mt-2 text-gray-600">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowScheduledDonations(!showScheduledDonations)}
              className="flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {showScheduledDonations ? 'Hide' : 'View'} Monthly Donations
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowWalletSettings(!showWalletSettings)}
              className="flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Wallet Settings
            </Button>
          </div>
        </div>
      </div>

      {showWalletSettings && (
        <div className="mb-8">
          <WalletAliasSettings />
        </div>
      )}

      {showScheduledDonations && (
        <div className="mb-8">
          <ScheduledDonations />
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid gap-6 mb-8 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.totalDonations')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                <CurrencyDisplay amount={2450} />
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.volunteerHours')}</p>
              <p className="text-2xl font-semibold text-gray-900">48</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Award className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.skillsEndorsed')}</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contributions */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.contributions')}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  aria-label="Filter by year"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === 'all' ? t('filter.allYears', 'All Years') : year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  aria-label="Filter by type"
                >
                  <option value="all">{t('filter.allTypes', 'All Types')}</option>
                  <option value="Donation">{t('filter.donations', 'Donations')}</option>
                  <option value="Volunteer Application">{t('filter.volunteerApplications', 'Volunteer Applications')}</option>
                  <option value="Volunteer Hours">{t('filter.volunteerHours', 'Volunteer Hours')}</option>
                </select>
              </div>
              <Button
                onClick={() => setShowExportModal(true)}
                variant="secondary"
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('contributions.export')}
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.organization')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.details')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.verification')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContributions.map((contribution) => (
                <tr key={contribution.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(contribution.timestamp, true)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {t(`contribution.type.${contribution.purpose.toLowerCase().replace(' ', '')}`, contribution.purpose)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contribution.metadata?.organization || t('common.unknown', 'Unknown')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {contribution.purpose === 'Donation' ? (
                      <span>
                        {contribution.amount} {contribution.cryptoType} (
                        <CurrencyDisplay amount={contribution.fiatValue || 0} />)
                      </span>
                    ) : contribution.purpose === 'Volunteer Hours' ? (
                      <span>{contribution.metadata?.hours} {t('volunteer.hours')} - {contribution.metadata?.description}</span>
                    ) : (
                      <span>{contribution.metadata?.opportunity}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      contribution.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : contribution.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {t(`status.${contribution.status}`, contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contribution.hash || contribution.metadata?.verificationHash ? (
                      <a 
                        href={`https://moonscan.io/tx/${contribution.hash || contribution.metadata?.verificationHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <span className="truncate max-w-[100px]">
                          {(contribution.hash || contribution.metadata?.verificationHash || '').substring(0, 10)}...
                        </span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      t('common.notAvailable', 'N/A')
                    )}
                    {contribution.metadata?.blockNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        {t('blockchain.block', 'Block')} #{contribution.metadata.blockNumber}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skills & Endorsements */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t('skills.endorsements', 'Skills & Endorsements')}</h2>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { skill: 'Web Development', endorsements: 5 },
              { skill: 'Project Management', endorsements: 3 },
              { skill: 'Event Planning', endorsements: 4 }
            ].map((item) => (
              <button
                key={item.skill}
                onClick={() => handleSkillClick(item.skill)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{item.skill}</h3>
                  <p className="text-sm text-gray-500">{item.endorsements} {t('skills.endorsements', 'endorsements')}</p>
                </div>
                <Award className="h-5 w-5 text-indigo-600" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <DonationExportModal
          donations={contributions}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default GiveDashboard;