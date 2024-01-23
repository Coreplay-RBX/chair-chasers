import { Service, type OnTick } from "@flamework/core";
import { Players, ServerStorage, Workspace as World } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { Timer } from "@rbxts/timer";

import type { OnPlayerJoin } from "server/hooks";
import { Events } from "server/network";
import Log from "shared/logger";

const { updateIntermissionTimer, updateGameTimer } = Events

const MAPS = <Model[]>ServerStorage.Maps.GetChildren();
const SERVER_SETTINGS = ServerStorage.ServerSettings;
const INTERMISSION_LENGTH = <number>SERVER_SETTINGS.GetAttribute("IntermissionLength");
const GAME_LENGTH = <number>SERVER_SETTINGS.GetAttribute("GameLength");

const enum GameState {
  WaitingForPlayers,
  Intermission,
  Active
}

@Service()
export class GameService implements OnTick, OnPlayerJoin {
  private state = GameState.WaitingForPlayers;
  private currentTimer?: Timer;

  public onPlayerJoin(): void {
    const playerCount = Players.GetPlayers().size();
    if (playerCount < 2) return;
    if (this.state !== GameState.WaitingForPlayers) return;

    this.startIntermission();
  }

  public onTick(): void {
    const playerCount = Players.GetPlayers().size();
    if (playerCount < 2)
      this.waitForPlayers();
  }

  private startGame(): void {
    this.state = GameState.Active;
    this.cancelTimer();
    this.startTimer();

    const selectedMap = MAPS[math.random(0, MAPS.size() - 1)].Clone();
    selectedMap.Name = "Environment"
    selectedMap.Parent = World.LoadedMap;

    this.teleportPlayersToMap();
  }

  private startIntermission(): void {
    this.state = GameState.Intermission;
    this.cancelTimer();
    this.startTimer();
  }

  private waitForPlayers(): void {
    this.state = GameState.WaitingForPlayers;
    this.cancelTimer();
  }

  private startTimer(): void {
    if (![GameState.Intermission, GameState.Active].includes(this.state)) return;

    const length = this.state === GameState.Active ? GAME_LENGTH : INTERMISSION_LENGTH;
    const updateRemote = this.state === GameState.Active ? updateGameTimer : updateIntermissionTimer;
    this.currentTimer = new Timer(length);
    this.currentTimer.secondReached.Connect(() => updateRemote.broadcast(this.currentTimer!.getTimeLeft()));

    let conn: RBXScriptConnection;
    conn = this.currentTimer.completed.Connect(() => {
      conn.Disconnect();
      this.currentTimer?.destroy();

      if (this.state === GameState.Intermission)
        this.startGame();
      else {
        this.teleportPlayersToLobby();
        this.startIntermission();
        World.LoadedMap.Environment?.Destroy();
      }
    });

    this.currentTimer.start();
  }

  private cancelTimer(): void {
    this.currentTimer?.stop();
    this.currentTimer?.destroy();
    this.currentTimer = undefined;
  }

  private teleportPlayers(part: Part): void {
    for (const player of Players.GetPlayers())
      player.Character!.PivotTo(part.CFrame.add(new Vector3(0, 6, 0)));
  }

  private teleportPlayersToMap(): void {
    const mapSpawns = <Part[]>World.LoadedMap.Environment!.PlayerSpawns.GetChildren();
    const spawn = mapSpawns[math.random(0, mapSpawns.size() - 1)];
    this.teleportPlayers(spawn);
  }

  private teleportPlayersToLobby(): void {
    const lobbySpawns = <Part[]>World.Lobby.Spawns.GetChildren();
    const spawn = lobbySpawns[math.random(0, lobbySpawns.size() - 1)];
    this.teleportPlayers(spawn);
  }
}