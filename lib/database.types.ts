export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string
          title: string
          description: string | null
          meeting_code: string
          start_time: string | null
          end_time: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          meeting_code: string
          start_time?: string | null
          end_time?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          meeting_code?: string
          start_time?: string | null
          end_time?: string | null
          status?: string
          created_at?: string
        }
      }
      mood_data: {
        Row: {
          id: string
          meeting_id: string
          participant_id: string
          mood_value: number
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          participant_id: string
          mood_value: number
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          participant_id?: string
          mood_value?: number
          timestamp?: string
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          meeting_id: string
          participant_id: string
          message: string
          tags: string[] | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          participant_id: string
          message: string
          tags?: string[] | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          participant_id?: string
          message?: string
          tags?: string[] | null
          status?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 