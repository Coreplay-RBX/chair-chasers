import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ReplicatedFirst, SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";
import { toLongRemainingTime } from "shared/utilities/helpers";
import type { GameDataModel } from "shared/data-models/generic";
import Log from "shared/logger";

import type { MenuController } from "client/controllers/menu-controller";

const { dataUpdate, setData, incrementData } = Events;

const CURRENT_DAY_BUTTON = "rbxassetid://10160612244";
const DAY_BUTTON = "rbxassetid://10160670677";
const CURRENT_DAY_REWARDS_IMAGE = "rbxassetid://10160612511";
const DAY_REWARDS_IMAGE = "rbxassetid://10160678472";
const CURRENT_DAY_REWARDS_COLOR = Color3.fromRGB(255, 255, 255);
const CURRENT_DAY_TITLE_COLOR = Color3.fromRGB(89, 171, 40);
const DAY_COLOR = Color3.fromRGB(128, 79, 23);
const HOURS_IN_DAY = 24; // normal day length (obviously)
// const HOURS_IN_DAY = 0.004; // dis makes a day 15 seconds lol (for testing)

type Reward = [number, ExtractKeys<GameDataModel, number>];
type RewardList = Record<DayButtonName, Reward | Reward[]>;
type DayButtonName = "Day1" | "Day2" | "Day3" | "Day4" | "Day5";
type DayButton = DailyRewardButton | Omit<DailyRewardButton, "TextLabel">;

@Component({
  tag: "DailyRewardsPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class DailyRewards extends BaseComponent<{}, PlayerGui["Menu"]["DailyRewards"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly rewards = <RewardList>require(ReplicatedFirst.DailyRewards);
  private readonly rewardButtons: DayButton[] = [this.instance.Day1, this.instance.Day2, this.instance.Day3, this.instance.Day4, this.instance.Day5];
  private lastClaimedDaily = 0;
  private consecutiveLogins = 0;
  private currentRewardButton = <DayButton><unknown>undefined;

  private readonly parentFrame = <Frame>this.instance.Parent;

  public constructor(
    private readonly menu: MenuController
  ) { super(); }

  public onStart(): void {
    this.janitor.Add(dataUpdate.connect((key, value) => {
      if (key === "lastClaimedDaily") {
        this.lastClaimedDaily = <number>value;
        const daysSinceLastClaim = (os.time() - this.lastClaimedDaily) / 60 / 60 / HOURS_IN_DAY;
        if (daysSinceLastClaim >= 2)
          setData("consecutiveLogins", 0);
      } else if (key === "consecutiveLogins")
        this.consecutiveLogins = <number>value;
    }));

    const parentFrame = <Frame>this.instance.Parent;
    this.menu.setPage("DailyRewards", true);
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
    ReplicatedFirst.DailyRewards.Destroy();
  }

  private update(): void {
    const daysSinceLastClaim = (os.time() - this.lastClaimedDaily) / 60 / 60 / HOURS_IN_DAY;
    if (!this.parentFrame.Visible)
      if (daysSinceLastClaim >= 1)
        this.parentFrame.Visible = true;
      else
        return;

    this.selectRewardButton(this.rewardButtons[this.consecutiveLogins]);
    const remainingSeconds = math.max((HOURS_IN_DAY * 60 * 60) - (os.time() - this.lastClaimedDaily), 0);
    this.instance.Clock.Countdown.Text = `NEXT CHEST IN ${toLongRemainingTime(remainingSeconds)}`;
  }

  private selectRewardButton(button: DayButton) {
    if (!button) return;
    if (this.currentRewardButton === button) return;
    this.currentRewardButton = button;

    this.janitor.Add(button.MouseButton1Click.Connect(() => this.claimCurrentReward()));
    for (let otherButton of this.rewardButtons)
      task.spawn(() => {
        const current = button === otherButton;
        const isDay5Button = (b: DayButton): b is Omit<DailyRewardButton, "TextLabel"> => otherButton.Name === "Day5";
        if (isDay5Button(otherButton)) {
          // um idk what to do here yet
        } else {
          const dayButton = <DailyRewardButton>otherButton;
          dayButton.Image = current ? CURRENT_DAY_BUTTON : DAY_BUTTON;
          dayButton.TextLabel.TextColor3 = current ? CURRENT_DAY_TITLE_COLOR : DAY_COLOR;
          dayButton.Rewards.TextLabel.TextColor3 = current ? CURRENT_DAY_REWARDS_COLOR : DAY_COLOR;
          dayButton.Rewards.Image = current ? CURRENT_DAY_REWARDS_IMAGE : DAY_REWARDS_IMAGE;
        }
      });
  }

  private async claimCurrentReward(): Promise<void> {
    if (!this.canClaimCurrent()) return;

    const currentRewardButton = this.currentRewardButton;
    const rewards = this.rewards[<DayButtonName>currentRewardButton.Name];
    this.selectRewardButton(this.rewardButtons[this.consecutiveLogins + 1]);
    setData("lastClaimedDaily", os.time());
    incrementData("consecutiveLogins");

    if (typeOf(rewards[0]) === "table")
      for (const reward of <Reward[]>rewards)
        this.giveReward(reward);
    else
      this.giveReward(<Reward>rewards);

    Sound.CollectReward.Play();
    Log.info("Claimed daily reward!");
  }

  private giveReward(reward: Reward): void {
    const [amount, key] = reward;
    incrementData(key, amount);
  }

  private canClaimCurrent(): boolean {
    const daysSinceLastClaim = (os.time() - this.lastClaimedDaily) / 60 / 60 / HOURS_IN_DAY;
    return daysSinceLastClaim >= 1;
  }
}