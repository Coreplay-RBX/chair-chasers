import { Players, Workspace as World } from "@rbxts/services";

import changeChairSkin from "./change-chair-skin";

import { Assets } from "shared/utilities/helpers";
import Destroyable from "shared/utilities/destroyable";
import type EquippedItems from "shared/data-models/equipped-items";

import type { DataService } from "../data-service";

const CHAIR_MODEL = Assets.Models.Chairs["Basic Chair"];

export interface Chair extends Model {
  Seat: Seat;
}

export class ChairCollection extends Destroyable {
  public spawned = false;
  public collection: Chair[] = [];

  public constructor(
    private readonly data: DataService,
    private readonly map: GameMap,
    private size: number
  ) {

    super();
    this.spawn();
    this.janitor.Add(() => this.collection.clear());
  }

  public find(predicate: (chair: Chair, index: number) => boolean | undefined): Maybe<Chair> {
    return this.collection.find(predicate)
  }

  public getOutliers(playersInGame: Player[]): Player[] {
    const seatedPlayers = this.getSeatedPlayers(playersInGame);
    return playersInGame.filter(player => !seatedPlayers.includes(player));
  }

  public getSeatedPlayers(playersInGame: Player[]) {
    return playersInGame.filter(player => player.Character?.FindFirstChildOfClass("Humanoid")?.Sit);
  }

  public removeChair(chair: Chair): void {
    if (this.size <= 0) return;

    this.collection.remove(this.collection.indexOf(chair));
    chair.Destroy();
    this.size--;
  }

  public toggleAll(on: boolean): void {
    for (const chair of this.collection)
      task.spawn(() => {
        if (!chair.FindFirstChildOfClass("Seat")) return;
        chair.Seat.Disabled = !on
      });
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
        this.collection = this.collection.filter(c => c.Parent !== undefined);
        this.collection.push(chair);
      });

      const chairSpawns = <Part[]>this.map.ChairSpawns.GetChildren();
      const spawn = chairSpawns[math.random(0, chairSpawns.size() - 1)];
      const [_, chairSize] = chair.GetBoundingBox();
      const y = spawn.Position.Y - spawn.Size.Y + (chairSize.Y / 2);
      const mapPosition = this.map.GetPivot().Position;
      const lookAt = mapPosition.sub(new Vector3(0, mapPosition.Y - y, 0));

      chair.PivotTo(CFrame.lookAt(new Vector3(spawn.Position.X, y, spawn.Position.Z), lookAt));
      chair.Seat.Disabled = true;
      chair.Parent = World.LoadedMap.Chairs;
      this.collection.push(chair);
    }
  }
}