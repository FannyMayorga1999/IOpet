import { getFirestore } from '../configs/firebase';
import { FoodCatalog, CreateFoodCatalogDTO, UpdateFoodCatalogDTO } from '../interfaces/foodCatalog.interface';
import { AppError } from '../middlewares/errorHandler';

const COLLECTION = 'foodCatalog';

export class FoodCatalogService {
  private db = getFirestore();

  async findAll(): Promise<FoodCatalog[]> {
    const snapshot = await this.db.collection(COLLECTION).get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodCatalog));
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  async findActive(): Promise<FoodCatalog[]> {
    const all = await this.findAll();
    return all.filter((f) => f.active);
  }

  async findBySpecies(species: string): Promise<FoodCatalog[]> {
    const snapshot = await this.db
      .collection(COLLECTION)
      .where('suitableFor', 'array-contains', species)
      .get();
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FoodCatalog));
    return items.filter((f) => f.active).sort((a, b) => a.name.localeCompare(b.name));
  }

  async findById(id: string): Promise<FoodCatalog> {
    const doc = await this.db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) {
      throw new AppError(404, 'FOOD_NOT_FOUND', `Food with id ${id} not found`);
    }
    return { id: doc.id, ...doc.data() } as FoodCatalog;
  }

  async create(data: CreateFoodCatalogDTO): Promise<FoodCatalog> {
    const now = new Date().toISOString();
    const docRef = await this.db.collection(COLLECTION).add({
      ...data,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as FoodCatalog;
  }

  async update(id: string, data: UpdateFoodCatalogDTO): Promise<FoodCatalog> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new AppError(404, 'FOOD_NOT_FOUND', `Food with id ${id} not found`);
    }
    await docRef.update({ ...data, updatedAt: new Date().toISOString() });
    const updated = await docRef.get();
    return { id: updated.id, ...updated.data() } as FoodCatalog;
  }

  async delete(id: string): Promise<void> {
    const docRef = this.db.collection(COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new AppError(404, 'FOOD_NOT_FOUND', `Food with id ${id} not found`);
    }
    await docRef.delete();
  }
}
