export interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_code: string;
  start_time?: string;
  end_time?: string;
  status: 'active' | 'ended' | 'cancelled';
  created_at: string;
}

export interface MoodData {
  id: string;
  meeting_id: string;
  participant_id: string;
  mood_value: number;
  timestamp: string;
  created_at: string;
}

export interface Feedback {
  id: string;
  meeting_id: string;
  participant_id: string;
  message: string;
  tags?: string[];
  status: 'read' | 'unread';
  created_at: string;
}

export interface CreateMeetingInput {
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}

export interface SubmitMoodInput {
  meeting_id: string;
  participant_id?: string;
  mood_value: number;
} 