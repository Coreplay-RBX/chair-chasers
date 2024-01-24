import { Controller } from "@flamework/core";
import { PlayerGui } from "shared/utilities/client";

export type PageName = ExtractKeys<PlayerGui["Menu"], Frame>;

@Controller()
export class MenuController {
  private readonly screen = <PlayerGui["Menu"]>PlayerGui.WaitForChild("Menu");
  private readonly pages = this.screen
    .GetChildren()
    .filter((child): child is Frame => child.IsA("Frame"));

  public hideAllPages(): void {
    for (const page of this.pages)
      task.spawn(() => page.Visible = false);
  }

  public setPage(pageName: PageName) {
    for (const page of this.pages)
      task.spawn(() => page.Visible = page.Name === pageName);
  }
}