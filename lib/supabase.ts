import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

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

// Enable realtime subscriptions for specific tables
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