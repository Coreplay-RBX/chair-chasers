import { Service } from "@flamework/core";
import { Workspace as World } from "@rbxts/services";

import { Events } from "server/network";
import { toSeconds } from "shared/utilities/helpers";
import Log from "shared/logger";

import { ChairCircle } from "./chair-circle";
import changeChairSkin from "./change-chair-skin";

import type { GameService } from "../game-service";
import type { DataService } from "../data-services";
import type { EarningsService } from "../earnings-service";
import type { ServerSettingsService } from "../server-settings-service";

const { walkingAroundChairs, choosingChairs, eliminated, won } = Events;
const { rad, sin, cos, random } = math;

@Service()
export class ChairsService {
  private chairCircle?: ChairCircle
  private walkingAround = false;

  private readonly minWalkingLength: number;
  private readonly maxWalkingLength: number;
  private readonly choosingLength: number;

  public constructor(
    private readonly data: DataService,
    private readonly earnings: EarningsService,
    serverSettings: ServerSettingsService
  ) {

    this.minWalkingLength = toSeconds(serverSettings.get<string>("Chairs_MinimumWalkingLength"));
    this.maxWalkingLength = toSeconds(serverSettings.get<string>("Chairs_MaximumWalkingLength"));
    this.choosingLength = toSeconds(serverSettings.get<string>("Chairs_ChoosingLength"));
  }

  public beginGame(_game: GameService): void {
    if (!this.chairCircle) return;
    this.startWalking(_game);
  }

  public spawn(map: GameMap, amount: number): void {
    if (this.chairCircle) return;
    this.chairCircle = new ChairCircle(this.data, map, amount);
  }

  public cleanup(_game: GameService): void {
    this.chairCircle?.destroy();
    this.chairCircle = undefined;
    _game.conclude();
    Log.info("Cleaned up game of musical chairs");
  }

  private startWalking(_game: GameService): void {
    if (!this.chairCircle) return;

    this.walkingAround = true;
    this.chairCircle.toggleAll(false);

    const length = random(this.minWalkingLength, this.maxWalkingLength);
    task.delay(length, () => {
      this.stopWalkingPlayers(_game);
      this.startChoosing(_game);
    });

    task.spawn(() => {
      const center = World.LoadedMap.Environment!.ChairSpawn.Position;
      // HOW THE FUCK DO I WALK PLAYERS AROUND THIS SHIT
      // ill figure it out eventually lol
    });

    walkingAroundChairs.broadcast();
  }

  private stopWalkingPlayers(_game: GameService): void {
    this.walkingAround = false;

    _game.teleportPlayersToMap();
    for (const player of _game.playersInGame) {
      const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
      if (!humanoid) continue;

      humanoid.PlatformStand = false;
    }
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
    this.earnings.addWin(winner);

    const winnerName = winner.DisplayName !== winner.Name ? `${winner.DisplayName} (${winner.Name})` : winner.Name;
    won.broadcast(`${winnerName} has won the game!`);
  }

  private eliminateOutliers(_game: GameService): void {
    if (!this.chairCircle) return;

    const outliers = this.chairCircle.getOutliers(_game.playersInGame);
    eliminated(outliers);
    for (const player of this.chairCircle!.getSeatedPlayers(_game.playersInGame)) {
      const humanoid = player.Character!.FindFirstChildOfClass("Humanoid")!;
      const chair = this.chairCircle.chairs.find(chair => chair.Seat.Occupant === humanoid);
      if (chair)
        changeChairSkin(chair);

      humanoid.JumpPower = 50;
      humanoid.Jump = true;
    }

    for (const outlier of outliers) {
      _game.eliminatePlayer(outlier);
      this.chairCircle!.removeChair();
    }

    if (_game.playersInGame.size() < 1) { // game ending conditions
      task.delay(5, () => this.cleanup(_game));
      return won.broadcast("No one has won the game!");
    } else if (_game.playersInGame.size() === 1)
      return this.selectWinner(_game);

    task.delay(3, () => this.startWalking(_game));
  }
}