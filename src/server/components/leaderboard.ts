import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Players } from "@rbxts/services";

import { Assets, commaFormat, toSeconds } from "shared/utilities/helpers";
import type EarningsHistory from "shared/data-models/earnings-history";

import type { DataService } from "server/services/data-service";
import type { ServerSettingsService } from "server/services/server-settings-service";

const TOP_PLAYERS_SHOWN = 50; // top 50, top 100, etc

interface LeaderboardEntry {
  readonly playerID: number,
  readonly dataType: TrackedDataKey,
  readonly dataValue: number;
}

interface LeaderboardScreen extends SurfaceGui {
  Scroller: ScrollingFrame;
}

@Component({ tag: "Leaderboard" })
export class Leaderboard extends BaseComponent<{}, LeaderboardModel> implements OnStart {
  private readonly dataType: TrackedDataKey = this.instance.Name === "WinsLeaderboard" ? "wins" : "notes";

  public constructor(
    private readonly data: DataService,
    private readonly serverSettings: ServerSettingsService
  ) { super(); }

  public onStart(): void {


    const refreshRate = toSeconds(<string>this.serverSettings.get("Leaderboard_RefreshRate"));
    task.spawn(() => {
      while (true) {
        this.update();
        task.wait(refreshRate);
      }
    });
  }

  private update(): void {
    const allTime = this.getTopAllTime();
    const monthly = this.getTopMonthly();
    const weekly = this.getTopWeekly();
    const allTimeUI = this.createUI(this.instance.AllTime);
    const monthlyUI = this.createUI(this.instance.Monthly);
    const weeklyUI = this.createUI(this.instance.Weekly);
    this.updateScreen(allTime, allTimeUI);
    this.updateScreen(monthly, monthlyUI);
    this.updateScreen(weekly, weeklyUI);
  }

  private updateScreen(entries: LeaderboardEntry[], screen: LeaderboardScreen) {
    this.clearScreenEntries(screen);
    for (const entry of entries) {
      const index = entries.indexOf(entry);
      task.spawn(() => {
        const frame = Assets.UI.LeaderboardEntry.Clone();
        frame.Avatar.Image = Players.GetUserThumbnailAsync(entry.playerID, Enum.ThumbnailType.AvatarBust, Enum.ThumbnailSize.Size100x100)[0];
        frame.PlayerName.Text = Players.GetNameFromUserIdAsync(entry.playerID);
        frame.Rank.Text = `#${commaFormat(index + 1)}`
        frame.Value.Text = `${commaFormat(entry.dataValue)} ${entry.dataType}`;
        frame.LayoutOrder = index;
        frame.Parent = screen.Scroller;
      });
    }
  }

  private clearScreenEntries(screen: LeaderboardScreen): void {
    task.spawn(() => {
      const entries = screen.Scroller.GetChildren()
        .filter(instance => instance.IsA("Frame"));

      for (const entry of entries)
        entry.Destroy();
    });
  }

  private createUI(parent: Part): LeaderboardScreen {
    print("created ui for", parent.GetFullName())
    const ui = new Instance("SurfaceGui");
    ui.Name = "Screen";
    ui.Adornee = parent;
    ui.Face = Enum.NormalId.Right

    const scroller = new Instance("ScrollingFrame");
    scroller.Name = "Scroller";
    scroller.BorderSizePixel = 0;
    scroller.BackgroundTransparency = 1;
    scroller.VerticalScrollBarInset = Enum.ScrollBarInset.Always;
    scroller.ScrollingDirection = Enum.ScrollingDirection.Y;
    scroller.ScrollBarImageColor3 = new Color3();
    scroller.ScrollBarThickness = 16;
    scroller.CanvasSize = UDim2.fromScale(0, 3);
    scroller.Size = UDim2.fromScale(1, 1);
    scroller.Parent = ui;

    const listLayout = new Instance("UIListLayout");
    listLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center;
    listLayout.Padding = new UDim(0, 5);
    listLayout.Parent = scroller;

    const padding = new Instance("UIPadding");
    padding.PaddingBottom = new UDim(0, 10);
    padding.PaddingLeft = new UDim(0, 15);
    padding.PaddingRight = new UDim(0, 15);
    padding.PaddingTop = new UDim(0, 10);
    padding.Parent = scroller;

    ui.Parent = parent;
    return <LeaderboardScreen>ui;
  }

  private getTopMonthly(): LeaderboardEntry[] {
    return this.getTopTimed(30);
  }

  private getTopWeekly(): LeaderboardEntry[] {
    return this.getTopTimed(7);
  }

  private getTopAllTime(): LeaderboardEntry[] {
    const historyStore = this.data.getEarningsHistoryStore();
    const allUserIDs = this.data.getTrackedUserIDs();
    const allTime: LeaderboardEntry[] = [];

    for (const userID of allUserIDs) {
      const allHistory = historyStore.GetAsync<EarningsHistory[]>(tostring(userID))[0]!;
      const allTimeEarnings = allHistory.reduce((sum, history) => sum + history[this.dataType], 0);
      allTime.push({
        playerID: userID,
        dataType: this.dataType,
        dataValue: allTimeEarnings
      });
    }

    return allTime
      .sort((a, b) => a.dataValue > b.dataValue)
      .filter((_, i) => i < TOP_PLAYERS_SHOWN);
  }

  private getTopTimed(days: number): LeaderboardEntry[] {
    const historyStore = this.data.getEarningsHistoryStore();
    const allUserIDs = this.data.getTrackedUserIDs();
    const allTimed: LeaderboardEntry[] = [];

    for (const userID of allUserIDs) {
      const allHistory = historyStore.GetAsync<EarningsHistory[]>(tostring(userID))[0]!;
      const timedHistory = allHistory.filter(history => {
        const now = os.time();
        const diff = now - history.timestamp;
        const dayDiff = diff / 60 / 24;
        return dayDiff <= days;
      });

      const timedEarnings = timedHistory.reduce((sum, history) => sum + history[this.dataType], 0);
      allTimed.push({
        playerID: userID,
        dataType: this.dataType,
        dataValue: timedEarnings
      });
    }

    return allTimed
      .sort((a, b) => a.dataValue > b.dataValue)
      .filter((_, i) => i < TOP_PLAYERS_SHOWN);
  }
}