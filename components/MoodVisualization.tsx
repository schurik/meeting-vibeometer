'use client';

import { useMoodData } from '@/lib/hooks/useMoodData';

const moodLabels = [
  { value: 1, label: 'Very Negative', emoji: '😞', color: 'bg-red-400' },
  { value: 2, label: 'Negative', emoji: '😕', color: 'bg-orange-400' },
  { value: 3, label: 'Neutral', emoji: '😐', color: 'bg-yellow-400' },
  { value: 4, label: 'Positive', emoji: '🙂', color: 'bg-lime-400' },
  { value: 5, label: 'Very Positive', emoji: '😁', color: 'bg-green-400' },
];

export default function MoodVisualization({ meetingId }: { meetingId: string }) {
  const { loading, error, aggregated } = useMoodData(meetingId);

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading mood data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>Error loading mood data: {error.message}</p>
      </div>
    );
  }

  // If no participants yet
  if (aggregated.total === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No mood data available yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Mood data will appear here in real-time as participants submit their feelings.
        </p>
      </div>
    );
  }

  // Calculate the average emoji to display
  const getAverageEmoji = () => {
    const roundedAverage = Math.round(aggregated.average);
    const mood = moodLabels.find(m => m.value === roundedAverage);
    return mood ? mood.emoji : '😐';
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{getAverageEmoji()}</div>
        <h3 className="font-medium">Average Mood: {aggregated.average}</h3>
        <p className="text-sm text-gray-500">{aggregated.total} participants</p>
      </div>

      <div className="space-y-3">
        {moodLabels.map((mood) => {
          const count = aggregated.counts[mood.value] || 0;
          const percentage = aggregated.total > 0
            ? Math.round((count / aggregated.total) * 100)
            : 0;

          return (
            <div key={mood.value} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <span>{mood.emoji}</span>
                  <span className="text-sm font-medium">{mood.label}</span>
                </span>
                <span className="text-sm text-gray-500">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${mood.color} h-2.5 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 