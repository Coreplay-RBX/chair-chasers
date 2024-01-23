import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import Object from "@rbxts/object-utils";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";

import type { UIBlurController } from "client/controllers/ui-blur-controller";

const { mapVotingStarted, closeMapVotingFrame, voteForMap } = Events;

@Component({
  tag: "MapVoting",
  ancestorWhitelist: [ PlayerGui ]
})
export class MapVoting extends BaseComponent<{}, PlayerGui["Menu"]["MapSelection"]> implements OnStart {
  public constructor(
    private readonly blur: UIBlurController
  ) { super(); }

  public onStart(): void {
    const main = this.instance.Main;
    const options = [main.Option1, main.Option2, main.Option3];

    this.maid.GiveTask(closeMapVotingFrame.connect(() => this.toggle(false)));
    this.maid.GiveTask(mapVotingStarted.connect(maps => {
      this.toggle(true);
      for (const i of Object.keys(maps)) {
        const option = options[i - 1];
        option.Select.MouseButton1Click.Connect(() => {
          voteForMap(i - 1);
          for (const otherOption of options)
            otherOption.Selected.Visible = otherOption === option;
        });
      }
    }));
  }

  private toggle(on: boolean) {
    this.instance.Visible = on;
    this.blur.toggle(on);
  }
}