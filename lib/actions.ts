'use server';

import { supabase, generateMeetingCode } from './supabase';
import { CreateMeetingInput, Meeting, SubmitMoodInput } from './types';

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

export async function submitMoodValue(data: SubmitMoodInput): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate a unique participant ID if not provided
    // This is stored in localStorage on the client to allow the same participant to update their mood
    const participant_id = data.participant_id || crypto.randomUUID();

    const { error } = await supabase
      .from('mood_data')
      .insert({
        meeting_id: data.meeting_id,
        participant_id,
        mood_value: data.mood_value,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting mood:', error);
    return { success: false, error: 'Failed to submit mood' };
  }
} 