import type Inventory from "./inventory";
import type EquippedItems from "./equipped-items";
import type EarningsHistory from "./earnings-history";

export interface GameDataModel {
  notes: number;
  wins: number;
  inventory: Inventory;
  equippedItems: EquippedItems;
  redeemedCodes: string[];
  earningsHistory: EarningsHistory[];
}

export type DataValue = GameDataModel[DataKey];
export type DataKey = keyof GameDataModel;

export const DataKeys: DataKey[] = [
  "notes", "wins",
  "inventory", "equippedItems",
  "redeemedCodes",
  "earningsHistory"
];