import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { ConnectButton } from './web3/ConnectButton';
import { SettingsMenu } from './SettingsMenu';
import { Menu, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';

export const AppNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const { userType } = useAuth();
  
  // Memoize limited nav pages check
  const isLimitedNavPage = useMemo(() => 
    ['/about', '/legal', '/privacy', '/governance'].includes(location.pathname),
    [location.pathname]
  );
  
  // Memoize isActive function to prevent recreation on every render
  const isActive = useCallback((path: string) => 
    location.pathname === path ? 'bg-primary-100 text-primary-900' : 'text-gray-700 hover:bg-primary-50',
    [location.pathname]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Memoize keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMenuOpen(false);
    }
  }, []);

  // Memoize dashboard navigation handler
  const handleDashboardClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (userType === 'charity') {
      navigate('/charity-portal');
    } else {
      navigate('/give-dashboard');
    }
  }, [userType, navigate]);

  return (
    <nav 
      className="bg-background-primary border-b border-gray-200 shadow-sm"
      aria-label="Application navigation"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center"
              aria-label="Give Protocol home"
            >
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold text-primary-900">Give Protocol</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              {!isLimitedNavPage ? (
                <>
                  <Link
                    to="/browse"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive('/browse')}`}
                  >
                    <span>{t('nav.browse')}</span>
                  </Link>
                  <Link
                    to="/opportunities"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive('/opportunities')}`}
                  >
                    <span>{t('nav.opportunities')}</span>
                  </Link>
                  <Link
                    to="/contributions"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive('/contributions')}`}
                  >
                    <span>{t('nav.contributions')}</span>
                  </Link>
                  <a
                    href="#"
                    onClick={handleDashboardClick}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                      isActive('/give-dashboard') || isActive('/charity-portal')
                    }`}
                  >
                    <span>{t('nav.dashboard')}</span>
                  </a>
                  <Link
                    to="/governance"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive('/governance')}`}
                  >
                    <span>{t('nav.governance')}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/about"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive('/about')}`}
                  >
                    <span>{t('nav.about')}</span>
                  </Link>
                  <a
                    href="https://giveprotocol.github.io/Duration-Give/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 text-gray-700 hover:bg-primary-50`}
                  >
                    <span>{t('nav.docs')}</span>
                  </a>
                  <Link
                    to="/legal"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive('/legal')}`}
                  >
                    <span>{t('nav.legal')}</span>
                  </Link>
                  <Link
                    to="/privacy"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive('/privacy')}`}
                  >
                    <span>Privacy</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <SettingsMenu />
            <ConnectButton />
            
            {/* Mobile menu button */}
            <button
              ref={menuButtonRef}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden" 
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
            {!isLimitedNavPage ? (
              <>
                <Link
                  to="/browse"
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/browse')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.browse')}
                </Link>
                <Link
                  to="/opportunities"
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/opportunities')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.opportunities')}
                </Link>
                <Link
                  to="/contributions"
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/contributions')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.contributions')}
                </Link>
                <a
                  href="#"
                  onClick={(e) => {
                    setIsMenuOpen(false);
                    handleDashboardClick(e);
                  }}
                  className={`block px-3 py-3 rounded-md text-base font-medium ${
                    isActive('/give-dashboard') || isActive('/charity-portal')
                  }`}
                >
                  {t('nav.dashboard')}
                </a>
                <Link
                  to="/governance"
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/governance')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.governance')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/about')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.about')}
                </Link>
                <a
                  href="https://give-protocol.gitbook.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-primary-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.docs')}
                </a>
                <Link
                  to="/legal"
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/legal')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.legal')}
                </Link>
                <Link
                  to="/privacy"
                  className={`block px-3 py-3 rounded-md text-base font-medium ${isActive('/privacy')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Privacy
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};