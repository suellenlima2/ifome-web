export interface RestrictionInfo {
  label: string;
  icon: string;
  color: 'green' | 'yellow' | 'purple' | 'red';
}

export type RestrictionKey = 'vegetarian' | 'vegan' | 'glutenFree' | 'lactoseFree' | 'spicy';

export type UserRole = 'student' | 'admin';

export type DishCategory = 'base' | 'proteina' | 'proteina_v' | 'salada' | 'acomp' | 'sobremesa' | 'bebida';

export interface Dish {
  id: string;
  name: string;
  desc: string;
  cat: DishCategory;
  tags: RestrictionKey[];
}

export type MealKey = 'cafe' | 'almoco' | 'jantar';

export interface Meal {
  key: MealKey;
  label: string;
  time: string;
  confirmados: number;
  capacidade: number;
  dishes: Dish[];
}

export interface MenuToday {
  date: string;
  meals: Meal[];
}

export interface NextDay {
  date: string;
  almoco: string;
  jantar: string;
}

export interface WeekDay {
  date: string;
  today: boolean;
  meals: Array<{
    key?: MealKey;
    label: string;
    time: string;
    dishes: Partial<Dish>[];
  }>;
}

export type StockStatus = 'ok' | 'low' | 'crit';

export interface StockItem {
  id: string;
  name: string;
  cat: string;
  stock: number;
  min: number;
  max: number;
  unit: string;
  status: StockStatus;
}

export type AlertLevel = 'crit' | 'warn' | 'info';

export interface Alert {
  id: string;
  level: AlertLevel;
  title: string;
  body: string;
  at: string;
}

export interface DemandDay {
  d: string;
  almoco: number;
  jantar: number;
}

export interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  at: string;
  unread: boolean;
}

export interface RecentConfirmation {
  id: string;
  name: string;
  mat: string;
  meal: string;
  type: 'Padrão' | 'Adaptada';
  at: string;
}

export interface UserProfile {
  name: string;
  initials: string;
  email: string;
  matricula: string;
  campus: string;
  curso: string;
  phone: string;
  restrictions: RestrictionKey[];
  role: UserRole;
}

export interface MealHistory {
  date: string;
  meal: string;
  dish: string;
  rating: number;
}

export interface DashboardData {
  menuToday: MenuToday;
  alerts: Alert[];
  stock: StockItem[];
  demand7d: DemandDay[];
  recentConfirmations: RecentConfirmation[];
}

export type ConfirmationType = 'padrao' | 'adaptada';

export interface ConfirmationPayload {
  period: MealKey;
  type: ConfirmationType;
}
