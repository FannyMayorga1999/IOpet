import { getFirestore } from '../configs/firebase';
import { Pet, CreatePetDTO, UpdatePetDTO } from '../interfaces/pet.interface';
import { AppError } from '../middlewares/errorHandler';

const COLLECTION = 'pets';

export class PetService {
  private db = getFirestore();

  async findAll(): Promise<Pet[]> {
    const snapshot = await this.db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Pet));
  }

  async findById(id: string): Promise<Pet> {
    const doc = await this.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) {
      throw new AppError(404, 'PET_NOT_FOUND', `Pet with id ${id} not found`);
    }
    return { id: doc.id, ...doc.data() } as Pet;
  }

  async findByOwner(ownerId: string): Promise<Pet[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where('ownerId', '==', ownerId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Pet));
  }

  async create(data: CreatePetDTO): Promise<Pet> {
    const now = new Date().toISOString();
    const docRef = await this.db.collection(COLLECTION).add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Pet;
  }

  async update(id: string, data: UpdatePetDTO): Promise<Pet> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError(404, 'PET_NOT_FOUND', `Pet with id ${id} not found`);
    }

    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as Pet;
  }

  async delete(id: string): Promise<void> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError(404, 'PET_NOT_FOUND', `Pet with id ${id} not found`);
    }

    await docRef.delete();
  }
}
