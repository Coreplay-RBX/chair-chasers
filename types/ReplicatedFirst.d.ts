interface ReplicatedFirst extends Instance {
  CodeList: ModuleScript;
  Assets: Folder & {
    UI: Folder & {
      ViewportButton: ImageButton & {
        Viewport: ViewportFrame;
      };
    };
    Models: Folder & {
      Chairs: Folder & {
        ["Sun Chair"]: Model & {
          Seat: Seat;
          Model: Model;
        };
        ["Moon Chair"]: Model & {
          Seat: Seat;
          Model: Model & {
            MeshPart: MeshPart;
          };
        };
        ["Little Tree Chair"]: Model & {
          Seat: Seat;
          Model: Model & {
            Part: Part & {
              Decal: Decal;
            };
          };
        };
        ["Basic Chair"]: Model & {
          Seat: Seat;
          Model: Model;
        };
        ["Star Chair"]: Model & {
          Seat: Seat;
          Model: Model;
        };
        ["Coral Chair"]: Model & {
          Seat: Seat;
          Model: Model;
        };
        ["Cloudy Dream Chair"]: Model & {
          Seat: Seat;
          Model: Model & {
            Model: Model & {
              MeshPart: MeshPart & {
                ParticleEmitter: ParticleEmitter;
              };
              Model: Model & {
                Model: Model;
              };
            };
          };
        };
        ["Dark Throne"]: Model & {
          Seat: Seat;
          Model: Model;
        };
        ["Flowers and Vines Chair"]: Model & {
          Seat: Seat & {
            Script: Script;
            sitanim: Animation;
          };
          Model: Model & {
            Union: UnionOperation;
            ["Back Border"]: UnionOperation;
          };
        };
        ["Ice Chair"]: Model & {
          Seat: Seat;
          Model: Model;
        };
        ["Musical Note Chair"]: Model & {
          Seat: Seat;
          Model: Model;
        };
        ["Lava Chair"]: Model & {
          Seat: Seat;
          Model: Model & {
            Part: Part;
          };
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