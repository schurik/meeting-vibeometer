import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meeting Vibeometer',
  description: 'Real-time mood tracking for presentations and meetings',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Meeting Vibeometer</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real-time mood tracking and feedback for presentations and meetings. Gauge your audience sentiment as you present.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold">Join a Meeting</h2>
            <p className="text-gray-500 mt-1">Enter the meeting code to join</p>
          </div>

          <form className="space-y-4" action={`/join`} method="GET">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Join Meeting
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Need to create a new meeting?
            </p>
            <Link
              href="/create"
              className="inline-block mt-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create Meeting
            </Link>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Real-time Feedback</h3>
            <p className="text-gray-600">
              Get instant mood data from your audience as you present.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Anonymous Participation</h3>
            <p className="text-gray-600">
              Participants can share their mood without revealing their identity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Actionable Insights</h3>
            <p className="text-gray-600">
              Visualize mood trends over time to improve your presentations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
