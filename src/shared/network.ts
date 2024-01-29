import { Networking } from "@flamework/networking";
import type { DataKey, DataValue, GameDataModel } from "./data-models/generic";
import type ConsoleChatType from "./structs/console-chat-type";

interface ServerEvents {
  initializeData(): void;
  dataLoaded(): void;
  setData(key: DataKey, value: DataValue): void;
  incrementData(key: ExtractKeys<GameDataModel, number>, amount?: number): void;
  voteForMap(mapIndex: number): void;
}

interface ClientEvents {
  dataUpdate(key: DataKey, value: DataValue): void;
  sendConsoleChatMessage(text: string, chatType: ConsoleChatType): void;
  waitingForPlayers(): void;
  intermissionStarted(): void;
  gameStarted(): void;
  updateIntermissionTimer(remaining: number): void;
  updateGameTimer(remaining: number): void;
  mapVotingStarted(mapPool: string[]): void;
  closeMapVotingFrame(): void;
  walkingAroundChairs(): void;
  choosingChairs(): void;
  eliminated(): void;
  won(message: string): void;
}

interface ServerFunctions {
  getData(key: DataKey): DataValue;
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
