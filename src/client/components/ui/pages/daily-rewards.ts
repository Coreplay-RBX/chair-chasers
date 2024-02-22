import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";

import type { MenuController } from "client/controllers/menu-controller";
import { toRemainingTime } from "shared/utilities/helpers";

const { dataUpdate } = Events;

// TODO: if page is closed without claiming rewards, auto-claim them

@Component({
  tag: "DailyRewardsPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class DailyRewards extends BaseComponent<{}, PlayerGui["Menu"]["DailyRewards"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;
  private lastClaimedDaily = 0;

  public constructor(
    private readonly menu: MenuController
  ) { super(); }

  public onStart(): void {
    this.janitor.Add(dataUpdate.connect((key, value) => {
      if (key !== "lastClaimedDaily") return;
      this.lastClaimedDaily = <number>value;
    }));

    this.menu.setPage("DailyRewards", true);
    const parentFrame = <Frame>this.instance.Parent;
    this.janitor.Add(parentFrame.GetPropertyChangedSignal("Visible").Connect(() => {
      if (parentFrame.Visible) return;
      // ui was closed, check if rewards were claimed
    }));

    task.spawn(() => {
      while (true) {
        this.update();
        task.wait(1);
      }
    });
  }

  private update(): void {
    const remainingSeconds = math.max((24 * 60 * 60) - (os.time() - this.lastClaimedDaily), 0);
    let formatted = toRemainingTime(remainingSeconds)
    if (formatted.size() === 0)
      formatted = "00:00:00";
    else if (formatted.size() <= 5) // 00:00, 5 characters
      formatted = `00:${formatted}`;

    this.instance.Clock.Countdown.Text = formatted;
  }
}