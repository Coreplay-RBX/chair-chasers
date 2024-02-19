import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import type { DataService } from "server/services/data-service";

const TOP_PLAYERS_SHOWN = 50; // top 50, top 100, etc

type LeaderboardDataType = "wins" | "notes";
interface LeaderboardEntry {
  readonly player: Player,
  readonly dataType: LeaderboardDataType,
  readonly dataValue: number;
}

@Component({ tag: "Leaderboard" })
export class Leaderboard extends BaseComponent<{}, LeaderboardModel> implements OnStart {
  private readonly dataType: LeaderboardDataType = this.instance.Name === "WinsLeaderboard" ? "wins" : "notes";

  public constructor(
    private readonly data: DataService
  ) { super(); }

  public onStart(): void {

  }

  private update(): void {

  }

  private getTopWeekly(): LeaderboardEntry[] {
    const allUserIDs = this.data.getStoredUserIDs(TOP_PLAYERS_SHOWN);
    return [];
  }
}