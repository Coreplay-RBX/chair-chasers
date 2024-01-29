import { Service } from "@flamework/core";

import { Events } from "server/network";
import { toSeconds } from "shared/utilities/helpers";
import Log from "shared/logger";

import { ChairCircle } from "../classes/chair-circle";
import type { GameService } from "./game-service";
import type { DataService } from "./data-services";
import type { ServerSettingsService } from "./server-settings-service";

const { walkingAroundChairs, choosingChairs, eliminated, won } = Events;
const { random } = math;

@Service()
export class ChairsService {
  private chairCircle?: ChairCircle

  private readonly minWalkingLength: number;
  private readonly maxWalkingLength: number;
  private readonly choosingLength: number;

  public constructor(
    private readonly data: DataService,
    serverSettings: ServerSettingsService
  ) {

    this.minWalkingLength = toSeconds(serverSettings.get<string>("Chairs_MinimumWalkingLength"));
    this.maxWalkingLength = toSeconds(serverSettings.get<string>("Chairs_MaximumWalkingLength"));
    this.choosingLength = toSeconds(serverSettings.get<string>("Chairs_ChoosingLength"));
  }

  public beginGame(_game: GameService): void {
    if (!this.chairCircle) return;
    Log.info("Began game of musical chairs");
    this.startWalking(_game);
  }

  public spawn(map: GameMap, amount: number): void {
    if (this.chairCircle) return;
    this.chairCircle = new ChairCircle(this.data, map, amount);
    Log.info("Spawned chair circle");
  }

  public cleanup(_game: GameService): void {
    this.chairCircle?.destroy();
    this.chairCircle = undefined;
    _game.conclude();
    Log.info("Cleaned up game of musical chairs");
  }

  private startWalking(_game: GameService): void {
    if (!this.chairCircle) return;

    this.chairCircle.toggleAll(false);
    const length = random(this.minWalkingLength, this.maxWalkingLength);
    task.delay(length, () => this.startChoosing(_game));
    walkingAroundChairs.broadcast();
  }

  private startChoosing(_game: GameService): void {
    if (!this.chairCircle) return;

    this.chairCircle.toggleAll(true);
    task.delay(this.choosingLength, () => {
      if (!this.chairCircle) return;
      if (_game.playersInGame.size() > 1)
        this.eliminateOutliers(_game);
      else
        this.selectWinner(_game);
    });

    choosingChairs.broadcast();
  }

  private selectWinner(_game: GameService) {
    const [winner] = _game.playersInGame;
    task.delay(5, () => this.cleanup(_game));
    won.broadcast(`${winner.DisplayName} (${winner.Name}) has won the game!`);
  }

  private eliminateOutliers(_game: GameService): void {
    if (!this.chairCircle) return;

    const outliers = this.chairCircle.getOutliers(_game.playersInGame);
    eliminated(outliers);
    for (const player of this.chairCircle!.getSeatedPlayers(_game.playersInGame))
      player.Character!.FindFirstChildOfClass("Humanoid")!.Jump = true;

    for (const outlier of outliers) {
      _game.eliminatePlayer(outlier);
      this.chairCircle!.removeChair();
    }

    Log.info(`Eliminated outliers: ${outliers.map(p => p.Name).join(", ")}`);
    if (_game.playersInGame.size() < 1) { // game ending conditions
      task.delay(5, () => this.cleanup(_game));
      return Log.info(`No one has won the game.`);
    } else if (_game.playersInGame.size() === 1)
      return this.selectWinner(_game);

    task.delay(3, () => this.startWalking(_game));
  }
}