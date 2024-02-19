import { Service } from "@flamework/core";

import type EarningsHistory from "shared/data-models/earnings-history";

import type { DataService } from "./data-service";

@Service()
export class EarningsService {
  public constructor(
    private readonly data: DataService
  ) {}

  public addWin(player: Player): void {
    this.data.increment(player, "wins");
    this.track(player, "wins");
  }

  public addNotes(player: Player, amount: number): void {
    this.data.increment(player, "notes", amount);
    this.track(player, "notes", amount);
  }

  private track(player: Player, key: TrackedDataKey, amount = 1): void {
    this.data.getTrackingStore(key).IncrementAsync(tostring(player.UserId), amount);
  }
}