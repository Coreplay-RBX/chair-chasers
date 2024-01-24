import type Inventory from "./inventory";
import type EquippedItems from "./equipped-items";

export interface GameDataModel {
  notes: number;
  inventory: Inventory;
  equippedItems: EquippedItems;
}

export type DataValue = GameDataModel[DataKey];
export type DataKey = keyof GameDataModel;

export const DataKeys: DataKey[] = [
  "notes", "inventory", "equippedItems"
];