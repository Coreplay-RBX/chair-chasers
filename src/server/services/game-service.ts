import { Service, type OnTick } from "@flamework/core";
import { Players, Workspace as World } from "@rbxts/services";
import { Timer, TimerState } from "@rbxts/timer";

import { toSeconds } from "shared/utilities/helpers";
import { Events } from "server/network";
import type { OnPlayerJoin, OnPlayerLeave } from "server/hooks";

import type { MapVotingService } from "./map-voting-service";
import type { ChairsService } from "./chairs-service";
import type { ServerSettingsService } from "./server-settings-service";

const { updateIntermissionTimer, updateGameTimer, waitingForPlayers, intermissionStarted, gameStarted } = Events;

const enum GameState {
  None,
  WaitingForPlayers,
  Intermission,
  Active
}

@Service()
export class GameService implements OnTick, OnPlayerJoin, OnPlayerLeave {
  public readonly playersInGame: Player[] = [];

  private readonly intermissionLength: number;
  private readonly gameLength: number;
  private readonly minimumPlayers: number;
  private state = GameState.None;
  private currentTimer?: Timer;

  public constructor(
    private readonly mapVoting: MapVotingService,
    private readonly chairs: ChairsService,
    serverSettings: ServerSettingsService
  ) {

    this.intermissionLength = toSeconds(serverSettings.get<string>("Rounds_IntermissionLength"));
    this.gameLength = toSeconds(serverSettings.get<string>("Rounds_GameLength"));
    this.minimumPlayers = serverSettings.get<number>("Rounds_MinimumPlayers");
  }

  public onPlayerJoin(): void {
    if (this.state !== GameState.WaitingForPlayers) return;
    this.startIntermission();
  }

  public onPlayerLeave(player: Player): void {
    if (this.playersInGame.includes(player))
      this.playersInGame.remove(this.playersInGame.indexOf(player));
  }

  public onTick(): void {
    if ([GameState.WaitingForPlayers, GameState.Active].includes(this.state)) return;

    const playerCount = Players.GetPlayers().size();
    if (playerCount !== 0 && playerCount < this.minimumPlayers) // !== 0 to avoid spamming the remote before player has even loaded in
      this.waitForPlayers();
  }

  public eliminatePlayer(player: Player): void {
    this.playersInGame.remove(this.playersInGame.indexOf(player));
    this.teleportPlayerToLobby(player);
  }

  public startIntermission(): void {
    this.state = GameState.Intermission;
    this.playersInGame.clear();
    this.cancelTimer();
    this.startTimer();
    this.mapVoting.start();
    intermissionStarted.broadcast();
  }

  public conclude(): void {
    this.teleportPlayersToLobby();
    this.startIntermission();
    World.LoadedMap.Environment?.Destroy();
  }

  private startGame(): void {
    this.state = GameState.Active;
    this.cancelTimer();
    // this.startTimer();

    const map = this.mapVoting.getWinner().Clone();
    map.Name = "Environment"
    map.Parent = World.LoadedMap;

    this.teleportPlayersToMap();
    gameStarted.broadcast();

    for (const player of Players.GetPlayers())
      this.playersInGame.push(player);

    this.chairs.spawn(map, this.playersInGame.size());
    task.delay(3, () => this.chairs.beginGame(this));
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
    });

    this.currentTimer.start();
  }

  private cancelTimer(): void {
    if (this.currentTimer?.getState() === TimerState.Running)
      this.currentTimer.stop();

    this.currentTimer?.destroy();
    this.currentTimer = undefined;
  }

  private teleportPlayer(player: Player, part: Part) {
    player.Character!.PivotTo(part.CFrame.add(new Vector3(0, 6, 0)));
  }

  private teleportPlayers(part: Part): void {
    for (const player of Players.GetPlayers())
      this.teleportPlayer(player, part);
  }

  private teleportPlayersToMap(): void {
    const mapSpawns = <Part[]>World.LoadedMap.Environment!.PlayerSpawns.GetChildren();
    const spawn = mapSpawns[math.random(0, mapSpawns.size() - 1)];
    this.teleportPlayers(spawn);
  }

  private teleportPlayerToLobby(player: Player): void {
    const lobbySpawns = <Part[]>World.Lobby.Spawns.GetChildren();
    const spawn = lobbySpawns[math.random(0, lobbySpawns.size() - 1)];
    this.teleportPlayer(player, spawn);
  }

  private teleportPlayersToLobby(): void {
    for (const player of Players.GetPlayers())
      this.teleportPlayerToLobby(player);
  }
}