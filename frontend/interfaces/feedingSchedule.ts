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
