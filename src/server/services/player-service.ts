import { Service, Modding, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { OnPlayerJoin, OnPlayerLeave } from "server/hooks";

@Service()
export class PlayerService implements OnStart {
  private readonly joinListeners = new Set<OnPlayerJoin>();
  private readonly leaveListeners = new Set<OnPlayerLeave>();

  public onStart(): void {
    Modding.onListenerAdded<OnPlayerJoin>((object) => this.joinListeners.add(object));
    Modding.onListenerRemoved<OnPlayerJoin>((object) => this.joinListeners.delete(object));
    Modding.onListenerAdded<OnPlayerLeave>((object) => this.leaveListeners.add(object));
    Modding.onListenerRemoved<OnPlayerLeave>((object) => this.leaveListeners.delete(object));

    Players.PlayerAdded.Connect((player) => {
      for (const listener of this.joinListeners)
        task.spawn(() => listener.onPlayerJoin(player));
    });

    Players.PlayerRemoving.Connect((player) => {
      for (const listener of this.leaveListeners)
        task.spawn(() => listener.onPlayerLeave(player));
    });

    for (const player of Players.GetPlayers())
      for (const listener of this.joinListeners)
        task.spawn(() => listener.onPlayerJoin(player));
  }

  public removeJoinListener(listener: OnPlayerJoin): void {
    this.joinListeners.delete(listener);
  }

  public removeLeaveListener(listener: OnPlayerLeave): void {
    this.leaveListeners.delete(listener);
  }
}