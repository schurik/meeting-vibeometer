'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PresenterNavForm() {
  const [meetingCode, setMeetingCode] = useState('');
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = meetingCode.trim().toUpperCase();
    if (trimmedCode) {
      router.push(`/presenter/${trimmedCode}`);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Presenter View</h2>
        <p className="text-gray-500 mt-1">Enter the code to view the dashboard</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="presenterCode" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Code
          </label>
          <input
            id="presenterCode"
            name="presenterCode"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter 6-digit code"
            maxLength={6}
            value={meetingCode}
            onChange={(e) => setMeetingCode(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Dashboard
        </button>
      </form>
    </div>
  );
} 