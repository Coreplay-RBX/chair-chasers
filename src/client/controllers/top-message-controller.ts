import { Controller, type OnInit } from "@flamework/core";

import { PlayerGui } from "shared/utilities/client";
import { Events } from "client/network";
import { toTimerFormat } from "shared/utilities/helpers";

const { updateIntermissionTimer, updateGameTimer, waitingForPlayers, intermissionStarted, gameStarted } = Events;

type MessageName = ExtractKeys<PlayerGui["TopMessages"], ImageLabel>;

@Controller()
export class TopMessageController implements OnInit {
  public readonly frames = <PlayerGui["TopMessages"]>PlayerGui.WaitForChild("TopMessages");

  public onInit(): void {
    updateIntermissionTimer.connect(remaining => this.frames.Intermission.Countdown.Text = toTimerFormat(remaining));
    updateGameTimer.connect(remaining => this.frames.RemainingTime.Countdown.Text = toTimerFormat(remaining));
    waitingForPlayers.connect(() => this.enable("WaitingForPlayers"));
    intermissionStarted.connect(() => this.enable("Intermission"));
    gameStarted.connect(() => this.enable("RemainingTime"));
  }

  public enable(messageName: MessageName): void {
    const messages = this.frames.GetChildren()
      .filter((child): child is ImageLabel => child.IsA("ImageLabel"));

    for (const message of messages)
      message.Visible = message.Name === messageName;
  }

  public disable(messageName: MessageName): void {
    const message = this.frames[messageName];
    message.Visible = false;
  }
}