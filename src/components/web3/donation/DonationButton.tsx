import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { DonationModal } from './DonationModal';
import { TransactionButton } from '@/components/web3/common/TransactionButton';

interface DonationButtonProps {
  charityName: string;
  charityAddress: string;
  buttonText?: string;
  onSuccess?: () => void;
}

export const DonationButton: React.FC<DonationButtonProps> = ({
  charityName,
  charityAddress,
  buttonText = "Donate",
  onSuccess
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TransactionButton
        icon={Heart}
        label={buttonText}
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center"
      />

      {showModal && (
        <DonationModal
          charityName={charityName}
          charityAddress={charityAddress}
          onClose={() => setShowModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};