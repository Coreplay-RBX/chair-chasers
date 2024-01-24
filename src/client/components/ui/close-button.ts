import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";

import type { UIBlurController } from "client/controllers/ui-blur-controller";

@Component({
  tag: "CloseButton",
  ancestorWhitelist: [ PlayerGui ]
})
export class CloseButton extends BaseComponent<{}, GuiButton> implements OnStart {
  public constructor(
    private readonly blur: UIBlurController
  ) { super(); }

  public onStart(): void {
    this.maid.GiveTask(this.instance.MouseButton1Click.Connect(() => {
      const parentFrame = this.instance.FindFirstAncestorOfClass("Frame")!;
      parentFrame.Visible = false;
      (<PlayerGui["Menu"]>parentFrame.Parent).Buttons.Visible = true;
      this.blur.toggle(false);
    }));
  }
}