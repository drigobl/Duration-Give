import { useState } from 'react';

interface ScheduleParams {
  charityAddress: string;
  tokenAddress: string;
  totalAmount: string;
}

interface DonorSchedule {
  id: number;
  charity: string;
  token: string;
  totalAmount: string;
  amountPerMonth: string;
  monthsRemaining: number;
  nextDistribution: Date;
  active: boolean;
}

// Mock data for development
const mockSchedules: DonorSchedule[] = [
  {
    id: 1,
    charity: '0x742b90f5a1a66F1D0f9f1bA7f8B4c3e4565C1234',
    token: '0xToken1234567890123456789012345678901234',
    totalAmount: '100.0',
    amountPerMonth: '10.0',
    monthsRemaining: 8,
    nextDistribution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    active: true
  },
  {
    id: 2,
    charity: '0x842c90f5a1a66F1D0f9f1bA7f8B4c3e4565C5678',
    token: '0xToken1234567890123456789012345678901234',
    totalAmount: '60.0',
    amountPerMonth: '20.0',
    monthsRemaining: 2,
    nextDistribution: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    active: true
  },
  {
    id: 3,
    charity: '0x942d90f5a1a66F1D0f9f1bA7f8B4c3e4565C9012',
    token: '0xToken1234567890123456789012345678901234',
    totalAmount: '50.0',
    amountPerMonth: '25.0',
    monthsRemaining: 0,
    nextDistribution: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (completed)
    active: false
  }
];

export function useScheduledDonationMock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async ({ charityAddress, tokenAddress, totalAmount }: ScheduleParams) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    
    // Simulate success
    return '0xmocktransactionhash123456789';
  };

  const cancelSchedule = async (scheduleId: number) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find and "cancel" the schedule
    const schedule = mockSchedules.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.active = false;
    }
    
    setLoading(false);
    
    return '0xmockcancelhash123456789';
  };

  const getDonorSchedules = async (): Promise<DonorSchedule[]> => {
    setLoading(true);
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    
    // Return active schedules
    return mockSchedules.filter(schedule => schedule.active);
  };

  return {
    createSchedule,
    cancelSchedule,
    getDonorSchedules,
    loading,
    error
  };
}