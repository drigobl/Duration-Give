import React from 'react';
import { DonationButton } from '@/components/web3/donation/DonationButton';
import { ScheduledDonationButton } from '@/components/web3/donation/ScheduledDonationButton';
import { formatCurrency } from '@/utils/money';
import { Link } from 'react-router-dom';

const EducationForAll: React.FC = () => {
  const charity = {
    id: '2',
    name: 'Education for All',
    description: 'Supporting education in developing countries through innovative learning programs, teacher training, and infrastructure development.',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800',
    verified: true,
    country: 'Kenya',
    stats: {
      totalDonated: 620000,
      donorCount: 980,
      projectsCompleted: 25
    },
    mission: 'Our mission is to make quality education accessible to all children, regardless of their socioeconomic background.',
    impact: [
      'Built 50 schools in underserved communities',
      'Provided scholarships to 10,000+ students',
      'Trained 2,500 teachers in modern pedagogy',
      'Distributed 100,000 educational resources'
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="relative h-80 rounded-xl overflow-hidden mb-6">
          <img
            src={charity.image}
            alt={charity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center mb-2">
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                Verified
              </span>
              <span className="ml-3 text-sm opacity-90">{charity.country}</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{charity.name}</h1>
            <p className="text-lg opacity-90">{charity.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Donated</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(charity.stats.totalDonated)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Donors</p>
                <p className="text-xl font-bold text-gray-900">
                  {charity.stats.donorCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Projects</p>
                <p className="text-xl font-bold text-gray-900">
                  {charity.stats.projectsCompleted}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Giving Options</h2>
            <div className="space-y-4">
              <DonationButton
                charityName={charity.name}
                charityAddress={charity.id}
                buttonText="Give Once"
              />
              <ScheduledDonationButton
                charityName={charity.name}
                charityAddress={charity.id}
                buttonText="Give Monthly"
              />
              <Link 
                to="/docs/giving-options"
                className="block text-sm text-indigo-600 hover:text-indigo-800 mt-2 text-center"
              >
                Learn about the difference in giving options →
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">{charity.mission}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Highlights</h2>
            <ul className="space-y-2">
              {charity.impact.map((item, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationForAll;