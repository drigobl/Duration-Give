import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <Logo className="h-6 w-6" />
              <span className="ml-2 text-xl font-bold text-gray-900">Give Protocol</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Empowering charitable giving through transparent and efficient blockchain technology.
            </p>
          </div>
          
          <div className="col-span-3 grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a 
                    href="https://giveprotocol.github.io/Duration-Give/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Documentation & FAQ
                  </a>
                </li>
                <li>
                  <Link to="/governance" className="text-gray-600 hover:text-gray-900">
                    Governance
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/legal" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal#compliance" className="text-gray-600 hover:text-gray-900">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Give Protocol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};