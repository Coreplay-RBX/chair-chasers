import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import Object from "@rbxts/object-utils";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";

import type { MenuController } from "client/controllers/menu-controller";
import type { UIBlurController } from "client/controllers/ui-blur-controller";
import { Assets } from "shared/utilities/helpers";

const { mapVotingStarted, closeMapVotingFrame, voteForMap } = Events;

@Component({
  tag: "MapVotingPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class MapVotingPage extends BaseComponent<{}, PlayerGui["Menu"]["MapSelection"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly options = [this.instance.Option1, this.instance.Option2, this.instance.Option3];

  public constructor(
    private readonly menu: MenuController
  ) { super(); }

  public onStart(): void {
    this.janitor.Add(closeMapVotingFrame.connect(() => {
      this.menu.setPage("Buttons", false);
      this.reset();

      for (const option of this.options)
        option.MapViewport.FindFirstChildOfClass("Model")?.Destroy();
    }));

    this.janitor.Add(mapVotingStarted.connect(maps => {
      if (this.menu.isPageOpen("DailyRewards")) return;
      this.menu.setPage("MapSelection", true);

      for (const [i, mapName] of Object.entries(maps))
        task.spawn(() => {
          const option = this.options[i - 1];
          const previewMap = <GameMap>Assets.Maps.WaitForChild(mapName).Clone();
          const camera = new Instance("Camera");
          camera.CFrame = <CFrame>previewMap.GetAttribute("ThumbnailCFrame");
          camera.FieldOfView = <number>previewMap.GetAttribute("ThumbnailFOV");
          previewMap.Parent = option.MapViewport;
          option.MapViewport.CurrentCamera = camera;

          option.Select.MouseButton1Click.Connect(() => {
            voteForMap(i - 1);
            for (const otherOption of this.options)
              otherOption.Selected.Visible = otherOption === option;
          });
        });
    }));
  }

  private reset(): void {
    for (const option of this.options)
      option.Selected.Visible = false;
  }
}