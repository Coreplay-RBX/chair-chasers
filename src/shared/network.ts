import { Networking } from "@flamework/networking";
import { DataKey, DataValue, GameDataModel } from "./data-models/generic";

interface ServerEvents {
  initializeData(): void;
  dataLoaded(): void;
  setData(key: DataKey, value: DataValue): void;
  incrementData(key: ExtractKeys<GameDataModel, number>, amount?: number): void;
}

interface ClientEvents {
  dataUpdate(key: DataKey, value: DataValue): void;
  waitingForPlayers(): void;
  intermissionStarted(): void;
  gameStarted(): void;
  updateIntermissionTimer(remaining: number): void;
  updateGameTimer(remaining: number): void;
  mapVotingStarted(mapPool: string[]): void;
}

interface ServerFunctions {
  getData(key: DataKey): DataValue;
}

interface ClientFunctions {
  getVotedMap(): string
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
