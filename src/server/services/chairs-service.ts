import { Service } from "@flamework/core";
import { Players, Workspace as World } from "@rbxts/services";

import { Assets, toSeconds } from "shared/utilities/helpers";
import Destroyable from "shared/utilities/destroyable";
import type EquippedItems from "shared/data-models/equipped-items";
import type ChairSkinName from "shared/data-models/chair-skin-name";

import type { GameService } from "./game-service";
import type { DataService } from "./data-services";
import type { ServerSettingsService } from "./server-settings-service";
import Log from "shared/logger";

const { rad, sin, cos, random } = math;

const CHAIR_MODEL = Assets.Models.Chairs["Basic Chair"];

interface Chair extends Model {
  Seat: Seat;
}

function changeChairSkin(chair: Chair, occupant?: Humanoid, skinName: ChairSkinName = "Basic Chair"): void {
  const skinnedChair = Assets.Models.Chairs[skinName].Clone();
  skinnedChair.PivotTo(chair.GetPivot())
  skinnedChair.Parent = World.LoadedMap.Chairs;
  chair.Seat.FindFirstChild("SeatWeld")?.Destroy();
  chair.Destroy();

  if (occupant)
    skinnedChair.Seat.Sit(occupant);
}

class ChairCircle extends Destroyable {
  public spawned = false;
  private readonly chairs: Chair[] = []

  public constructor(
    private readonly data: DataService,
    private readonly map: GameMap,
    private size: number
  ) {

    super();
    this.spawn();
    this.janitor.Add(() => this.chairs.clear());
  }

  public getOutliers(playersInGame: Player[]): Player[] {
    const seatedPlayers = this.chairs
      .filter(chair => chair.Seat.Occupant !== undefined)
      .map(chair => chair.Seat.Occupant!)
      .filter(occupant => occupant.FindFirstAncestorOfClass("Model") !== undefined)
      .map(occupant => occupant.FindFirstAncestorOfClass("Model")!)
      .filter(character => Players.GetPlayerFromCharacter(character) !== undefined)
      .map(character => Players.GetPlayerFromCharacter(character)!);

    return playersInGame.filter(player => !seatedPlayers.includes(player));
  }

  public removeChair(): void {
    if (this.size <= 1) return;

    const chair = this.chairs.shift()!;
    chair.Destroy();
    this.update();
    this.size--;
  }

  public toggleAll(on: boolean): void {
    for (const chair of this.chairs)
      task.spawn(() => chair.Seat.Disabled = !on);
  }

  private spawn(): void {
    this.spawned = true;

    for (let i = 0; i < this.size; i++) {
      const chair = this.janitor.Add(CHAIR_MODEL.Clone());
      chair.Seat.GetPropertyChangedSignal("Occupant").Connect(() => {
        const occupant = chair.Seat.Occupant;
        if (!occupant)
          return changeChairSkin(chair);

        const character = occupant.FindFirstAncestorOfClass("Model");
        const player = Players.GetPlayerFromCharacter(character);
        if (!player) return;

        const equipped = this.data.get<EquippedItems>(player, "equippedItems");
        changeChairSkin(chair, occupant, equipped.chairSkin)
      });

      chair.Seat.Disabled = true;
      chair.Parent = World.LoadedMap.Chairs;
      this.chairs.push(chair);
    }

    this.update();
  }

  private update(): void {
    const angleIncrement = 360 / this.chairs.size();
    const radius = this.map.ChairSpawn.Size.X;

    for (const chair of this.chairs)
      task.spawn(() => {
        const i = this.chairs.indexOf(chair);
        const angle = rad(i * angleIncrement);
        const newX = cos(angle) * radius;
        const newZ = sin(angle) * radius;
        const cf = new CFrame(newX, 0, newZ).mul(CFrame.Angles(0, angle, 0));
        chair.PivotTo(cf);
      });
  }
}

const enum MusicalChairsState {
  Walking,
  Choosing
}

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
    this.startWalking(_game);
    Log.info("Began game of musical chairs");
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
    Log.info("Walking around chairs...");
  }

  private startChoosing(_game: GameService): void {
    if (!this.chairCircle) return;

    this.chairCircle.toggleAll(true);
    task.delay(this.choosingLength, () => {
      if (!this.chairCircle) return;
      if (_game.playersInGame.size() > 1)
        this.eliminateOutliers(_game);
      else {
        // winner winner chicken dinner
        const [winner] = _game.playersInGame;
        task.delay(5, () => this.cleanup(_game));
        Log.info(`${winner} has won the game!`);
      }
    });

    Log.info("Choosing chairs...");
  }

  private eliminateOutliers(_game: GameService): void {
    if (!this.chairCircle) return;

    const outliers = this.chairCircle.getOutliers(_game.playersInGame);
    for (const outlier of outliers)
      task.spawn(() => _game.eliminatePlayer(outlier));

    task.delay(3, () => {
      this.startWalking(_game);
      for (const player of _game.playersInGame)
        player.Character!.FindFirstChildOfClass("Humanoid")!.Jump = true;
    });

    Log.info(`Eliminated outliers: ${outliers.map(p => p.Name).join(", ")}`);
  }
}