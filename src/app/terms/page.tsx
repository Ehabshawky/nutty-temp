// src/app/terms/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Nutty Scientists',
  description: 'Terms and conditions of service',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Terms of Service
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
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using our services, you accept and agree to be bound by these Terms of Service.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <p>Nutty Scientists provides interactive science education services including workshops, camps, and events for children and adults.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information when making bookings</li>
                <li>Follow safety guidelines during events</li>
                <li>Respect other participants and instructors</li>
                <li>Pay for services in a timely manner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Booking and Cancellation</h2>
              <p>Bookings are confirmed upon full payment. Cancellations must be made at least 48 hours in advance for a full refund.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Liability</h2>
              <p>We are not liable for any injuries or damages that occur during participation in our activities, except where caused by our negligence.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of changes.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}