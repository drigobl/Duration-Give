import React, { useState, useEffect, useCallback } from 'react';
// Temporarily using mock for development - switch back when contracts are deployed
import { useScheduledDonationMock as useScheduledDonation } from '@/hooks/web3/useScheduledDonationMock';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Calendar, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { useToast } from '@/contexts/ToastContext';

interface ScheduledDonation {
  id: number;
  charity: string;
  token: string;
  totalAmount: string;
  amountPerMonth: string;
  monthsRemaining: number;
  nextDistribution: Date;
  active: boolean;
}

export const ScheduledDonations: React.FC = () => {
  const { getDonorSchedules, cancelSchedule, loading, error } = useScheduledDonation();
  const [schedules, setSchedules] = useState<ScheduledDonation[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledDonation | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchSchedules = useCallback(async () => {
    try {
      setLoadingSchedules(true);
      const donorSchedules = await getDonorSchedules();
      setSchedules(donorSchedules);
    } catch (err) {
      console.error('Failed to fetch scheduled donations:', err);
    } finally {
      setLoadingSchedules(false);
    }
  }, [getDonorSchedules]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleCancelClick = (schedule: ScheduledDonation) => {
    setSelectedSchedule(schedule);
    setCancelError(null);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedSchedule) return;

    try {
      setCancelError(null);
      await cancelSchedule(selectedSchedule.id);
      showToast('success', 'Scheduled donation cancelled', 'Your monthly donation schedule has been cancelled and remaining funds returned to your wallet.');
      setIsCancelModalOpen(false);
      fetchSchedules();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel scheduled donation';
      setCancelError(errorMessage);
      
      // Check if user rejected transaction
      if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
        setCancelError('Transaction was rejected. Please confirm the transaction in your wallet to cancel the schedule.');
      }
    }
  };

  if (loadingSchedules) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Donations</h3>
          <p className="text-gray-500 mb-4">You don't have any active monthly donation schedules.</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Monthly Donation Schedules</h2>
            <Button
              variant="secondary"
              onClick={fetchSchedules}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Date (UTC)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining Distributions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(schedule.nextDistribution.toISOString(), true, true)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs">
                      {schedule.charity.substring(0, 6)}...{schedule.charity.substring(38)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.amountPerMonth} {schedule.token}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">{schedule.monthsRemaining}</span>
                      <span className="text-gray-500 ml-1">of 12</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCancelClick(schedule)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Confirm Cancellation</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to cancel your monthly donation schedule? The remaining funds ({parseFloat(selectedSchedule.amountPerMonth) * selectedSchedule.monthsRemaining} tokens) will be returned to your wallet.
              </p>
              
              {cancelError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                  {cancelError}
                </div>
              )}
              
              <div className="flex justify-center space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setIsCancelModalOpen(false)}
                >
                  Keep Schedule
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmCancel}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Cancel Schedule'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};