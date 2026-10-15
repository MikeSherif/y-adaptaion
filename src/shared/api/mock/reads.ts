import { materials } from './materials';

const seeded = materials.filter((material) => material.isRead).map((material) => material.id);

export const materialReads = new Map<string, Set<string>>([
  ['user-1', new Set(seeded)],
  ['user-2', new Set(seeded)],
]);

export function hasRead(userId: string, materialId: string) {
  return materialReads.get(userId)?.has(materialId) ?? false;
}

export function markRead(userId: string, materialId: string) {
  const current = materialReads.get(userId) ?? new Set<string>();
  current.add(materialId);
  materialReads.set(userId, current);
}
