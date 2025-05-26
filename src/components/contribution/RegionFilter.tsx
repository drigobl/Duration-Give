import React from 'react';
import { Globe } from 'lucide-react';

interface RegionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const RegionFilter: React.FC<RegionFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-5 w-5 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="all">All Regions</option>
        <option value="na">North America</option>
        <option value="eu">Europe</option>
        <option value="asia">Asia</option>
        <option value="africa">Africa</option>
        <option value="sa">South America</option>
        <option value="oceania">Oceania</option>
      </select>
    </div>
  );
};