export type FeedingStatus = 'pending' | 'completed' | 'missed';

export interface FeedingSchedule {
  id?: string;
  petId: string;
  portionSize: string;
  foodType: string;
  scheduledTime: string;
  completedTime?: string;
  status: FeedingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedingScheduleDTO {
  petId: string;
  portionSize: string;
  foodType: string;
  scheduledTime: string;
  notes?: string;
}

export interface UpdateFeedingScheduleDTO {
  portionSize?: string;
  foodType?: string;
  scheduledTime?: string;
  status?: FeedingStatus;
  completedTime?: string;
  notes?: string;
}
