import React from 'react';
import { Users, Target, Newspaper } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Mission & Vision */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Give Protocol</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To revolutionize charitable giving by leveraging blockchain technology, ensuring transparency, 
              efficiency, and lasting impact for both donors and charitable organizations.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              A world where every charitable donation creates maximum impact through transparent, 
              efficient, and sustainable giving mechanisms.
            </p>
          </div>
        </div>
      </section>
      
      {/* Rest of the component remains the same */}
    </div>
  );
};