import { Service, type OnInit } from "@flamework/core";

import { Events } from "server/network";
import type { OnPlayerJoin, OnPlayerLeave } from "server/hooks";

import { toSeconds } from "shared/utilities/helpers";
import ConsoleChatType from "shared/structs/console-chat-type";

import type { ServerSettingsService } from "./server-settings-service";

const { sendConsoleChatMessage } = Events;

@Service()
export class ChatConsoleService implements OnInit, OnPlayerJoin, OnPlayerLeave {
  public constructor(
    private readonly serverSettings: ServerSettingsService
  ) {}

  public onInit(): void {
    const promotionInterval = toSeconds(this.serverSettings.get<string>("ChatPromotionInterval"));
    const promotions = [
      "Follow @OverpeakGames on Twitter for X notes!",
      "Follow @OverpeakGames on Twitter for exclusive codes!"
    ];

    task.spawn(() => {
      while (true) {
        task.wait(promotionInterval);
        const randomPromotion = promotions[math.random(0, promotions.size() - 1)];
        this.sendMessage(`<b>${randomPromotion}</b>`, ConsoleChatType.Promotion);
      }
    });
  }

  public onPlayerLeave(player: Player): void {
    this.sendMessage(`${player.DisplayName} (${player.Name}) has left the game.`, ConsoleChatType.JoinOrLeave);
  }

  public onPlayerJoin(player: Player): void {
    this.sendMessage(`${player.DisplayName} (${player.Name}) has joined the game.`, ConsoleChatType.JoinOrLeave);
  }

  private sendMessage(text: string, chatType: ConsoleChatType): void {
    sendConsoleChatMessage.broadcast(text, chatType)
  }
}