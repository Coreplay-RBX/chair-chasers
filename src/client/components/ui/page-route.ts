import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";

import type { MenuController, PageName } from "client/controllers/menu-controller";
import type { UIBlurController } from "client/controllers/ui-blur-controller";

interface Attributes {
  DestinationPage: PageName;
  Blur?: boolean;
}

@Component({
  tag: "PageRoute",
  ancestorWhitelist: [ PlayerGui ]
})
export class PageRoute extends BaseComponent<Attributes, GuiButton> implements OnStart {
  public constructor(
    private readonly menu: MenuController,
    private readonly blur: UIBlurController
  ) { super(); }

  public onStart(): void {
    this.instance.MouseButton1Click.Connect(() => {
      this.menu.setPage(this.attributes.DestinationPage);
      if (this.attributes.Blur !== undefined)
        this.blur.toggle(this.attributes.Blur);
    });
  }
}