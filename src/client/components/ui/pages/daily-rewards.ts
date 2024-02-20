import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";

import type { MenuController } from "client/controllers/menu-controller";

// TODO: if page is closed without claiming rewards, auto-claim them

@Component({
  tag: "DailyRewardsPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class DailyRewards extends BaseComponent<{}, PlayerGui["Menu"]["DailyRewards"]["Main"]> implements OnStart {
  public constructor(
    private readonly menu: MenuController
  ) { super(); }

  public onStart(): void {
    this.menu.setPage("DailyRewards", true);
  }
}