import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {}

@Component({ tag: "WinsLeaderboard" })
export class WinsLeaderboard extends BaseComponent<Attributes, LeaderboardModel> implements OnStart {
  public onStart(): void {

  }
}