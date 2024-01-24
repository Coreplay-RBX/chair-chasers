import { Service, type OnInit } from "@flamework/core";
import { ServerStorage } from "@rbxts/services";

import { Events } from "server/network";
import type { OnPlayerJoin, OnPlayerLeave } from "server/hooks";

import { toSeconds } from "shared/utilities/helpers";
import ConsoleChatType from "shared/structs/console-chat-type";

const { sendConsoleChatMessage } = Events;

@Service()
export class ChatConsoleService implements OnInit, OnPlayerJoin, OnPlayerLeave {
  public onInit(): void {
    const promotionInterval = toSeconds(<string>ServerStorage.ServerSettings.GetAttribute("ChatPromotionInterval"));
    const promotions = [
      "Follow @Coreplay on Twitter for X notes.",
      "Follow @Coreplay on Twitter for exclusive codes."
    ];

    task.spawn(() => {
      while (task.wait(promotionInterval)) {
        const randomPromotion = promotions[math.random(0, promotions.size() - 1)];
        this.sendMessage(randomPromotion, ConsoleChatType.Promotion);
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