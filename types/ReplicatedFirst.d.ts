interface ReplicatedFirst extends Instance {
  Assets: Folder & {
    Models: Folder & {
      Chairs: Folder;
      Vegetation: Folder;
      Rocks: Folder;
      Underwater: Folder;
      Coin: Model;
      Orb: Model;
    };
  };
}