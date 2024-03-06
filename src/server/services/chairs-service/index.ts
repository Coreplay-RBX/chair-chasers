import { Service } from "@flamework/core";
import { Workspace as World } from "@rbxts/services";

import { Events } from "server/network";
import { reverse, slice, toSeconds } from "shared/utilities/helpers";
import Log from "shared/logger";

import { ChairCollection } from "./chair-collection";

import type { GameService } from "../game-service";
import type { DataService } from "../data-service";
import type { EarningsService } from "../earnings-service";
import type { ServerSettingsService } from "../server-settings-service";

const { walkingAroundChairs, choosingChairs, eliminated, won } = Events;
const { floor } = math;

@Service()
export class ChairsService {
  private readonly roamingLength = 5;
  private readonly choosingLength: number;
  private chairs?: ChairCollection

  public constructor(
    private readonly data: DataService,
    private readonly earnings: EarningsService,
    serverSettings: ServerSettingsService
  ) {

    this.choosingLength = toSeconds(serverSettings.get<string>("Chairs_ChoosingLength"));
  }

  public beginGame(_game: GameService): void {
    this.startWalking(_game);
  }

  public spawn(_game: GameService): void {
    if (this.chairs) {
      this.chairs.destroy();
      this.chairs = undefined;
    }

    this.chairs = new ChairCollection(this, _game, this.data);
  }

  public cleanup(_game: GameService): void {
    this.chairs?.destroy();
    this.chairs = undefined;
    _game.conclude();
    Log.info("Cleaned up game of musical chairs");
  }

  public selectWinner(_game: GameService) {
    const [winner] = _game.playersInGame;
    _game.placement.push(winner);

    const topPlayerAmount = 5;
    const topReward = 150; // notes
    const topPlayers = reverse(slice(_game.placement, -topPlayerAmount));
    this.earnings.addWin(winner);
    for (const player of topPlayers) {
      const placement = topPlayers.indexOf(player) + 1;
      const reward = floor(topReward / placement);
      this.earnings.addNotes(player, reward)
    }

    const winnerName = winner.DisplayName !== winner.Name ? `${winner.DisplayName} (${winner.Name})` : winner.Name;
    won.broadcast(`${winnerName} has won the game!`);
    task.delay(5, () => this.cleanup(_game));
  }

  public eliminateOutliers(_game: GameService): void {
    if (!this.chairs) return;

    const outliers = this.chairs.getOutliers(_game.playersInGame);
    eliminated(outliers);
    for (const outlier of outliers)
      _game.eliminatePlayer(outlier);

    for (const player of this.chairs!.getSeatedPlayers(_game.playersInGame)) {
      const humanoid = player.Character!.FindFirstChildOfClass("Humanoid")!;
      humanoid.JumpPower = 50;
      humanoid.Jump = true;

      const chair = this.chairs.find(chair => chair.Seat.Occupant === humanoid)!;
      this.chairs!.removeChair(chair);
    }

    _game.roundEnded.Fire();
    if (_game.playersInGame.size() < 1) { // game ending conditions
      task.delay(5, () => this.cleanup(_game));
      return won.broadcast("No one has won the game!");
    } else if (_game.playersInGame.size() === 1)
      return this.selectWinner(_game);

    task.delay(3, () => this.startWalking(_game)); // if game isn't over, continue the cycle
  }

  private startWalking(_game: GameService): void {
    task.delay(this.roamingLength, () => {
      this.stopWalkingPlayers(_game);
      this.startChoosing(_game);
    });

    walkingAroundChairs.broadcast();
  }

  private stopWalkingPlayers(_game: GameService): void {
    for (const player of _game.playersInGame) {
      const humanoid = player.Character?.FindFirstChildOfClass("Humanoid");
      if (!humanoid) continue;

      humanoid.PlatformStand = false;
    }
  }

  private startChoosing(_game: GameService): void {
    this.spawn(_game);
    task.delay(this.choosingLength, () => {
      if (!this.chairs) return;
      if (_game.playersInGame.size() > 1)
        this.eliminateOutliers(_game);
      else
        this.selectWinner(_game);
    });

    choosingChairs.fire(_game.playersInGame);
  }
}