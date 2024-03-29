interface ReplicatedFirst extends Instance {
  CodeList: ModuleScript;
  DailyRewards: ModuleScript;
  Assets: Folder & {
    Maps: Folder;
    UI: Folder & {
      SelectSpectate: ImageButton & {
        Username: TextLabel;
        Icon: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        DisplayName: TextLabel;
      };
      SwapSpectate: ImageButton & {
        Username: TextLabel;
        Icon: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        DisplayName: TextLabel;
      };
      ViewportButton: ImageButton & {
        Viewport: ViewportFrame;
      };
      LeaderboardEntry: Frame & {
        PlayerName: TextLabel & {
          UIStroke: UIStroke;
        };
        Rank: TextLabel & {
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Value: TextLabel & {
          UIStroke: UIStroke;
        };
        Avatar: ImageLabel & {
          UICorner: UICorner;
          UIStroke: UIStroke;
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    Models: Folder & {
      Pets: Folder & {
        Test: Model;
      };
      Weapons: Folder & {
        Test: Model;
      };
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