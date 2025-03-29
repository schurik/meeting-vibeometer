'use client';

import { useState, useEffect } from 'react';
import { submitMoodValue } from '@/lib/actions';

interface MoodSelectionProps {
  meetingId: string;
  meetingCode: string;
}

interface MoodButtonProps {
  value: number;
  selected: boolean;
  onClick: (value: number) => void;
  label: string;
  emoji: string;
  color: string;
}

const moodLabels = [
  { value: 1, label: 'Very Negative', emoji: '😞', color: 'bg-red-400 hover:bg-red-500' },
  { value: 2, label: 'Negative', emoji: '😕', color: 'bg-orange-400 hover:bg-orange-500' },
  { value: 3, label: 'Neutral', emoji: '😐', color: 'bg-yellow-400 hover:bg-yellow-500' },
  { value: 4, label: 'Positive', emoji: '🙂', color: 'bg-lime-400 hover:bg-lime-500' },
  { value: 5, label: 'Very Positive', emoji: '😁', color: 'bg-green-400 hover:bg-green-500' },
];

const MoodButton = ({ value, selected, onClick, label, emoji, color }: MoodButtonProps) => (
  <button
    onClick={() => onClick(value)}
    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${selected
      ? `${color} ring-2 ring-blue-500 shadow-md transform scale-105`
      : 'bg-white hover:bg-gray-50'
      }`}
    title={label}
    aria-label={`Select mood: ${label}`}
  >
    <span className="text-2xl mb-1">{emoji}</span>
    <span className="text-xs font-medium">{value}</span>
  </button>
);

export default function MoodSelection({ meetingId, meetingCode }: MoodSelectionProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);

  // Initialize participant ID from localStorage or create a new one
  useEffect(() => {
    const storageKey = `vibeometer_participant_${meetingCode}`;
    let storedId = localStorage.getItem(storageKey);

    if (!storedId) {
      storedId = crypto.randomUUID();
      localStorage.setItem(storageKey, storedId);
    }

    setParticipantId(storedId);
  }, [meetingCode]);

  const handleMoodSelection = async (moodValue: number) => {
    // If the same mood is selected, deselect it
    if (selectedMood === moodValue) {
      setSelectedMood(null);
      return;
    }

    setSelectedMood(moodValue);
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage(null);

    try {
      const result = await submitMoodValue({
        meeting_id: meetingId,
        participant_id: participantId || undefined,
        mood_value: moodValue,
      });

      if (result.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit mood');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred');
      console.error('Error submitting mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">How are you feeling about this meeting?</h2>

      <div className="grid grid-cols-5 gap-3 mb-4">
        {moodLabels.map((mood) => (
          <MoodButton
            key={mood.value}
            value={mood.value}
            selected={selectedMood === mood.value}
            onClick={handleMoodSelection}
            label={mood.label}
            emoji={mood.emoji}
            color={mood.color}
          />
        ))}
      </div>

      {isSubmitting && (
        <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-md">
          Submitting your response...
        </div>
      )}

      {!isSubmitting && submitStatus === 'success' && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          Your mood has been recorded. You can update it at any time.
        </div>
      )}

      {!isSubmitting && submitStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          {errorMessage || 'Failed to submit your mood. Please try again.'}
        </div>
      )}

      <p className="mt-4 text-sm text-gray-500">
        Your mood response is anonymous and will help the presenter gauge audience sentiment.
      </p>
    </div>
  );
} 