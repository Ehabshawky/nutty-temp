// src/app/privacy-policy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Nutty Scientists',
  description: 'Privacy policy and data protection information',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="mb-8 text-gray-600 dark:text-gray-400">
            <p className="mb-4">
              Last updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@nuttyscientists.com<br />
                <strong>Phone:</strong> +20 122 266 8543<br />
                <strong>Address:</strong> Garden 8 mall, New Cairo, 1st Settlement
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}