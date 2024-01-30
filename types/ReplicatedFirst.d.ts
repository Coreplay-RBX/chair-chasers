interface ReplicatedFirst extends Instance {
  CodeList: ModuleScript;
  Assets: Folder & {
    Maps: Folder;
    UI: Folder & {
      ViewportButton: ImageButton & {
        Viewport: ViewportFrame;
      };
    };
    Models: Folder & {
      Chairs: Folder & {
        ["Sun Chair"]: Model & {
          Seat: Seat;
        };
        ["Moon Chair"]: Model & {
          Seat: Seat;
        };
        ["Little Tree Chair"]: Model & {
          Seat: Seat;
        };
        ["Basic Chair"]: Model & {
          Seat: Seat;
        };
        ["Star Chair"]: Model & {
          Seat: Seat;
        };
        ["Coral Chair"]: Model & {
          Seat: Seat;
        };
        ["Cloudy Dream Chair"]: Model & {
          Seat: Seat;
        };
        ["Dark Throne"]: Model & {
          Seat: Seat;
        };
        ["Flowers and Vines Chair"]: Model & {
          Seat: Seat;
        };
        ["Ice Chair"]: Model & {
          Seat: Seat;
        };
        ["Musical Note Chair"]: Model & {
          Seat: Seat;
        };
        ["Lava Chair"]: Model & {
          Seat: Seat;
        };
      };
      Vegetation: Folder;
      Rocks: Folder;
      Underwater: Folder;
      Coin: Model;
      Orb: Model;
    };
  };
}