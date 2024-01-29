import { Controller, type OnInit } from "@flamework/core";

import { PlayerGui } from "shared/utilities/client";
import { Events } from "client/network";
import { toTimerFormat } from "shared/utilities/helpers";

const {
  waitingForPlayers,
  updateIntermissionTimer, intermissionStarted,
  updateGameTimer, gameStarted,
  walkingAroundChairs, choosingChairs, eliminated, won
} = Events;

type MessageName = ExtractKeys<PlayerGui["TopMessages"], ImageLabel>;

@Controller()
export class TopMessageController implements OnInit {
  public readonly frames = <PlayerGui["TopMessages"]>PlayerGui.WaitForChild("TopMessages");

  public onInit(): void {
    updateIntermissionTimer.connect(remaining => this.frames.Intermission.Countdown.Text = toTimerFormat(remaining));
    updateGameTimer.connect(remaining => this.frames.RemainingTime.Countdown.Text = toTimerFormat(remaining));
    waitingForPlayers.connect(() => this.enable("WaitingForPlayers"));
    intermissionStarted.connect(() => this.enable("Intermission"));
    gameStarted.connect(() => this.disableAll());

    walkingAroundChairs.connect(() => this.disable("FindChair"));
    choosingChairs.connect(() => this.enable("FindChair"));
    eliminated.connect(() => {
      this.disableAll();
      this.enable("Eliminated")
      task.delay(4, () => this.disable("Eliminated"));
    });
    won.connect(message => {
      this.disableAll();
      this.frames.Win.TextLabel.Text = message;
      this.enable("Win");
    });
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

  public disableAll(): void {
    const messages = this.frames.GetChildren()
      .filter((child): child is ImageLabel => child.IsA("ImageLabel"));

    for (const message of messages)
      message.Visible = false
  }
}