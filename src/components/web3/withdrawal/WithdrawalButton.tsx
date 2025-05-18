import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { WithdrawalModal } from './WithdrawalModal';
import { TransactionButton } from '../common/TransactionButton';

interface WithdrawalButtonProps {
  onSuccess?: () => void;
}

export const WithdrawalButton: React.FC<WithdrawalButtonProps> = ({ onSuccess }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TransactionButton
        icon={Wallet}
        label="Withdraw"
        onClick={() => setShowModal(true)}
      />

      {showModal && (
        <WithdrawalModal
          onClose={() => setShowModal(false)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};