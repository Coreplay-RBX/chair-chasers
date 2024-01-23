interface PlayerGui extends BasePlayerGui {
  TopMessages: ScreenGui & {
    Eliminated: ImageLabel;
    Win: ImageLabel;
    FindChair: ImageLabel;
    Intermission: ImageLabel & {
      Countdown: TextLabel;
    };
    RemainingTime: ImageLabel & {
      Countdown: TextLabel;
    };
  };
  Menu: ScreenGui & {
    ["Codes "]: Frame & {
      ["Main Frame"]: ImageLabel & {
        ["Redeem Button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          LocalScript: LocalScript;
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
        ImageButton: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    leaderboards: Frame & {
      ["Main Frame"]: ImageLabel & {
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
        Bronze: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        ImageButton: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    Buttons: Frame & {
      ["Spectate button"]: ImageButton;
      NoteDisplay: ImageLabel & {
        Display: TextLabel;
        NoteShop: ImageButton & {
          NoteShopUsage: LocalScript;
        };
      };
      MenuFrame: ScrollingFrame & {
        ["Shop button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        ["Music button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIListLayout: UIListLayout;
        ["Twitter button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        LocalScript: LocalScript;
      };
    };
    ShopFrame: Frame & {
      Shop: ImageLabel & {
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
    InventoryFrame: Frame & {
      Inventory: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          LocalScript: LocalScript;
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
    SpectateFrame: Frame & {
      SpectatePreview: ImageLabel & {
        ["Cancel button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        ScrollingFrame: ScrollingFrame & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
      SpectateSelector: ImageLabel & {
        ["Cancel button"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        ScrollingFrame: ScrollingFrame & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    ["Top Messages"]: Frame & {
      ["You are out"]: ImageLabel & {
        TextLabel: TextLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
      GuiScript: LocalScript & {
        ClientGuiController: ModuleScript;
      };
      ["You WOn"]: ImageLabel & {
        TextLabel: TextLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
      ["You Find a chair"]: ImageLabel & {
        TextLabel: TextLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
      ["time Left"]: ImageLabel & {
        UIAspectRatioConstraint: UIAspectRatioConstraint;
      };
      Intermission: ImageLabel & {
        Time: TextLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        TextLabel: TextLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
      };
    };
    NoteShopFrame: Frame & {
      NoteShop: ImageLabel & {
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
    ["Inventory Button"]: ImageButton;
    DailyRewardsFrame: Frame & {
      DailyRewards: ImageLabel & {
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
        ["Clock vector"]: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          TextLabel: TextLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        ["Day 5 locked"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
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
        ["Day 5 collect"]: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
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
    MapSelectionFrame: Frame & {
      MapSelection: ImageLabel & {
        Exit: ImageButton & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
        };
        Option1: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          ImageButton: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        Option2: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          ImageButton: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
        UIAspectRatioConstraint: UIAspectRatioConstraint;
        Option3: ImageLabel & {
          UIAspectRatioConstraint: UIAspectRatioConstraint;
          ImageButton: ImageButton & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
        };
      };
    };
  };
}