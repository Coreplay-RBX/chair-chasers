import { Controller, type OnInit } from "@flamework/core";
import { StarterGui } from "@rbxts/services";

import { Events } from "client/network";
import ConsoleChatType from "shared/structs/console-chat-type";

const { sendConsoleChatMessage } = Events;

@Controller()
export class ChatConsoleController implements OnInit {
  public onInit(): void {
    sendConsoleChatMessage.connect((text, chatType) =>
      StarterGui.SetCore("ChatMakeSystemMessage", {
        Text: `<b>[SYSTEM]:</b> ${text}`,
        Color: chatType === ConsoleChatType.JoinOrLeave ? Color3.fromRGB(255, 245, 120) : Color3.fromRGB(115, 115, 115),
        Font: Enum.Font.SourceSans,
        TextSize: 18
      })
    );
  }
}