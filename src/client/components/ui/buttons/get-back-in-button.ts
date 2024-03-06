import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { MarketplaceService as Market } from "@rbxts/services";

import { Player, PlayerGui } from "shared/utilities/client";
import InGameButton from "client/base-components/in-game-button";
import DevProduct from "shared/structs/dev-products";

@Component({
  tag: "GetBackInButton",
  ancestorWhitelist: [ PlayerGui ]
})
export class GetBackInButton extends InGameButton<{}, GuiButton> implements OnStart {
  public onStart(): void {
    this.linkVisibility();
    this.janitor.Add(this.instance.MouseButton1Click.Connect(() => {
      if (!this.instance.Visible) return;
      Market.PromptProductPurchase(Player, DevProduct.GetBackIn);
    }));
  }
}