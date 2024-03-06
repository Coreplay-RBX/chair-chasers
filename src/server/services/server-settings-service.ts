import { Service } from "@flamework/core";
import { ServerStorage, RunService as Runtime } from "@rbxts/services";

@Service()
export class ServerSettingsService {
  public get<T extends Maybe<AttributeValue>>(settingName: string): T {
    const settings = Runtime.IsStudio() ? ServerStorage.TestServerSettings : ServerStorage.ServerSettings;
    return <T>settings.GetAttribute(settingName);
  }

  public getNoteAmount(noteTier: string): number {
    return <number>ServerStorage.PurchasableNoteAmounts.GetAttribute(noteTier);
  }
}