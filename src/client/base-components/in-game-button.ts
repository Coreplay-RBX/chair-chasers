import { BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Events } from "../network";
import { Player } from "shared/utilities/client";

const { playersInGameChanged } = Events;

export default class InGameButton<A extends {} = {}, I extends GuiButton = GuiButton> extends BaseComponent<A, I> {
  protected readonly janitor = new Janitor;

  protected linkVisibility(): void {
    this.janitor.Add(playersInGameChanged.connect(ids => {
      const playersInGame = ids.map(id => Players.GetPlayerByUserId(id)).filterUndefined();
      this.instance.Visible = !playersInGame.includes(Player); // can spectate if not in the game
    }));
  }
}