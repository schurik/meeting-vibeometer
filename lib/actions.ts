'use server';

import { supabase, generateMeetingCode } from './supabase';
import { CreateMeetingInput, Meeting } from './types';

export async function createMeeting(data: CreateMeetingInput): Promise<{ success: boolean; meeting?: Meeting; error?: string }> {
  try {
    const meeting_code = await generateMeetingCode();

    const { data: meeting, error } = await supabase
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

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, meeting };
  } catch (error) {
    console.error('Error creating meeting:', error);
    return { success: false, error: 'Failed to create meeting' };
  }
} 