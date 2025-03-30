import React from 'react';
import { getMeetingDetails, getInitialMoodData } from '@/lib/actions';
import MoodChart from '@/components/MoodChart';

interface PresenterPageProps {
  params: Promise<{
    meeting_code: string;
  }>;
}

// Make the component async to use await
export default async function PresenterPage({ params }: PresenterPageProps) {
  const resolvedParams = await params;
  const { meeting_code } = resolvedParams;

  // Fetch meeting details first
  const meetingDetailsResult = await getMeetingDetails(meeting_code);
  const { success: meetingSuccess, meeting, error: meetingError } = meetingDetailsResult;

  if (!meetingSuccess || !meeting) {
    // Handle error case (e.g., meeting not found)
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>{meetingError || 'Failed to load meeting details.'}</p>
        <p>Meeting Code Attempted: {meeting_code}</p>
      </div>
    );
  }

  // Now fetch initial mood data using the meeting ID
  const { success: moodSuccess, data: initialMoodData, error: moodError } = await getInitialMoodData(meeting.id);

  // Optional: Handle mood data fetching error, though chart can start empty
  if (!moodSuccess) {
    console.warn('Could not fetch initial mood data:', moodError);
    // Don't block rendering, chart will initialize empty
  }

  return (
    <div className="container mx-auto p-4">
      {/* Display Meeting Title and Description */}
      <h1 className="text-3xl font-bold mb-2">{meeting.title}</h1>
      {meeting.description && (
        <p className="text-lg text-gray-600 mb-4">{meeting.description}</p>
      )}
      <p className="text-sm text-gray-500 mb-6">Meeting Code: {meeting.meeting_code}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Real-time Mood</h2>
          {/* Replace placeholder with MoodChart */}
          <MoodChart meetingId={meeting.id} initialMoodData={initialMoodData || []} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Feedback</h2>
          {/* TODO: Display feedback */}
          <div className="bg-gray-100 p-4 rounded shadow min-h-[200px]">
            <p>Feedback display placeholder...</p>
          </div>
        </div>
      </div>

    </div>
  );
} 