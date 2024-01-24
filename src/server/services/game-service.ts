import { Service, type OnTick } from "@flamework/core";
import { Players, Workspace as World } from "@rbxts/services";
import { Timer, TimerState } from "@rbxts/timer";

import { toSeconds } from "shared/utilities/helpers";
import { Events } from "server/network";
import type { OnPlayerJoin } from "server/hooks";

import type { MapVotingService } from "./map-voting-service";
import { ServerSettingsService } from "./server-settings-service";

const { updateIntermissionTimer, updateGameTimer, waitingForPlayers, intermissionStarted, gameStarted } = Events;

const enum GameState {
  None,
  WaitingForPlayers,
  Intermission,
  Active
}

@Service()
export class GameService implements OnTick, OnPlayerJoin {
  private readonly intermissionLength: number;
  private readonly gameLength: number;
  private readonly minimumPlayers: number;
  private state = GameState.None;
  private currentTimer?: Timer;

  public constructor(
    private readonly mapVoting: MapVotingService,
    private readonly serverSettings: ServerSettingsService
  ) {

    this.intermissionLength = toSeconds(this.serverSettings.get<string>("IntermissionLength"));
    this.gameLength = toSeconds(this.serverSettings.get<string>("GameLength"));
    this.minimumPlayers = this.serverSettings.get<number>("MinimumPlayers");
  }

  public onPlayerJoin(): void {
    const playerCount = Players.GetPlayers().size();
    if (playerCount < this.minimumPlayers) return;
    if (this.state !== GameState.WaitingForPlayers) return;

    this.startIntermission();
  }

  public onTick(): void {
    if (this.state === GameState.WaitingForPlayers) return;

    const playerCount = Players.GetPlayers().size();
    if (playerCount < this.minimumPlayers)
      this.waitForPlayers();
  }

  private startGame(): void {
    this.state = GameState.Active;
    this.cancelTimer();
    this.startTimer();

    const map = this.mapVoting.getWinner().Clone();
    map.Name = "Environment"
    map.Parent = World.LoadedMap;

    this.teleportPlayersToMap();
    gameStarted.broadcast();
  }

  private startIntermission(): void {
    this.state = GameState.Intermission;
    this.cancelTimer();
    this.startTimer();
    this.mapVoting.start();
    intermissionStarted.broadcast();
  }

  private waitForPlayers(): void {
    this.state = GameState.WaitingForPlayers;
    this.cancelTimer();
    waitingForPlayers.broadcast();
  }

  private startTimer(): void {
    if (![GameState.Intermission, GameState.Active].includes(this.state)) return;

    const length = this.state === GameState.Active ? this.gameLength : this.intermissionLength;
    const updateRemote = this.state === GameState.Active ? updateGameTimer : updateIntermissionTimer;
    this.currentTimer = new Timer(length);
    this.currentTimer.secondReached.Connect(() => updateRemote.broadcast(math.round(this.currentTimer!.getTimeLeft())));

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
    if (this.currentTimer?.getState() === TimerState.Running)
      this.currentTimer.stop();

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