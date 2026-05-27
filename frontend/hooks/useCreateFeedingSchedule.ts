'use client';

import { useState } from 'react';
import { FeedingSchedule, DistributionType } from '@/interfaces/feedingSchedule';
import { api, endpoints } from '@/services/api';

interface CreateFeedingData {
  petId: string;
  portionSize: string;
  foodType: string;
  scheduledTime: string;
  distributionType: DistributionType;
  notes?: string;
}

export function useCreateFeedingSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchedule = async (data: CreateFeedingData): Promise<FeedingSchedule | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<FeedingSchedule>(endpoints.feedingSchedules, data);
      if (res.success && res.data) {
        return res.data;
      }
      setError(res.message || 'Error creating schedule');
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createSchedule, loading, error };
}
