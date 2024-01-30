import { Players, Workspace as World } from "@rbxts/services";

import changeChairSkin from "./change-chair-skin";

import { Assets } from "shared/utilities/helpers";
import Destroyable from "shared/utilities/destroyable";
import type EquippedItems from "shared/data-models/equipped-items";

import type { DataService } from "../data-services";

const CHAIR_MODEL = Assets.Models.Chairs["Basic Chair"];

const { rad, sin, cos } = math;

export interface Chair extends Model {
  Seat: Seat;
}

export class ChairCircle extends Destroyable {
  public spawned = false;
  public chairs: Chair[] = [];

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
    const seatedPlayers = this.getSeatedPlayers(playersInGame);
    return playersInGame.filter(player => !seatedPlayers.includes(player));
  }

  public getSeatedPlayers(playersInGame: Player[]) {
    return playersInGame.filter(player => player.Character?.FindFirstChildOfClass("Humanoid")?.Sit);
  }

  public removeChair(): void {
    if (this.size <= 0) return;

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
      let chair = this.janitor.Add(CHAIR_MODEL.Clone());
      chair.Seat.GetPropertyChangedSignal("Occupant").Connect(() => {
        const occupant = chair.FindFirstChildOfClass("Seat")?.Occupant;
        if (!occupant) return;

        occupant.JumpPower = 0;
        const character = occupant.FindFirstAncestorOfClass("Model");
        const player = Players.GetPlayerFromCharacter(character);
        if (!player) return;

        const equipped = this.data.get<EquippedItems>(player, "equippedItems");
        const skinnedChair = changeChairSkin(chair, occupant, equipped.chairSkin)!;
        chair = skinnedChair ? this.janitor.Add(skinnedChair) : chair;
        this.chairs = this.chairs.filter(c => c.Parent !== undefined);
        this.chairs.push(chair);
      });

      chair.Seat.Disabled = true;
      chair.Parent = World.LoadedMap.Chairs;
      this.chairs.push(chair);
    }

    this.update();
  }

  private update(): void {
    const angleIncrement = 360 / this.chairs.size();
    const radius = this.map.ChairSpawn.Size.X / 2;
    const centerHeight = this.map.ChairSpawn.Size.Y;
    const center = this.map.ChairSpawn.Position;

    for (const chair of this.chairs)
      task.spawn(() => {
        const i = this.chairs.indexOf(chair) + 1;
        const angle = rad(i * angleIncrement);
        const newX = center.X + cos(angle) * radius;
        const newZ = center.Z - sin(angle) * radius;

        const [_, chairSize] = chair.GetBoundingBox();
        const newY = center.Y - (centerHeight / 2) + (chairSize.Y / 2);
        const cf = new CFrame(new Vector3(center.X, newY, center.Z), new Vector3(newX, newY, newZ))
          .mul(CFrame.Angles(0, rad(180), 0));

        chair.PivotTo(cf.add(cf.LookVector.mul(this.chairs.size() - 1)));
      });
  }
}
