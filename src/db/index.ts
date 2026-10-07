import Dexie, { type EntityTable } from 'dexie';
import type { CompanyHierarchyCanvas } from '../types/company';

export const db = new Dexie('CorpCanvasDatabase') as Dexie & {
  canvases: EntityTable<CompanyHierarchyCanvas, 'id'>;
};

// Schema definition
db.version(1).stores({
  canvases: 'id, name, companyName, source, createdAt, updatedAt'
});

export async function getAllCanvases(): Promise<CompanyHierarchyCanvas[]> {
  return await db.canvases.orderBy('updatedAt').reverse().toArray();
}

export async function getCanvasById(id: string): Promise<CompanyHierarchyCanvas | undefined> {
  return await db.canvases.get(id);
}

export async function saveCanvas(canvas: CompanyHierarchyCanvas): Promise<string> {
  const updatedCanvas = {
    ...canvas,
    updatedAt: new Date().toISOString()
  };
  await db.canvases.put(updatedCanvas);
  return canvas.id;
}

export async function deleteCanvas(id: string): Promise<void> {
  await db.canvases.delete(id);
}
