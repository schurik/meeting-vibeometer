'use client';

import { useState, useEffect } from 'react';
import { getMeetingMoodData, subscribeMoodData, supabase } from '@/lib/supabase';
import { MoodData } from '@/lib/types';

interface MoodDataState {
  data: MoodData[];
  loading: boolean;
  error: Error | null;
}

interface AggregatedMood {
  average: number;
  counts: Record<number, number>;
  total: number;
}

export function useMoodData(meetingId: string) {
  const [state, setState] = useState<MoodDataState>({
    data: [],
    loading: true,
    error: null,
  });

  const [aggregated, setAggregated] = useState<AggregatedMood>({
    average: 0,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    total: 0,
  });

  // Calculate aggregated data
  useEffect(() => {
    if (state.data.length === 0) {
      return;
    }

    // Get unique participants with their latest mood
    const participantMoods = new Map<string, MoodData>();

    // Sort by timestamp (newest first) to get the latest mood from each participant
    const sortedData = [...state.data].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Keep only the latest mood for each participant
    sortedData.forEach(mood => {
      if (!participantMoods.has(mood.participant_id)) {
        participantMoods.set(mood.participant_id, mood);
      }
    });

    // Calculate counts and average
    const latestMoods = Array.from(participantMoods.values());
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    latestMoods.forEach(mood => {
      counts[mood.mood_value as 1 | 2 | 3 | 4 | 5]++;
    });

    const total = latestMoods.length;
    const sum = latestMoods.reduce((acc, mood) => acc + mood.mood_value, 0);
    const average = total > 0 ? sum / total : 0;

    setAggregated({
      average: parseFloat(average.toFixed(2)),
      counts,
      total,
    });
  }, [state.data]);

  // Fetch initial mood data
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const { data, error } = await getMeetingMoodData(meetingId);

        if (error) {
          throw error;
        }

        setState({ data: data || [], loading: false, error: null });
      } catch (error) {
        console.error('Error fetching mood data:', error);
        setState({ data: [], loading: false, error: error as Error });
      }
    };

    fetchMoodData();
  }, [meetingId]);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = subscribeMoodData(meetingId, (newMood) => {
      setState(prevState => ({
        ...prevState,
        data: [newMood, ...prevState.data],
      }));
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [meetingId]);

  return {
    moodData: state.data,
    loading: state.loading,
    error: state.error,
    aggregated,
  };
}