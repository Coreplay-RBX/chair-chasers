import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";

@Component({
  tag: "Spectate",
  ancestorWhitelist: [ PlayerGui ]
})
export class Spectate extends BaseComponent<{}, PlayerGui["Menu"]["Spectate"]["Main"]> implements OnStart {
  public onStart(): void {

  }
}