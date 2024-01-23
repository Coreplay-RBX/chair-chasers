import { Service, type OnTick } from "@flamework/core";
import { Players, ServerStorage } from "@rbxts/services";
import { Timer } from "@rbxts/timer";

import type { OnPlayerJoin } from "server/hooks";
import { Events } from "server/network";

import type { PlayerService } from "./player-service";

const { updateIntermissionTimer, updateGameTimer } = Events

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
      else
        this.startIntermission();
    });

    this.currentTimer.start();
  }

  private cancelTimer(): void {
    this.currentTimer?.stop();
    this.currentTimer?.destroy();
    this.currentTimer = undefined;
  }
}