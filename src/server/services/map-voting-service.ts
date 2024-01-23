import { Service, type OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";


@Service()
export class MapVotingService implements OnInit {
  private currentVotes = [0, 0, 0];
  public mapPool: GameMap[] = [];

  public onInit(): void {

  }

  public getWinner(): GameMap {
    const [highestVoted] = this.currentVotes.sort((a, b) => a > b);
    const mapIndex = this.currentVotes.indexOf(highestVoted);
    const winner = this.mapPool[mapIndex];
    this.reset();

    return winner;
  }

  public voteFor(player: Player, mapNumber: number): void {
    const votedFor = <Maybe<number>>player.GetAttribute("VotedFor");
    if (votedFor === mapNumber) return;
    if (votedFor !== undefined)
      this.currentVotes[votedFor - 1]--;

    player.SetAttribute("VotedFor", mapNumber);
    this.currentVotes[mapNumber - 1]++;
  }

  private reset(): void {
    this.mapPool = [];
    this.currentVotes = [0, 0, 0];
    for (const player of Players.GetPlayers())
      player.SetAttribute("VotedFor", undefined);
  }
}