import { getFirestore } from '../configs/firebase';
import {
  FeedingSchedule,
  CreateFeedingScheduleDTO,
  UpdateFeedingScheduleDTO,
} from '../interfaces/feedingSchedule.interface';
import { AppError } from '../middlewares/errorHandler';

const COLLECTION = 'feedingSchedules';

export class FeedingScheduleService {
  private db = getFirestore();

  async findAll(): Promise<FeedingSchedule[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .orderBy('scheduledTime', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FeedingSchedule));
  }

  async findById(id: string): Promise<FeedingSchedule> {
    const doc = await this.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) {
      throw new AppError(404, 'SCHEDULE_NOT_FOUND', `Feeding schedule with id ${id} not found`);
    }
    return { id: doc.id, ...doc.data() } as FeedingSchedule;
  }

  async findByPet(petId: string): Promise<FeedingSchedule[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where('petId', '==', petId)
      .orderBy('scheduledTime', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FeedingSchedule));
  }

  async create(data: CreateFeedingScheduleDTO): Promise<FeedingSchedule> {
    const now = new Date().toISOString();
    const docRef = await this.db.collection(COLLECTION).add({
      ...data,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as FeedingSchedule;
  }

  async update(id: string, data: UpdateFeedingScheduleDTO): Promise<FeedingSchedule> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError(404, 'SCHEDULE_NOT_FOUND', `Feeding schedule with id ${id} not found`);
    }

    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as FeedingSchedule;
  }

  async delete(id: string): Promise<void> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError(404, 'SCHEDULE_NOT_FOUND', `Feeding schedule with id ${id} not found`);
    }

    await docRef.delete();
  }
}
