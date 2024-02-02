import { Service } from "@flamework/core";

import type EarningsHistory from "shared/data-models/earnings-history";

import type { DataService } from "./data-services";

@Service()
export class EarningsService {
  public constructor(
    private readonly data: DataService
  ) {}

  public addWin(player: Player): void {
    this.data.increment(player, "wins");
    this.track(player, 0, 1);
  }

  public addNotes(player: Player, amount: number): void {
    this.data.increment(player, "notes", amount);
    this.track(player, amount, 0);
  }

  private track(player: Player, notesEarned: number, winsEarned: number): void {
    const history = this.data.get<EarningsHistory[]>(player, "earningsHistory");
    history.push({
      notesEarned, winsEarned,
      timestamp: os.time()
    });

    this.data.set(player, "earningsHistory", history);
  }
}