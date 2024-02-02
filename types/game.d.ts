interface GameMap extends Model {
  Thumbnail: Camera;
  PlayerSpawns: Folder;
  ChairSpawn: Part;
}

interface LeaderboardModel extends Folder {
  Decoration: Model;
  AllTime: Part;
  Monthly: Part;
  Weekly: Part;
}