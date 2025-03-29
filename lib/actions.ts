'use server';

import { createNewMeeting, submitMood, getMeetingByCode, getMeetingMoodData } from './supabase';
import { CreateMeetingInput, Meeting, SubmitMoodInput, MoodData } from './types';

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

export async function getMeetingDetails(code: string): Promise<{ success: boolean; meeting?: Meeting; error?: string }> {
  try {
    const upperCaseCode = code.toUpperCase();
    const { data: meeting, error } = await getMeetingByCode(upperCaseCode);

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Meeting not found' };
      }
      console.error('Error fetching meeting details:', error);
      return { success: false, error: error.message };
    }

    if (!meeting) {
      return { success: false, error: 'Meeting not found' };
    }

    return { success: true, meeting };
  } catch (error) {
    console.error('Unexpected error fetching meeting details:', error);
    return { success: false, error: 'Failed to fetch meeting details' };
  }
}

export async function getInitialMoodData(meetingId: string): Promise<{ success: boolean; data?: MoodData[]; error?: string }> {
  try {
    const { data, error } = await getMeetingMoodData(meetingId);

    if (error) {
      console.error('Error fetching initial mood data:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching initial mood data:', error);
    return { success: false, error: 'Failed to fetch initial mood data' };
  }
}