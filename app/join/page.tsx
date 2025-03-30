import { redirect } from 'next/navigation';
import { getActiveMeetingByCode } from '@/lib/supabase';

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const code = typeof resolvedParams.code === 'string' ? resolvedParams.code.toUpperCase() : undefined;

  if (!code) {
    redirect('/');
  }

  // Check if meeting exists
  const { data: meeting, error } = await getActiveMeetingByCode(code);

  if (error || !meeting) {
    // If meeting doesn't exist, redirect back to home with an error
    redirect(`/?error=Invalid meeting code: ${code}`);
  }

  // If meeting exists, redirect to the meeting page
  redirect(`/meeting/${meeting.meeting_code}`);
}