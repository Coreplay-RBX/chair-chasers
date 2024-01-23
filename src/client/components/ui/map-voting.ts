import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { Events } from "client/network";
import { PlayerGui } from "shared/utilities/client";
import Object from "@rbxts/object-utils";

const { mapVotingStarted } = Events;

@Component({
  tag: "MapVoting",
  ancestorWhitelist: [ PlayerGui ]
})
export class MapVoting extends BaseComponent<{}, PlayerGui["Menu"]["MapSelection"]> implements OnStart {
  public onStart(): void {
    const main = this.instance.Main;
    const options = [main.Option1, main.Option2, main.Option3];

    mapVotingStarted.connect(maps => {
      for (const [i, map] of Object.entries(maps)) {
        const optionLabel = options[i];
        optionLabel.Select.MouseButton1Click.Connect(() => {
          for (const option of options)
            option.Selected.Visible = option === optionLabel;
        });
      }
    });
  }
}