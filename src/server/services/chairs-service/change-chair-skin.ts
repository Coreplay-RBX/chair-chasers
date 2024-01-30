import { Workspace as World } from "@rbxts/services";

import { Assets } from "shared/utilities/helpers";
import type { Chair } from "./chair-circle";
import type ChairSkinName from "shared/data-models/chair-skin-name";

export default function changeChairSkin(chair: Model, occupant?: Humanoid, skinName: ChairSkinName = "Basic Chair"): Maybe<Chair> {
  if (chair.Name === skinName) return;
  const skinnedChair = Assets.Models.Chairs[skinName].Clone();
  skinnedChair.PivotTo(chair.GetPivot());
  skinnedChair.Parent = World.LoadedMap.Chairs;
  chair.Destroy();

  if (occupant)
    skinnedChair.Seat.Sit(occupant);

  return skinnedChair;
}