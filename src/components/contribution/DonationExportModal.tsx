import React, { useState } from 'react';
import { Calendar, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Transaction, TransactionExportOptions } from '@/types/contribution';
import { exportDonationsToCSV } from '@/utils/export';
import { formatDateForInput } from '@/utils/date';
import { useTranslation } from '@/hooks/useTranslation';

interface DonationExportModalProps {
  donations: Transaction[];
  onClose: () => void;
}

export const DonationExportModal: React.FC<DonationExportModalProps> = ({ 
  donations, 
  onClose 
}) => {
  const { t } = useTranslation();
  const [filename, setFilename] = useState(`contributions_${new Date().toISOString().split('T')[0]}`);
  const [options, setOptions] = useState<TransactionExportOptions>({
    includePersonalInfo: true,
    dateRange: {
      start: formatDateForInput(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      end: formatDateForInput(new Date().toISOString())
    }
  });

  const handleExport = () => {
    // Filter donations based on date range if provided
    let filteredDonations = [...donations];
    
    if (options.dateRange?.start && options.dateRange?.end) {
      const startDate = new Date(options.dateRange.start);
      const endDate = new Date(options.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day
      
      filteredDonations = filteredDonations.filter(donation => {
        const donationDate = new Date(donation.timestamp);
        return donationDate >= startDate && donationDate <= endDate;
      });
    }
    
    // Export the filtered donations
    exportDonationsToCSV(filteredDonations, `${filename}.csv`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t('export.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('export.filename')}
            </label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="contributions_export"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('export.dateRange')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  type="date"
                  value={options.dateRange?.start || ''}
                  onChange={(e) => setOptions({
                    ...options,
                    dateRange: {
                      ...options.dateRange!,
                      start: e.target.value
                    }
                  })}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
              <div className="relative">
                <Input
                  type="date"
                  value={options.dateRange?.end || ''}
                  onChange={(e) => setOptions({
                    ...options,
                    dateRange: {
                      ...options.dateRange!,
                      end: e.target.value
                    }
                  })}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includePersonalInfo"
              checked={options.includePersonalInfo}
              onChange={(e) => setOptions({
                ...options,
                includePersonalInfo: e.target.checked
              })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="includePersonalInfo" className="ml-2 block text-sm text-gray-900">
              {t('export.includePersonal')}
            </label>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>{t('export.willInclude')}</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>{t('contributions.date')}</li>
              <li>{t('contributions.type')}</li>
              <li>{t('contributions.details')}</li>
              <li>{t('contributions.status')}</li>
              {options.includePersonalInfo && (
                <li>{t('export.walletAddresses', 'Wallet addresses (sender and recipient)')}</li>
              )}
              <li>{t('export.volunteerDetails', 'Volunteer contribution details (when applicable)')}</li>
              <li>{t('export.verificationHashes', 'Verification hashes (when applicable)')}</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            {t('export.cancel')}
          </Button>
          <Button
            onClick={handleExport}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            {t('export.download')}
          </Button>
        </div>
      </div>
    </div>
  );
};