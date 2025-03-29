'use server';

import { createNewMeeting, submitMood } from './supabase';
import { CreateMeetingInput, Meeting, SubmitMoodInput } from './types';

export async function createMeeting(data: CreateMeetingInput): Promise<{ success: boolean; meeting?: Meeting; error?: string }> {
  try {
    const { data: meeting, error } = await createNewMeeting(data);

    if (error) {
      return { success: false, error: error.message };
    }

    if (!meeting) {
      return { success: false, error: 'Failed to create meeting' };
    }

    return { success: true, meeting };
  } catch (error) {
    console.error('Error creating meeting:', error);
    return { success: false, error: 'Failed to create meeting' };
  }
}

export async function submitMoodValue(data: SubmitMoodInput): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await submitMood(data);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting mood:', error);
    return { success: false, error: 'Failed to submit mood' };
  }
}