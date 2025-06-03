import React from 'react';
import { ScheduledDonationForm } from './ScheduledDonationForm';
import { TransactionModal } from '@/components/web3/common/TransactionModal';

interface ScheduledDonationModalProps {
  charityName: string;
  charityAddress: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ScheduledDonationModal: React.FC<ScheduledDonationModalProps> = ({
  charityName,
  charityAddress,
  onClose,
  onSuccess
}) => {
  return (
    <TransactionModal
      title={`Schedule Monthly Donations to ${charityName}`}
      onClose={onClose}
    >
      <ScheduledDonationForm
        charityAddress={charityAddress}
        charityName={charityName}
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
        onClose={onClose}
      />
    </TransactionModal>
  );
};