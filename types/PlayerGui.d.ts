interface PlayerGui extends BasePlayerGui {
  LoadScreen : ScreenGui & {
    Main: Frame & {
      Progress: Frame & {
        Bar: Frame;
      };
      Loading: TextLabel;
    }
  }
  TopMessages: ScreenGui & {
    Eliminated: ImageLabel;
    Win: ImageLabel & {
      TextLabel: TextLabel;
    };
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
      Notes: ImageLabel & {
        Amount: TextLabel;
        Shop: ImageButton;
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
          Off: ImageLabel;
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
      Main: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        List: ScrollingFrame;
      };
    };
    SwapSpectate: Frame & {
      Main: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        List: ScrollingFrame;
      };
    };
    Shop: Frame & {
      Main: ImageLabel & {
        Exit: ImageButton;
        Display: ImageLabel & {
          Viewport: ViewportFrame;
          Description: TextLabel;
          Buy: ImageButton;
        };
        Tabs: ScrollingFrame & {
          UIListLayout: UIListLayout;
          Weapons: ImageButton;
          Pets: ImageButton;
          Chairs: ImageButton;
        };
        Items: ScrollingFrame;
      };
    };
    MapSelection: Frame & {
      Main: ImageLabel & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Option1: ImageLabel & {
          MapViewport: ViewportFrame;
          Selected: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Select: ImageButton;
        };
        Option2: ImageLabel & {
          MapViewport: ViewportFrame;
          Selected: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Select: ImageButton;
        };
        Option3: ImageLabel & {
          MapViewport: ViewportFrame;
          Selected: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          Select: ImageButton;
        };
      };
    };
    Codes: Frame & {
      Main: ImageLabel & {
        Redeem: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        TextBubble: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          Input: TextBox & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        TextLabel: TextLabel & {
          UIStroke: UIStroke;
        };
        StatusMessage: TextLabel;
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Exit: ImageButton;
      };
    };
    Inventory: Frame & {
      Main: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Tabs: Frame & {
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
          Viewport: ViewportFrame;
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