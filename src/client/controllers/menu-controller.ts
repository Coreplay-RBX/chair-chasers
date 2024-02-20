import { Controller } from "@flamework/core";
import { PlayerGui } from "shared/utilities/client";

import type { UIBlurController } from "./ui-blur-controller";

export type PageName = ExtractKeys<PlayerGui["Menu"], Frame>;

@Controller()
export class MenuController {
  private readonly screen = <PlayerGui["Menu"]>PlayerGui.WaitForChild("Menu");
  private readonly pages = this.screen
    .GetChildren()
    .filter((child): child is Frame => child.IsA("Frame"));

  public constructor(
    private readonly blur: UIBlurController
  ) {}

  public isPageOpen(pageName: PageName): boolean {
    return this.pages.find(page => page.Name === pageName)?.Visible === true;
  }

  public hideAllPages(): void {
    for (const page of this.pages)
      task.spawn(() => page.Visible = false);
  }

  public setPage(pageName: PageName, blur?: boolean) {
    for (const page of this.pages)
      task.spawn(() => page.Visible = page.Name === pageName);

    if (blur !== undefined)
      this.blur.toggle(blur);
  }
}