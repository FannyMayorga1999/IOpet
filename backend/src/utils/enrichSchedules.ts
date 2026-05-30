import { PetService } from '../services/pet.service';
import { FeedingSchedule } from '../interfaces/feedingSchedule.interface';

const petService = new PetService();

export async function enrichSchedulesWithPets<T extends FeedingSchedule>(
  schedules: T[]
): Promise<(T & { petName: string; petSpecies: string })[]> {
  const petIds = [...new Set(schedules.map((s) => s.petId))];
  const petsMap = new Map<string, { name: string; species: string }>();

  for (const id of petIds) {
    try {
      const pet = await petService.findById(id);
      petsMap.set(id, { name: pet.name, species: pet.species });
    } catch {
      petsMap.set(id, { name: 'Unknown', species: 'other' });
    }
  }

  return schedules.map((s) => ({
    ...s,
    petName: petsMap.get(s.petId)?.name || 'Unknown',
    petSpecies: petsMap.get(s.petId)?.species || 'other',
  }));
}
