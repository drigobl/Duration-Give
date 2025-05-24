import React, { useState, useEffect } from 'react';
import { useScheduledDonation } from '@/hooks/web3/useScheduledDonation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Calendar, AlertTriangle, XCircle } from 'lucide-react';
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
  const { showToast } = useToast();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoadingSchedules(true);
      const donorSchedules = await getDonorSchedules();
      setSchedules(donorSchedules);
    } catch (err) {
      console.error('Failed to fetch scheduled donations:', err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const handleCancelClick = (schedule: ScheduledDonation) => {
    setSelectedSchedule(schedule);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedSchedule) return;

    try {
      await cancelSchedule(selectedSchedule.id);
      showToast('success', 'Scheduled donation cancelled');
      setIsCancelModalOpen(false);
      fetchSchedules();
    } catch (err) {
      showToast('error', 'Failed to cancel scheduled donation', err instanceof Error ? err.message : undefined);
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
        <div className="divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Monthly Donation to {schedule.charity.substring(0, 6)}...{schedule.charity.substring(38)}</h3>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p>Total Amount: {schedule.totalAmount} tokens</p>
                    <p>Monthly Payment: {schedule.amountPerMonth} tokens</p>
                    <p>Months Remaining: {schedule.monthsRemaining} of 12</p>
                    <p>Next Distribution: {formatDate(schedule.nextDistribution.toISOString())}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCancelClick(schedule)}
                  disabled={loading}
                >
                  Cancel Schedule
                </Button>
              </div>
            </div>
          ))}
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