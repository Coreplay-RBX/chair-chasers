import { Service, type OnInit } from "@flamework/core";
import { Players, ServerStorage } from "@rbxts/services";

import { Events } from "server/network";
import { slice } from "shared/utilities/helpers";
import Log from "shared/logger";

const { voteForMap, closeMapVotingFrame, mapVotingStarted } = Events;

const MAPS = <GameMap[]>ServerStorage.Maps.GetChildren();

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

  public getWinner(): GameMap {
    const [highestVoted] = this.currentVotes.sort((a, b) => a > b);
    const mapIndex = this.currentVotes.indexOf(highestVoted);
    const winner = this.mapPool[mapIndex];
    this.reset();

    Log.info(`"${winner.Name}" map has won the vote`);
    return winner;
  }

  public voteFor(player: Player, mapIndex: number): void {
    Log.info(`${player} voted for map #${mapIndex + 1}`);

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