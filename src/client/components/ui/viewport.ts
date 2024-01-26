import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

import { PlayerGui } from "shared/utilities/client";
import type { ViewportCameraController } from "client/controllers/viewport-camera-controller";

@Component({
  tag: "Viewport",
  ancestorWhitelist: [ PlayerGui ]
})
export class Viewport extends BaseComponent<{}, ViewportFrame> implements OnStart {
  public constructor(
    private readonly viewportCamera: ViewportCameraController
  ) { super(); }

  public onStart(): void {
    const viewportCamera = this.viewportCamera.createGeneric();
    this.instance.CurrentCamera = viewportCamera;
    viewportCamera.Parent = this.instance;
  }
}