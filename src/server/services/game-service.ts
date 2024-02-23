import { Service, type OnTick } from "@flamework/core";
import { Players, Workspace as World } from "@rbxts/services";
import { Timer, TimerState } from "@rbxts/timer";
import Signal from "@rbxts/signal";

import { Events, Functions } from "server/network";
import { toSeconds } from "shared/utilities/helpers";
import type { OnPlayerJoin, OnPlayerLeave } from "server/hooks";

import type { MapVotingService } from "./map-voting-service";
import type { ChairsService } from "./chairs-service";
import type { ServerSettingsService } from "./server-settings-service";

const {
  updateIntermissionTimer, updateGameTimer,
  waitingForPlayers, intermissionStarted, gameStarted,
  playersInGameChanged
} = Events;
const { isInGame } = Functions;

const enum GameState {
  None,
  WaitingForPlayers,
  Intermission,
  Active
}

@Service()
export class GameService implements OnTick, OnPlayerJoin, OnPlayerLeave {
  public readonly playersInGame: Player[] = [];
  public readonly playersChanged = new Signal<(playersInGame: Player[]) => void>;
  public readonly placement: Player[] = [];

  private readonly intermissionLength: number;
  private readonly gameLength: number;
  private readonly minimumPlayers: number;
  private state = GameState.None;
  public currentMap?: GameMap;
  private currentTimer?: Timer;

  public constructor(
    private readonly mapVoting: MapVotingService,
    private readonly chairs: ChairsService,
    serverSettings: ServerSettingsService
  ) {

    this.intermissionLength = toSeconds(serverSettings.get<string>("Rounds_IntermissionLength"));
    this.gameLength = toSeconds(serverSettings.get<string>("Rounds_RoundLength"));
    this.minimumPlayers = serverSettings.get<number>("Rounds_MinimumPlayers");
    this.playersChanged.Connect(playersInGame => playersInGameChanged.broadcast(playersInGame.map(p => p.UserId)));

    isInGame.setCallback(player => this.playersInGame.includes(player));
  }

  public onPlayerJoin(player: Player): void {
    switch (this.state) {
      case GameState.WaitingForPlayers: {
        waitingForPlayers(player);
        break;
      }
      case GameState.Intermission: {
        intermissionStarted(player);
        this.mapVoting.openUI(player);
        break;
      }
      case GameState.Active: {
        gameStarted(player);
        break;
      }
    }
  }

  public onPlayerLeave(player: Player): void {
    if (this.playersInGame.includes(player))
      this.removePlayer(player)
  }

  public onTick(): void {
    if (this.state === GameState.Active) return;

    const playerCount = Players.GetPlayers().size();
    if (playerCount === 0) return;
    if (playerCount < this.minimumPlayers) { // !== 0 to avoid spamming the remote before player has even loaded in
      if (this.state === GameState.WaitingForPlayers) return; // if we're already waiting or already in a game, don't try to wait for players
      this.waitForPlayers();
    } else if (this.state !== GameState.Intermission)
      this.startIntermission();
  }

  public eliminatePlayer(player: Player): void {
    this.removePlayer(player)
    this.teleportPlayerToLobby(player);
    this.placement.push(player);
  }

  public startIntermission(): void {
    this.state = GameState.Intermission;
    this.playersInGame.clear();
    this.playersChanged.Fire(this.playersInGame);
    this.cancelTimer();
    this.startTimer();
    this.mapVoting.start();
    this.currentMap = undefined;
    intermissionStarted.broadcast();
  }

  public conclude(): void {
    this.teleportPlayersToLobby();
    this.startIntermission();
    this.placement.clear();
    World.LoadedMap.Environment?.Destroy();
  }

  public teleportPlayersToMap(): void {
    const mapSpawns = <Part[]>World.LoadedMap.Environment!.PlayerSpawns.GetChildren();
    for (const player of Players.GetPlayers()) {
      const spawn = mapSpawns[math.random(0, mapSpawns.size() - 1)];
      this.teleportPlayer(player, spawn);
    }
  }

  private removePlayer(player: Player): void {
    this.playersInGame.remove(this.playersInGame.indexOf(player));
    this.playersChanged.Fire(this.playersInGame);
  }

  private addPlayer(player: Player) {
    this.playersInGame.push(player);
    this.playersChanged.Fire(this.playersInGame);
  }

  private startGame(): void {
    this.state = GameState.Active;
    this.cancelTimer();

    const map = this.mapVoting.getWinner().Clone();
    map.Name = "Environment"
    map.Parent = World.LoadedMap;
    this.currentMap = map;

    this.teleportPlayersToMap();
    gameStarted.broadcast();

    for (const player of Players.GetPlayers())
      this.addPlayer(player);

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