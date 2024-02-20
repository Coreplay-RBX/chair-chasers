import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { SoundService as Sound } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

import { PlayerGui } from "shared/utilities/client";

@Component({
  tag: "MusicButton",
  ancestorWhitelist: [ PlayerGui ]
})
export class MusicButton extends BaseComponent<{}, PlayerGui["Menu"]["Buttons"]["SidePanel"]["Music"]> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly defaultVolume = Sound.CurrentSong.Volume;
  private enabled = true;

  public onStart(): void {
    this.janitor.Add(this.instance.MouseButton1Click.Connect(() => {
      this.enabled = !this.enabled;
      this.instance.Off.Visible = !this.enabled;
      Sound.CurrentSong.Volume = this.enabled ? this.defaultVolume : 0;
    }));
  }
}