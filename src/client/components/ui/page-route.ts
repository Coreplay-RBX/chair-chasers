import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import type { UIBlurController } from "client/controllers/ui-blur-controller";

interface Attributes {
  DestinationPage: string;
  Blur?: boolean;
}

@Component({ tag: "PageRoute" })
export class PageRoute extends BaseComponent<Attributes, GuiButton> implements OnStart {
  public constructor(
    private readonly blur: UIBlurController
  ) { super(); }

  public onStart(): void {
    this.instance.MouseButton1Click.Connect(() => {
      if (this.attributes.Blur !== undefined)
        this.blur.toggle(this.attributes.Blur);

      const pages = this.instance.FindFirstAncestorOfClass("ScreenGui")!
        .GetChildren()
        .filter((child): child is Frame => child.IsA("Frame"));
      for (const page of pages)
        task.spawn(() => page.Visible = page.Name === this.attributes.DestinationPage);
    });
  }
}