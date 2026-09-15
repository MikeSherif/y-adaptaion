import type { User } from '@/shared/types/domain';
export const currentUser: User = {
  id: 'user-1',
  firstName: 'Алина',
  lastName: 'Ковалева',
  middleName: 'Сергеевна',
  email: 'employee@example.com',
  phone: '+7 913 555-12-74',
  position: 'Product designer',
  department: { id: 'design', name: 'Продуктовый дизайн' },
  startDate: '2026-09-08',
  manager: {
    id: 'manager-1',
    firstName: 'Мария',
    lastName: 'Соколова',
    position: 'Head of Design',
  },
};
