import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";

const { playersInGameChanged } = Events;

@Component({
  tag: "SpectateButton",
  ancestorWhitelist: [ PlayerGui ]
})
export class SpectateButton extends BaseComponent<{}, ImageButton> implements OnStart {
  private readonly janitor = new Janitor;

  public onStart(): void {
    this.janitor.Add(playersInGameChanged.connect(ids => {
      const playersInGame = ids.map(id => Players.GetPlayerByUserId(id)).filterUndefined();
      this.instance.Visible = !playersInGame.includes(Players.LocalPlayer); // can spectate if not in the game
    }));
  }
}