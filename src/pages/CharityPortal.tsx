import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { DollarSign, Users, Clock, Download, Award, TrendingUp, ExternalLink, Plus, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Transaction } from '@/types/contribution';
import { DonationExportModal } from '@/components/contribution/DonationExportModal';
import { formatDate } from '@/utils/date';
import { useTranslation } from '@/hooks/useTranslation';
import { CurrencyDisplay } from '@/components/CurrencyDisplay';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Logger } from '@/utils/logger';

export const CharityPortal: React.FC = () => {
  const { user, userType } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<'transactions' | 'volunteers' | 'applications' | 'opportunities'>('transactions');
  const [showExportModal, setShowExportModal] = useState(false);
  const { t } = useTranslation();
  
  // State for charity statistics
  const [charityStats, setCharityStats] = useState({
    totalDonated: 0,
    volunteerHours: 0,
    skillsEndorsed: 0,
    activeVolunteers: 0
  });
  
  // State for transactions, applications, and hours
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [pendingHours, setPendingHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    if (profile?.id) {
      fetchCharityData();
    }
  }, [profile?.id]);

  const fetchCharityData = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      Logger.info('Fetching charity data', { profileId: profile.id });
      
      // Fetch charity statistics with error handling
      Logger.info('Fetching donations data');
      const { data: donationsData, error: donationsError } = await supabase
        .from('donations')
        .select('amount')
        .eq('charity_id', profile.id);
        
      if (donationsError) {
        Logger.error('Error fetching donations data', { error: donationsError.message });
        throw donationsError;
      }
      
      // Ensure donationsData is an array
      const donations = Array.isArray(donationsData) ? donationsData : [];
      Logger.info('Donations data received', { count: donations.length });
      
      Logger.info('Fetching volunteer hours data');
      const { data: hoursData, error: hoursDataError } = await supabase
        .from('volunteer_hours')
        .select('hours')
        .eq('charity_id', profile.id)
        .eq('status', 'approved');
        
      if (hoursDataError) {
        Logger.error('Error fetching hours data', { error: hoursDataError.message });
        throw hoursDataError;
      }
      
      // Ensure hoursData is an array
      const hours = Array.isArray(hoursData) ? hoursData : [];
      Logger.info('Hours data received', { count: hours.length });
      
      Logger.info('Fetching endorsements data');
      const { data: endorsementsData, error: endorsementsError } = await supabase
        .from('skill_endorsements')
        .select('id')
        .eq('recipient_id', profile.id);
        
      if (endorsementsError) {
        Logger.error('Error fetching endorsements data', { error: endorsementsError.message });
        throw endorsementsError;
      }
      
      // Ensure endorsementsData is an array
      const endorsements = Array.isArray(endorsementsData) ? endorsementsData : [];
      Logger.info('Endorsements data received', { count: endorsements.length });
      
      Logger.info('Fetching volunteers data');
      const { data: volunteersData, error: volunteersError } = await supabase
        .from('volunteer_hours')
        .select('volunteer_id')
        .eq('charity_id', profile.id)
        .eq('status', 'approved');
        
      if (volunteersError) {
        Logger.error('Error fetching volunteers data', { error: volunteersError.message });
        throw volunteersError;
      }
      
      // Ensure volunteersData is an array
      const volunteers = Array.isArray(volunteersData) ? volunteersData : [];
      Logger.info('Volunteers data received', { count: volunteers.length });
      
      // Calculate statistics with proper type checking and error handling
      const totalDonated = donations.reduce((sum, donation) => {
        const amount = donation?.amount ? Number(donation.amount) : 0;
        return sum + amount;
      }, 0);
        
      const totalHours = hours.reduce((sum, hour) => {
        const hourCount = hour?.hours ? Number(hour.hours) : 0;
        return sum + hourCount;
      }, 0);
        
      const totalEndorsements = endorsements.length;
      
      // Create a Set of unique volunteer IDs with type checking
      const uniqueVolunteers = new Set(
        Array.isArray(volunteers) && volunteers.length > 0
          ? volunteers
              .filter(v => v?.volunteer_id)
              .map(v => v.volunteer_id)
          : []
      );
      
      Logger.info('Calculated charity statistics', {
        totalDonated,
        totalHours,
        totalEndorsements,
        uniqueVolunteersCount: uniqueVolunteers.size
      });
      
      setCharityStats({
        totalDonated,
        volunteerHours: totalHours,
        skillsEndorsed: totalEndorsements,
        activeVolunteers: uniqueVolunteers.size
      });
      
      // Fetch transactions (donations) with error handling
      Logger.info('Fetching detailed donations data');
      const { data: detailedDonations, error: transactionsError } = await supabase
        .from('donations')
        .select(`
          id,
          amount,
          created_at,
          donor:donor_id (
            id,
            user_id
          )
        `)
        .eq('charity_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (transactionsError) {
        Logger.error('Error fetching detailed donations data', { error: transactionsError.message });
        throw transactionsError;
      }
      
      // Ensure detailedDonations is an array
      const donationsList = Array.isArray(detailedDonations) ? detailedDonations : [];
      Logger.info('Detailed donations data received', { count: donationsList.length });
      
      // Format transactions with type checking
      const formattedTransactions = donationsList.map(donation => ({
        id: donation?.id || '',
        hash: donation?.id || '', // Using ID as hash for sample data
        from: donation?.donor?.id || '',
        to: profile.id || '',
        amount: donation?.amount ? Number(donation.amount) : 0,
        cryptoType: 'GLMR',
        fiatValue: donation?.amount ? Number(donation.amount) : 0,
        fee: donation?.amount ? Number(donation.amount) * 0.001 : 0,
        timestamp: donation?.created_at || new Date().toISOString(),
        status: 'completed',
        purpose: 'Donation',
        metadata: {
          organization: donation?.donor?.id ? 'Donor' : 'Anonymous',
          category: 'Donation'
        }
      }));
      
      setTransactions(formattedTransactions);
      
      // Fetch pending volunteer applications with error handling
      Logger.info('Fetching volunteer applications');
      
      // First, get all opportunity IDs for this charity
      const { data: opportunityIds, error: idsError } = await supabase
        .from('volunteer_opportunities')
        .select('id')
        .eq('charity_id', profile.id);

      if (idsError) {
        Logger.error('Error fetching opportunity IDs', { error: idsError.message });
        throw idsError;
      }

      // Ensure we have an array of IDs
      const validOpportunityIds = Array.isArray(opportunityIds) && opportunityIds.length > 0
        ? opportunityIds.map(opp => opp.id).filter(Boolean)
        : [];

      // Only proceed with the second query if we have IDs
      if (validOpportunityIds.length > 0) {
        const { data: applications, error: applicationsError } = await supabase
          .from('volunteer_applications')
          .select(`
            id,
            full_name,
            opportunity:opportunity_id (
              id,
              title
            )
          `)
          .eq('status', 'pending')
          .in('opportunity_id', validOpportunityIds)
          .order('created_at', { ascending: false });
          
        if (applicationsError) {
          Logger.error('Error fetching volunteer applications', { error: applicationsError.message });
          throw applicationsError;
        }
        
        // Ensure applications is an array
        const applicationsList = Array.isArray(applications) ? applications : [];
        Logger.info('Applications data received', { count: applicationsList.length });
        
        setPendingApplications(applicationsList);
      } else {
        // Handle case where there are no opportunities
        setPendingApplications([]);
        Logger.info('No opportunities found for this charity, skipping applications fetch');
      }
      
      // Fetch pending volunteer hours with error handling
      Logger.info('Fetching volunteer hours');
      const { data: pendingHoursData, error: hoursFetchError } = await supabase
        .from('volunteer_hours')
        .select(`
          id,
          volunteer_id,
          hours,
          date_performed,
          description,
          volunteer:volunteer_id (
            id,
            user_id
          )
        `)
        .eq('charity_id', profile.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (hoursFetchError) {
        Logger.error('Error fetching volunteer hours', { error: hoursFetchError.message });
        throw hoursFetchError;
      }
      
      // Ensure pendingHoursData is an array
      const pendingHoursList = Array.isArray(pendingHoursData) ? pendingHoursData : [];
      Logger.info('Volunteer hours data received', { count: pendingHoursList.length });
      
      // Format volunteer hours with type checking
      const formattedHours = pendingHoursList.map(hour => ({
        id: hour?.id || '',
        volunteerId: hour?.volunteer_id || '',
        volunteerName: hour?.volunteer?.id ? 'Volunteer' : 'Unknown Volunteer',
        hours: hour?.hours ? Number(hour.hours) : 0,
        datePerformed: hour?.date_performed || new Date().toISOString(),
        description: hour?.description || ''
      }));
      
      setPendingHours(formattedHours);
      
      // Reset retry count on success
      setRetryCount(0);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : '';
      
      Logger.error('Error fetching charity data:', { 
        error: errorMessage,
        stack: errorStack,
        state: {
          profileId: profile?.id,
          retryCount
        }
      });
      
      // Implement retry with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const nextRetry = Math.pow(2, retryCount) * 1000; // Exponential backoff
        Logger.info(`Retrying in ${nextRetry}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchCharityData(), nextRetry);
      } else {
        setError('Failed to load charity data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCreated = (hash: string) => {
    Logger.info('Verification created with hash:', hash);
    // Refresh data after verification
    fetchCharityData();
  };

  if (!user) {
    return <Navigate to="/login?type=charity" />;
  }

  if (profileLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          {error}
          <Button 
            onClick={() => fetchCharityData()} 
            variant="secondary" 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Redirect donor users to donor portal
  if (userType !== 'charity') {
    return <Navigate to="/donor-portal" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('charity.dashboard')}</h1>
        <p className="mt-2 text-gray-600">{t('charity.subtitle')}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 mb-8 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.totalDonations')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                <CurrencyDisplay amount={charityStats.totalDonated} />
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('charity.activeVolunteers')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {charityStats.activeVolunteers}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.volunteerHours')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {charityStats.volunteerHours}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <Award className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('dashboard.skillsEndorsed')}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {charityStats.skillsEndorsed}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('charity.transactions')}
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'volunteers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('charity.volunteers')}
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('charity.applications')}
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'opportunities'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {t('volunteer.opportunities')}
            </button>
          </nav>
        </div>
      </div>

      {/* Transaction History */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{t('charity.transactions')}</h2>
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
          <div className="overflow-x-auto">
            {transactions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.type')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('donor.volunteer', 'Donor/Volunteer')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.details')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('contributions.verification')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.timestamp, true)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {t(`contribution.type.${transaction.purpose.toLowerCase().replace(' ', '')}`, transaction.purpose)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.metadata?.donor || t('donor.anonymous', 'Anonymous')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span>
                          {transaction.amount} {transaction.cryptoType} (
                          <CurrencyDisplay amount={transaction.fiatValue || 0} />)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {t(`status.${transaction.status}`, transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.hash ? (
                          <a 
                            href={`https://moonscan.io/tx/${transaction.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <span className="truncate max-w-[100px]">
                              {transaction.hash.substring(0, 10)}...
                            </span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          t('common.notAvailable', 'N/A')
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volunteer Hours Verification */}
      {activeTab === 'volunteers' && (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{t('volunteer.pendingHours', 'Pending Volunteer Hours')}</h2>
              <Button
                variant="secondary"
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('contributions.export')}
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {pendingHours.length > 0 ? (
              pendingHours.map(hours => (
                <div key={hours.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{hours.volunteerName}</h3>
                      <p className="text-sm text-gray-500">
                        {hours.hours} {t('volunteer.hours')} {formatDate(hours.datePerformed)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t('volunteer.verify')}
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('volunteer.reject')}
                      </Button>
                    </div>
                  </div>
                  
                  {hours.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">{t('volunteer.description')}</p>
                      <p className="text-sm text-gray-700">{hours.description}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('volunteer.noPendingHours', 'No pending volunteer hours to verify.')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volunteer Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t('volunteer.pendingApplications', 'Pending Applications')}</h2>
          </div>
          <div className="p-6 space-y-4">
            {pendingApplications.length > 0 ? (
              pendingApplications.map(application => (
                <div key={application.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{application.full_name}</h3>
                      <p className="text-sm text-gray-500">
                        {t('volunteer.appliedFor')}: {application.opportunity?.title || 'Unknown Opportunity'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t('volunteer.accept')}
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('volunteer.reject')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('volunteer.noPendingApplications', 'No pending applications to review.')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Volunteer Opportunities Management */}
      {activeTab === 'opportunities' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('volunteer.opportunities', 'Volunteer Opportunities')}</h2>
            <Link to="/charity-portal/create-opportunity">
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {t('volunteer.createNew', 'Create New')}
              </Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{t('volunteer.opportunities', 'Volunteer Opportunities')}</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-8 text-gray-500">
                {t('volunteer.noOpportunitiesYet', 'No opportunities created yet. Click "Create New" to get started.')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <DonationExportModal
          donations={transactions}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default CharityPortal;