import { Controller, type OnInit } from "@flamework/core";
import { SoundService as Sound } from "@rbxts/services";

@Controller()
export class MusicController implements OnInit {
  public onInit(): void {
    const songs = <Sound[]>Sound.Songs.GetChildren();
    task.spawn(() => {
      while (true) {
        const newSong = songs[math.random(1, songs.size()) - 1];
        Sound.CurrentSong.SoundId = newSong.SoundId;
        Sound.CurrentSong.Play();
        Sound.CurrentSong.Ended.Wait();
      }
    });
  }
}