import React, { useState } from 'react';
import { Send, Github, Bird, Disc as Discord } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Logger } from '@/utils/logger';

const ComingSoon: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      // Call the MailChimp API endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      setStatus('success');
      setEmail('');
    } catch (err) {
      Logger.error('Subscription error', { error: err });
      setStatus('error');
      setErrorMessage('Failed to join waitlist. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)] animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.1),transparent_50%)]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="py-8 flex items-center justify-center">
          <Logo className="h-10 w-10" />
          <span className="ml-3 text-2xl font-bold text-gray-900">Give Protocol</span>
        </div>

        {/* Hero Section */}
        <main className="py-20 sm:py-24">
          <div className="text-center">
            <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 mb-6">
              COMING SOON
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Join the future of philanthropy, with transparent, efficient and impactful social investment
            </p>

            {/* Email Form */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  disabled={status === 'loading' || status === 'success'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className={`absolute right-2 top-2 px-4 py-1 rounded-md transition-all ${
                    status === 'loading' 
                      ? 'bg-gray-100 cursor-wait'
                      : status === 'success'
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Notify Me
                </button>
              </form>

              {status === 'success' && (
                <p className="mt-2 text-green-600">
                  Thanks for joining! We'll keep you updated.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-2 text-red-600">{errorMessage}</p>
              )}
            </div>

            {/* Features Preview */}
            <div className="mt-20">
              <h2 className="sr-only">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Transparent</h3>
                  <p className="text-gray-600">Track your impact with blockchain-verified donations</p>
                </div>
                <div className="p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Efficient</h3>
                  <p className="text-gray-600">Smart contracts ensure funds reach their destination</p>
                </div>
                <div className="p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Impactful</h3>
                  <p className="text-gray-600">Maximize your giving through innovative DeFi strategies</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-6">
              <a 
                href="https://giveprotocol.bsky.social" 
                className="text-gray-400 hover:text-gray-600"
                aria-label="Follow Give Protocol on Bluesky"
              >
                <Bird className="h-6 w-6" />
              </a>
              <a 
                href="https://github.com/giveprotocol" 
                className="text-gray-400 hover:text-gray-600"
                aria-label="View Give Protocol on GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://discord.gg/giveprotocol" 
                className="text-gray-400 hover:text-gray-600"
                aria-label="Join Give Protocol Discord community"
              >
                <Discord className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Give Protocol. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ComingSoon;