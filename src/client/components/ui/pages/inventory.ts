import type { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";

import { Events, Functions } from "client/network";
import { PlayerGui } from "shared/utilities/client";
import { Assets } from "shared/utilities/helpers";
import type Inventory from "shared/data-models/inventory";
import type EquippedItems from "shared/data-models/equipped-items";
import type ChairSkinName from "shared/data-models/chair-skin-name";

const { dataUpdate, setData } = Events;
const { getData } = Functions;

const SELECTED_BUTTON = "rbxassetid://10160149151";
const REGULAR_BUTTON = "rbxassetid://10160149748";

@Component({
  tag: "InventoryPage",
  ancestorWhitelist: [ PlayerGui ]
})
export class InventoryPage extends BaseComponent<{}, PlayerGui["Menu"]["Inventory"]["Main"]> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly itemsPageTemplate = this.instance.Items;
  private readonly tabs: ScrollingFrame[] = [];
  private selectedTab = "Chairs";
  private selectedItem?: typeof Assets.UI.ViewportButton;

  public onStart(): void {
    this.janitor.Add(dataUpdate.connect((key, inventory) => {
      if (key !== "inventory") return;
      this.update(<Inventory>inventory);
    }));

    this.janitor.Add(this.instance.Display.Equip.MouseButton1Click.Connect(() => this.equipSelected()));
    this.createTabItemContainers();
  }

  private update(inventory: Inventory): void {
    for (const tab of this.tabs) // get rid of old inventory buttons
      tab.GetChildren()
        .filter((i): i is ImageButton => i.IsA("ImageButton"))
        .forEach(btn => btn.Destroy());

    task.spawn(() => {
      for (const chairSkin of inventory.chairSkins) {
        const chairModel = <Model>Assets.Models.Chairs.WaitForChild(chairSkin).Clone();
        this.createInventoryButton(chairSkin, "Chairs", chairModel);
      }
    });
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

  private async equipSelected(): Promise<void> {
    if (!this.selectedItem) return;

    const equippedItems = <EquippedItems>await getData("equippedItems");
    const category = <string>this.selectedItem.GetAttribute("ItemCategory");
    const equippedItemType = this.getItemTypeFromTabName();
    if (equippedItems[equippedItemType])
      equippedItems[equippedItemType] = undefined; // unequip

    else
      switch (category) {
        case "Chairs": {
          const skinName = <ChairSkinName>this.selectedItem.GetAttribute("ItemName");
          equippedItems.chairSkin = skinName;
          break;
        }
      }

    setData("equippedItems", equippedItems);
  }

  private switchTab(tabName: string) {
    this.deselectAllButtons();
    this.selectedTab = tabName;
    for (const tab of this.tabs) {
      tab.Visible = tabName === tab.Name;
    }
  }

  private async selectButton(selectedButton: typeof Assets.UI.ViewportButton): Promise<void> {
    if (this.selectedItem === selectedButton)
      return this.deselectAllButtons();

    // const equippedItems = <EquippedItems>await getData("equippedItems");
    // if (equippedItems[this.getItemTypeFromTabName()])
    //   this.instance.Display.Equip.TextLabel.Text = "Unequip";

    this.selectedItem = selectedButton;
    this.instance.Display.Visible = true;
    for (const frame of this.getAllItemFrames())
      for (const button of this.getItemsFromFrame(frame))
        button.Image = button === selectedButton ? SELECTED_BUTTON : REGULAR_BUTTON;

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

  private createInventoryButton(itemName: string, category: string, viewportModel: Model): void {
    const button = Assets.UI.ViewportButton.Clone();
    viewportModel.Parent = button.Viewport;
    button.Name = "InventoryItem";
    button.MouseButton1Click.Connect(() => this.selectButton(button));
    button.Parent = this.getItemsFrame(category);
    button.SetAttribute("ItemName", itemName);
    button.SetAttribute("ItemCategory", category)
  }

  private getItemTypeFromTabName(): keyof EquippedItems {
    switch(this.selectedTab) {
      case "Chairs": return "chairSkin";
    }
    return <keyof EquippedItems><unknown>undefined;
  }

  private getItemsFromFrame(frame: ScrollingFrame): (typeof Assets.UI.ViewportButton)[] {
    return frame.GetChildren()
      .filter((instance): instance is typeof Assets.UI.ViewportButton => instance.IsA("ImageButton"))
  }

  private getAllItemFrames(): ScrollingFrame[] {
    return this.instance.GetChildren()
      .filter((instance): instance is ScrollingFrame => instance.IsA("ScrollingFrame"));
  }

  private getItemsFrame(category: string): ScrollingFrame {
    return this.tabs.find(tab => tab.Name === category)!;
  }
}