import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { CreateMeetingInput, Meeting, SubmitMoodInput, MoodData } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client with proper typing
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Meeting operations
export async function getMeetingByCode(code: string) {
  return await supabase
    .from('meetings')
    .select('*')
    .eq('meeting_code', code)
    .single();
}

export async function getActiveMeetingByCode(code: string) {
  return await supabase
    .from('meetings')
    .select('*')
    .eq('meeting_code', code)
    .eq('status', 'active')
    .single();
}

export async function getMeetingTitleByCode(code: string) {
  return await supabase
    .from('meetings')
    .select('title')
    .eq('meeting_code', code.toUpperCase())
    .single();
}

export async function createNewMeeting(data: CreateMeetingInput): Promise<{ data: Meeting | null; error: any }> {
  const meeting_code = await generateMeetingCode();

  return await supabase
    .from('meetings')
    .insert({
      title: data.title,
      description: data.description || null,
      meeting_code,
      start_time: data.start_time || null,
      end_time: data.end_time || null,
      status: 'active'
    })
    .select()
    .single();
}

// Mood data operations
export async function submitMood(data: SubmitMoodInput) {
  const participant_id = data.participant_id || crypto.randomUUID();

  return await supabase
    .from('mood_data')
    .insert({
      meeting_id: data.meeting_id,
      participant_id,
      mood_value: data.mood_value,
    });
}

export async function getMeetingMoodData(meetingId: string) {
  return await supabase
    .from('mood_data')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('timestamp', { ascending: false });
}

// Realtime subscriptions
export async function setupRealtimeSubscriptions() {
  await supabase
    .channel('schema-db-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'mood_data',
    }, (payload) => console.log('Change received!', payload))
    .subscribe();
}

export function subscribeMoodData(meetingId: string, onMoodUpdate: (newMood: MoodData) => void) {
  return supabase
    .channel(`mood-data-${meetingId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'mood_data',
      filter: `meeting_id=eq.${meetingId}`,
    }, (payload) => {
      onMoodUpdate(payload.new as MoodData);
    })
    .subscribe();
}

export async function generateMeetingCode(): Promise<string> {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  // Check if code already exists
  const { data } = await supabase
    .from('meetings')
    .select('meeting_code')
    .eq('meeting_code', code)
    .single();

  // If code exists, generate a new one recursively
  if (data) {
    return generateMeetingCode();
  }

  return code;
} 