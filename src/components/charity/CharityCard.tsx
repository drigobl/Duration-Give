import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';
import { Card } from '@/components/ui/Card';

// Simplified charity interface for display purposes
interface SimpleCharity {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  verified: boolean;
  country: string;
  causes: string[];
}

interface CharityCardProps {
  charity: SimpleCharity;
}

export const CharityCard: React.FC<CharityCardProps> = React.memo(({ charity }) => {
  // Memoize charity slug to prevent recalculation
  const charitySlug = useMemo(() => {
    return charity.name.toLowerCase().replace(/\s+/g, '-');
  }, [charity.name]);

  return (
    <Link to={`/charity/${charitySlug}`}>
      <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
        <ImageWithFallback
          src={charity.image}
          alt={charity.name}
          className="w-full h-48 object-cover"
          fallbackSrc="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800"
        />
        <div className="p-6">
          <div className="flex items-center mb-2">
            {charity.verified && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Verified
              </span>
            )}
            <span className="ml-2 text-sm text-gray-500">{charity.country}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{charity.name}</h3>
          <p className="text-gray-600">{charity.description}</p>
        </div>
      </Card>
    </Link>
  );
});