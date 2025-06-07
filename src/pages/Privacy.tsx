import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 prose prose-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
      <p className="text-gray-600 italic mb-8">Effective Date: November 1, 2024</p>

      <p className="mb-6">Give Protocol ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our blockchain-based charitable giving platform.</p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">1. Information We Collect</h2>
      
      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Personal Information</h3>
      <p className="mb-4">When you register an account, we may collect:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Email address</li>
        <li>Username</li>
        <li>Wallet address(es)</li>
        <li>Profile information you choose to provide</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Transaction Information</h3>
      <p className="mb-4">When you make donations or volunteer contributions, we collect:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Transaction details (amount, recipient, date)</li>
        <li>Blockchain transaction hashes</li>
        <li>Donation preferences and history</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Technical Information</h3>
      <p className="mb-4">We automatically collect:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Device information</li>
        <li>Usage data and analytics</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">2. How We Use Your Information</h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Provide and maintain our Service</li>
        <li>Process donations and volunteer contributions</li>
        <li>Send transaction confirmations and receipts</li>
        <li>Communicate with you about your account</li>
        <li>Improve our Service and user experience</li>
        <li>Ensure compliance with legal obligations</li>
        <li>Detect and prevent fraud or abuse</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">3. Information Sharing</h2>
      <p className="mb-4">We may share your information with:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><span className="font-semibold">Charitable Organizations:</span> Transaction details necessary for donation processing</li>
        <li><span className="font-semibold">Blockchain Networks:</span> Transaction data required for blockchain operations</li>
        <li><span className="font-semibold">Service Providers:</span> Third parties who assist in operating our Service</li>
        <li><span className="font-semibold">Legal Requirements:</span> When required by law or to protect our rights</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">4. Blockchain Data</h2>
      <p className="mb-6">Please note that blockchain transactions are public and permanent. While we protect your personal information in our systems, transaction data on the blockchain is publicly visible and cannot be deleted or modified.</p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">5. Data Security</h2>
      <p className="mb-4">We implement appropriate technical and organizational measures to protect your information, including:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Encryption of sensitive data</li>
        <li>Secure communication protocols</li>
        <li>Regular security assessments</li>
        <li>Access controls and authentication</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">6. Your Rights</h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your account</li>
        <li>Export your data</li>
        <li>Opt-out of marketing communications</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">7. Cookies and Tracking</h2>
      <p className="mb-4">We use cookies and similar technologies to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Maintain your session</li>
        <li>Remember your preferences</li>
        <li>Analyze usage patterns</li>
        <li>Improve our Service</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">8. Third-Party Links</h2>
      <p className="mb-6">Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.</p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">9. Data Retention</h2>
      <p className="mb-6">We retain your information for as long as necessary to provide our Service and comply with legal obligations. Blockchain transaction data is permanent and cannot be deleted.</p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">10. International Data Transfers</h2>
      <p className="mb-6">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">11. Privacy Rights for Specific Jurisdictions</h2>
      
      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">California Residents (CCPA)</h3>
      <p className="mb-4">California residents have additional rights including:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Right to know what personal information is collected</li>
        <li>Right to delete personal information</li>
        <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
        <li>Right to non-discrimination</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">European Union Residents (GDPR)</h3>
      <p className="mb-4">EU residents have rights including:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Right to access and portability</li>
        <li>Right to rectification and erasure</li>
        <li>Right to restrict processing</li>
        <li>Right to object to processing</li>
      </ul>
      <p className="mb-4">Legal Basis for Processing:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Performance of a contract when we provide you with our Service</li>
        <li>Legitimate interests in operating and improving our Service</li>
        <li>Compliance with our legal obligations</li>
        <li>Your consent, where applicable</li>
      </ul>
      <p className="mb-6">You have the right to lodge a complaint with a supervisory authority if you believe our processing of your personal data violates applicable law.</p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">12. Children's Privacy</h2>
      <p className="mb-6">Our Service is not directed to children under the age of 18, and we do not knowingly collect personal information from children. If we learn we have collected personal information from a child under 18, we will delete that information as quickly as possible. If you believe a child has provided us with personal information, please contact us.</p>
    </div>
  );
};

export default Privacy;