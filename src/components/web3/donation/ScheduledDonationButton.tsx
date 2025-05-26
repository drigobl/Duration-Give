import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { ScheduledDonationModal } from './ScheduledDonationModal';
import { TransactionButton } from '@/components/web3/common/TransactionButton';

interface ScheduledDonationButtonProps {
  charityName: string;
  charityAddress: string;
  buttonText?: string;
  onSuccess?: () => void;
}

export const ScheduledDonationButton: React.FC<ScheduledDonationButtonProps> = ({
  charityName,
  charityAddress,
  buttonText = "Donate Monthly",
  onSuccess
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TransactionButton
        icon={Calendar}
        label={buttonText}
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center"
      />

      {showModal && (
        <ScheduledDonationModal
          charityName={charityName}
          charityAddress={charityAddress}
          onClose={() => setShowModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};