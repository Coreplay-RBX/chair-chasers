import type Inventory from "./inventory";
import type EquippedItems from "./equipped-items";

export interface GameDataModel {
  notes: number;
  wins: number;
  inventory: Inventory;
  equippedItems: EquippedItems;
  redeemedCodes: string[];
  purchaseHistory: string[];
  lastClaimedDaily: number;
  consecutiveLogins: number;
}

export type DataValue = GameDataModel[DataKey];
export type DataKey = keyof GameDataModel;

export const DataKeys: DataKey[] = [
  "notes", "wins",
  "inventory", "equippedItems",
  "redeemedCodes", "purchaseHistory",
  "lastClaimedDaily", "consecutiveLogins"
];