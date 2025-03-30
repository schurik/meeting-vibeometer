import CreateMeetingForm from '@/components/CreateMeetingForm';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Create a Meeting | Meeting Vibeometer',
  description: 'Create a new meeting to track audience mood and feedback in real-time',
};

export default function CreateMeetingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Meeting Vibeometer</h1>
          <Link href="/" className="text-gray-600">Create a new meeting to track audience mood and feedback</Link>
        </div>

        <CreateMeetingForm />

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Already have a meeting code? <Link href="/" className="text-blue-600 hover:underline">Join a meeting</Link>
          </p>
        </div>
      </div>
    </div>
  );
} 