import React from 'react';
import { DonationButton } from '@/components/web3/donation/DonationButton';
import { formatCurrency } from '@/utils/money';

const ReforestationProject: React.FC = () => {
  const cause = {
    id: '3',
    name: 'Reforestation Project',
    description: 'Restoring forest ecosystems and biodiversity through community-led reforestation initiatives and sustainable land management practices.',
    targetAmount: 100000,
    raisedAmount: 60000,
    charityId: '3',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1498925008800-019c7d59d903?auto=format&fit=crop&w=800',
    impact: [
      'Planted 100,000+ native trees',
      'Restored 500 hectares of forest',
      'Protected 50 endangered species',
      'Engaged 1,000 local community members'
    ],
    timeline: '2024-2025',
    location: 'Amazon Rainforest',
    partners: [
      'Climate Action Now',
      'Indigenous Communities',
      'Environmental Scientists',
      'Local Conservation Groups'
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="relative h-80 rounded-xl overflow-hidden mb-6">
          <img
            src={cause.image}
            alt={cause.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{cause.name}</h1>
            <p className="text-lg opacity-90">{cause.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Funding Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{formatCurrency(cause.raisedAmount)} of {formatCurrency(cause.targetAmount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(cause.raisedAmount / cause.targetAmount) * 100}%` }}
                  />
                </div>
              </div>
              <DonationButton
                charityName={cause.name}
                charityAddress={cause.charityId}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="font-medium">{cause.timeline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{cause.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Key Partners</p>
                <ul className="list-disc list-inside">
                  {cause.partners.map((partner, index) => (
                    <li key={index} className="text-gray-700">{partner}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cause.impact.map((item, index) => (
              <div key={index} className="flex items-start">
                <span className="w-2 h-2 mt-2 bg-indigo-500 rounded-full mr-3" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReforestationProject;