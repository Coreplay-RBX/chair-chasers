import { Controller, type OnInit } from "@flamework/core";
import { TweenInfoBuilder } from "@rbxts/builders";
import { Lighting, TweenService as Tween } from "@rbxts/services";
import { tween } from "shared/utilities/ui";

@Controller()
export class UIBlurController implements OnInit {
  private readonly effect = new Instance("BlurEffect", Lighting);

  public onInit(): void {
    this.toggle(false);
  }

  public toggle(on: boolean): void {
    const info = new TweenInfoBuilder()
      .SetTime(0.4)
      .SetEasingStyle(Enum.EasingStyle.Quad);

    tween(this.effect, info, {
      Size: on ? 24 : 0
    });
  }
}