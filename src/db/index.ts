import Dexie, { type Table } from 'dexie';
import type { CompanyHierarchyCanvas } from '../types/company';

export class CorpCanvasDatabase extends Dexie {
  canvases!: Table<CompanyHierarchyCanvas, string>;

  constructor() {
    super('CorpCanvasDatabase');
    this.version(1).stores({
      canvases: 'id, name, companyName, source, createdAt, updatedAt'
    });
  }
}

export const db = new CorpCanvasDatabase();

// In-memory fallback in case IndexedDB is restricted or disabled on file://
const inMemoryCanvases = new Map<string, CompanyHierarchyCanvas>();

export async function getAllCanvases(): Promise<CompanyHierarchyCanvas[]> {
  try {
    const list = await db.canvases.orderBy('updatedAt').reverse().toArray();
    if (list && list.length > 0) {
      list.forEach((c) => inMemoryCanvases.set(c.id, c));
      return list;
    }
  } catch (err) {
    console.warn('Dexie getAllCanvases error, falling back to in-memory store:', err);
  }
  return Array.from(inMemoryCanvases.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getCanvasById(id: string): Promise<CompanyHierarchyCanvas | undefined> {
  try {
    const item = await db.canvases.get(id);
    if (item) return item;
  } catch (err) {
    console.warn('Dexie getCanvasById error, falling back to in-memory store:', err);
  }
  return inMemoryCanvases.get(id);
}

export async function saveCanvas(canvas: CompanyHierarchyCanvas): Promise<string> {
  const updatedCanvas: CompanyHierarchyCanvas = {
    ...canvas,
    updatedAt: new Date().toISOString()
  };
  inMemoryCanvases.set(updatedCanvas.id, updatedCanvas);
  try {
    await db.canvases.put(updatedCanvas);
  } catch (err) {
    console.warn('Dexie saveCanvas error (using in-memory fallback):', err);
  }
  return updatedCanvas.id;
}

export async function deleteCanvas(id: string): Promise<void> {
  inMemoryCanvases.delete(id);
  try {
    await db.canvases.delete(id);
  } catch (err) {
    console.warn('Dexie deleteCanvas error:', err);
  }
}
