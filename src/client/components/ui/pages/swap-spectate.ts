import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";
import { Assets } from "shared/utilities/helpers";

import type { SpectationController } from "client/controllers/spectation-controller";

const { playersInGameChanged } = Events;

@Component({
  tag: "SwapSpectatePage",
  ancestorWhitelist: [ PlayerGui ]
})
export class SwapSpectate extends BaseComponent<{}, PlayerGui["Menu"]["SwapSpectate"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;

  public constructor(
    private readonly spectation: SpectationController
  ) { super(); }

  public onStart(): void {
    this.janitor.Add(this.spectation.stopped.Connect(() => this.togglePage(false)));
    this.janitor.Add(this.spectation.started.Connect(() => this.togglePage(true)));
    this.janitor.Add(playersInGameChanged.connect(ids => {
      const players = ids.map(id => Players.GetPlayerByUserId(id)).filterUndefined();
      this.update(players);
    }));
  }

  private update(players: Player[]): void {
    this.clear();
    for (const player of players)
      task.spawn(() => {
        const button = Assets.UI.SwapSpectate.Clone();
        button.Username.Text = `@${player.Name}`;
        button.DisplayName.Text = player.DisplayName;
        button.MouseButton1Click.Connect(() => this.spectation.swap(player));
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

  private togglePage(on: boolean): void {
    const frame = <Frame>this.instance.Parent;
    frame.Visible = on;
  }
}