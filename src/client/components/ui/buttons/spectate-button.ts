import type { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";
import InGameButton from "client/base-components/in-game-button";

@Component({
  tag: "SpectateButton",
  ancestorWhitelist: [ PlayerGui ]
})
export class SpectateButton extends InGameButton<{}, ImageButton> implements OnStart {
  public onStart(): void {
    this.linkVisibility();
  }
}