import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";

@Component({
  tag: "SwapSpectate",
  ancestorWhitelist: [ PlayerGui ]
})
export class SwapSpectate extends BaseComponent<{}, PlayerGui["Menu"]["SwapSpectate"]["Main"]> implements OnStart {
  public onStart(): void {

  }
}