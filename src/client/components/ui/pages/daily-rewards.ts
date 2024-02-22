import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";

import type { MenuController } from "client/controllers/menu-controller";
import { toRemainingTime } from "shared/utilities/helpers";
import Log from "shared/logger";

const { dataUpdate, setData } = Events;

const CURRENT_DAY_BUTTON = "rbxassetid://10160612244";
const DAY_BUTTON = "rbxassetid://10160670677";
const CURRENT_DAY_REWARDS_IMAGE = "rbxassetid://10160612511";
const DAY_REWARDS_IMAGE = "rbxassetid://10160678472";
const CURRENT_DAY_REWARDS_COLOR = Color3.fromRGB(255, 255, 255);
const CURRENT_DAY_TITLE_COLOR = Color3.fromRGB(89, 171, 40);
const DAY_COLOR = Color3.fromRGB(169, 100, 27);

type DayButton = DailyRewardButton | Omit<DailyRewardButton, "TextLabel">;

// TODO: if page is closed without claiming rewards, auto-claim them

@Component({
  tag: "DailyRewardsPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class DailyRewards extends BaseComponent<{}, PlayerGui["Menu"]["DailyRewards"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly rewardButtons: DayButton[] = [this.instance.Day1, this.instance.Day2, this.instance.Day3, this.instance.Day4, this.instance.Day5];
  private lastClaimedDaily = 0;
  private currentRewardButton = this.rewardButtons[0];

  public constructor(
    private readonly menu: MenuController
  ) { super(); }

  public onStart(): void {
    this.janitor.Add(dataUpdate.connect((key, value) => {
      if (key === "lastClaimedDaily")
        this.lastClaimedDaily = <number>value;
      else if (key === "consecutiveLogins") {
        this.currentRewardButton = this.rewardButtons[<number>value];
        this.selectRewardButton(this.currentRewardButton);
      }
    }));

    this.menu.setPage("DailyRewards", true);
    const parentFrame = <Frame>this.instance.Parent;
    this.janitor.Add(parentFrame.GetPropertyChangedSignal("Visible").Connect(() => {
      if (parentFrame.Visible) return;
      this.claimCurrentReward();
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

    this.instance.Clock.Countdown.Text = `NEXT CHEST IN ${formatted}`;
  }

  private selectRewardButton(button: DayButton) {
    this.janitor.Add(button.MouseButton1Click.Once(() => this.claimCurrentReward()));
    for (let otherButton of this.rewardButtons) {
      const current = button === otherButton;
      const isDay5Button = (b: DayButton): b is Omit<DailyRewardButton, "TextLabel"> => otherButton.Name === "Day5";
      if (isDay5Button(otherButton)) {

      } else {
        const dayButton = <DailyRewardButton>otherButton;
        dayButton.Image = current ? CURRENT_DAY_BUTTON : DAY_BUTTON;
        dayButton.TextLabel.TextColor3 = current ? CURRENT_DAY_TITLE_COLOR : DAY_COLOR;
        dayButton.Rewards.TextLabel.TextColor3 = current ? CURRENT_DAY_REWARDS_COLOR : DAY_COLOR;
        dayButton.Rewards.Image = current ? CURRENT_DAY_REWARDS_IMAGE : DAY_REWARDS_IMAGE;
      }
    }
  }

  private claimCurrentReward(): void {
    if (!this.canClaimCurrent()) return;
    setData("lastClaimedDaily", os.time());
    Sound.CollectReward.Play();
    Log.info("Claimed daily reward!");
  }

  private canClaimCurrent(): boolean {
    const daysSinceLastClaim = (os.time() - this.lastClaimedDaily) / 60 / 60 / 24;
    return daysSinceLastClaim >= 1
  }
}