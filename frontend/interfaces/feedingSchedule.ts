export type FeedingStatus = 'pending' | 'completed' | 'missed';
export type DistributionType = 'manual' | 'programmed';

export interface FeedingSchedule {
  id?: string;
  petId: string;
  petName?: string;
  petSpecies?: string;
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
