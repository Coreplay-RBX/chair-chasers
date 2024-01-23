interface Workspace extends WorldModel {
  LoadedMap: Folder & {
    Environment?: GameMap;
    Chairs: Folder;
  };
  Lobby: Folder & {
    Spawns: Folder;
  };
}