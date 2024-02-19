import { Service } from "@flamework/core";

import type { DataService } from "./data-service";

@Service()
export class EarningsService {
  public constructor(
    private readonly data: DataService
  ) {}

  public addWin(player: Player): void {
    this.trackGain(player, "wins");
  }

  public addNotes(player: Player, amount: number): void {
    this.trackGain(player, "notes", amount);
  }

  private trackGain(player: Player, key: TrackedDataKey, amount = 1): void {
    this.data.increment(player, key, amount);
    this.data.addEarningsHistory(player, {
      notes: key === "notes" ? amount : 0,
      wins: key === "wins" ? amount : 0,
      timestamp: os.time()
    });
  }
}