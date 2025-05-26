import React from 'react';
import { Shield, Users, Vote, Scale, Clock, AlertTriangle } from 'lucide-react';

export const Governance: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Protocol Governance</h1>
        <p className="text-xl text-gray-600">
          Empowering our community through transparent and decentralized decision-making
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Vote className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold">Voting Power</h3>
          </div>
          <p className="text-gray-600">
            Voting power is earned through active participation:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Donations contribute to base voting power
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Volunteer hours add additional weight
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Verified organizations receive multipliers
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold">Proposal Thresholds</h3>
          </div>
          <p className="text-gray-600">
            Core protocol changes require:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              66% supermajority approval
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              50% minimum participation
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              48-hour voting period
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold">Council Oversight</h3>
          </div>
          <p className="text-gray-600">
            A multi-signature council provides:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              Emergency response capabilities
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              4/7 signatures for critical actions
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2" />
              24-hour maximum timelock
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <Scale className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold">Proposal Process</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">1. Creation</h4>
              <p className="text-gray-600">
                Any account with minimum voting power can submit detailed proposals with implementation plans.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">2. Discussion</h4>
              <p className="text-gray-600">
                7-day minimum discussion period for community feedback and refinement.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">3. Voting</h4>
              <p className="text-gray-600">
                48-hour voting period with weighted voting based on participation metrics.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">4. Execution</h4>
              <p className="text-gray-600">
                Successful proposals are implemented after meeting all required thresholds.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <Clock className="h-8 w-8 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-semibold">Timeframes & Delays</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Standard Changes</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• 7 days discussion period</li>
                <li>• 48 hours voting period</li>
                <li>• 24 hours timelock before execution</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Emergency Actions</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• No discussion period required</li>
                <li>• 4/7 council signatures needed</li>
                <li>• 24 hours maximum timelock</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-8 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">Important Notice</h3>
              <p className="text-indigo-700">
                All governance participants are required to review and understand the complete governance documentation before participating in proposals or voting. This ensures informed decision-making and maintains the integrity of our governance process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};