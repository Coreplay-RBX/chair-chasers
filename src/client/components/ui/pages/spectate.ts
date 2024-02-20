import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";
import { Assets } from "shared/utilities/helpers";

import type { SpectationController } from "client/controllers/spectation-controller";
import type { UIBlurController } from "client/controllers/ui-blur-controller";

const { playersInGameChanged, intermissionStarted } = Events;

@Component({
  tag: "SpectatePage",
  ancestorWhitelist: [ PlayerGui ]
})
export class Spectate extends BaseComponent<{}, PlayerGui["Menu"]["Spectate"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;

  public constructor(
    private readonly spectation: SpectationController,
    private readonly blur: UIBlurController
  ) { super(); }

  public onStart(): void {
    this.janitor.Add(this.spectation.started.Connect(() => this.closePage()))
    this.janitor.Add(intermissionStarted.connect(() => this.spectation.stop())); // exit spectation when game ends
    this.janitor.Add(playersInGameChanged.connect(ids => {
      const players = ids.map(id => Players.GetPlayerByUserId(id)).filterUndefined();
      this.update(players);
    }));
  }

  private update(players: Player[]): void {
    this.clear();
    for (const player of players)
      task.spawn(() => {
        const button = Assets.UI.SelectSpectate.Clone();
        button.Username.Text = `@${player.Name}`;
        button.DisplayName.Text = player.DisplayName;
        button.MouseButton1Click.Connect(() => this.spectation.spectate(player));
        button.Parent = this.instance.List;
      });
  }

  private clear(): void {
    const playerButtons = this.instance.List
      .GetChildren()
      .filter(instance => instance.IsA("ImageButton"));

    for (const button of playerButtons)
      task.spawn(() => button.Destroy());
  }

  private closePage(): void {
    const frame = <Frame>this.instance.Parent;
    frame.Visible = false;
    this.blur.toggle(false);
  }
}