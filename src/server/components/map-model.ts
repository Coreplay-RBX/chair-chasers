import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
  ThumbnailCFrame?: CFrame;
  ThumbnailFocus?: CFrame;
  ThumbnailFOV?: number;
}

@Component({ tag: "MapModel" })
export class MapModel extends BaseComponent<Attributes, GameMap> implements OnStart {
  public onStart(): void {
    const camera = this.instance.Thumbnail;
    this.attributes.ThumbnailCFrame = camera.CFrame;
    this.attributes.ThumbnailFOV = camera.FieldOfView;
    this.attributes.ThumbnailFocus = camera.Focus;
  }
}