'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createMeeting } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const meetingSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
});

type MeetingFormValues = z.infer<typeof meetingSchema>;

export default function CreateMeetingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: '',
      description: '',
      start_time: '',
      end_time: '',
    },
  });

  const onSubmit = async (data: MeetingFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createMeeting(data);

      if (result.success && result.meeting) {
        reset();
        router.push(`/presenter/${result.meeting.meeting_code}`);
      } else {
        setError(result.error || 'Failed to create meeting');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create a New Meeting</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Title *
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter meeting title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your meeting"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time (Optional)
            </label>
            <input
              id="start_time"
              type="datetime-local"
              {...register('start_time')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
              End Time (Optional)
            </label>
            <input
              id="end_time"
              type="datetime-local"
              {...register('end_time')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Meeting'}
        </button>
      </form>
    </div>
  );
} 