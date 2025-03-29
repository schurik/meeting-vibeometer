import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import MoodSelection from '@/components/MoodSelection';
import MoodVisualization from '@/components/MoodVisualization';

export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const { data: meeting } = await supabase
    .from('meetings')
    .select('title')
    .eq('meeting_code', params.code.toUpperCase())
    .single();

  return {
    title: meeting ? `${meeting.title} | Meeting Vibeometer` : 'Meeting',
    description: 'Real-time mood tracking for presentations and meetings',
  };
}

export default async function MeetingPage({
  params,
}: {
  params: { code: string };
}) {
  const code = params.code.toUpperCase();
  const { data: meeting, error } = await getMeetingByCode(code);

  if (error || !meeting) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <header className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-2xl font-bold">{meeting.title}</h1>
            {meeting.description && (
              <p className="text-gray-600 mt-2">{meeting.description}</p>
            )}
            <div className="mt-4 flex items-center">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Code: {meeting.meeting_code}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                Status: {meeting.status}
              </span>
            </div>
          </header>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Mood Dashboard</h2>
            <MoodVisualization meetingId={meeting.id} />
          </div>

          <MoodSelection meetingId={meeting.id} meetingCode={meeting.meeting_code} />
        </div>
      </div>
    </div>
  );
}

export async function getMeetingByCode(code: string) {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('meeting_code', code)
    .single();

  return { data, error };
}
