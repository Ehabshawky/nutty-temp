// src/app/cookie-policy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Nutty Scientists',
  description: 'Cookie usage and tracking information',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Cookie Policy
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
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
              <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
              <table className="min-w-full border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="py-2 px-4 border text-left">Cookie Type</th>
                    <th className="py-2 px-4 border text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border">Essential Cookies</td>
                    <td className="py-2 px-4 border">Required for basic site functionality</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Analytics Cookies</td>
                    <td className="py-2 px-4 border">Help us understand how visitors use our site</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border">Preference Cookies</td>
                    <td className="py-2 px-4 border">Remember your settings and preferences</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookie Consent</h2>
              <p>By continuing to use our website, you consent to our use of cookies as described in this policy.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p>You can control cookies through your browser settings. Please note that disabling cookies may affect your experience.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}