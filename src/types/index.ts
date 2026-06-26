export interface RestrictionInfo {
  label: string;
  icon: string;
  color: 'green' | 'yellow' | 'purple' | 'red';
}

export type RestrictionKey = 
  | 'vegetarian' 
  | 'vegan' 
  | 'gluten_free'
  | 'lactose_free'
  | 'spicy';

export type UserRole = 'student' | 'admin';

export type DishCategory = 
  | 'base' 
  | 'protein'
  | 'salad'
  | 'side'
  | 'dessert'
  | 'drink';

export interface Dish {
  id: string;
  name: string;
  description: string;
  category: DishCategory;
  restrictions: RestrictionKey[];
}

export type MealKey = 'breakfast' | 'lunch' | 'dinner';

export interface Meal {
  id: string;
  period: MealKey;
  startTime: string;
  endTime: string;
  capacity: number;
  confirmedCount: number;
  usagePercent: number;
  dishes: Dish[];
}

export interface MenuToday {
  date: string;
  meals: Meal[];
}

export interface NextDay {
  date: string;
  lunch: string;
  dinner: string;
}

export interface WeekDay {
  date: string;
  today: boolean;
  meals: Array<{
    period?: MealKey;
    startTime: string;
    endTime: string;
    dishes: Partial<Dish>[];
  }>;
}

export type StockStatus = 'ok' | 'low' | 'crit';

export interface StockItem {
  id: string;
  name: string;
  category: string;
  currentQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  status: StockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StockResponse {
  data: StockItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'entrada' | 'saida' | string;
  quantity: number;
  reason: string;
  createdById: string;
  createdAt: string;
}

export interface StockMovementsResponse {
  data: StockMovement[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export type AlertLevel = 'crit' | 'warn' | 'info';

export interface Alert {
  id: string;
  level: AlertLevel;
  type: string;
  title: string;
  body: string;
  relatedId: string | null;
  resolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
}

export interface AlertsResponse {
  data: Alert[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DemandDay {
  date: string;
  period: MealKey;
  count: number;
}

export interface Demand7dResponse {
  data: DemandDay[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationResponse {
  data: Notification[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface RecentConfirmation {
  id: string;
  userId: string;
  userName: string;
  userEnrollment: string;
  mealDate: string;
  mealPeriod: MealKey;
  type: 'standard' | 'adapted';
  confirmedAt: string;
}

export interface RecentConfirmationsResponse {
  data: RecentConfirmation[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  enrollment: string;
  campus: string;
  course: string;
  phone: string;
  restrictions: RestrictionKey[];
  role: UserRole;
}

export interface MealHistory {
  id: string;
  date: string;
  period: MealKey;
  dish: string;
  rating: number;
  recordedAt: string;
}

export interface MealHistoryResponse {
  data: MealHistory[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface DashboardData {
  menuToday: {
    day: MenuToday;
  };
  alerts: Alert[];
  stock: StockItem[];
  demand7d: DemandDay[];
  recentConfirmations: RecentConfirmation[];
}

export type ConfirmationType = 'standard' | 'adapted';

export interface MealConfirmation {
  id: string;
  mealId: string;
  date: string;
  period: MealKey;
  type: ConfirmationType;
  confirmedAt: string;
}

export interface ConfirmationPayload {
  period: MealKey;
  type: ConfirmationType;
}