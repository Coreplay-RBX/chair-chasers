type TrackedDataKey = "notes" | "wins";

interface GameMap extends Model {
  PlayerSpawns: Folder;
  ChairSpawns: Folder;
  Map: Model;
}

interface LeaderboardModel extends Folder {
  Decoration: Model;
  AllTime: Part;
  Monthly: Part;
  Weekly: Part;
}