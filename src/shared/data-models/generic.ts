export interface GameDataModel {
  notes: number;
}

export type DataValue = GameDataModel[DataKey];
export type DataKey = keyof GameDataModel;

export const DataKeys: DataKey[] = [
  "notes"
];