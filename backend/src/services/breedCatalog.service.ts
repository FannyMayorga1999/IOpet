import { getFirestore } from '../configs/firebase';
import { BreedCatalog, CreateBreedCatalogDTO, UpdateBreedCatalogDTO } from '../interfaces/breedCatalog.interface';
import { AppError } from '../middlewares/errorHandler';

const COLLECTION = 'breedCatalog';

export class BreedCatalogService {
  private db = getFirestore();

  async findAll(): Promise<BreedCatalog[]> {
    const snapshot = await this.db.collection(COLLECTION).get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BreedCatalog));
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findActive(): Promise<BreedCatalog[]> {
    const all = await this.findAll();
    return all.filter((b) => b.active);
  }

  async findBySpecies(species: string): Promise<BreedCatalog[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where('species', '==', species)
      .get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as BreedCatalog));
    return items.filter((b) => b.active).sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<BreedCatalog> {
    const doc = await this.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) {
      throw new AppError(404, 'BREED_NOT_FOUND', `Breed with id ${id} not found`);
    }
    return { id: doc.id, ...doc.data() } as BreedCatalog;
  }

  async create(data: CreateBreedCatalogDTO): Promise<BreedCatalog> {
    const now = new Date().toISOString();
    const docRef = await this.db.collection(COLLECTION).add({
      ...data,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as BreedCatalog;
  }

  async update(id: string, data: UpdateBreedCatalogDTO): Promise<BreedCatalog> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new AppError(404, 'BREED_NOT_FOUND', `Breed with id ${id} not found`);
    }
    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as BreedCatalog;
  }

  async delete(id: string): Promise<void> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new AppError(404, 'BREED_NOT_FOUND', `Breed with id ${id} not found`);
    }
    await docRef.delete();
  }
}
