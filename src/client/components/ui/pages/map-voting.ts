import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
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
export class MapVotingPage extends BaseComponent<{}, PlayerGui["Menu"]["MapSelection"]> implements OnStart {
  private readonly main = this.instance.Main;
  private readonly options = [this.main.Option1, this.main.Option2, this.main.Option3];

  public constructor(
    private readonly menu: MenuController,
    private readonly blur: UIBlurController
  ) { super(); }

  public onStart(): void {
    this.maid.GiveTask(closeMapVotingFrame.connect(() => {
      this.menu.setPage("Buttons");
      this.toggle(false);
      this.reset();

      for (const option of this.options)
        option.MapViewport.FindFirstChildOfClass("Model")?.Destroy();
    }));

    this.maid.GiveTask(mapVotingStarted.connect(maps => {
      this.menu.hideAllPages();
      this.toggle(true);

      for (const [i, mapName] of Object.entries(maps)) {
        const option = this.options[i - 1];
        const previewMap = <GameMap>Assets.Maps.WaitForChild(mapName).Clone();
        const camera = new Instance("Camera");
        camera.Focus = <CFrame>previewMap.GetAttribute("ThumbnailFocus");
        camera.CFrame = <CFrame>previewMap.GetAttribute("ThumbnailCFrame");
        camera.FieldOfView = <number>previewMap.GetAttribute("ThumbnailFOV");
        previewMap.Parent = option.MapViewport;
        option.MapViewport.CurrentCamera = camera;

        option.Select.MouseButton1Click.Connect(() => {
          voteForMap(i - 1);
          for (const otherOption of this.options)
            otherOption.Selected.Visible = otherOption === option;
        });
      }
    }));
  }

  private reset(): void {
    for (const option of this.options)
      option.Selected.Visible = false;
  }

  private toggle(on: boolean) {
    this.instance.Visible = on;
    this.blur.toggle(on);
  }
}