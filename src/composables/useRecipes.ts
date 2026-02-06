import { openDB } from 'idb'

const DB_NAME = 'recipeDB';
const STORE_NAME = 'recipes';
const DB = await initDB();

export interface Recipe {
  id?: number
  title: string
  ingredients: string[]
  steps: string
  category?: string
  rating?: number
}

export async function initDB() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
}

// CRUD functions
export async function getRecipes() {
  return DB.getAll(STORE_NAME);
}

export async function addOrUpdateRecipe(recipe: Recipe) {
  await DB.put(STORE_NAME, recipe);
}

export async function isRecipeStored(id: number) {
  return DB.get(STORE_NAME, id);
}

export async function deleteRecipe(id: number) {
  await DB.delete(STORE_NAME, id);
}
