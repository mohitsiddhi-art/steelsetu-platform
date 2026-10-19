export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'SALES'
  | 'STORE'
  | 'SELLER'
  | 'BUYER'
  | 'BROKER'
  | 'MODERATOR'
  | 'COMMUNITY_MEMBER';

export interface SteelCalculationResult {
  plainWeightKg: number;
  corrugatedWeightKg: number;
  totalTons: number;
  estimatedAmountInr: number;
}
