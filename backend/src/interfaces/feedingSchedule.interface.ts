export type FeedingStatus = 'pending' | 'completed' | 'missed';
export type DistributionType = 'manual' | 'programmed';

export interface FeedingSchedule {
  id?: string;
  petId: string;
  portionSize: string;
  foodType: string;
  scheduledTime: string;
  completedTime?: string;
  status: FeedingStatus;
  distributionType: DistributionType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedingScheduleDTO {
  petId: string;
  portionSize: string;
  foodType: string;
  scheduledTime: string;
  distributionType: DistributionType;
  notes?: string;
}

export interface UpdateFeedingScheduleDTO {
  portionSize?: string;
  foodType?: string;
  scheduledTime?: string;
  status?: FeedingStatus;
  distributionType?: DistributionType;
  completedTime?: string;
  notes?: string;
}
