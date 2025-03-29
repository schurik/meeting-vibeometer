'use client';

import { useMoodData } from '@/lib/hooks/useMoodData';
import { useEffect, useState } from 'react';

const moodLabels = [
  { value: 1, label: 'Very Negative', emoji: '😞', color: 'bg-red-400' },
  { value: 2, label: 'Negative', emoji: '😕', color: 'bg-orange-400' },
  { value: 3, label: 'Neutral', emoji: '😐', color: 'bg-yellow-400' },
  { value: 4, label: 'Positive', emoji: '🙂', color: 'bg-lime-400' },
  { value: 5, label: 'Very Positive', emoji: '😁', color: 'bg-green-400' },
];

export default function MoodVisualization({ meetingId }: { meetingId: string }) {
  const { loading, error, aggregated, moodData } = useMoodData(meetingId);
  const [recentUpdate, setRecentUpdate] = useState(false);
  const [timelineData, setTimelineData] = useState<{ timestamp: Date; average: number }[]>([]);

  // Handle animation effect for new mood submissions
  useEffect(() => {
    if (moodData.length > 0) {
      setRecentUpdate(true);
      const timer = setTimeout(() => setRecentUpdate(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [moodData.length]);

  // Process timeline data (last 10 minutes of data at 30 second intervals)
  useEffect(() => {
    if (moodData.length === 0) return;

    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    // Filter data from last 10 minutes
    const recentData = moodData.filter(
      (mood) => new Date(mood.timestamp) > tenMinutesAgo
    );

    // Group by 30-second intervals
    const intervalGroups: Record<string, number[]> = {};

    recentData.forEach(mood => {
      const timestamp = new Date(mood.timestamp);
      // Round to nearest 30 seconds
      const intervalKey = new Date(
        Math.floor(timestamp.getTime() / (30 * 1000)) * 30 * 1000
      ).toISOString();

      if (!intervalGroups[intervalKey]) {
        intervalGroups[intervalKey] = [];
      }

      intervalGroups[intervalKey].push(mood.mood_value);
    });

    // Calculate average for each interval
    const timelinePoints = Object.entries(intervalGroups).map(([timeKey, values]) => {
      const sum = values.reduce((acc, val) => acc + val, 0);
      return {
        timestamp: new Date(timeKey),
        average: parseFloat((sum / values.length).toFixed(2))
      };
    }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    setTimelineData(timelinePoints);
  }, [moodData]);

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

  // Get color based on average mood
  const getAverageColor = () => {
    const roundedAverage = Math.round(aggregated.average);
    const mood = moodLabels.find(m => m.value === roundedAverage);
    return mood ? mood.color : 'bg-yellow-400';
  };

  return (
    <div className={`p-4 ${recentUpdate ? 'animate-pulse' : ''}`}>
      <div className="text-center mb-6">
        <div className={`inline-block p-5 rounded-full mb-3 ${getAverageColor()} text-5xl ${recentUpdate ? 'animate-bounce' : ''}`}>
          {getAverageEmoji()}
        </div>
        <h3 className="font-medium text-xl">Average Mood: {aggregated.average}</h3>
        <p className="text-sm text-gray-500">{aggregated.total} participants</p>
      </div>

      <div className="space-y-3 mb-6">
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
                  className={`${mood.color} h-2.5 rounded-full transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {timelineData.length > 1 && (
        <div className="mt-8">
          <h4 className="text-sm font-medium mb-2">Mood Timeline (Last 10 minutes)</h4>
          <div className="h-16 flex items-end space-x-1 overflow-x-auto pb-2">
            {timelineData.map((point, index) => {
              const height = Math.max(20, point.average * 12); // Scale height for visualization
              const bgColor = moodLabels[Math.round(point.average) - 1]?.color || 'bg-gray-300';

              return (
                <div key={index} className="flex flex-col items-center flex-shrink-0" title={`${point.timestamp.toLocaleTimeString()}: ${point.average}`}>
                  <div
                    className={`w-4 ${bgColor} rounded-t-sm`}
                    style={{ height: `${height}px` }}
                  ></div>
                  <div className="text-[8px] text-gray-500 mt-1 rotate-45 origin-left">
                    {point.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 