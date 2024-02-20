import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";

// TODO: if page is closed without claiming rewards, auto-claim them

@Component({
  tag: "DailyRewards",
  ancestorWhitelist: [ PlayerGui ]
})
export class DailyRewards extends BaseComponent<{}, PlayerGui["Menu"]["DailyRewards"]["Main"]> implements OnStart {
  public onStart(): void {
    this.instance.Visible = true
  }
}