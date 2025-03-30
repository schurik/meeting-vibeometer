'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { supabase } from '@/lib/supabase'; // Adjust import path as needed
import { MoodData } from '@/lib/types'; // Adjust import path as needed

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MoodChartProps {
  meetingId: string;
  initialMoodData?: MoodData[]; // Optional initial data
}

// Define mood labels (e.g., 1=Very Poor, 5=Very Good)
const moodLabels: { [key: number]: string } = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Neutral',
  4: 'Good',
  5: 'Very Good',
};

export default function MoodChart({ meetingId, initialMoodData = [] }: MoodChartProps) {
  const [moodCounts, setMoodCounts] = useState<{ [key: number]: number }>({});
  const chartRef = useRef<ChartJS<"bar", number[], string>>(null);

  useEffect(() => {
    // Initialize counts from initial data
    const initialCounts = initialMoodData.reduce((acc, mood) => {
      acc[mood.mood_value] = (acc[mood.mood_value] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });
    setMoodCounts(initialCounts);

    // Set up Supabase real-time subscription
    const channel = supabase
      .channel(`mood-data-${meetingId}`)
      .on<MoodData>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_data',
          filter: `meeting_id=eq.${meetingId}`,
        },
        (payload) => {
          console.log('New mood received:', payload.new);
          const newMoodValue = payload.new.mood_value;
          setMoodCounts((prevCounts) => ({
            ...prevCounts,
            [newMoodValue]: (prevCounts[newMoodValue] || 0) + 1,
          }));
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to mood updates for meeting ${meetingId}`);
        }
      });

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
      console.log(`Unsubscribed from mood updates for meeting ${meetingId}`);
    };
  }, [meetingId, initialMoodData]); // Depend on initialMoodData as well

  const data = {
    labels: Object.keys(moodLabels).map(key => moodLabels[parseInt(key, 10)]),
    datasets: [
      {
        label: 'Mood Distribution',
        data: Object.keys(moodLabels).map(key => moodCounts[parseInt(key, 10)] || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Very Poor
          'rgba(255, 159, 64, 0.6)', // Poor
          'rgba(255, 205, 86, 0.6)', // Neutral
          'rgba(75, 192, 192, 0.6)', // Good
          'rgba(54, 162, 235, 0.6)', // Very Good
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend for simplicity
      },
      title: {
        display: true,
        text: 'Current Participant Mood Distribution',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' participant(s)';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Participants',
        },
        ticks: { // Ensure only whole numbers are shown on the y-axis
          stepSize: 1,
          precision: 0
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mood'
        }
      }
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow h-[300px] md:h-[400px]">
      {/* Ensure chart has a defined height */}
      <Bar ref={chartRef} options={options} data={data} />
    </div>
  );
} 