import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ContentProvider } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { PlayerGui } from "shared/utilities/client";
import { removeDuplicates, flatten } from "shared/utilities/helpers";
import { tween } from "shared/utilities/ui";
import { TweenInfoBuilder } from "@rbxts/builders";

type Preloadable =
  | ImageLabel
  | ImageButton
  | Decal
  | Texture
  | MeshPart
  | FileMesh
  | Sound
  | Animation;

@Component({
  tag: "LoadScreen",
  ancestorWhitelist: [ PlayerGui ]
})
export class LoadScreen extends BaseComponent<{}, PlayerGui["LoadScreen"]> implements OnStart {
  private readonly janitor = new Janitor;

  public onStart(): void {
    const defaultStrokeTrans = this.instance.Main.Progress.Bar.UIStroke.Transparency;
    let alive = true;
    this.janitor.LinkToInstance(this.instance, false);
    this.janitor.Add(() => alive = false);
    this.instance.Enabled = true;
    this.instance.Main.Progress.Bar.Size = UDim2.fromScale(0, 1);
    this.instance.Main.Progress.Bar.UIStroke.Transparency = 1;

    task.spawn(() => {
      let dots = 0;
      while (alive) {
        this.instance.Main.Loading.Text = `LOADING${".".rep(dots + 1)}`;
        dots += 1;
        dots %= 4;
        task.wait(0.5);
      }
    });

    task.delay(0.5, () => {
      const idsToPreload = game.GetDescendants()
        .filter((instance): instance is Preloadable =>
          instance.IsA("ImageLabel") ||
          instance.IsA("ImageButton") ||
          instance.IsA("Decal") ||
          instance.IsA("Texture") ||
          instance.IsA("MeshPart") ||
          instance.IsA("FileMesh") ||
          instance.IsA("Sound") ||
          instance.IsA("Animation")
        )
        .map((preloadable): string | string[] => {
          if (preloadable.IsA("ImageLabel") || preloadable.IsA("ImageButton"))
            return preloadable.Image;
          else if (preloadable.IsA("Decal") || preloadable.IsA("Texture"))
            return preloadable.Texture;
          else if (preloadable.IsA("MeshPart"))
            return [preloadable.MeshId, preloadable.TextureID];
          else if (preloadable.IsA("FileMesh"))
            return preloadable.MeshId;
          else if (preloadable.IsA("Sound"))
            return preloadable.SoundId;
          else
            return preloadable.AnimationId;
        })
        .filterUndefined();

      const ids = removeDuplicates(flatten(idsToPreload));
      const totalAssets = ids.size();
      let assetNumber = 1;
      ContentProvider.PreloadAsync(ids, () => {
        const progress = assetNumber === 0 ? 0 : assetNumber / totalAssets;
        assetNumber += 1;

        this.instance.Main.Progress.Bar.UIStroke.Transparency = defaultStrokeTrans;
        tween(this.instance.Main.Progress.Bar, new TweenInfoBuilder().SetTime(0.1), {
          Size: UDim2.fromScale(progress, 1)
        }).Completed.Once(() => {
          if (assetNumber >= totalAssets)
            this.instance.Destroy();
        });
      });
    })
  }
}