import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";

import { Events, Functions } from "client/network";
import { Assets } from "shared/utilities/helpers";
import { PlayerGui } from "shared/utilities/client";
import type Inventory from "shared/data-models/inventory";

const { dataUpdate, setData } = Events;
const { getData } = Functions;

const SELECTED_BUTTON = "rbxassetid://10160149151";
const REGULAR_BUTTON = "rbxassetid://10160149748";

@Component({
  tag: "ShopPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class ShopPage extends BaseComponent<{}, PlayerGui["Menu"]["Shop"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly itemsPageTemplate = this.instance.Items;
  private readonly tabs: ScrollingFrame[] = [];
  private selectedTab = "Chairs";
  private selectedItem?: typeof Assets.UI.ViewportButton;

  public async onStart(): Promise<void> {
    let conn: RBXScriptConnection;
    conn = dataUpdate.connect((key, inventory) => {
      if (key !== "inventory") return;

      conn.Disconnect();
      for (const chair of <Model[]>Assets.Models.Chairs.GetChildren()) {
        if (chair.GetAttribute("NotForSale")) continue;
        this.createShopButton(<Inventory>inventory, chair.Name, "Chairs", chair.Clone());
      }
    });

    this.janitor.Add(this.instance.Display.Buy.MouseButton1Click.Connect(() => this.buySelected()));
    this.createTabItemContainers();
  }

  private createTabItemContainers(): void {
    const tabButtons = this.instance.Tabs.GetChildren()
      .filter((i): i is ImageButton => i.IsA("ImageButton"));

    for (const tabButton of tabButtons) {
      const frame = this.itemsPageTemplate.Clone();
      frame.Name = tabButton.Name;
      frame.Visible = false;
      frame.Parent = this.instance;
      this.tabs.push(frame);
      this.janitor.Add(tabButton.MouseButton1Click.Connect(() => this.switchTab(tabButton.Name)));
    }

    this.switchTab("Chairs");
  }

  private async buySelected(): Promise<void> {
    if (!this.selectedItem) return;

    const inventory = <Inventory>await getData("inventory");
    const notes = <number>await getData("notes");
    const equippedItemType = this.getItemTypeFromName();
    const itemName = <string>this.selectedItem.GetAttribute("ItemName");
    const itemPrice = <number>this.selectedItem.GetAttribute("ItemPrice");
    if (notes < itemPrice) return;
    if ((<string[]>inventory[equippedItemType]).includes(itemName))
      return;

    (<string[]>inventory[equippedItemType]).push(itemName);
    setData("inventory", inventory);
  }

  private switchTab(tabName: string): void {
    this.deselectAllButtons();
    this.selectedTab = tabName;
    for (const tab of this.tabs)
      tab.Visible = tabName === tab.Name;
  }

  private async selectButton(selectedButton: typeof Assets.UI.ViewportButton): Promise<void> {
    if (this.selectedItem === selectedButton)
      return this.deselectAllButtons();

    this.selectedItem = selectedButton;
    this.instance.Display.Visible = true;
    this.instance.Display.Buy.Visible = !<boolean>this.selectedItem.GetAttribute("ItemOwned");
    this.instance.Display.Description.Text = `${<string>this.selectedItem.GetAttribute("ItemDescription")} | ${<number>this.selectedItem.GetAttribute("ItemPrice")} notes`;
    for (const frame of this.getAllItemFrames())
      for (const button of this.getItemsFromFrame(frame))
        button.Image = button === selectedButton ? SELECTED_BUTTON : REGULAR_BUTTON;

    this.instance.Display.Viewport.FindFirstChildOfClass("Model")?.Destroy();
    const viewportModel = selectedButton.Viewport.FindFirstChildOfClass("Model")!.Clone();
    viewportModel.Parent = this.instance.Display.Viewport;
  }

  private deselectAllButtons(): void {
    this.selectedItem = undefined;
    this.instance.Display.Visible = false;
    for (const frame of this.getAllItemFrames())
      for (const button of this.getItemsFromFrame(frame))
        button.Image = REGULAR_BUTTON;

    this.instance.Display.Viewport.FindFirstChildOfClass("Model")?.Destroy();
  }

  private createShopButton(inventory: Inventory, itemName: string, category: string, viewportModel: Model): void {
    const button = Assets.UI.ViewportButton.Clone();
    const itemType = this.getItemTypeFromName(category);
    viewportModel.Parent = button.Viewport;
    button.Name = "ShopItem";
    button.MouseButton1Click.Connect(() => this.selectButton(button));
    button.Parent = this.getItemsFrame(category);
    button.SetAttribute("ItemOwned", (<string[]>inventory[itemType]).includes(itemName));
    button.SetAttribute("ItemName", itemName);
    button.SetAttribute("ItemCategory", category);
    button.SetAttribute("ItemDescription", viewportModel.GetAttribute("ItemDescription"));
    button.SetAttribute("ItemPrice", viewportModel.GetAttribute("ItemPrice"));
  }

  private getItemTypeFromName(name = this.selectedTab): keyof Inventory {
    switch(name) {
      case "Chairs": return "chairSkins";
      case "Pets": return "pets";
      case "Weapons": return "weapons";
    }
    return <keyof Inventory><unknown>undefined;
  }

  private getItemsFromFrame(frame: ScrollingFrame): (typeof Assets.UI.ViewportButton)[] {
    return frame.GetChildren()
      .filter((instance): instance is typeof Assets.UI.ViewportButton => instance.IsA("ImageButton"))
  }

  private getAllItemFrames(): ScrollingFrame[] {
    return this.instance.GetChildren()
      .filter((instance): instance is ScrollingFrame => instance.IsA("ScrollingFrame") && instance.Name !== "Tabs");
  }

  private getItemsFrame(category: string): ScrollingFrame {
    return this.tabs.find(tab => tab.Name === category)!;
  }
}