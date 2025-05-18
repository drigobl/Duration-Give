import React from 'react';
import { DonationForm } from './DonationForm';
import { TransactionModal } from '@/components/web3/common/TransactionModal';

interface DonationModalProps {
  charityName: string;
  charityAddress: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  charityName,
  charityAddress,
  onClose,
  onSuccess
}) => {
  return (
    <TransactionModal
      title={`Donate to ${charityName}`}
      onClose={onClose}
    >
      <DonationForm
        charityAddress={charityAddress}
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
      />
    </TransactionModal>
  );
};