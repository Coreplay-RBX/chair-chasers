import { Service, type OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";

import { Events } from "server/network";
import { Assets, slice } from "shared/utilities/helpers";
import Log from "shared/logger";

const { voteForMap, closeMapVotingFrame, mapVotingStarted } = Events;

const MAPS = <GameMap[]>Assets.Maps.GetChildren();

@Service()
export class MapVotingService implements OnInit {
  private currentVotes = [0, 0, 0];
  public mapPool: GameMap[] = [];

  public onInit(): void {
    voteForMap.connect((player, mapIndex) => this.voteFor(player, mapIndex))
  }

  public start(): void {
    const shuffledMaps = MAPS
      .sort(() => (new Random).NextInteger(-1, 0) < 0);

    this.mapPool = slice(shuffledMaps, 0, 3);
    mapVotingStarted.broadcast(this.mapPool.map(map => map.Name));

    Log.info(`Started map voting. Current map pool: ${this.mapPool.map(map => map.Name).join(", ")}`);
  }

  public openUI(player: Player): void {
    mapVotingStarted(player, this.mapPool.map(map => map.Name));
  }

  public getWinner(): GameMap {
    const unsortedVotes = [...this.currentVotes];
    const [highestVoted] = this.currentVotes.sort((a, b) => a > b);
    const mapIndex = unsortedVotes.indexOf(highestVoted);
    const winner = this.mapPool[mapIndex];
    this.reset();

    Log.info(`"${winner.Name}" map has won the vote`);
    return winner;
  }

  public voteFor(player: Player, mapIndex: number): void {
    const votedFor = <Maybe<number>>player.GetAttribute("VotedFor");
    if (votedFor === mapIndex) return;
    if (votedFor !== undefined)
      this.currentVotes[votedFor]--;

    player.SetAttribute("VotedFor", mapIndex);
    this.currentVotes[mapIndex]++;
  }

  private reset(): void {
    this.mapPool = [];
    this.currentVotes = [0, 0, 0];
    for (const player of Players.GetPlayers())
      player.SetAttribute("VotedFor", undefined);

    closeMapVotingFrame.broadcast();
  }
}