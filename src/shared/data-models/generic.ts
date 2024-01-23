import type Inventory from "./inventory";

export interface GameDataModel {
  notes: number;
  inventory: Inventory;
}

export type DataValue = GameDataModel[DataKey];
export type DataKey = keyof GameDataModel;

export const DataKeys: DataKey[] = [
  "notes", "inventory"
];