interface PlayerGui extends BasePlayerGui {
  TopMessages: ScreenGui & {
    Eliminated: ImageLabel;
    Win: ImageLabel;
    FindChair: ImageLabel;
    WaitingForPlayers: ImageLabel;
    Intermission: ImageLabel & {
      Countdown: TextLabel;
    };
    RemainingTime: ImageLabel & {
      Countdown: TextLabel;
    };
  };
  Menu: ScreenGui & {
    Leaderboard: Frame & {
      Main: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Silver: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        Gold: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Bronze: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
      };
    };
    UIPadding: UIPadding;
    Buttons: Frame & {
      Inventory: ImageButton & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
      NoteDisplay: ImageLabel & {
        Display: TextLabel;
        NoteShop: ImageButton;
      };
      SidePanel: Frame & {
        Shop: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIPadding: UIPadding;
        Codes: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIListLayout: UIListLayout;
        Music: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
      Spectate: ImageButton & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
    };
    DailyRewards: Frame & {
      Main: ImageLabel & {
        Day1: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          ["Collect button"]: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            TextLabel: TextLabel & {
              UIAspectRatioConstraint: UIAspectRatioConstraint;
            };
          };
        };
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Day4: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          ["Collect button"]: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            TextLabel: TextLabel;
          };
        };
        Day3: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          ["Collect button"]: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            TextLabel: TextLabel;
          };
        };
        Clock: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          Countdown: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        Day5: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          ["Collect button"]: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Day2: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          ["Collect button"]: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
            TextLabel: TextLabel;
          };
        };
      };
    };
    Spectate: Frame & {
      Selector: ImageLabel & {
        ["Cancel button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        ScrollingFrame: ScrollingFrame & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
      Preview: ImageLabel & {
        ["Cancel button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        ScrollingFrame: ScrollingFrame & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    Shop: Frame & {
      Main: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        ItemDisplay: ImageLabel & {
          Description: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          Buy: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        Tabs: ScrollingFrame & {
          UIListLayout: UIListLayout;
          Weapons: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Pets: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Chairs: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Items: ScrollingFrame & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    MapSelection: Frame & {
      Main: ImageLabel & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Option1: ImageLabel & {
          Selected: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Select: ImageButton;
        };
        Option2: ImageLabel & {
          Selected: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Select: ImageButton;
        };
        Option3: ImageLabel & {
          Selected: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Select: ImageButton;
        };
      };
    };
    ["Codes "]: Frame & {
      Main: ImageLabel & {
        ["Redeem Button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        ["Codes Box"]: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextBox: TextBox & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        TextLabel: TextLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Exit: ImageButton;
      };
    };
    Inventory: Frame & {
      Main: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Tabs: ScrollingFrame & {
          UIListLayout: UIListLayout;
          Weapons: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Pets: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Chairs: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        Display: ImageLabel & {
          Equip: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          Description: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Items: ScrollingFrame & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    NoteShop: Frame & {
      Main: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        ["Best Value"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
    };
  };
}